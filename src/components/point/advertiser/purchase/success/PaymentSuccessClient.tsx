'use client'
import { useUpdateAmount } from "@/hooks/point/useUpdateAmount";
import { useEffect } from "react";

const PaymentSuccessClient = ({
    amount
}:{
    amount:number
}) => {
    const updateAmount = useUpdateAmount();
    useEffect(()=>{
        updateAmount(amount);
    },[])
    return null;
}
export default PaymentSuccessClient;
