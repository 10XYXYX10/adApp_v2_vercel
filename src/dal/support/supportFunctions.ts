// src/dal/support/supportFunctions.ts
import prisma from "@/lib/prisma"
import { SupportListSortType, SupportListStatusType, SupportListCategoryType, SupportListOptionType, SupportListItemType, SupportWithMessages } from "@/lib/types/support/supportTypes"
import { Prisma } from "@prisma/client"

const fetchCount = process.env.NEXT_PUBLIC_FETCH_COUNT ? Number(process.env.NEXT_PUBLIC_FETCH_COUNT) : 10;

//////////
//■[ サポート一覧取得 ]
export const getSupportList = async({
    advertiserId,
    sort,
    status,
    category,
    page,
}:{
    advertiserId: number
    sort: SupportListSortType
    status: SupportListStatusType
    category: SupportListCategoryType
    page: number
}):Promise<{
    result: boolean
    message: string
    data?: SupportListItemType[]
}> => {
    try{
        //////////
        //■[ Prismaを用いたデータ取得のためのパラメータを調整 ]
        let optionOb: SupportListOptionType = {}
        
        //・whereOb
        let whereOb: Prisma.SupportWhereInput = {};
        
        //・advertiserId === 0でadmin判定
        if(advertiserId !== 0) {
            whereOb.userId = advertiserId; // advertiser: 本人のサポートのみ
        }
        // admin: 制限なし（全ユーザーのサポート）
        
        //・status
        if(status){
            whereOb = { 
                ...whereOb,
                status,
            }
        }
        
        //・category
        if(category){
            whereOb = { 
                ...whereOb,
                category,
            }
        }
        
        //・sort
        optionOb = {
            ...optionOb,
            orderBy: { createdAt: sort }
        }
        
        //・optionObにorderBy,skip,takeを追加
        optionOb = {
            ...optionOb,
            where: whereOb,
            skip: Number(fetchCount*(page-1)),
            take: fetchCount+1,
        }

        //////////
        //■[ データ取得 ]
        const supportList = await prisma.support.findMany({
            ...optionOb,
            select: {
                id: true,
                title: true,
                status: true,
                priority: true,
                category: true,
                respondedAt: true,
                createdAt: true,
                userId: true,
                // admin時はuser情報も取得
                ...(advertiserId === 0 && {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            businessType: true,
                        }
                    }
                })
            }
        });

        return {
            result: true,
            message: 'success',
            data: supportList
        }
    }catch(err){
        const message = err instanceof Error ?  `${err.message}.` : `Internal Server Error.`;
        return {
            result: false,
            message,
        }
    }
};



//////////
//■[ サポート詳細取得（メッセージ含む） ]
export const getSupportDetail = async({
    supportId,
    advertiserId,
}:{
    supportId: number
    advertiserId: number
}):Promise<{
    result: boolean
    message: string
    data?: SupportWithMessages | null
}> => {
    try{
        //////////
        //■[ whereCondition構築 ]
        const whereCondition: Prisma.SupportWhereInput = {
            id: supportId
        };
        
        //・advertiserId === 0でadmin判定
        if(advertiserId !== 0) {
            whereCondition.userId = advertiserId; // advertiser: 本人のサポートのみ取得
        }
        // admin: supportIdのみで制限なし

        //////////
        //■[ データ取得 ]
        const support = await prisma.support.findFirst({
            where: whereCondition,
            select: {
                id: true,
                title: true,
                status: true,
                priority: true,
                category: true,
                respondedAt: true,
                createdAt: true,
                userId: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        // admin時は詳細なuser情報も取得
                        ...(advertiserId === 0 && {
                            email: true,
                            businessType: true,
                            companyName: true,
                            isActive: true,
                        })
                    }
                },
                messages: {
                    select: {
                        id: true,
                        content: true,
                        senderType: true,
                        senderId: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'asc' // 時系列順で表示
                    }
                }
            }
        });

        if (!support) {
            return {
                result: false,
                message: 'Support not found.',
                data: null
            }
        }

        //////////
        //■[ 型変換 ]
        const supportWithMessages: SupportWithMessages = {
            id: support.id,
            title: support.title,
            status: support.status,
            priority: support.priority,
            category: support.category,
            respondedAt: support.respondedAt,
            createdAt: support.createdAt,
            userId: support.userId,
            user: support.user,
            messages: support.messages
        };

        return {
            result: true,
            message: 'success',
            data: supportWithMessages
        }
    }catch(err){
        const message = err instanceof Error ?  `${err.message}.` : `Internal Server Error.`;
        return {
            result: false,
            message,
        }
    }
};