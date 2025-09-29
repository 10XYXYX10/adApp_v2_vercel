'use server'
// src/actions/ad/adminReviewActions.ts
import { security } from '@/lib/seculity/seculity'
import { deleteFile } from '@/lib/s3'
import prisma from '@/lib/prisma'
import { 
    ReviewAction,
    REJECT_REASON_MESSAGES,
    RejectReason
} from '@/lib/types/ad/adAdminTypes'

//////////
//■[ 広告審査アクション実行 ]
export async function reviewAction({
    adminId,
    adId,
    action,
    reason,
    comment,
}:{
    adminId: number,
    adId: number
    action: ReviewAction
    reason: RejectReason
    comment: string
}): Promise<{
  success: boolean
  errMsg: string
  statusCode: number
}> {
    console.log('--reviewAction--')
    try {
        //////////
        //■[ セキュリティー（管理者認証） ]:401,403の場合は、frontendでalert通知した後、router.pushでauthのページに飛ばす
        const { result:success, data, message } = await security({readOnly:false})
        if (!success || !data) {
            return {
                success: false,
                errMsg: message,
                statusCode: 401
            }
        }
        // 管理者チェック
        if (data.userType !== 'admin' || data.id !== adminId) {
            return {
                success: false,
                errMsg: 'Access denied.',
                statusCode: 403
            }
        }

        //////////
        //■[ 広告データ取得・検証 ]
        const adData = await prisma.advertisement.findUnique({
            where:{ id:adId },
            select:{
                remainingBudget:true,
                userId:true,
                mediaFile:{
                    select:{
                        id:true,
                        filePath:true
                    }
                }
            }
        });
        if(!adData){
            return {
                success: false,
                errMsg: 'Not found.',
                statusCode: 404
            }
        }

        console.log('x1')
        //////////
        //■[ 審査処理実行（トランザクション） ]
        const result = await prisma.$transaction(async (prismaT) => {
            if (action === 'approve') {
                //////////
                //■[ 承認処理 ]
                await prismaT.advertisement.update({
                    where: { id: adId },
                    data: {
                        status: 'active', // 承認 → 即座に配信開始
                        verified: true,
                        verifiedAt: new Date(),
                        updatedAt: new Date()
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                amount: true
                            }
                        }
                    }
                })

                // 承認通知作成
                await prismaT.notification.create({
                    data: {
                        userId: adData?.userId,
                        title: '広告が承認されました',
                        description: `
                            広告「ID:${adId}」が承認され、配信を開始いたします。
                            ${comment ? `\n\n【メッセージ】\n${comment}` : ''}
                        `,
                        type: 'advertisement',
                        isRead: false
                    }
                })

            } else if (action === 'reject') {
                //////////
                //■[ 却下処理 - 広告完全削除 ]:削除処理成功時、クライアントサイドで、alert通知した後、router.pushで広告revieの一覧ページへ遷移
                
                // 1. ポイント返還計算・実行
                const refundAmount = Number(adData.remainingBudget);
                if (refundAmount > 0) {
                    await prismaT.user.update({
                        where: { id: adData.userId },
                        data: {
                            amount: {
                                increment: refundAmount
                            }
                        }
                    })
                    // ポイント履歴記録
                    await prismaT.point.create({
                        data: {
                            userId: adData.userId,
                            type: 'refund',
                            amount: refundAmount,
                            description: `Ad rejected and deleted - refund for ad #${adId}`,
                            uniqueKey: `refund-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                        }
                    })
                }

                // 2. 広告レコード削除（AdStatsは onDelete: Cascade で自動削除）
                await prismaT.advertisement.delete({
                    where: { id: adId }
                })
                // 3. 却下通知作成
                const reasonMessage = reason 
                    ? REJECT_REASON_MESSAGES[reason]
                    : REJECT_REASON_MESSAGES.other
                const notificationDescription = `
                    広告「ID:${adId}」は審査の結果、却下となり削除されました。\n\n【却下理由】\n${reasonMessage}
                    ${comment ? `\n\n【追加メッセージ】\n${comment}` : ''}
                    ${refundAmount > 0 ? `\n\n使用済みポイント ${refundAmount}P を返還いたしました。` : ''}
                `
                await prismaT.notification.create({
                    data: {
                        userId: adData.userId,
                        title: '広告が却下されました',
                        description: notificationDescription,
                        type: 'advertisement',
                        isRead: false
                    }
                })

                // 4. メディアファイル削除（S3）
                if (adData.mediaFile) {
                    // メディアファイルレコード削除
                    await prismaT.mediaFile.delete({
                        where: { id: adData.mediaFile.id }
                    })
                    // S3ファイル削除 *必ず最後にメディアファイルを削除.こうすることで失敗時にロールバックでデータの齟齬が発生しない
                    const filePath = adData.mediaFile.filePath;
                    const {result,message} = await deleteFile(filePath)
                    if(!result)throw new Error(message)
                }
            }
        }, {
            maxWait: 10000,
            timeout: 25000,
        }).catch((err) => {
            throw err
        })

        console.log('x2')
        //////////
        //■[ レスポンス形成 ]
        return {
            success: true,
            errMsg: '',
            statusCode: 200
        }

    } catch (err) {
        console.error('Review action error:', err)
        return {
            success: false,
            errMsg: err instanceof Error ? err.message : 'Internal Server Error.',
            statusCode: 500
        }
    }
}
