import {cookies} from "next/headers"
import connectToDB from "@/configs/db";
import User from "@/models/User";
const jwt = require('jsonwebtoken')
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        const {phone, otpCode} = await req.json();
        console.log(phone,otpCode)
        // check exist phone & verify code
        if(!phone || !otpCode){
            return NextResponse.json(
                {success:false,message: 'Phone Number and OTP Code is required.'},
                {status:400}
            );
        }

        // Connect to DB
        await connectToDB()

        // check user exist
        const user = await User.findOne({phone}).select("name phone email role purchasedCourses otp");
        if(!user){
            return NextResponse.json(
                {success:false,message: 'Use not found.'},
                {status:404}
            );
        }

        // verify OTP Code
        const {otp} = user;
        if(!otp || otp.code !== otpCode){
             return NextResponse.json(
                {success:false,message: 'invalid Code.'},
                {status:401}
            );
        }

        // check expires Time
        const currentTime = new Date().getTime();
        const isExpired = currentTime > otp.expiresAt;
        if(isExpired){
            user.otp = null;
            await user.save();
            return NextResponse.json(
                {success:false,message: 'OTP Code is expired.'},
                {status:410}
            );
        }

        // create ACCESS_TOKEN and REFRESH_TOKEN
        const accessPayload = {
            userId: user._id.toString(),
            phone : user.phone,
            role: user.role
        }
        // Create Tokens withe JWT
        const accessToken = jwt.sign(accessPayload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'5min'})
        const refreshToken = jwt.sign(accessPayload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'})

        // save refresh token in db
        user.otp = null;
        user.refreshToken = refreshToken;
        user.isVerified =true;
        user.lastLoginAt= new Date();
        await user.save();

        // save tokens in cookies
        const cookieStore = await cookies();
        // set Cookie
        cookieStore.set('accessToken',accessToken,{
            httpOnly:true,
            maxAge:15 * 60, // 15Min
            sameSite: 'strict',
            secure: process.env.NODE_ENV === "production",
            path:'/'
        })
        cookieStore.set('refreshToken',refreshToken,{
            httpOnly:true,
            maxAge: 7 * 24 * 60 * 60, // 15Min
            sameSite: 'strict',
            secure: process.env.NODE_ENV === "production",
            path:'/'
        })
        
        return NextResponse.json(
                {
                    success:true,
                    message: 'OTP Code is accepted.',
                    redirectTo: user.role === 'admin'? "/admin/dashboard" : '/profile',
                    user: {
                        id: user._id.toString(),
                        phone: user.phone,
                        name: user.name||'',
                        role: user.role,
                        purchasedCourses: user.purchasedCourses||[]
                    }
                },
                {status:200}
            );

    } catch (error) {
        console.error("Error verifying OTP")
        return NextResponse.json(
                {success:false,message: 'Server error'},
                {status:500}
            );
    }
}