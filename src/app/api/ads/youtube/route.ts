// src/app/api/ads/youtube/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyYouTubeVideo } from '@/lib/youtube/verification'
import { validateApiKey } from '@/lib/functions/apiFunctions'

//////////
//■[ GET: ランダムYouTube広告取得 ]
export async function GET(request: NextRequest) {
    try {
        //////////
        //■[ API Key認証 ]
        if (!validateApiKey(request)) {
            return NextResponse.json(
                { success: false, errMsg: 'Access denied: Invalid API key' },
                { status: 403 }
            )
        }

        //////////
        //■[ 有効なYouTube広告を最大3件取得（古い順） ]
        const advertisements = await prisma.advertisement.findMany({
            where: {
                adType: { startsWith: 'youtube-' },
                status: 'active',
                verified: true,
                verifiedAt: { not: null }, // verifyYouTubeVideoの認証が未完了の場合、除外。
                ytVideoCheckedAt: { not: null }, // verifyYouTubeVideoの認証が未完了の場合、除外。
                remainingBudget: { gte: 1.0 },
                targetId: { not: null }
            },
            select: {
                id: true,
                adType: true,
                targetId: true,
                remainingBudget: true,
                userId: true
            },
            orderBy: {
                updatedAt: 'asc' // 古い順で取得してローテーション実現
            },
            take: 3 // 最大3件取得
        })

        //////////
        //■[ 広告が見つからない場合 ]
        if (advertisements.length === 0) {
            return NextResponse.json(
                { 
                    success: true, 
                    data: [],
                    message: `No active YouTube advertisements available` 
                },
                { 
                    status: 200,
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate'
                    }
                }
            )
        }

        //////////
        //■[ レスポンスデータ生成 ]
        const responseData = advertisements.map(ad => ({
            adId: ad.id,
            youtubeId: ad.targetId!,
            adType: ad.adType // 'youtube-short' or 'youtube-long'
        }))

        //////////
        //■[ レスポンス返却 ]
        return NextResponse.json(
            {
                success: true,
                data: responseData
            },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                }
            }
        )

    } catch (err) {
        console.error('YouTube Ad GET Error:', err)
        return NextResponse.json(
            {
                success: false,
                errMsg: err instanceof Error ? err.message : 'Internal Server Error',
                data: null
            },
            { status: 500 }
        )
    }
}

//////////
//■[ PUT: YouTube広告視聴完了統計更新 ]
export async function PUT(request: NextRequest) {
        console.log(`YOUTUBE-PUT-1`)
    try {
        //////////
        //■[ API Key認証 ]
        if (!validateApiKey(request)) {
            return NextResponse.json(
                { success: false, errMsg: 'Access denied: Invalid API key' },
                { status: 403 }
            )
        }

        //////////
        //■[ リクエストボディ取得 ]
        const body = await request.json()
        const { adId, action } = body

        // バリデーション
        if (!adId || typeof adId !== 'number') {
            return NextResponse.json(
                { success: false, errMsg: 'Invalid adId' },
                { status: 400 }
            )
        }

        if (action !== 'completed') {
            return NextResponse.json(
                { success: false, errMsg: 'Invalid action. The value is not supported' },
                { status: 400 }
            )
        }

        console.log(`YOUTUBE-PUT-2`)
        //////////
        //■[ 広告IDから広告タイプを取得（簡易チェック） ]
        const targetAd = await prisma.advertisement.findUnique({
            where: { id: adId },
            select: {
                adType: true,
                userId: true,
                remainingBudget: true
            }
        })
        if (!targetAd || !targetAd.adType.startsWith('youtube-')) {
            return NextResponse.json(
                { 
                    success: false, 
                    errMsg: 'YouTube advertisement not found' 
                },
                { status: 404 }
            )
        }

        //////////
        //■[ 実際の消費額計算 ]
        const currentRemainingBudget = Number(targetAd.remainingBudget)
        const deductAmount = targetAd.adType === 'youtube-short' ? 1.5 : 3.0//deduct=差し引く,控除する
        const actualSpent = Math.min(deductAmount, currentRemainingBudget)//減算した際、0いかにならないよう、小さい方の値を採用

        //////////
        //■[ DB更新（視聴統計・予算消費・updatedAt更新） ]
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        await prisma.$transaction(async (prismaT) => {
            //////////
            //・AdStats更新
            const existingStats = await prismaT.adStats.findUnique({
                where: {
                    advertisementId_date: {
                        advertisementId: adId,
                        date: today
                    }
                }
            })
            if (existingStats) {
                // 既存統計を更新（impressionsをYouTube視聴完了として扱う）
                await prismaT.adStats.update({
                    where: { id: existingStats.id },
                    data: {
                        impressions: { increment: 1 },
                        spentPoints: { increment: actualSpent },
                        updatedAt: new Date()
                    }
                })
            } else {
                // 新規統計作成
                await prismaT.adStats.create({
                    data: {
                        advertisementId: adId,
                        userId: targetAd.userId,
                        date: today,
                        impressions: 1, // YouTube視聴完了
                        clicks: 0,
                        spentPoints: actualSpent
                    }
                })
            }

            //////////
            //・Advertisement予算更新＋updatedAt更新（ローテーション用）
            const newRemainingBudget = Math.max(0, currentRemainingBudget - actualSpent)
            await prismaT.advertisement.update({
                where: { id: adId },
                data: {
                    remainingBudget: newRemainingBudget,
                    updatedAt: new Date() // ローテーション用のupdatedAt更新
                }
            })
        }, {
            maxWait: 10000, // default: 2000
            timeout: 25000, // default: 5000
        }).catch((err) => {
            throw err
        })

        console.log(`YOUTUBE-PUT-3`)
        //////////
        //■[ 12時間以上経過したYouTube広告の検閲チェック（古い順に3件） ]
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000)
        const adsNeedingRecheck = await prisma.advertisement.findMany({
            where: {
                adType: { startsWith: 'youtube-' },
                status: 'active',
                verified: true,
                OR: [
                    { ytVideoCheckedAt: null },
                    { ytVideoCheckedAt: { lt: twelveHoursAgo } }
                ]
            },
            select: {
                id: true,
                targetId: true,
                userId: true,
                remainingBudget: true
            },
            orderBy: {
                ytVideoCheckedAt: 'asc' // 古い順（nullが最初）
            },
            take: 3 // 3件まで
        })

        console.log(`YOUTUBE-PUT-4`)
        // 検閲実行
        for (const ad of adsNeedingRecheck) {
            if (!ad.targetId) continue
            
            try {
                const verificationResult = await verifyYouTubeVideo(ad.targetId)
                    console.log(verificationResult)
                //////////
                //■[ catch error の場合は一時的エラーとして処理をスキップ ]
                if (verificationResult.errMsg.startsWith('catch error')) {
                    console.warn(`YouTube ad ${ad.id} verification skipped due to temporary error: ${verificationResult.errMsg}`)
                    continue // 次回再チェックするためytVideoCheckedAtは更新しない
                }
                
                if (!verificationResult.isValid) {
                    //////////
                    //■[ 検閲失敗 → 削除処理＋ポイント還元＋通知 ]
                    await prisma.$transaction(async (prismaT) => {
                        // 1. 広告削除
                        const deleteAd = await prismaT.advertisement.delete({
                            where: { id: ad.id },
                            select: {
                                remainingBudget: true
                            }
                        })

                        // 2. user.amount に remainingBudget を加算
                        await prismaT.user.update({
                            where: { id: ad.userId },
                            data: {
                                amount: { increment: Number(deleteAd.remainingBudget) },
                                updatedAt: new Date()
                            }
                        })

                        // 3. Pointにデータ追加
                        const uniqueKey = `youtube-verification-${ad.id}-${Date.now()}`
                        await prismaT.point.create({
                            data: {
                                type: 'refund',
                                amount: Number(deleteAd.remainingBudget),
                                description: `YouTube advertisement #${ad.id} verification failure refund`,
                                uniqueKey,
                                userId: ad.userId
                            }
                        })

                        // 4. 通知作成
                        await prismaT.notification.create({
                            data: {
                                title: 'YouTube広告が無効化されました',
                                description: `YouTube動画の検閲に失敗したため、広告ID #${ad.id} が削除され、残額 ${deleteAd.remainingBudget}円 が返金されました。`,
                                type: 'advertisement',
                                userId: ad.userId
                            }
                        })
                    }, {
                        maxWait: 10000,
                        timeout: 25000,
                    })

                    console.warn(`YouTube ad ${ad.id} deleted due to verification failure: ${verificationResult.errMsg}`)
                    
                } else {
                    //////////
                    //■[ 検閲問題無し → ytVideoCheckedAt更新 ]
                    const nowDate = new Date();
                    await prisma.advertisement.update({
                        where: { id: ad.id },
                        data: { 
                            verifiedAt:nowDate,
                            ytVideoCheckedAt:nowDate
                         }
                    })
                }
            } catch (err) {
                console.error(`YouTube verification failed for ad ${ad.id}:`, err)
                // エラー時は次回再チェックするためytVideoCheckedAtは更新しない
            }
        }

        //////////
        //■[ レスポンス返却 ]
        return NextResponse.json(
            {
                success: true,
                message: 'YouTube completion tracked successfully'
            },
            { status: 200 }
        )

    } catch (err) {
        console.error('YouTube Ad PUT Error:', err)
        
        return NextResponse.json(
            {
                success: false,
                errMsg: err instanceof Error ? err.message : 'Internal Server Error'
            },
            { status: 500 }
        )
    }
}


//////////
//■[ DELETE: YouTube広告削除（クライアント側再生不可対応） ]
export async function DELETE(request: NextRequest) {
    try {
        //////////
        //■[ API Key認証 ]
        if (!validateApiKey(request)) {
            return NextResponse.json(
                { success: false, errMsg: 'Access denied: Invalid API key' },
                { status: 403 }
            )
        }

        //////////
        //■[ リクエストボディ取得 ]
        const body = await request.json()
        const { adId, reason } = body

        // バリデーション
        if (!adId || typeof adId !== 'number') {
            return NextResponse.json(
                { success: false, errMsg: 'Invalid adId' },
                { status: 400 }
            )
        }

        //////////
        //■[ 広告存在確認 ]
        const advertisement = await prisma.advertisement.findFirst({
            where: {
                id: adId,
                adType: { startsWith: 'youtube-' },
                status: 'active'
            },
            select: {
                id: true,
                userId: true,
                remainingBudget: true,
                targetId: true
            }
        })
        if (!advertisement) {
            return NextResponse.json(
                { 
                    success: false, 
                    errMsg: 'YouTube advertisement not found' 
                },
                { status: 404 }
            )
        }

        //////////
        //■[ 削除処理＋ポイント還元＋通知 ]
        await prisma.$transaction(async (prismaT) => {
            // 1. 広告削除
            const deleteAd = await prismaT.advertisement.delete({
                where: { id: advertisement.id },
                select: {
                    remainingBudget: true
                }
            })

            // 2. user.amount に remainingBudget を加算
            await prismaT.user.update({
                where: { id: advertisement.userId },
                data: {
                    amount: { increment: Number(deleteAd.remainingBudget) },
                    updatedAt: new Date()
                }
            })

            // 3. Pointにデータ追加
            const uniqueKey = `youtube-playback-error-${advertisement.id}-${Date.now()}`
            await prismaT.point.create({
                data: {
                    type: 'refund',
                    amount: Number(deleteAd.remainingBudget),
                    description: `YouTube advertisement #${advertisement.id} deleted due to playback error`,
                    uniqueKey,
                    userId: advertisement.userId
                }
            })

            // 4. 通知作成
            const reasonText = reason === 'playback-error' 
                ? 'YouTube動画の再生に失敗したため' 
                : 'YouTube動画に問題が発生したため'
                
            await prismaT.notification.create({
                data: {
                    title: 'YouTube広告が削除されました',
                    description: `${reasonText}、広告ID #${advertisement.id} が削除され、残額 ${deleteAd.remainingBudget}円 が返金されました。動画ID: ${advertisement.targetId}`,
                    type: 'advertisement',
                    userId: advertisement.userId
                }
            })
        }, {
            maxWait: 10000,
            timeout: 25000,
        }).catch((err) => {
            throw err
        })

        console.warn(`YouTube ad ${advertisement.id} deleted due to client-side playback error`)

        //////////
        //■[ レスポンス返却 ]
        return NextResponse.json(
            {
                success: true,
                message: 'YouTube advertisement deleted successfully'
            },
            { status: 200 }
        )

    } catch (err) {
        console.error('YouTube Ad DELETE Error:', err)
        
        return NextResponse.json(
            {
                success: false,
                errMsg: err instanceof Error ? err.message : 'Internal Server Error'
            },
            { status: 500 }
        )
    }
}
