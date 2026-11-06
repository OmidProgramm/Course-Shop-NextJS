"use client"
import { useEffect, useState } from "react";
import styles from "./AuthPage.module.css";
import {IoMdArrowRoundBack} from 'react-icons/io';
import OtpInputs from "@/components/features/auth/OtpInputs";
import toast from "react-hot-toast";
import Loader from "@/components/shared/Loader";

export default function AuthPage(){
    const [phone, setPhone] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(120);
    const [isResendDisabled, setIsResendDisabled] = useState(true)
    const [otp,setOtp] = useState(['','','','',''])

    const isPhoneValid = (phone) => /^0\d{10}$/.test(phone);
    const handleSendOtp = async ()=>{
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/sms/send",{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({phone})
            })
            const data = await res.json();
            console.log(data)
            if(data.success){
                setIsCodeSent(true); 
                toast.success('verify Code sent successfully.'); 
            }else{
               toast.error('verify Code did not send.');
            }
        } catch (error) {
            console.log(error)
        }finally{
            setIsLoading(false); 
        }
    }

    const hadleBackToPhone = ()=>{
        setOtp(['','','','','']);
        setIsCodeSent(false);
        setTimer(120)
        setPhone('')
    }
    const handleVerifyOtp = async ()=>{
        const otpCode = otp.join('')
        try {
            setIsLoading(true)
            const response = await fetch("/api/auth/sms/verify",{
                method: "POST",
                headers:{"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify({phone,otpCode})
            });
            const data = await response.json();
            if(data.success){
                toast.success('Login is successfully.')
            }else{
                if(response.status == 401){
                    toast.error('OTP Code is invalid.')
                }else if(response.status == 410){
                    toast.error('OTP Code is expired.')
                }else{
                    toast.error('something is wrong in try')
                }
            }
        } catch (error) {
            toast.error('something is wrong in catch')
        }finally{
            setIsLoading(false)
        }
    }
    const handleResendOtp = async ()=>{
        
        try {
            const res = await fetch("/api/auth/sms/send",{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({phone})
            })
            const data = await res.json();
            if(data.success){
                toast.success('verify Code sent successfully.'); 
                setOtp(['','','','',''])
                setTimer(120)
            }else{
               toast.error('verify Code did not send.');
            }
        } catch (error) {
            console.log(error)
        }
    }
    const isOtpComplete = otp.every(input => input !== '')
    useEffect(()=>{
        let interval;
        if(isCodeSent && timer > 0){
            interval = setInterval(()=>{
                setTimer(time => time - 1)
            },1000)
        }else if(timer == 0){
            console.log('time out')
        }

        return ()=>{
            clearInterval(interval)
        }
    },[isCodeSent,timer])
    return (
        <div className={styles.authWrapper}>
            <div className={styles.right}></div>
            <div className={styles.authForm}>
                { !isCodeSent &&(
                    <>
                        <h2>Developcoding</h2>
                        <h3>Login | Register</h3>
                        <p>Enter your Number</p>
                        <input type="text"
                        placeholder="your Number"
                        value={phone}
                        onChange={(e)=>setPhone(e.target.value)}
                        />
                        { isLoading? (
                            <Loader/>
                        ) : (
                            <button 
                            onClick={handleSendOtp}
                            disabled={!isPhoneValid(phone)}
                            >
                                Login
                            </button>
                        )}
                     </>
                )}
                {isCodeSent && (
                    <>
                        <h2>Developcoding</h2>
                        <div className={styles.gotoBack} onClick={hadleBackToPhone}>
                            <IoMdArrowRoundBack size={"20px"}/>
                        </div>
                        <p>confirm code {phone} sended</p>
                        <h3>enter confirm code</h3>
                        <OtpInputs otp={otp} setOtp={setOtp} />
                        {isLoading ? (
                            <Loader/>
                        ) : (
                            <button
                            onClick={handleVerifyOtp}
                            disabled={!isOtpComplete}
                            >
                                confirm login
                            </button>
                        )}
                        <div className={styles.resendOtp}>
                            {timer > 0 ? (
                                <p className={styles.timer}>
                                    remind {timer} second
                                </p>
                            ) : (
                                <p 
                                className={styles.resend}
                                onClick={handleResendOtp}
                                disabled={isResendDisabled}
                                > 
                                    resend confirm code
                                </p>
                            )}
                            </div>
                    </>   
                )}      
            </div>
            <div className={styles.left}></div>
        </div>
    )
}