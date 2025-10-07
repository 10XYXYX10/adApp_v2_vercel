'use server'
// src/actions/payment/crypt/cryptActions.ts
import prisma from "@/lib/prisma"
import { saveAccessTokenInCookies, security } from "@/lib/seculity/seculity"
import { CryptoCurrency, CreatePaymentResult, PaymentStatusResult } from "@/lib/types/payment/crypt/cryptTypes";
import { PaymentStatus } from "@/lib/types/payment/paymentTypes";
import { cookies } from "next/headers";

//const cryptoFee = process.env.CRYPT_FEE ? Number(process.env.CRYPT_FEE) : 0.015;
const appUrl = process.env.NEXT_PUBLIC_APP_URL as string;
const fiveDaysMS = 432000000;//1000*60*60 * 24 * 5;


// CURRENCY_CONFIGの修正
const CURRENCY_CONFIG = {
 ltc: {
   nowPaymentsCurrency: 'ltc',
   name: 'Litecoin',
   symbol: 'LTC'
 },
 eth: {
   nowPaymentsCurrency: 'eth',
   name: 'Ethereum', 
   symbol: 'ETH'
 },
 btc: {
   nowPaymentsCurrency: 'btc',
   name: 'Bitcoin',
   symbol: 'BTC'
 },
  usdc: {
    nowPaymentsCurrency: 'usdc',      // Ethereum ERC-20 の USDC
    name: 'USD Coin(Ethereum)',
    symbol: 'USDC'
  },
  usdcmatic: {
    nowPaymentsCurrency: 'usdcmatic', // Polygon の USDC
    name: 'USD Coin(Polygon)',
    symbol: 'USDC'
  }
}

// "usdc", //Ethereum上のUSDC「https://nowpayments.io/supported-coins/usdc-payments」
// "usdcmatic" //Polygon上のUSDC「https://nowpayments.io/supported-coins/usdcmatic-payments」

// NOWPayments API設定
const NOW_PAYMENTS_API_URL = process.env.NOWPAYMENTS_ENDPOINT as string;
const NOW_PAYMENTS_API_KEY = process.env.NOWPAYMENTS_SECRET_KEY as string;

// 決済作成
export const createCryptoPayment = async ({
  advertiserId,
  currency,
  totalAmount,//手数料込
  purchaseAmount,//購入金額
}: {
  advertiserId: number
  currency: CryptoCurrency
  totalAmount: number
  purchaseAmount: number
}): Promise<CreatePaymentResult> => {
  try {
    //////////
    //■[ セキュリティー ]
    const {result,data,message} = await security({readOnly:false});
    if(!result || !data)return {success:false, errMsg:message, statusCode:401}
    const {id} = data;
    if(id!==advertiserId)return {success:false, errMsg:'Unauthorized.', statusCode:401}


    // 金額バリデーション
    if (!purchaseAmount || purchaseAmount < 100 || purchaseAmount > 100000) return { success: false, errMsg: 'Invalid amount.', statusCode: 400 }

    // 通貨バリデーション
    if (!CURRENCY_CONFIG[currency]) return { success: false, errMsg: 'Invalid currency.', statusCode: 400 }

    // 一意のオーダーID生成
    const orderId = `order_${advertiserId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // NOWPayments API呼び出し準備
    const nowPaymentsPayload = {
      price_amount: totalAmount,//totalAmount ←本番環境ではこちらに,
      price_currency: 'jpy',//'jpy' ← *デモでjpy指定したらerrるから注意
      pay_currency: CURRENCY_CONFIG[currency].nowPaymentsCurrency,
      order_id: orderId,
      order_description: `ポイント購入 - purchaseAmount:${purchaseAmount}, totalAmount:${totalAmount}`,
      // ## IPN = Instant Payment Notification:
      // - NOWPaymentsが決済状況変更時に自動的にPOSTリクエストを送信するURL
      // - ユーザーが送金完了→NOWPaymentsが検知→このURLに通知
      // - サーバー間通信（ユーザーには見えない）
      // - /api/nowpayments/ipnで受信し、DBのPayment,Point,User.amountを更新
      ipn_callback_url: `${appUrl}/api/nowpayments/ipn`,
      // ## success_url:
      // - 決済完了後にユーザーがリダイレクトされるURL
      // - ユーザーが「決済完了しました」ボタンを押した際の遷移先
      // - ユーザー向けの成功画面表示用
      success_url: `${appUrl}/advertiser/${advertiserId}/point/purchase/success`,
      // ## cancel_url:
      // - ユーザーが決済をキャンセルした際のリダイレクト先
      // - 「戻る」ボタンや決済中断時の遷移先
      // - 仮想通貨決済選択画面に戻る
      cancel_url: `${appUrl}/advertiser/${advertiserId}/point/purchase/crypto`
    }

    let nowPaymentsResponse

    // NOWPayments API呼び出し
    try {
      const response = await fetch(`${NOW_PAYMENTS_API_URL}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': NOW_PAYMENTS_API_KEY
        },
        body: JSON.stringify(nowPaymentsPayload)
      })
      if (!response.ok) {
        const errorData = await response.text()
        console.error('NOWPayments API Error:', response.status, errorData)
        throw new Error(`NOWPayments API error: ${response.status}`)
      }
      nowPaymentsResponse = await response.json()

    } catch (error) {
      console.error('NOWPayments API call failed:', error)
      return { 
        success: false, 
        errMsg: 'Payment service temporarily unavailable.', 
        statusCode: 503 
      }
    }//tryCatch

    // 有効期限（5日）
    const expiredAt = new Date(Date.now() + fiveDaysMS)

    // データベースに決済記録を保存
    const newPayment = await prisma.payment.create({
      data: {
        userId: advertiserId,
        orderId: orderId,
        provider: 'nowpayments',
        paymentMethod: CURRENCY_CONFIG[currency].nowPaymentsCurrency,
        transactionId: nowPaymentsResponse.payment_id,
        purchaseAmount,
        totalAmount,//手数料込
        currency: 'JPY',
        status: 'pending',
        expiredAt,
        metadata: {
          nowPaymentsData: nowPaymentsResponse,
          payAddress: nowPaymentsResponse.pay_address,
          payAmount: nowPaymentsResponse.pay_amount,
          payCurrency: nowPaymentsResponse.pay_currency
        }
      },
      select:{
        id: true
      }
    })

    // レスポンスデータ
    const paymentData = {
      id: newPayment.id,//DBのPyment.idではなく、NowPaymentデータのPyment.transactionId
      transactionId: nowPaymentsResponse.payment_id,//NowPaymentデータのPyment.transactionId
      orderId: orderId,
      payAddress: nowPaymentsResponse.pay_address,
      payAmount: nowPaymentsResponse.pay_amount.toString(),
      paymentUrl: nowPaymentsResponse.payment_url ,//|| `https://blockexplorer.com/${currency}`,
      expiredAt: expiredAt.toISOString(),
      currency: CURRENCY_CONFIG[currency].symbol
    }
    
    return {
      success: true,
      errMsg: '',
      statusCode: 200,
      paymentData
    }

  } catch (error) {
    console.error('createCryptoPayment error:', error)
    return {
      success: false,
      errMsg: error instanceof Error ? error.message : 'Internal Server Error.',
      statusCode: 500
    }
  }
}



// 決済状況確認
export const checkCryptoPaymentStatus = async ({
  transactionId,
}:{
  transactionId: string
}): Promise<PaymentStatusResult> => {
  try {
    //////////
    //■[ セキュリティー ]
    const cookieStore = await cookies();
    const jwtEncodedStr = cookieStore.get('accessToken')?.value;
    if(!jwtEncodedStr)return {success:false, errMsg:'Unauthorized.', statusCode:401}
    const {result,data:user,message} = await security({jwtEncodedStr,readOnly:true});
    if(!result || !user)return {success:false, errMsg:message, statusCode:401}
    const userId = user.id;

    // データベースから決済情報取得
    const payment = await prisma.payment.findFirst({
      where: {
        transactionId,
        userId,
      }
    })
    if (!payment) return { success: false, errMsg: 'Payment not found.', statusCode: 404 }

    // 既に完了している場合
    if (payment.status === 'completed') {
      return {
        success: true,
        errMsg: '',
        statusCode: 200,
        status: 'completed',
        transactionId: payment.transactionId || undefined
      }
    }

    // NOWPayments APIで状況確認（期限切れ時も必ず確認）
    let nowPaymentsStatus
    try {
      const response = await fetch(`${NOW_PAYMENTS_API_URL}/payment/${transactionId}`, {
        method: 'GET',
        headers: {
          'x-api-key': NOW_PAYMENTS_API_KEY
        }
      })

      if (!response.ok) {
        console.error('NOWPayments status check failed:', response.status)
        // APIエラーの場合は現在のDBステータスを返す ← errCountでエラー数が一定値以上に達した場合、適切な処理を施すべきかも.NOWPayments側の問題でエラーが続く可能性がある
        return {
          success: true,
          errMsg: '',
          statusCode: 200,
          status: payment.status as PaymentStatus
        }
      }
      nowPaymentsStatus = await response.json()
    } catch (error) {
      console.error('NOWPayments status API error:', error)
      // 本番環境でAPIエラーの場合は現在のDBステータスを返す
      return {
        success: true,
        errMsg: '',
        statusCode: 200,
        status: payment.status as PaymentStatus
      }
    }

    // 期限切れチェック（NOWPayments APIの結果を優先）
    const isExpired = payment.expiredAt && new Date() > payment.expiredAt;
    
    // NOWPayments側で成功している場合は期限切れでも処理続行
    if (isExpired && nowPaymentsStatus.payment_status !== 'finished' && nowPaymentsStatus.payment_status !== 'confirmed') {
      // 期限切れかつNOWPayments側も未完了の場合
      let expiredStatus: 'expired' | 'failed'

      // NOWPayments側の状況に応じて最終ステータス決定
      if (nowPaymentsStatus.payment_status === 'failed' || nowPaymentsStatus.payment_status === 'refunded') {
        expiredStatus = 'failed'
      } else {
        expiredStatus = 'expired'
      }

      await prisma.payment.update({
        where: { id: payment.id },
        data: { 
          status: expiredStatus,
          metadata: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...((payment.metadata as any) || {}),
            nowPaymentsStatus: nowPaymentsStatus,
            expiredAt: new Date().toISOString()
          }
        }
      })

      return {
        success: true,
        errMsg: '',
        statusCode: 200,
        status: expiredStatus
      }
    }

    // ステータス変換
    let dbStatus: 'pending' | 'completed' | 'failed' | 'expired'

    switch (nowPaymentsStatus.payment_status) {
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

    // ステータスが変更された場合はDBを更新
    if (dbStatus !== payment.status) {
      await prisma.$transaction(async (tx) => {
        // Payment更新
        await tx.payment.update({
          where: { id: payment.id },
          data: { 
            status: dbStatus,
            metadata: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ...((payment.metadata as any) || {}),
              nowPaymentsStatus: nowPaymentsStatus
            }
          }
        })

        // 決済完了の場合はポイント付与
        if (dbStatus === 'completed') {
          // 既存のPoint記録確認（重複防止）
          const uniqueKey = `payment-${payment.id}`;
          const existingPoint = await tx.point.findUnique({
            where: { uniqueKey }
          })
          if(!existingPoint){
            // ポイント付与
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
            // ユーザーの総ポイント更新
            const {amount:newAmount} = await tx.user.update({
              where: { id: payment.userId },
              data: {
                amount: {
                  increment: payment.purchaseAmount,
                }
              },
              select:{
                amount: true
              }
            })
            // accessToken更新
            const {result,message} = await saveAccessTokenInCookies({
              id:userId,
              name:user.name,
              userType:'advertiser',
              amount:Number(newAmount)
            });
            if(!result)throw new Error(message);
          }
        }
      })
    }

    return {
      success: true,
      errMsg: '',
      statusCode: 200,
      status: dbStatus,
      transactionId: payment.transactionId || undefined
    }

  } catch (error) {
    console.error('checkCryptoPaymentStatus error:', error)
    return {
      success: false,
      errMsg: error instanceof Error ? error.message : 'Internal Server Error.',
      statusCode: 500
    }
  }
}


//////////
//■ [ 期限切れ・古いpending決済の一括削除 ]
//・5日以上経過したexpired決済を削除
const cleanupExpiredPayments = async (userId:number): Promise<{
 success: boolean
 statusCode: number
 errMsg: string
}> => {
 try {
   //////////
   //■ [ 削除対象の決済を特定 ]
   const fiveDaysAgo = new Date()
   fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5)
   fiveDaysAgo.setHours(0, 0, 0, 0) // 5日前の00:00:00

   const targetPayments = await prisma.payment.findMany({
     where: {
      // 5日以上経過したexpired決済
      status: 'expired',
      createdAt: {
        lt: fiveDaysAgo
      }
     },
     orderBy: {
       createdAt: 'asc'
     }
   })

   if (targetPayments.length === 0) {
     return {
       success: true,
       statusCode: 200,
       errMsg: '',
     }
   }

  //////////
  //■ [ 一括削除実行 ]
  const paymentIdsToDelete = targetPayments.map(p => p.id);
  await prisma.payment.deleteMany({
    where: {
      id: {
        in: paymentIdsToDelete
      }
    }
  })

   //////////
   //■ [ return ]
   return {
     success: true,
     statusCode: 200,
     errMsg: '',
   }

 } catch (err) {
   console.error('cleanupExpiredPayments error:', err)
   return {
     success: false,
     statusCode: 500,
     errMsg: err instanceof Error ? err.message : 'Internal Server Error.'
   }
 }
}