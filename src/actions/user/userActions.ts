'use server'
// src/actions/user/userActions.ts
import { security } from "@/lib/seculity/seculity";
import prisma from "@/lib/prisma";
import { sendMail } from "@/lib/nodemailer";
import { NotificationType } from "@/lib/types/notification/notificationTypes";
import { dangerousCharToEntity } from "@/lib/seculity/validation";

//////////
//■ [ ユーザー管理 & 通知送信 ]
export const manageUserAndNotify = async({
    targetUserId,
    isActiveToggle,
    notificationTitle,
    notificationDescription,
    notificationType,
    sendEmail,
}:{
    targetUserId: number
    isActiveToggle?: boolean // undefinedの場合はアカウント状態変更なし
    notificationTitle: string
    notificationDescription: string
    notificationType: NotificationType // 'payment' | 'advertisement' | 'system' | 'other'
    sendEmail: boolean
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
        if(notificationTitle.length > 100) return {success:false, errMsg:"タイトルは100文字以内でお願いします。", statusCode:400};
        if(notificationDescription.length > 500) return {success:false, errMsg:"通知内容は500文字以内でお願いします。", statusCode:400};
        const notificationTitle_escaped = dangerousCharToEntity(notificationTitle);
        const notificationDescription_escaped = dangerousCharToEntity(notificationDescription);

        //////////
        //■ [ 対象ユーザー確認 ]
        const targetUser = await prisma.user.findFirst({
            where: {
                id: targetUserId,
                userType: 'advertiser', // advertiserのみ対象
            },
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
            }
        });
        if(!targetUser) return {success:false, errMsg: 'ユーザーが見つかりません', statusCode:404};

        //////////
        //■ [ トランザクション実行 ]
        await prisma.$transaction(async (prismaT) => {
            //・アカウント状態変更（isActiveToggleがundefined以外の場合）
            if(isActiveToggle !== undefined) {
                await prismaT.user.update({
                    where: { id: targetUserId },
                    data: {
                        isActive: isActiveToggle,
                        updatedAt: new Date()
                    }
                });
            }

            //・通知作成
            await prismaT.notification.create({
                data: {
                    title: notificationTitle_escaped,
                    description: notificationDescription_escaped,
                    type: notificationType,
                    userId: targetUserId,
                }
            });

            //・メール送信（sendEmailがtrueの場合）
            if(sendEmail) {
                const {result, message} = await sendMail({
                    toEmail: targetUser.email,
                    subject: notificationTitle_escaped,
                    text: notificationDescription_escaped,
                    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
<h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
${notificationTitle_escaped}
</h2>
<div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
<p style="color: #374151; line-height: 1.6; white-space: pre-wrap;">
    ${notificationDescription_escaped}
</p>
</div>
<hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
<p style="color: #6b7280; font-size: 14px; text-align: center;">
このメールは管理者からの重要なお知らせです。
</p>
</div>
                    `
                });
                if(!result) throw new Error(message);
            }
        }, {
            maxWait: 10000,
            timeout: 25000,
        }).catch((err) => {
            throw err;
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
//■ [ ユーザー削除 ]
//・削除条件:
//  - User.isActive===false && User.updatedAt>=90日
//・削除処理transaction:
//  - User削除
//      - cascade.deleteの設定により関連データも一括削除
//      - 関連するMediaFileのみ削除時に取得しておく
//  - 関連MediaFileデータをDBから一括削除
//  - 最後に、ストレージから削除
