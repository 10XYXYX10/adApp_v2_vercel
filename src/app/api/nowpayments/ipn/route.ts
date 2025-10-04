//「src/app/api/nowpayments/ipn/route.ts」
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import crypto from 'crypto'

const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET as string

// オブジェクトを再帰的にソート（NOWPayments公式仕様）
const sortObject = (obj: any): any => {
  return Object.keys(obj)
    .sort()
    .reduce((result: any, key) => {
      result[key] = obj[key] && typeof obj[key] === 'object' 
        ? sortObject(obj[key]) 
        : obj[key]
      return result
    }, {})
}

// NOWPayments IPN署名検証
const verifyIPNSignature = (body: any, signature: string): boolean => {
  try {
    if (!ipnSecret) {
      console.error('NOWPAYMENTS_IPN_SECRET not configured')
      return false
    }

    // ★重要: ボディをソートしてからJSON文字列化
    const sortedBody = sortObject(body)
    const payload = JSON.stringify(sortedBody)
    
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
  console.log("--api/nowpayments/ipn/route.ts > POST--")
  try {
    // ヘッダーとボディ取得
    const signature = request.headers.get('x-nowpayments-sig') || ''
    const body = await request.json() // ★先にJSONパース

    console.log('IPN received:', {
      signature: signature ? 'present' : 'missing',
      paymentId: body.payment_id,
      status: body.payment_status
    })

    // 必須フィールド確認
    if (!body.payment_id || !body.payment_status) {
      console.error('Missing required IPN fields')
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // ★署名検証（開発環境でもテスト推奨）
    if (!verifyIPNSignature(body, signature)) {
      console.error('IPN signature verification failed')
      // ★本番では必ず401を返す
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
      console.warn('⚠️ Signature failed but proceeding (dev mode)')
    }

    const paymentId = body.payment_id
    const paymentStatus = body.payment_status

    // 処理対象のステータスのみ処理
    if (!['finished', 'confirmed', 'failed', 'refunded', 'expired'].includes(paymentStatus)) {
      console.log(`Ignoring IPN status: ${paymentStatus}`)
      return NextResponse.json({ message: 'Status ignored' }, { status: 200 })
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

    // 既に処理済みの場合
    if (payment.status === 'completed') {
      console.log(`Payment already completed: ${paymentId}`)
      return NextResponse.json({ message: 'Already processed' }, { status: 200 })
    }

    // ステータス変換
    let dbStatus: 'pending' | 'completed' | 'failed' | 'expired'
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
        
        const existingPoint = await tx.point.findUnique({
          where: { uniqueKey }
        })

        if (!existingPoint) {
          await tx.point.create({
            data: {
              userId: payment.userId,
              type: 'purchase',
              amount: payment.purchaseAmount,
              description: `仮想通貨決済によるポイント購入 (${payment.paymentMethod?.toUpperCase()})`,
              uniqueKey,
              paymentId: payment.id
            }
          })

          await tx.user.update({
            where: { id: payment.userId },
            data: {
              amount: { increment: payment.purchaseAmount }
            }
          })

          console.log(`✅ Points awarded: ${payment.purchaseAmount} to user ${payment.userId}`)
        }
      }
    })

    console.log(`✅ IPN processed: ${paymentId} → ${dbStatus}`)

    // ★必ず200を返す
    return NextResponse.json({ 
      message: 'IPN processed successfully',
      paymentId,
      status: dbStatus
    }, { status: 200 })

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

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}