// src/dal/payment/paymentFunctions.ts
import prisma from "@/lib/prisma"

export const getPaymentSuccessData = async ({
  advertiserId,
  paymentId,
}: {
  advertiserId: number
  paymentId: number
}): Promise<{
  success: boolean
  statusCode: number
  errMsg: string
  data?: {
    purchasedPoints: number
    totalPaid: number
    userPointAmount: number
    payment: {
      provider: string
      currency: string
      amount: number
      paymentMethod: string | null
    }
  }
}> => {
  try {

    // 決済情報取得
    const payment = await prisma.payment.findFirst({
      where: {
        id:paymentId,
        userId: advertiserId,
        status: 'completed'
      },
      include: {
        points: true
      }
    })
    if (!payment)return { success: false, statusCode: 404, errMsg: 'Payment not found or not completed.' };

    // ユーザーの最新ポイント残高取得
    const user = await prisma.user.findUnique({
      where: { id: advertiserId },
      select: { amount: true }
    });
    if(!user)return { success: false, statusCode: 404, errMsg: 'User not found.' };

    // データを整理
    const purchasedPoints = payment.points[0]?.amount || 0
    const totalPaid = Number(payment.totalAmount)
    const userPointAmount = Number(user.amount)

    return {
      success: true,
      statusCode: 200,
      errMsg: '',
      data: {
        purchasedPoints:Number(purchasedPoints),
        totalPaid,
        userPointAmount,
        payment: {
          provider: payment.provider,
          currency: payment.currency,
          amount: Number(payment.totalAmount),
          paymentMethod: payment.paymentMethod,
        }
      }
    }

  } catch (err) {
    return {
      success: false,
      statusCode: 500,
      errMsg: err instanceof Error ? err.message : 'Internal server error.'
    }
  }
}
