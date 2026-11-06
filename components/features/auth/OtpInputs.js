'use client'
import { useEffect, useRef } from 'react'
import styles from './OtpInputs.module.css'
export default function OtpInputs({otp,setOtp}){
    const inputRefs = useRef([]);
    useEffect(()=>{
        if(inputRefs.current[0]){
            inputRefs.current[0].focus()
        }
    },[]);
    const handleChange = (e,index)=>{
        const value = e.target.value
        if(value.length == 1){
            const updatedOtp = [...otp]
            updatedOtp[index] = e.target.value
            setOtp(updatedOtp)
            if(index < 4){
                inputRefs.current[index+1].focus()
            }
        }
    }
    const handleBackspace=(e,index)=> {
        if(e.key == 'Backspace'){
            if(index >0 && otp[index] == ''){
                const updatedOtp = [...otp]
                updatedOtp[index-1] = ''
                setOtp(updatedOtp)
                inputRefs.current[index-1].focus()
            }else{
                const updatedOtp = [...otp]
                updatedOtp[index] = ''
                setOtp(updatedOtp)
            }
        }
    }
    return (
        <div className={styles.otpInputWrapper}>
             <input type="text" className={styles.otpInput} 
             ref={(element)=>inputRefs.current[0]=element}
             onChange={(e)=>handleChange(e,0)}
             onKeyDown={(e)=> handleBackspace(e,0)}
             value={otp[0]}
             inputMode="numeric" maxLength={1} />

             <input type="text" className={styles.otpInput}
             ref={(element)=>inputRefs.current[1]=element} 
              onChange={(e)=>handleChange(e,1)}
              onKeyDown={(e)=> handleBackspace(e,1)}
              value={otp[1]}
             inputMode="numeric" maxLength={1} />

             <input type="text" className={styles.otpInput} 
             ref={(element)=>inputRefs.current[2]=element}
              onChange={(e)=>handleChange(e,2)}
              onKeyDown={(e)=> handleBackspace(e,2)}
              value={otp[2]}
             inputMode="numeric" maxLength={1} />

             <input type="text" className={styles.otpInput} 
             ref={(element)=>inputRefs.current[3]=element}
              onChange={(e)=>handleChange(e,3)}
              onKeyDown={(e)=> handleBackspace(e,3)}
              value={otp[3]}
             inputMode="numeric" maxLength={1} />

             <input type="text" className={styles.otpInput} 
             ref={(element)=>inputRefs.current[4]=element}
              onChange={(e)=>handleChange(e,4)}
              onKeyDown={(e)=> handleBackspace(e,4)}
              value={otp[4]}
             inputMode="numeric" maxLength={1} />
        </div>
    )
}