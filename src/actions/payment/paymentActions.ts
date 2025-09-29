'use server'
// src/actions/payment/paymentActions.ts
import prisma from "@/lib/prisma"
import { saveAccessTokenInCookies, security } from "@/lib/seculity/seculity"
import { CompletedPaymentItem, PaymentData, PaymentData_Strict, PaymentStatsData, PaymentStatsResponse, PendingPaymentItem } from "@/lib/types/payment/paymentTypes"
import { cookies } from "next/headers"

const dispCount = process.env.NEXT_PUBLIC_DISPLAY_PAYMENT_AND_POINT_COUNT ? Number(process.env.NEXT_PUBLIC_DISPLAY_PAYMENT_AND_POINT_COUNT) : 5;

// NOWPayments API設定
const NOW_PAYMENTS_API_URL = process.env.NOWPAYMENTS_ENDPOINT as string
const NOW_PAYMENTS_API_KEY = process.env.NOWPAYMENTS_SECRET_KEY as string

//////////
//■[ データ整形 ]
//・型変換とDecimal→string変換
const formatPayment = (payment: PaymentData):PaymentData_Strict => ({
  id: payment.id,
  orderId: payment.orderId,
  provider: payment.provider,
  paymentMethod: payment.paymentMethod,
  transactionId: payment.transactionId,
  totalAmount: payment.totalAmount.toString(),
  currency: payment.currency,
  status: payment.status as 'pending' | 'completed' | 'failed' | 'expired',
  createdAt: payment.createdAt,
  //metadata: payment.metadata
})

//////////
//■ [ pendingæ±ºæ¸ˆçŠ¶æ³ç¢ºèª - Admin対応拡張版 ]
//・advertiserId: 0 → Admin Mode（全ユーザーのpending決済チェック）
//・advertiserId: 有効値 → Advertiser Mode（特定ユーザーのみ）
//・Payment.status==='pending'のものを一括取得
//・NOWPayments APIで最新状況確認
//・決済完了時：Payment/Point/User.amount更新
//・決済失敗・期限切れ時：Payment.status更新
export const checkPendingPayments = async ({
  advertiserId,
}: {
  advertiserId: number
}): Promise<{
  success: boolean
  statusCode: number
  errMsg: string
  pendingPayments: PendingPaymentItem[]
  completedPayments: CompletedPaymentItem[]
  newBalance?: string
}> => {
  try {
    // セキュリティチェック
    const cookieStore = await cookies()
    const jwtEncodedStr = cookieStore.get('accessToken')?.value
    if (!jwtEncodedStr) return { 
      success: false, 
      errMsg: 'Unauthorized.', 
      statusCode: 401,
      pendingPayments: [],
      completedPayments: []
    }
    const { result, data:user, message } = await security({jwtEncodedStr,readOnly:true})
    if (!result || !user) return { 
      success: false, 
      statusCode: 401, 
      errMsg: message,
      pendingPayments: [],
      completedPayments: []
    }
    if (user.id !== advertiserId) return { 
      success: false, 
      statusCode: 401, 
      errMsg: 'Unauthorized.',
      pendingPayments: [],
      completedPayments: []
    }

    // pending決済一括取得
    const pendingPayments = await prisma.payment.findMany({
      where: {
        userId: advertiserId,
        status: 'pending',
      },
      select: {
        id: true,
        orderId: true,
        paymentMethod: true,
        totalAmount: true,
        metadata:true,
        currency: true,
        createdAt: true,
        expiredAt: true,
        provider: true,
        transactionId: true,
        purchaseAmount: true,
        userId: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    if (pendingPayments.length === 0) {
        return {
            success: true,
            statusCode: 200,
            errMsg: '',
            pendingPayments: [],
            completedPayments: []
        }
    }

    const updatedCompletedPayments: CompletedPaymentItem[] = []
    let hasBalanceUpdate = false

    // 各pending決済の状況確認
    for (const payment of pendingPayments) {
      try {
        let dbStatus: 'pending' | 'completed' | 'failed' | 'expired' = 'pending'
        
        // 期限切れチェック
        const isExpired = payment.expiredAt && new Date() > payment.expiredAt

        // NOWPayments API で状況確認
        if (payment.provider === 'nowpayments' && payment.transactionId) {
          try {
            // payment.expiredAtが期限切れであっても、一度は確認
            const response = await fetch(`${NOW_PAYMENTS_API_URL}/payment/${payment.transactionId}`, {
              method: 'GET',
              headers: {
                'x-api-key': NOW_PAYMENTS_API_KEY
              }
            })

            if (response.ok) {
              const nowPaymentsStatus = await response.json()
              
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
            } else {
              if (isExpired) dbStatus = 'expired'
            }
          } catch (apiError) {
            console.error(`NOWPayments API call failed for payment ${payment.id}:`, apiError)
            if (isExpired) dbStatus = 'expired'
          }
        } else {
          // CCBillは後で実装
          if (isExpired) dbStatus = 'expired'
        }

        // ステータス変更があった場合のDB更新
        if (dbStatus !== 'pending') {
          await prisma.$transaction(async (tx) => {
            let pointId: number | null = null
            let pointAmount: string | null = null

            // Payment更新
            const updatedPayment = await tx.payment.update({
              where: { id: payment.id },
              data: {
                status: dbStatus,
                // metadata: {
                //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
                //   ...((payment.metadata as any) || {}),
                //   statusUpdatedAt: new Date().toISOString(),
                //   autoCheckCompleted: true
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
                const createdPoint = await tx.point.create({
                  data: {
                    userId: payment.userId,
                    type: 'purchase',
                    amount: payment.purchaseAmount,
                    description: `仮想通貨決済によるポイント購入 (${payment.paymentMethod?.toUpperCase()}) - 自動確認`,
                    uniqueKey,
                    paymentId: payment.id
                  }
                })

                // ユーザーのポイント残高更新
                const {amount:newAmount} = await tx.user.update({
                  where: { id: payment.userId },
                  data: {
                    amount: {
                      increment: payment.purchaseAmount
                    }
                  }
                })

                // accessToken更新
                const {result,message} = await saveAccessTokenInCookies({
                  id:user.id,
                  name:user.name,
                  userType:'advertiser',
                  amount:Number(newAmount)
                });
                if(!result)throw new Error(message);

                pointId = createdPoint.id
                pointAmount = payment.purchaseAmount.toString()
                hasBalanceUpdate = true
              }
            }

            // 完了済み配列に追加
            updatedCompletedPayments.push({
              id: updatedPayment.id,
              orderId: updatedPayment.orderId,
              paymentMethod: payment.paymentMethod,
              totalAmount: payment.totalAmount.toString(),
              currency: payment.currency,
              status: dbStatus,
              completedAt: new Date(),
              pointId,
              pointAmount
            })
          })
        }
      } catch (paymentError) {
        console.error(`Error processing payment ${payment.id}:`, paymentError)
      }
    }

        // 残り pending 決済リスト
        const remainingPendingPayments: PendingPaymentItem[] = pendingPayments
            .filter(payment => !updatedCompletedPayments.some(completed => completed.id === payment.id))
            .map(payment => ({
                id: payment.id,
                orderId: payment.orderId,
                paymentMethod: payment.paymentMethod,
                totalAmount: payment.totalAmount.toString(),
                currency: payment.currency,
                createdAt: payment.createdAt,
                expiredAt: payment.expiredAt,
                provider: payment.provider
            }))

        // 最新の残高取得（ポイント更新があった場合）
        let newBalance: string | undefined
        if (hasBalanceUpdate) {
            const user = await prisma.user.findUnique({
                where: { id: advertiserId },
                select: { amount: true }
            })
            if (user) {
                newBalance = user.amount.toString()
            }
        }

        return {
            success: true,
            statusCode: 200,
            errMsg: '',
            pendingPayments: remainingPendingPayments,
            completedPayments: updatedCompletedPayments,
            newBalance
        }

    } catch (err) {
        console.error('checkPendingPayments error:', err)
        return {
            success: false,
            statusCode: 500,
            errMsg: err instanceof Error ? err.message : 'Internal Server Error.',
            pendingPayments: [],
            completedPayments: []
        }
    }
}



//////////
//■ [ 決済履歴取得 - Admin対応拡張版 ]
//・advertiserId: 0 → Admin Mode（全ユーザー決済）
//・advertiserId: 有効値 → Advertiser Mode（特定ユーザーのみ）
//・30件+1件取得でページング判定
//・最新順（createdAt DESC）でソート
export const getPaymentHistory = async ({
 advertiserId, // 0 = admin mode, 有効値 = advertiser mode
 page,
}: {
 advertiserId: number
 page: number
}): Promise<{
 success: boolean
 statusCode: number
 errMsg: string
 data?: PaymentData_Strict[]
 pendingData?: PaymentData_Strict[]
}> => {
 try {
   //////////
   //■ [ セキュリティチェック - Admin/Advertiser分岐 ]
   const cookieStore = await cookies();
   const jwtEncodedStr = cookieStore.get('accessToken')?.value;
   if(!jwtEncodedStr) return {success:false, errMsg:'Unauthorized.', statusCode:401}
   const { result, data, message } = await security({jwtEncodedStr,readOnly:true})
   if (!result || !data) return { success: false, statusCode: 401, errMsg: message }
   if (advertiserId === 0) {
     // Admin Mode: 管理者認証
     if (data.userType !== 'admin') return { success: false, statusCode: 401, errMsg: 'Admin access required.' }
   } else {
     // Advertiser Mode: 本人確認
     if (data.id !== advertiserId) return { success: false, statusCode: 401, errMsg: 'Unauthorized.' }
   }

   //////////
   //■ [ ページバリデーション ]
   if (!page || page < 1) return { success: false, statusCode: 400, errMsg: 'Invalid page number.' }

   //////////
   //■ [ pending決済取得 - Admin/Advertiser共通 ]
   const pendingPayments = await prisma.payment.findMany({
     where: {
       ...(advertiserId !== 0 ? { advertiserId } : {}), // Admin: 全ユーザー、Advertiser: 自分のみ
       status: 'pending'
     },
     select: {
       id: true,
       orderId: true,
       provider: true,
       paymentMethod: true,
       transactionId: true,
       totalAmount: true,
       currency: true,
       status: true,
       createdAt: true,
       metadata: true,
       ...(advertiserId === 0 ? { 
         user: { 
           select: { 
             id: true, 
             name: true 
           } 
         } 
       } : {}) // Admin Mode時はユーザー情報も取得
     },
     orderBy: {
       createdAt: 'desc'
     }
   })

   //////////
   //■ [ 通常決済履歴取得 - Admin/Advertiser共通 ]
   const regularPayments = await prisma.payment.findMany({
     where: {
       ...(advertiserId !== 0 ? { advertiserId } : {}), // Admin: 全ユーザー、Advertiser: 自分のみ
       status: {
         not: 'pending'
       }
     },
     select: {
       id: true,
       orderId: true,
       provider: true,
       paymentMethod: true,
       transactionId: true,
       totalAmount: true,
       currency: true,
       status: true,
       createdAt: true,
       metadata: true,
       ...(advertiserId === 0 ? { 
         user: { 
           select: { 
             id: true, 
             name: true 
           } 
         } 
       } : {}) // Admin Mode時はユーザー情報も取得
     },
     orderBy: {
       createdAt: 'desc'
     },
     take: dispCount + 1, // 30 + 1件
     skip: (page - 1) * dispCount
   })

   //////////
   //■ [ データ整形 - Admin Mode時はユーザー情報付与 ]
   const formattedPendingPayments = pendingPayments.map(payment => ({
     ...formatPayment(payment),
     ...(advertiserId === 0 && payment.user ? { 
       userName: payment.user.name,
       advertiserIdInfo: payment.user.id 
     } : {})
   }))
   
   const formattedRegularPayments = regularPayments.map(payment => ({
     ...formatPayment(payment),
     ...(advertiserId === 0 && payment.user ? { 
       userName: payment.user.name,
       advertiserIdInfo: payment.user.id 
     } : {})
   }))

   //////////
   //■ [ return ]
   return {
     success: true,
     statusCode: 200,
     errMsg: '',
     data: formattedRegularPayments, // 31件のままコンポーネントに渡す
     pendingData: formattedPendingPayments,
   }

 } catch (err) {
   console.error('getPaymentHistory error:', err)
   return {
     success: false,
     statusCode: 500,
     errMsg: err instanceof Error ? err.message : 'Internal Server Error.'
   }
 }
}



//////////
//■[ Payment統計データ取得関数 ]
export async function getPaymentStatsData({
  startDate,
}: {
  startDate?: string // 指定月の1日（YYYY-MM-01形式、未指定時は今月）
}): Promise<PaymentStatsResponse> {
  try {
    //////////
    //■[ 期間計算（月別専用） ]
    // let calculatedStartDate: Date
    // let calculatedEndDate: Date
    let year: number, month: number

    if (startDate) {
      // 指定された月（YYYY-MM-01形式）
      const [yearStr, monthStr] = startDate.split('-')
      year = Number(yearStr)
      month = Number(monthStr) - 1 // monthは0ベース
      
      if (isNaN(year) || isNaN(month) || month < 0 || month > 11) {
        return { success: false, data: null, errMsg: 'Invalid date format. Use YYYY-MM-01.', statusCode: 400 }
      }
    } else {
      // 今月
      const now = new Date()
      year = now.getFullYear()
      month = now.getMonth()
    }
    
    // 開始日：月の1日 00:00:00
    const calculatedStartDate = new Date(year, month, 1, 0, 0, 0, 0)
    
    // 終了日：月の末日 23:59:59
    const calculatedEndDate = new Date(year, month + 1, 0, 23, 59, 59, 999)
    
    //////////
    //■[ Payment統計データ取得（日別集計） ]
    // completedステータスのPaymentのみを対象とする
    const paymentsData = await prisma.payment.findMany({
      where: {
        status: 'completed',
        createdAt: {
          gte: calculatedStartDate,
          lte: calculatedEndDate
        }
      },
      select: {
        createdAt: true,
        purchaseAmount: true,
        totalAmount: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    //////////
    //■[ 日別データ集計処理 ]
    const dailyStatsMap = new Map<string, {
      paymentCount: number
      totalAmount: number
      totalFees: number
    }>()

    paymentsData.forEach(payment => {
      // 日付をYYYY-MM-DD形式に変換
      const dateKey = payment.createdAt.getFullYear() + '-' + 
                     String(payment.createdAt.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(payment.createdAt.getDate()).padStart(2, '0')
      
      const existing = dailyStatsMap.get(dateKey) || {
        paymentCount: 0,
        totalAmount: 0,
        totalFees: 0
      }
      
      const purchaseAmount = Number(payment.purchaseAmount)
      const totalAmount = Number(payment.totalAmount)
      const fees = totalAmount - purchaseAmount // 手数料 = 総額 - 購入額
      
      dailyStatsMap.set(dateKey, {
        paymentCount: existing.paymentCount + 1,
        totalAmount: existing.totalAmount + purchaseAmount,
        totalFees: existing.totalFees + fees
      })
    })

    //////////
    //■[ 軽量データ変換（0埋めはクライアントサイドで実行） ]
    const stats: PaymentStatsData[] = Array.from(dailyStatsMap.entries())
      .map(([date, data]) => ({
        date,
        paymentCount: data.paymentCount,
        totalAmount: data.totalAmount,
        totalFees: data.totalFees
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    //////////
    //■[ サマリー計算（軽量化） ]
    const totalPaymentCount = stats.reduce((sum, stat) => sum + stat.paymentCount, 0)
    const totalAmount = stats.reduce((sum, stat) => sum + stat.totalAmount, 0)
    const totalFees = stats.reduce((sum, stat) => sum + stat.totalFees, 0)
    
    const avgAmountPerPayment = totalPaymentCount > 0 ? totalAmount / totalPaymentCount : 0

    //////////
    //■[ レスポンス形成（確実な期間情報付き） ]
    const responseData = {
      success: true,
      data: {
        stats,
        summary: {
          totalPaymentCount,
          totalAmount: Math.round(totalAmount * 100) / 100, // 小数点2桁
          totalFees: Math.round(totalFees * 100) / 100,
          avgAmountPerPayment: Math.round(avgAmountPerPayment * 100) / 100
        },
        period: {
          type: 'monthly' as const,
          startDate: calculatedStartDate.getFullYear() + '-' + 
                    String(calculatedStartDate.getMonth() + 1).padStart(2, '0') + '-01', // 必ず1日
          endDate: calculatedEndDate.getFullYear() + '-' + 
                  String(calculatedEndDate.getMonth() + 1).padStart(2, '0') + '-' + 
                  String(calculatedEndDate.getDate()).padStart(2, '0')
        }
      },
      errMsg: '',
      statusCode: 200
    }

    return responseData

  } catch (err) {
    //////////
    //■[ エラーハンドリング ]
    console.error('Payment stats fetch error:', err)
    return {
      success: false,
      data: null,
      errMsg: err instanceof Error ? err.message : 'Internal Server Error.',
      statusCode: 500
    }
  }
}

//////////
//■[ Payment統計データ可用性チェック（prev/nextボタン制御用） ]
export async function checkPaymentStatsDataAvailability({
  currentDate,
}: {
  currentDate: string // YYYY-MM-01形式 
}): Promise<{
  success: boolean
  data: {
    hasPrevious: boolean
    hasNext: boolean
    previousDate?: string
    nextDate?: string
  } | null
  errMsg: string
  statusCode: number
}> {
  try {
    //////////
    //■[ バリデーション ]
    // YYYY-MM-01形式チェック
    const dateMatch = currentDate.match(/^(\d{4})-(\d{2})-01$/)
    if (!dateMatch) {
      return { success: false, data: null, errMsg: 'Invalid date format. Use YYYY-MM-01.', statusCode: 400 }
    }
    
    //////////
    //■[ 期間移動計算（月別専用） ]
    const [year, month] = currentDate.split('-').map(Number)
    const today = new Date()
    
    let hasPrevious = false, hasNext = false
    let previousDate: string | undefined, nextDate: string | undefined

    // 前月計算
    const prevYear = month === 1 ? year - 1 : year
    const prevMonth = month === 1 ? 12 : month - 1
    
    // 次月計算
    const nextYear = month === 12 ? year + 1 : year
    const nextMonth = month === 12 ? 1 : month + 1

    //////////
    //■[ prev判定：前月が2025年6月以降 ]
    hasPrevious = prevYear > 2025 || (prevYear === 2025 && prevMonth >= 6)
    if (hasPrevious) {
      previousDate = `${prevYear}-${String(prevMonth).padStart(2, '0')}-01`
    }

    //////////
    //■[ next判定：次月が今月以前 ]
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth() + 1
    hasNext = nextYear < currentYear || (nextYear === currentYear && nextMonth <= currentMonth)
    if (hasNext) {
      nextDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`
    }

    //////////
    //■[ レスポンス形成 ]
    const response = {
      success: true,
      data: {
        hasPrevious,
        hasNext,
        previousDate,
        nextDate
      },
      errMsg: '',
      statusCode: 200
    }

    return response

  } catch (err) {
    console.error('Payment data availability check error:', err)
    return {
      success: false,
      data: null,
      errMsg: err instanceof Error ? err.message : 'Internal Server Error.',
      statusCode: 500
    }
  }
}
