// src/lib/types/payment/paymentTypes.ts

import { Decimal } from "@prisma/client/runtime/library";

export type PaymentType = 'crypt' | 'credit'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'expired';

// データ型定義
export type PendingPaymentItem = {
  id: number
  orderId: string
  paymentMethod: string
  totalAmount: string
  currency: string
  createdAt: Date
  expiredAt: Date | null
  provider: string
}

export type CompletedPaymentItem = {
  id: number
  orderId: string
  paymentMethod: string
  totalAmount: string
  currency: string
  status: 'completed' | 'failed' | 'expired'
  completedAt: Date
  pointId: number | null
  pointAmount: string | null
}

export type PaymentData = {
  id: number
  orderId: string
  provider: string
  paymentMethod: string
  transactionId: string | null
  totalAmount: Decimal
  currency: string
  status: string//'pending' | 'completed' | 'failed' | 'expired'
  createdAt: Date
  //metadata?: any
}

export type PaymentData_Strict = {
  id: number
  orderId: string
  provider: string
  paymentMethod: string
  transactionId: string | null
  totalAmount: string
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'expired'
  createdAt: Date
  //metadata?: any
}

//////////
//■[ Payment統計データ型定義 ]
export type PaymentStatsData = {
  date: string // YYYY-MM-DD形式
  paymentCount: number // 決済件数
  totalAmount: number // 総決済金額
  totalFees: number // 総手数料
}
export type PaymentStatsSummary = {
  totalPaymentCount: number
  totalAmount: number
  totalFees: number
  avgAmountPerPayment: number // 平均決済金額
}
export type PaymentPeriodInfo = {
  type: 'monthly'
  startDate: string
  endDate: string
}
export type PaymentStatsResponse = {
  success: boolean
  data: {
    stats: PaymentStatsData[]
    summary: PaymentStatsSummary
    period: PaymentPeriodInfo
  } | null
  errMsg: string
  statusCode: number
}