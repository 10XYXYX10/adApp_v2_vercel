'use client'
// src/components/auth/AuthUser.tsx
import { useState } from "react";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import { UserType } from "@/lib/types/auth/authTypes";
const localFlag = process.env.NEXT_PUBLIC_APP_URL==='http://localhost:3000';

const AuthUser = ({
    userType
 }:{
    userType:UserType
 }) => {
    const [signUpFlag,setSignUpFlag] = useState(false);

    return (
        <div className='min-h-screen bg-gray-200'>
            {signUpFlag ? (<>
                <button 
                    onClick={()=>setSignUpFlag(false)}
                    className='mt-5 ml-5 px-2 py-1 text-white text-sm border border-blue-600 bg-blue-500 hover:bg-blue-400 rounded-sm'
                >
                    ログインに切り替え
                </button>
                { (localFlag||userType==="advertiser") && <SignUp userType={userType}/>}
            </>) : (<>
                { (localFlag||userType==="advertiser") &&(
                    <button
                        onClick={()=>setSignUpFlag(true)}
                        className='mt-5 ml-5 px-2 py-1 text-white text-sm border border-blue-600 bg-blue-500 hover:bg-blue-400 rounded-sm'
                    >
                        新規作成に切り替え
                    </button>                    
                )}
                <SignIn userType={userType}/>
            </>)}
        </div>
    )
}
export default AuthUser
