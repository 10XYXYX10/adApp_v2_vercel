// src/lib/types/support/supportTypes.ts
import { Prisma } from "@prisma/client";

export type SupportListSortType = 'desc'|'asc';

export type SupportListStatusType = 'open'|'in_progress'|'closed'|'';

export type SupportListCategoryType = 'payment'|'advertisement'|'technical'|'other'|'';

export type SupportListOptionType = {
    where?: Prisma.SupportWhereInput
    orderBy?: { createdAt: 'desc'|'asc' }
    skip?: number
    take?: number
}

// Supporte詳細表示用（メッセージ含む）
export type SupportWithMessages = {
    id: number
    title: string
    status: string
    priority: string
    category: string
    respondedAt: Date | null
    createdAt: Date
    userId: number
    user: {
        id: number
        name: string
        // 拡張：admin時の詳細user情報（optional）
        email?: string
        businessType?: string | null
        companyName?: string | null
        isActive?: boolean
    }
    messages: SupportMessage[]
}

// Support一覧表示用（基本情報のみ）
export type SupportListItemType = {
    id: number
    title: string
    status: string
    priority: string
    category: string
    respondedAt: Date | null
    createdAt: Date
    userId: number
    // 拡張：admin時のuser情報（optional）
    user?: {
        id: number
        name: string
        email: string
        businessType: string | null
    }
}

// SupportMessage型
export type SupportMessage = {
    id: number
    content: string
    senderType: string // 'user' | 'admin'
    senderId: number
    createdAt: Date
}

// Support作成フォーム用
export type SupportCreateFormData = {
    title: string
    category: SupportListCategoryType
    content: string
}
