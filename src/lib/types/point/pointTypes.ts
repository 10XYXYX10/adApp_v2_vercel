// src/lib/types/point/pointTypes.ts
import { Decimal } from "@prisma/client/runtime/library";

// Filter用の型
export type PointFilterData = {
    type: '' | 'purchase' | 'consume' | 'refund'
    sort: 'desc' | 'asc'
    page: number
}

// 引数型
export type GetPointListParams = {
    advertiserId: number
    type?: '' | 'purchase' | 'consume' | 'refund'
    sort?: 'desc' | 'asc' 
    page: number
    // limitは削除：サーバーサイドでfetchCount+1を使用
}

// Point一覧アイテム型
export type PointListItemType = {
    id: number
    type: 'purchase' | 'consume' | 'refund'
    amount: string
    description: string
    createdAt: Date
    // Paymentリレーション（必要最小限）
    payment?: {
        id: number
        orderId: string
        paymentMethod: string
        totalAmount: string
        status: string
    } | null
}

// 戻り値型
export type GetPointListResponse = {
    success: boolean
    statusCode: number
    errMsg: string
    data?: PointListItemType[] // fetchCount+1件のデータ（n+1パターン）
}

//////////
//■[ Point詳細表示用型 ]
export type PointDetailType = {
    id: number
    type: string // purchase/consume/refund
    amount: Decimal
    description: string
    createdAt: Date
    paymentId: number | null
    payment: {
        id: number
        orderId: string
        paymentMethod: string // creditcard/bitcoin/ethereum/Litecoin
        purchaseAmount: Decimal
        totalAmount: Decimal
        currency: string
        status: string // pending/completed/failed/expired
        createdAt: Date
    } | null
}

//////////
//■[ 関数の戻り値型 ]
export type GetPointDetailResult = {
    success: boolean
    errMsg: string
    data?: PointDetailType | null
}
