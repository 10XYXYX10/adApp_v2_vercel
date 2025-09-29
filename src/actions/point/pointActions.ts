'use server'
// src/actions/point/pointActions.ts
import prisma from "@/lib/prisma"
import { security } from "@/lib/seculity/seculity"
import { cookies } from "next/headers"
import { GetPointListParams, GetPointListResponse } from "@/lib/types/point/pointTypes"
import { Prisma } from "@prisma/client"

const fetchCount = process.env.NEXT_PUBLIC_FETCH_COUNT ? Number(process.env.NEXT_PUBLIC_FETCH_COUNT) : 10

export const getPointList = async ({
    advertiserId,
    type = '',
    sort = 'desc',
    page = 1
}: GetPointListParams): Promise<GetPointListResponse> => {
    try {
        // セキュリティチェック
        const cookieStore = await cookies()
        const jwtEncodedStr = cookieStore.get('accessToken')?.value
        if (!jwtEncodedStr) {
            return {
                success: false,
                statusCode: 401,
                errMsg: 'Unauthorized.',
            }
        }
        const { result, data, message } = await security({jwtEncodedStr,readOnly:true})
        if (!result || !data) {
            return {
                success: false,
                statusCode: 401,
                errMsg: message,
            }
        }
        // Admin/Advertiser認証チェック
        if (advertiserId === 0) {
            // Admin Mode: 管理者認証
            if (data.userType !== 'admin') {
                return {
                    success: false,
                    statusCode: 401,
                    errMsg: 'Admin access required.',
                }
            }
        } else {
            // Advertiser Mode: 本人確認
            if (data.id !== advertiserId) {
                return {
                    success: false,
                    statusCode: 401,
                    errMsg: 'Unauthorized.',
                }
            }
        }

        // ページバリデーション
        if (!page || page < 1) {
            return {
                success: false,
                statusCode: 400,
                errMsg: 'Invalid page number.',
            }
        }

        // WHERE条件構築
        const whereOb:Prisma.PointWhereInput  = {}

        // Admin/Advertiser制約
        if (advertiserId !== 0) {
            whereOb.userId = advertiserId // 本人のポイントのみ
        }

        // typeフィルター
        if (type && (type === 'purchase' || type === 'consume' || type === 'refund')) {
            whereOb.type = type
        }

        // ポイント一覧取得（n+1パターン）
        const points = await prisma.point.findMany({
            where: whereOb,
            select: {
                id: true,
                type: true,
                amount: true,
                description: true,
                createdAt: true,
                payment: {
                    select: {
                        id: true,
                        orderId: true,
                        paymentMethod: true,
                        totalAmount: true,
                        status: true,
                    }
                }
            },
            orderBy: {
                createdAt: sort
            },
            take: fetchCount + 1, // n+1パターン
            skip: (page - 1) * fetchCount
        })

        // データ整形
        const formattedPoints = points.map(point => ({
            id: point.id,
            type: point.type as 'purchase' | 'consume' | 'refund',
            amount: point.amount.toString(),
            description: point.description,
            createdAt: point.createdAt,
            payment: point.payment ? {
                id: point.payment.id,
                orderId: point.payment.orderId,
                paymentMethod: point.payment.paymentMethod,
                totalAmount: point.payment.totalAmount.toString(),
                status: point.payment.status,
            } : null
        }))

        return {
            success: true,
            statusCode: 200,
            errMsg: '',
            data: formattedPoints // fetchCount+1件のデータ
        }

    } catch (err) {
        console.error('getPointList error:', err)
        return {
            success: false,
            statusCode: 500,
            errMsg: err instanceof Error ? err.message : 'Internal Server Error.',
        }
    }
}