// src/dal/point/pointFunctions.ts
import prisma from "@/lib/prisma"
import { GetPointDetailResult } from "@/lib/types/point/pointTypes";

//////////
//■[ Point詳細取得 ]
export const getPointDetail = async({
    pointId,
    advertiserId,//adminから実行する際は0を指定
}:{
    pointId: number
    advertiserId: number
}): Promise<GetPointDetailResult> => {
    try {
        //////////
        //■[ データ取得 ]
        //・admin判定（advertiserId===0）の場合はuserIdの制約なし
        //・advertiserの場合は自身のPointのみ取得
        const whereCondition = advertiserId === 0 
            ? { id: pointId }
            : { id: pointId, userId: advertiserId };

        const point = await prisma.point.findFirst({
            where: whereCondition,
            select: {
                id: true,
                type: true,
                amount: true,
                description: true,
                createdAt: true,
                paymentId: true,
                payment: {
                    select: {
                        id: true,
                        orderId: true,
                        paymentMethod: true,
                        purchaseAmount: true,
                        totalAmount: true,
                        currency: true,
                        status: true,
                        createdAt: true,
                    }
                }
            }
        });

        if (!point) {
            return {
                success: false,
                errMsg: 'Point not found.',
                data: null
            }
        }

        return {
            success: true,
            errMsg: '',
            data: point
        }
    } catch(err) {
        const errMessage = err instanceof Error ? err.message : 'Internal Server Error.';
        return {
            success: false,
            errMsg: errMessage,
        }
    }
};