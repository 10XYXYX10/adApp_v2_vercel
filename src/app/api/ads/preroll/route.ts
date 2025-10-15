// src/app/api/ads/preroll/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { validateApiKey } from '@/lib/functions/apiFunctions';

const r2Prefix = process.env.NEXT_PUBLIC_MEDIA_PATH as string;
const wpPrefix = process.env.NEXT_PUBLIC_WP_TOP_PATH as string;


//////////
//■[ GET: ランダムプレロール広告取得 ]
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
        //■[ 有効なプレロール広告を最大3件取得（古い順） ]
        const advertisements = await prisma.advertisement.findMany({
            where: {
                adType: 'preroll',
                status: 'active',
                verified: true,
                remainingBudget: {
                    gte: 2.0 // プレロール広告の最低再生コスト
                }
            },
            select: {
                id: true,
                remainingBudget: true,
                destinationUrl: true,
                userId: true,
                mediaFile: {
                    select: {
                        id: true,
                        filePath: true,
                        filePathV2: true,
                        destination: true
                    }
                }
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
                    message: 'No active preroll advertisements available'
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
            let videoUrl = ''

            if (mediaFile.destination === 'r2') {
                videoUrl = `${r2Prefix}/${mediaFile.filePath}`
            } else if (mediaFile.destination === 'wp' && mediaFile.filePathV2) {
                videoUrl = `${wpPrefix}/${mediaFile.filePathV2}`
            } else {
                // フォールバック: R2パスを使用
                videoUrl = `${r2Prefix}/${mediaFile.filePath}`
            }

            return {
                adId: ad.id,
                videoUrl,
                destinationUrl: ad.destinationUrl,
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
        console.error('Preroll Ad GET Error:', err)

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
//■[ PUT: プレロール広告視聴完了統計更新 ]
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

        if (action !== 'completed') {
            return NextResponse.json(
                { success: false, errMsg: 'Invalid action. The value is not supported' },
                { status: 400 }
            )
        }

        //////////
        //■[ 広告存在確認 ]
        const advertisement = await prisma.advertisement.findFirst({
            where: {
                id: adId,
                adType: 'preroll',
                status: 'active',
                verified: true,
                remainingBudget: {
                    gte: 0.1 // 最低限の予算があることを確認
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
        const actualSpent = Math.min(2.0, currentRemainingBudget) // 小さい方の値を返す

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
                        advertisementId: advertisement.id,
                        date: today
                    }
                }
            })
            if (existingStats) {
                // 既存統計を更新（impressionsをプレロール視聴完了として扱う）
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
                        advertisementId: advertisement.id,
                        userId: advertisement.userId,
                        date: today,
                        impressions: 1, // プレロール視聴完了
                        clicks: 0,
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
                message: 'Preroll completion tracked successfully'
            },
            { status: 200 }
        )

    } catch (err) {
        console.error('Preroll Ad PUT Error:', err)

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
//■[ PATCH: プレロール広告クリック統計更新 ]
export async function PATCH(request: NextRequest) {
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
                { success: false, errMsg: 'Invalid action. The value is supported' },//攻撃者に手がかりを与えない為、エラー文字列に詳細な情報を含め過ぎない！！
                { status: 400 }
            )
        }

        //////////
        //■[ 広告存在確認 ]
        const advertisement = await prisma.advertisement.findFirst({
            where: {
                id: adId,
                adType: 'preroll',
                status: 'active',
                verified: true
            },
            select: {
                id: true,
                userId: true
            }
        })
        if (!advertisement) {
            return NextResponse.json(
                {
                    success: false,
                    errMsg: 'Advertisement not found'
                },
                { status: 404 }
            )
        }

        //////////
        //■[ DB更新（クリック統計のみ） ]
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
                // 既存統計を更新（クリック数のみ加算）
                await prismaT.adStats.update({
                    where: { id: existingStats.id },
                    data: {
                        clicks: { increment: 1 },
                        updatedAt: new Date()
                    }
                })
            } else {
                // 新規統計作成（クリックのみ）
                await prismaT.adStats.create({
                    data: {
                        advertisementId: advertisement.id,
                        userId: advertisement.userId,
                        date: today,
                        impressions: 0,
                        clicks: 1,
                        spentPoints: 0 // クリックはポイント消費なし
                    }
                })
            }
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
                message: 'Preroll click tracked successfully'
            },
            { status: 200 }
        )

    } catch (err) {
        console.error('Preroll Ad PATCH Error:', err)

        return NextResponse.json(
            {
                success: false,
                errMsg: err instanceof Error ? err.message : 'Internal Server Error'
            },
            { status: 500 }
        )
    }
}