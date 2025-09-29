// src/lib/types/crypt/cryptTypes.ts
import { PaymentStatus } from "../paymentTypes"

export type CryptoCurrency = 'ltc' | 'eth' | 'btc'

export type PaymentData = {
  id: number
  transactionId: string//NowPaymentデータのPyment.transactionId
  orderId: string
  payAddress: string
  payAmount: string
  paymentUrl: string
  expiredAt: string
  currency: string
}

export type CreatePaymentResult = {
  success: boolean
  errMsg: string
  statusCode: number
  paymentData?: PaymentData
}

export type PaymentStatusResult = {
  success: boolean
  errMsg: string
  statusCode: number
  status?: PaymentStatus
  transactionId?: string
}

export type PurchaseEntryFormType = {
    amount: [number, string]      // [値, エラー文字]
    agreedToTerms: [boolean, string]     // [値, エラー文字]
}