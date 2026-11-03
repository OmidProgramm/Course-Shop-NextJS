"use client"
import { useState } from "react";
import styles from "./AuthPage.module.css";
import {IoMdArrowRoundBack} from 'react-icons/io';
import OtpInputs from "@/components/features/auth/OtpInputs";
import toast from "react-hot-toast";

export default function AuthPage(){
    const [phone, setPhone] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpComplete, setIsOtpComplete] = useState(false);
    const [timer, setTimer] = useState(120);

    const isPhoneValid = (phone) => /^0\d{10}$/.test(phone);
    const handleSendOtp = async ()=>{
        /* setIsLoading(true);  */
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
            /* setIsLoading(false); */
        }
    }
    const hadleBackToPhone = ()=>{}
    const handleVerifyOtp = ()=>{}

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
                            <Loading/>
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
                        <OtpInputs/>
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