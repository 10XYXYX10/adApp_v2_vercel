'use client'
// src/components/auth/SignOut.tsx
import { useActionState, useEffect } from "react";
import { signOut } from "@/actions/auth/authActions";
import { IconLogout2 } from "@tabler/icons-react";

const SignOut = ({
  userType
 }:{
  userType:'admin'|'advertiser'
 }) => {
  const signOitWithUserType = signOut.bind(null, userType);
  const [errState, formAction, isPending ] = useActionState(signOitWithUserType, '');

  useEffect(()=>{
      if(!errState)return;
      alert(errState);
  },[errState])

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={isPending}
        className={`p-2 hover:opacity-75 inline-block my-1 ${isPending&&'cursor-not-allowed opacity-50'}`}
      >
        <IconLogout2 size={24}/>
      </button>
    </form>
  )
}

export default SignOut
