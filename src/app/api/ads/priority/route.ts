// src/app/api/ads/priority/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateApiKey } from '@/lib/functions/apiFunctions'

//////////
//■[ GET: ランダム優先表示広告取得 ]
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
        //■[ 有効な優先表示広告を取得 ]
        const advertisements = await prisma.advertisement.findMany({
            where: {
                adType: 'priority',
                status: 'active',
                verified: true,
                remainingBudget: {
                    gte: 0.1 // 最低表示コスト以上の予算が必要
                }
            },
            select: {
                id: true,
                targetId: true,
                remainingBudget: true,
                userId: true,
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        //////////
        //■[ 広告が見つからない場合 ]
        if (advertisements.length === 0) {
            return NextResponse.json(
                {
                    success: true,
                    data: null,
                    message: 'No active priority advertisements available'
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
        //■[ ランダムに1件選択 ]
        const randomIndex = Math.floor(Math.random() * advertisements.length)
        const selectedAd = advertisements[randomIndex]

        //////////
        //■[ DB更新（表示統計・予算消費） ]
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        await prisma.$transaction(async (prismaT) => {
            //////////
            //・AdStats更新
            const existingStats = await prismaT.adStats.findUnique({
                where: {
                    advertisementId_date: {
                        advertisementId: selectedAd.id,
                        date: today
                    }
                }
            })

            if (existingStats) {
                // 既存統計を更新
                await prismaT.adStats.update({
                    where: { id: existingStats.id },
                    data: {
                        impressions: { increment: 1 },
                        spentPoints: { increment: 0.1 },
                        updatedAt: new Date()
                    }
                })
            } else {
                // 新規統計作成
                await prismaT.adStats.create({
                    data: {
                        advertisementId: selectedAd.id,
                        userId: selectedAd.userId,
                        date: today,
                        impressions: 1,
                        clicks: 0,
                        spentPoints: 0.1
                    }
                })
            }

            //////////
            //・Advertisement予算更新
            await prismaT.advertisement.update({
                where: { id: selectedAd.id },
                data: {
                    remainingBudget: { decrement: 0.1 },
                    updatedAt: new Date()
                }
            })
        }, {
            maxWait: 10000, // default: 2000
            timeout: 25000, // default: 5000
        }).catch((err) => {
            throw err
        })

        //////////
        //■[ レスポンス返却 ]
        return NextResponse.json(
            {
                success: true,
                data: {
                    adId: selectedAd.id,
                    targetId: selectedAd.targetId
                }
            },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                }
            }
        )

    } catch (err) {
        console.error('Priority Ad Random GET Error:', err)

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
//■[ PUT: クリック統計更新 ]
export async function PUT(request: NextRequest) {
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
        const body = await request.json() as { adId?: number; action?: string };
        const { adId, action } = body

        // バリデーション
        if (!adId || typeof adId !== 'number') {
            return NextResponse.json(
                { success: false, errMsg: 'Invalid adId' },
                { status: 400 }
            )
        }

        if (action !== 'click') {
            return NextResponse.json(
                { success: false, errMsg: 'Invalid action. Only "click" is supported' },
                { status: 400 }
            )
        }

        //////////
        //■[ 広告存在確認 ]
        const advertisement = await prisma.advertisement.findFirst({
            where: {
                id: adId,
                adType: 'priority',
                status: 'active',
                verified: true,
                remainingBudget: {
                    gte: 0.1 // 表示処理と同じ最低条件
                }
            },
            select: {
                id: true,
                userId: true,
                remainingBudget: true
            }
        })

        if (!advertisement) {
            return NextResponse.json(
                {
                    success: false,
                    errMsg: 'Advertisement not found or insufficient budget'
                },
                { status: 404 }
            )
        }

        //////////
        //■[ 実際の消費額計算 ]
        const currentRemainingBudget = Number(advertisement.remainingBudget)
        const actualSpent = Math.min(1.0, currentRemainingBudget)//小さい方の値を返す
        //////////
        //■[ DB更新（クリック統計・予算消費） ]
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        await prisma.$transaction(async (prismaT) => {
            //////////
            //・AdStats更新
            const existingStats = await prismaT.adStats.findUnique({
                where: {
                    advertisementId_date: {
                        advertisementId: advertisement.id,
                        date: today
                    }
                }
            })

            if (existingStats) {
                // 既存統計を更新
                await prismaT.adStats.update({
                    where: { id: existingStats.id },
                    data: {
                        clicks: { increment: 1 },
                        spentPoints: { increment: actualSpent }, // 実際の消費額
                        updatedAt: new Date()
                    }
                })
            } else {
                // 新規統計作成（クリックのみの場合）
                await prismaT.adStats.create({
                    data: {
                        advertisementId: advertisement.id,
                        userId: advertisement.userId,
                        date: today,
                        impressions: 0,
                        clicks: 1,
                        spentPoints: actualSpent // 実際の消費額
                    }
                })
            }

            //////////
            //・Advertisement予算更新
            await prismaT.advertisement.update({
                where: { id: advertisement.id },
                data: {
                    remainingBudget: { decrement: actualSpent }, // 実際の消費額
                    updatedAt: new Date()
                }
            })
        }, {
            maxWait: 10000, // default: 2000
            timeout: 25000, // default: 5000
        }).catch((err) => {
            throw err
        })

        //////////
        //■[ レスポンス返却 ]
        return NextResponse.json(
            {
                success: true,
                message: 'Click tracked successfully'
            },
            { status: 200 }
        )

    } catch (err) {
        console.error('Priority Ad PUT Error:', err)

        return NextResponse.json(
            {
                success: false,
                errMsg: err instanceof Error ? err.message : 'Internal Server Error'
            },
            { status: 500 }
        )
    }
}