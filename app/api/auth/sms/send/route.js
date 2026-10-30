import connectToDB from "@/configs/db"
import User from "@/models/User"
import { NextResponse } from "next/server"

// validate phone number
const validatePhoneNumber = (phone) => /^0\d{10}$/.test(phone)


export async function POST(req){
    try {
        const {phone} = await req.json()

        // validate phone
        if(!phone){
            return NextResponse.json(
                {success: false,message:"Phone number is required."},
                {status:400}
            )
        }
        if(!validatePhoneNumber(phone)){
            return NextResponse.json(
                {success: false,message:"Phone number is invalid."},
                {status:400}
            )
        }
        await connectToDB()

        // check exist user
        const user = await User.findOne({phone})
        if(user && user.otp.expiresAt > new Date()){
             return NextResponse.json(
                {success: false,message:"OTP already sent. Please wait before requesting again."},
                {status:429}
            )
        }

        // create confirm code
        const otpCode = Math.floor(Math.random() * 90000) + 10000
        const expiresAt = new Date().getTime() + 180 * 1000 // expires time 3 MIN

        if(user){
            // save confirm code & time in DB
            user.otp.code = otpCode
            user.otp.expiresAt  = new Date(expiresAt)
            await user.save()
        }else{
            // create new user
            await User.create({phone, otp:{code:otpCode,expiresAt: new Date(expiresAt)}})
        }

        return NextResponse.json(
                {success: true,message:"OTP sent successfully."},
                {status:200}
            )

    } catch (error) {
        console.error("Error sendig OTP: ", error)
        return NextResponse.json(
                {success: false,message:"SERVER error"},
                {status:500}
            )
    }
}