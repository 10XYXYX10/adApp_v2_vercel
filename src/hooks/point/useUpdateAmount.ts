// src/hooks/useUpdateAmount.ts
import { useCallback } from "react"
import useStore from "@/store"
import { AuthUser } from "@/lib/types/auth/authTypes"

export function useUpdateAmount() {
    const { updateUser } = useStore()

    const updateAmount = useCallback( (amount: number) => {
        updateUser((prev: AuthUser) => ({
            ...prev,
            amount
        }))
    },[])

    return updateAmount
}
