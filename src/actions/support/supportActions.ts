'use server'
// src/actions/support/supportActions.ts
import { dangerousCharToEntity } from "@/lib/seculity/validation";
import { security } from "@/lib/seculity/seculity";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/seculity/upstash";

//////////
//■[ 自動クローズ処理（内部関数） ]
//・admin返信済み～advertiserから返答無し～10日以上経過＝解決と判断＝closed
const autoCloseSupportIfNeeded = async (excludeId:number): Promise<void> => {
    try {
        //////////
        //■[ 10日前の日時計算 ]
        const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);

        //////////
        //■[ 対象サポート一括取得 ]
        const supports = await prisma.support.findMany({
            where: { 
                status: 'in_progress',
                updatedAt: { lt: tenDaysAgo }, // 10日以上経過
                id: { not: excludeId } // 指定IDを除外
            },
            select: {
                id: true,
                respondedAt: true,//この値が有効＝admin返信済み. 新規作成時はnull. adminが返信したら現在時刻、advertiserが返信したらnull.
            }
        });

        //////////
        //■[ 条件一致分を一括更新 ]
        const targetIds:number[] = [];
        for(const support of supports){
            const {id,respondedAt} = support;
            if(respondedAt!==null)targetIds.push(id);
        }
        if (targetIds.length > 0) {
            await prisma.support.updateMany({
                where: { id: { in: targetIds } },
                data: { 
                    status: 'closed',
                }
            });
        }

    } catch (err) {
        // エラーは握りつぶす（メイン処理に影響させない）
        console.error('Auto close support error:', err);
    }
};

//////////
//■[ 返信メッセージ作成 ]
export const createSupportMessage = async({
    userType,
    supportId,
    content,
 }:{
    userType: 'advertiser' | 'admin'
    supportId: number
    content: string
 }): Promise<{
    success: boolean
    errMsg: string
    statusCode: number
 }> => {
    try {
        //////////
        //■[ セキュリティー ]
        const {result, data, message: securityMessage} = await security({readOnly:false});
        if(!result || !data) return {success:false, errMsg:securityMessage, statusCode:401};
        if(data.userType!==userType) return {success:false, errMsg:'No permission.', statusCode:401};

        //////////
        //■[ rateLimit ] 
        const rateLimitResult = await rateLimit()
        if(!rateLimitResult.success) return {success:false, errMsg:rateLimitResult.message, statusCode:429};//429 Too Many Requests

        //////////
        //■[ バリデーション ]
        if(content.length>500)return {success:false, errMsg:"お問い合わせ内容 は、500字以内でお願いします.", statusCode:404}
        const content_ = dangerousCharToEntity(content)

        //////////
        //■[ 権限チェック ]
        //・advertiser: 自分のサポートのみ
        //・admin: 全てのサポートにアクセス可能
        const whereCondition = userType === 'advertiser' 
            ? { id: supportId, userId: data.id }
            : { id: supportId };

        const support = await prisma.support.findFirst({
            where: whereCondition,
            select: { id:true, userId:true, status:true, respondedBy:true }
        });

        if(!support) return {success:false, errMsg: 'サポートが見つかりません', statusCode:404};

        //////////
        //■[ 自動クローズ処理（admin時のみ・非同期実行） ]
        if (userType === 'admin') {
            autoCloseSupportIfNeeded(supportId).catch(err => {
                console.error('Auto close background process failed:', err);
            });
        }

        //////////
        //■[ 送信者情報設定 ]
        const senderType = userType === 'advertiser' ? 'user' : 'admin';
        const senderId = data.id;

        //////////
        //■[ ステータス更新ロジック ]
        let newStatus = support.status; // 既存ステータスを維持
        // 修正：管理者がopenに返信した場合、in_progressに更新
        if(support.status === 'open' && userType === 'admin') {
            newStatus = 'in_progress';
        }
        // 修正：advertiserがclosedに返信した場合、openに更新
        if(support.status === 'closed' && userType === 'advertiser') {
            newStatus = 'open';
        }

        //////////
        //■[ respondedBy更新ロジック ]
        const newRespondedBy = support.respondedBy===null && senderType==='admin' ? data.id : support.respondedBy;

        //////////
        //■[ トランザクション実行 ]
        await prisma.$transaction(async (prismaT) => {
            //・メッセージ作成
            await prismaT.supportMessage.create({
                data: {
                    content:content_,
                    senderType,
                    senderId,
                    supportId
                }
            });

            //・Support.respondedAt更新 + ステータス更新 + updatedAt更新
            //  - admin返信時: 現在時刻を設定
            //  - user返信時: nullに設定（未読状態にリセット）
            await prismaT.support.update({
                where: { id: supportId },
                data: {
                    respondedBy: newRespondedBy,//返信した管理者ID（nullable）
                    respondedAt: senderType === 'admin' ? new Date() : null,//adminが返信したら現在時刻、advertiserが返信したらnull
                    status: newStatus, // 修正：ステータス更新追加
                    updatedAt: new Date() // 修正：updatedAt更新追加
                }
            });
        }, {
            maxWait: 10000,
            timeout: 25000,
        }).catch((err) => {
            throw err;
        });

        //////////
        //■[ 成功レスポンス ]
        return {success:true, errMsg:'', statusCode:200};

    } catch(err) {
        const errMessage = err instanceof Error ? err.message : 'Internal Server Error.';
        return {success:false, errMsg: errMessage, statusCode:500};
    }
};



//////////
//■[ サポート新規作成 ]
export const createSupport = async({
    userType,
    title,
    category,
    content,
}:{
    userType: 'advertiser' | 'admin'
    title: string
    category: string
    content: string
}): Promise<{
    success: boolean
    errMsg: string
    statusCode: number
    supportId?: number
}> => {
    try {
        //////////
        //■[ セキュリティー ]
        const {result, data, message: securityMessage} = await security({readOnly:false});
        if(!result || !data) return {success:false, errMsg:securityMessage, statusCode:401};
        if(data.userType!==userType) return {success:false, errMsg:'No permission.', statusCode:401};

        //////////
        //■[ rateLimit ] 
        const rateLimitResult = await rateLimit()
        if(!rateLimitResult.success) return {success:false, errMsg:rateLimitResult.message, statusCode:429};//429 Too Many Requests

        //////////
        //■[ バリデーション ]
        //・title
        if(title.length>100)return {success:false, errMsg:"titleの入力は100字以内でお願いします.", statusCode:404}
        //・content
        if(content.length>500)return {success:false, errMsg:"問い合わせ内容 は、500字以内でお願いします.", statusCode:404}
        //・category
        if(!['payment','advertisement','technical','other'].includes(category)) {
            return {success:false, errMsg:'無効なカテゴリーです', statusCode:400};
        }

        //////////
        //■[ 無害化 ]
        const title_ = dangerousCharToEntity(title)
        const content_ = dangerousCharToEntity(content)

        //////////
        //■[ トランザクション実行 ]
        let newSupportId: number;
        
        await prisma.$transaction(async (prismaT) => {
            //・サポート作成
            const support = await prismaT.support.create({
                data: {
                    title:title_,
                    category,
                    priority: 'medium', // デフォルト中優先度
                    userId: data.id,
                    //respondedAt:初回作成時はnull。adminが返信したら現在時刻、advertiserが返信したらnull。
                }
            });
            
            newSupportId = support.id;
            //・初回メッセージ作成
            await prismaT.supportMessage.create({
                data: {
                    content: content_,
                    senderType: userType === 'advertiser' ? 'user' : 'admin',
                    senderId: data.id,
                    supportId: newSupportId
                }
            });
        }, {
            maxWait: 10000,
            timeout: 25000,
        }).catch((err) => {
            throw err;
        });

        //////////
        //■[ 成功レスポンス ]
        return {success:true, errMsg:'', statusCode:200, supportId: newSupportId!};

    } catch(err) {
        const errMessage = err instanceof Error ? err.message : 'Internal Server Error.';
        return {success:false, errMsg: errMessage, statusCode:500};
    }
};