// src/fetches/notificationFunctions.ts
import prisma from "@/lib/prisma"
import { NotificationReadStatus, NotificationSortOrder, NotificationType, NotificationWithUser } from "@/lib/types/notification/notificationTypes"
import { Prisma } from "@prisma/client"

const fetchCount = process.env.NEXT_PUBLIC_FETCH_COUNT ? Number(process.env.NEXT_PUBLIC_FETCH_COUNT) : 10;

//////////
//■[ 通知一覧取得 ]
//////////
//■ [ 通知一覧取得 - 拡張版 ]
export const getNotificationList = async({
    advertiserId, // admin呼び出し時は0、advertiser呼び出し時は実際のID
    isRead,
    type,
    sort,
    search,
    page,
}:{
    advertiserId: number
    isRead: NotificationReadStatus
    type: NotificationType
    sort: NotificationSortOrder
    search: string
    page: number
}):Promise<{
    result: boolean
    message: string
    data?: NotificationWithUser[]
}> => {
    try{
        //////////
        //■ [ Prismaを用いたデータ取得のためのパラメータを調整 ]
        //・whereOb
        let whereOb: Prisma.NotificationWhereInput = {};
        
        // admin呼び出し時（advertiserId=0）は制約なし、advertiser呼び出し時は本人のみ
        if (advertiserId !== 0) {
            whereOb = {
                userId: advertiserId // 本人の通知のみ
            };
        }

        //・isRead
        if(isRead && isRead !== 'all'){
            whereOb = { 
                ...whereOb,
                isRead: isRead === 'true',
            }
        }
        //・type
        if(type && type !== 'other'){
            whereOb = { 
                ...whereOb,
                type: type,
            }
        }

        //・search（新規追加）
        if(search) {
            //半角スペースで区切って配列化
            let searchList: string[] = search.split(' ');
            searchList = searchList.filter((val) => val !== ''); 
            
            //whereOb - AND検索でOR条件
            whereOb = {
                ...whereOb,
                AND: searchList.map((search) => ({
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                    ]
                })) 
            }
        }

        //・sort
        const orderBy = { createdAt: sort as 'desc' | 'asc' }

        //////////
        //■ [ データ取得 ]
        const notificationList = await prisma.notification.findMany({
            where: whereOb,
            orderBy,
            skip: Number(fetchCount*(page-1)),
            take: fetchCount+1,
            select: {
                id: true,
                title: true,
                description: true,
                isRead: true,
                type: true,
                createdAt: true,
                userId: true,
            }
        });

        return {
            result: true,
            message: 'success',
            data: notificationList
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
//■ [ 通知詳細取得（既読更新付き） - 拡張版 ]
export const getNotificationDetail = async({
    notificationId,
    advertiserId, // admin呼び出し時は0、advertiser呼び出し時は実際のID
}:{
    notificationId: number
    advertiserId: number
}):Promise<{
    result: boolean
    message: string
    data?: NotificationWithUser | null
    wasUnread?: boolean
}> => {
    try{
        //////////
        //■ [ データ取得 ]
        let whereOb: Prisma.NotificationWhereInput = {
            id: notificationId,
        };
        
        // admin呼び出し時（advertiserId=0）は制約なし、advertiser呼び出し時は本人のみ
        if (advertiserId !== 0) {
            whereOb = {
                ...whereOb,
                userId: advertiserId, // 本人の通知のみ取得
            };
        }

        const notification = await prisma.notification.findFirst({
            where: whereOb,
            select: {
                id: true,
                title: true,
                description: true,
                isRead: true,
                type: true,
                createdAt: true,
                userId: true,
            }
        });
        
        if (!notification) {
            return {
                result: false,
                message: 'Notification not found.',
                data: null
            }
        }

        //////////
        //■ [ 未読→既読更新 ]
        const wasUnread = !notification.isRead;
        if (advertiserId!==0 && !notification.isRead) {
            await prisma.notification.update({
                where: { id: notificationId },
                data: { isRead: true }
            });
            
            // 返却データも更新
            notification.isRead = true;
        }

        return {
            result: true,
            message: 'success',
            data: notification,
            wasUnread
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
//■[ 未読通知数取得 ]
export const getUnreadNotificationCount = async({
   userId,
}:{
   userId: number
}):Promise<{
   result: boolean
   message: string
   count?: number
}> => {
   try{
       //////////
       //■[ 未読通知数カウント ]
       const count = await prisma.notification.count({
           where: {
               userId,
               isRead: false
           }
       });

       return {
           result: true,
           message: 'success',
           count
       }
   }catch(err){
       const message = err instanceof Error ?  `${err.message}.` : `Internal Server Error.`;
       return {
           result: false,
           message,
       }
   }
};