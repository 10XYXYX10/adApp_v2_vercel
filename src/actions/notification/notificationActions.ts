'use server'
// src/actions/notification/notificationActions.ts

import prisma from "@/lib/prisma";
import { security } from "@/lib/seculity/seculity";
import { dangerousCharToEntity } from "@/lib/seculity/validation";


//////////
//■ [ 通知更新 ]
export const updateNotification = async({
    notificationId,
    title,
    description,
}:{
    notificationId: number
    title: string
    description: string
}): Promise<{
    success: boolean
    errMsg: string
    statusCode: number
}> => {
    try {
        //////////
        //■ [ セキュリティー ]
        const {result, data, message: securityMessage} = await security({readOnly:false});
        if(!result || !data) return {success:false, errMsg:securityMessage, statusCode:401};
        if(data.userType !== 'admin') return {success:false, errMsg:'No permission.', statusCode:401};

        //////////
        //■ [ バリデーション ]
        //・title
        if(title.length > 100) return {success:false, errMsg:"タイトルは100字以内で入力してください", statusCode:400};
        if(title.trim().length === 0) return {success:false, errMsg:"タイトルを入力してください", statusCode:400};
        
        //・description
        if(description.length > 1000) return {success:false, errMsg:"内容は1000字以内で入力してください", statusCode:400};
        if(description.trim().length === 0) return {success:false, errMsg:"内容を入力してください", statusCode:400};

        //////////
        //■ [ 通知存在確認 ]
        const existingNotification = await prisma.notification.findUnique({
            where: { id: notificationId },
            select: { id: true, title: true, description: true }
        });
        if (!existingNotification) return {success:false, errMsg:'通知が見つかりません', statusCode:404};

        //////////
        //■ [ 無害化 ]
        const title_ = dangerousCharToEntity(title.trim());
        const description_ = dangerousCharToEntity(description.trim());

        //////////
        //■ [ 通知更新 ]
        await prisma.notification.update({
            where: { id: notificationId },
            data: {
                title: title_,
                description: description_,
                updatedAt: new Date()
            }
        });

        //////////
        //■ [ 成功レスポンス ]
        return {success:true, errMsg:'', statusCode:200};

    } catch(err) {
        const errMessage = err instanceof Error ? err.message : 'Internal Server Error.';
        return {success:false, errMsg: errMessage, statusCode:500};
    }
};


//////////
//■ [ 通知削除 ]
export const deleteNotification = async({
    notificationId,
}:{
    notificationId: number
}): Promise<{
    success: boolean
    errMsg: string
    statusCode: number
}> => {
    try {
        //////////
        //■ [ セキュリティー ]
        const {result, data, message: securityMessage} = await security({readOnly:false});
        if(!result || !data) return {success:false, errMsg:securityMessage, statusCode:401};
        if(data.userType !== 'admin') return {success:false, errMsg:'No permission.', statusCode:401};

        //////////
        //■ [ 通知存在確認 ]
        const existingNotification = await prisma.notification.findUnique({
            where: { id: notificationId },
            select: { id: true, title: true }
        });
        if (!existingNotification)return {success:false, errMsg:'通知が見つかりません', statusCode:404};

        //////////
        //■ [ 通知削除 ]
        await prisma.notification.delete({
            where: { id: notificationId }
        });

        //////////
        //■ [ 成功レスポンス ]
        return {success:true, errMsg:'', statusCode:200};

    } catch(err) {
        const errMessage = err instanceof Error ? err.message : 'Internal Server Error.';
        return {success:false, errMsg: errMessage, statusCode:500};
    }
};

//////////
//■ [ advertiserユーザー全員への一斉通知作成 ]
export const createNotificationForAllAdvertisers = async({
    title,
    type,
    description,
    sendEmail = false,
}:{
    title: string
    type: string
    description: string
    sendEmail?: boolean
}): Promise<{
    success: boolean
    errMsg: string
    statusCode: number
    createdCount?: number
}> => {
    try {
        //////////
        //■ [ セキュリティー ]
        const {result, data, message: securityMessage} = await security({readOnly:false});
        if(!result || !data) return {success:false, errMsg:securityMessage, statusCode:401};
        if(data.userType !== 'admin') return {success:false, errMsg:'No permission.', statusCode:401};

        //////////
        //■ [ バリデーション ]
        //・title
        if(title.length > 100) return {success:false, errMsg:"タイトルは100字以内で入力してください", statusCode:400};
        if(title.trim().length === 0) return {success:false, errMsg:"タイトルを入力してください", statusCode:400};

        //・description
        if(description.length > 1000) return {success:false, errMsg:"内容は1000字以内で入力してください", statusCode:400};
        if(description.trim().length === 0) return {success:false, errMsg:"内容を入力してください", statusCode:400};
        
        //・type
        if(!['payment','advertisement','system','other'].includes(type)) {
            return {success:false, errMsg:'無効な通知タイプです', statusCode:400};
        }

        //////////
        //■ [ advertiserユーザー全員取得 ]
        const advertiserUsers = await prisma.user.findMany({
            where: {
                userType: 'advertiser',
                isActive: true
            },
            select: {
                id: true,
            }
        });

        if(advertiserUsers.length === 0) {
            return {success:false, errMsg:'対象となるadvertiserユーザーが見つかりません', statusCode:404};
        }

        //////////
        //■ [ 無害化 ]
        const title_ = dangerousCharToEntity(title.trim());
        const description_ = dangerousCharToEntity(description.trim());

        //////////
        //■ [ トランザクション実行 ]
        let createdCount = 0;
        
        await prisma.$transaction(async (prismaT) => {
            //・各advertiserユーザーに通知作成
            for(const user of advertiserUsers) {
                await prismaT.notification.create({
                    data: {
                        title: title_,
                        description: description_,
                        type,
                        isRead: false,
                        userId: user.id
                    }
                });
                createdCount++;
            }

        }, {
            maxWait: 10000,
            timeout: 25000,
        }).catch((err) => {
            throw err;
        });

        //////////
        //■ [ 成功レスポンス ]
        return {
            success: true, 
            errMsg: '', 
            statusCode: 200,
            createdCount
        };

    } catch(err) {
        const errMessage = err instanceof Error ? err.message : 'Internal Server Error.';
        return {success:false, errMsg: errMessage, statusCode:500};
    }
};