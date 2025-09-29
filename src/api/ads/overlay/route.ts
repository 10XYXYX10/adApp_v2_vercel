// src/app/api/ads/overlay/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateApiKey } from '@/lib/functions/apiFunctions'

const r2Prefix = process.env.NEXT_PUBLIC_MEDIA_PATH as string;
const wpPrefix = process.env.NEXT_PUBLIC_WP_TOP_PATH as string;

//////////
//■[ GET: ランダムオーバーレイ広告取得 ]
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
        //■[ 有効なオーバーレイ広告を最大2件取得（古い順） ]
        const advertisements = await prisma.advertisement.findMany({
            where: {
                adType: 'overlay',
                status: 'active',
                verified: true,
                remainingBudget: {
                    gte: 0.1 // オーバーレイ広告の最低表示コスト
                }
            },
            select: {
                id: true,
                destinationUrl: true,
                mediaFile: {
                    select: {
                        filePath: true,
                        filePathV2: true,
                        destination: true
                    }
                }
            },
            orderBy: {
                updatedAt: 'asc' // 古い順で取得してローテーション実現
            },
            take: 2 // 最大2件取得
        })

        //////////
        //■[ 広告が見つからない場合 ]
        if (advertisements.length === 0) {
            return NextResponse.json(
                { 
                    success: true, 
                    data: [],
                    message: 'No active overlay advertisements available' 
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
        const responseData = advertisements.map(ad => {
            const mediaFile = ad.mediaFile!
            let imageUrl = ''
            
            if (mediaFile.destination === 'r2') {
                imageUrl = `${r2Prefix}/${mediaFile.filePath}`
            } else if (mediaFile.destination === 'wp' && mediaFile.filePathV2) {
                imageUrl = `${wpPrefix}/${mediaFile.filePathV2}`
            } else {
                // フォールバック: R2パスを使用
                imageUrl = `${r2Prefix}/${mediaFile.filePath}`
            }

            return {
                adId: ad.id,
                imageUrl,
                destinationUrl: ad.destinationUrl
            }
        })

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
        console.error('Overlay Ad GET Error:', err)
        
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
//■[ PUT: オーバーレイ広告表示/クリック統計更新 ]
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
        const body = await request.json()
        const { adId, action } = body

        // バリデーション
        if (!adId || typeof adId !== 'number') {
            return NextResponse.json(
                { success: false, errMsg: 'Invalid adId' },
                { status: 400 }
            )
        }

        if (action !== 'impression' && action !== 'click') {
            return NextResponse.json(
                { success: false, errMsg: 'Invalid action. The value is incorrect' },
                { status: 400 }
            )
        }

        //////////
        //■[ 広告存在確認 ]
        const advertisement = await prisma.advertisement.findFirst({
            where: {
                id: adId,
                adType: 'overlay',
                status: 'active',
                verified: true,
                remainingBudget: {
                    gte: action === 'impression' ? 0.1 : 1.0 // 表示0.1P、クリック1.0P
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
        const requiredAmount = action === 'impression' ? 0.1 : 1.0
        const actualSpent = Math.min(requiredAmount, currentRemainingBudget)

        //////////
        //■[ DB更新（統計・予算消費・updatedAt更新） ]
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
                        impressions: action === 'impression' ? { increment: 1 } : undefined,
                        clicks: action === 'click' ? { increment: 1 } : undefined,
                        spentPoints: { increment: actualSpent },
                        updatedAt: new Date()
                    }
                })
            } else {
                // 新規統計作成
                await prismaT.adStats.create({
                    data: {
                        advertisementId: advertisement.id,
                        userId: advertisement.userId,
                        date: today,
                        impressions: action === 'impression' ? 1 : 0,
                        clicks: action === 'click' ? 1 : 0,
                        spentPoints: actualSpent
                    }
                })
            }

            //////////
            //・Advertisement予算更新＋updatedAt更新（ローテーション用）
            await prismaT.advertisement.update({
                where: { id: advertisement.id },
                data: {
                    remainingBudget: { decrement: actualSpent },
                    updatedAt: new Date() // ローテーション用のupdatedAt更新
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
                message: `Overlay ${action} tracked successfully`
            },
            { status: 200 }
        )

    } catch (err) {
        console.error('Overlay Ad PUT Error:', err)
        
        return NextResponse.json(
            {
                success: false,
                errMsg: err instanceof Error ? err.message : 'Internal Server Error'
            },
            { status: 500 }
        )
    }
}