// src/lib/types/userTypes.ts

import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

//////////
//■ [ 型定義 - 後でuserTypes.tsに移動予定 ]
export type UserListSortType = 'desc' | 'asc';

export type UserListStatusType = 'active' | 'inactive' | '';

export type UserListBusinessType = 'individual' | 'corporate' | '';

export type UserListOptionType = {
    where?: Prisma.UserWhereInput
    orderBy?: { createdAt: 'desc' | 'asc' }
    skip?: number
    take?: number
}

// ユーザー詳細表示用型
export type UserDetailType = {
    id: number
    name: string
    email: string
    userType: string
    birthDate: Date
    businessType: string | null
    companyName: string | null
    representativeName: string | null
    businessNumber: string | null
    isActive: boolean
    amount: number
    lastLoginAt: Date | null
    createdAt: Date
    updatedAt: Date
    // リレーション
    Address: {
        id: number
        country: string | null
        postalCode: string | null
        state: string | null
        city: string | null
        addressLine1: string | null
        addressLine2: string | null
    }[]
    Phone: {
        id: number
        hashedPhoneNumber: string
    } | null
}

// ユーザー一覧表示用型
export type UserListItemType = {
    id: number
    name: string
    email: string
    userType: string
    businessType: string | null
    companyName: string | null
    isActive: boolean
    amount: Decimal
    lastLoginAt: Date | null
    createdAt: Date
}