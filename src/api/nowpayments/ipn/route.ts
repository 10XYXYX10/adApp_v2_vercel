//「src/app/api/nowpayments/ipn/route.ts」
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import crypto from 'crypto'

const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET as string

// NOWPayments IPN署名検証
const verifyIPNSignature = (payload: string, signature: string): boolean => {
  try {
    if (!ipnSecret) {
      console.error('NOWPAYMENTS_IPN_SECRET not configured')
      return false
    }

    const hmac = crypto.createHmac('sha512', ipnSecret)
    hmac.update(payload)
    const expectedSignature = hmac.digest('hex')

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    )
  } catch (error) {
    console.error('IPN signature verification error:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // リクエストボディとヘッダー取得
    const payload = await request.text()
    const signature = request.headers.get('x-nowpayments-sig') || ''

    console.log('IPN received:', {
      signature: signature ? 'present' : 'missing',
      payloadLength: payload.length
    })

    // 本番環境では署名検証必須
    if (process.env.NODE_ENV === 'production') {
      if (!verifyIPNSignature(payload, signature)) {
        console.error('IPN signature verification failed')
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    // JSONパース
    let ipnData
    try {
      ipnData = JSON.parse(payload)
    } catch (error) {
      console.error('IPN JSON parse error:', error)
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      )
    }

    console.log('IPN data:', {
      paymentId: ipnData.payment_id,
      status: ipnData.payment_status,
      orderId: ipnData.order_id
    })

    // 必須フィールド確認
    if (!ipnData.payment_id || !ipnData.payment_status) {
      console.error('Missing required IPN fields')
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const paymentId = ipnData.payment_id
    const paymentStatus = ipnData.payment_status

    // 処理対象のステータスのみ処理
    if (!['finished', 'confirmed', 'failed', 'refunded', 'expired'].includes(paymentStatus)) {
      console.log(`Ignoring IPN status: ${paymentStatus}`)
      return NextResponse.json({ message: 'Status ignored' })
    }

    // データベースで決済情報取得
    const payment = await prisma.payment.findFirst({
      where: {
        transactionId: paymentId,
        provider: 'nowpayments'
      }
    })

    if (!payment) {
      console.error(`Payment not found: ${paymentId}`)
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    // 既に処理済みの場合は重複処理を避ける
    if (payment.status === 'completed') {
      console.log(`Payment already completed: ${paymentId}`)
      return NextResponse.json({ message: 'Already processed' })
    }

    // ステータス変換
    let dbStatus: string
    switch (paymentStatus) {
      case 'finished':
      case 'confirmed':
        dbStatus = 'completed'
        break
      case 'failed':
      case 'refunded':
        dbStatus = 'failed'
        break
      case 'expired':
        dbStatus = 'expired'
        break
      default:
        dbStatus = 'pending'
    }

    // トランザクションで処理
    await prisma.$transaction(async (tx) => {
      // Payment更新
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: dbStatus,
          // metadata: {
          //   ...((payment.metadata as any) || {}),
          //   ipnData: ipnData,
          //   ipnReceivedAt: new Date().toISOString(),
          //   completedAt: dbStatus === 'completed' ? new Date().toISOString() : undefined
          // }
        }
      })

      // 決済完了の場合はポイント付与
      if (dbStatus === 'completed') {
        const uniqueKey = `payment-${payment.id}`
        
        // 重複防止：既存Point確認
        const existingPoint = await tx.point.findUnique({
          where: { uniqueKey }
        })

        if (!existingPoint) {
          // ポイント記録作成
          await tx.point.create({
            data: {
              userId: payment.userId,
              type: 'purchase',
              amount: payment.purchaseAmount,
              description: `仮想通貨決済によるポイント購入 (${payment.paymentMethod?.toUpperCase()}) - IPN`,
              uniqueKey,
              paymentId: payment.id
            }
          })

          // ユーザーのポイント残高更新
          await tx.user.update({
            where: { id: payment.userId },
            data: {
              amount: {
                increment: payment.purchaseAmount
              }
            }
          })

          console.log(`Points awarded: ${payment.purchaseAmount} to user ${payment.userId}`)
        } else {
          console.log(`Points already awarded for payment: ${payment.id}`)
        }
      }
    })

    console.log(`IPN processed successfully: ${paymentId} → ${dbStatus}`)

    // NOWPaymentsに成功応答
    return NextResponse.json({ 
      message: 'IPN processed successfully',
      paymentId,
      status: dbStatus
    })

  } catch (error) {
    console.error('IPN processing error:', error)
    
    // エラーログ詳細
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      })
    }

    // 500エラーを返すとNOWPaymentsが再送する
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET メソッドは無効
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}