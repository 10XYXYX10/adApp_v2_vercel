'use server'
// src/actions/ad/adStatsActions.ts
import { checkAdStatsDataAvailability, getAdStatsData } from '@/dal/ad/adStatsFunctions'
import prisma from '@/lib/prisma'
import { 
  PeriodType, 
  AdStatsData, 
  StatsResponse,
  DataAvailabilityResponse,
  DateRangeResponse,
  AggregatedStatsResponse,
  AggregationType,
  AggregatedStatsData
} from '@/lib/types/ad/adStatsTypes'


//////////
//■[ 1. 広告統計データ取得 ]
//・JST日付を安全に作成する関数（修正版）
const createJSTDate = (dateStr?: string): Date => {
  if (dateStr) {
    // YYYY-MM-DD形式の文字列から安全に日付を作成
    const [year, month, day] = dateStr.split('-').map(Number)
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      throw new Error(`Invalid date format: ${dateStr}`)
    }
    return new Date(year, month - 1, day) // monthは0ベース
  } else {
    // 現在のJST日付（確実に今日の日付を取得）
    const now = new Date()
    // JSTの今日の日付を確実に取得（時刻は00:00:00）
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }
}

//・広告統計データを取得する関数（修正版）
export async function getTargetAdStatsData( //getAdStatsData → getTargetAdStatsData に修正
  adId: number,
  period: PeriodType,
  startDate?: string // 指定日から期間分取得（未指定時は現在日から）
): Promise<StatsResponse> {
  try {
    //////////
    //■[ バリデーション ]
    if (!adId || adId <= 0) {
      return { success: false, data: null, errMsg: 'Invalid advertisement ID.', statusCode: 400 }
    }
    const validPeriods: PeriodType[] = ['7days', 'monthly']
    if (!validPeriods.includes(period)) {
      return { success: false, data: null, errMsg: 'Invalid period type.', statusCode: 400 }
    }

    //////////
    //■[ 期間計算（修正版 - 確実に現在日基準） ]
    let calculatedStartDate: Date
    let calculatedEndDate: Date

    // baseDate を確実に現在日または指定日に設定
    const baseDate = createJSTDate(startDate)

    if (period === '7days') {
      // 7日間：指定日（または今日）を含む過去7日間
      
      // 終了日：指定日の23:59:59
      calculatedEndDate = new Date(baseDate)
      calculatedEndDate.setHours(23, 59, 59, 999)
      
      // 開始日：6日前の00:00:00（今日含む7日間）
      calculatedStartDate = new Date(baseDate)
      calculatedStartDate.setDate(baseDate.getDate() - 6)
      calculatedStartDate.setHours(0, 0, 0, 0)
      
      // console.log('7days period calculated:', {
      //   start: calculatedStartDate,
      //   end: calculatedEndDate,
      //   baseDate: baseDate
      // })
      
    } else { // monthly
      // 月別：指定月の1日から末日まで
      const year = baseDate.getFullYear()
      const month = baseDate.getMonth()
      //console.log('Monthly calculation for:', { year, month: month + 1, baseDate })
      
      // 開始日：月の1日 00:00:00
      calculatedStartDate = new Date(year, month, 1, 0, 0, 0, 0)
      
      // 終了日：月の末日 23:59:59
      calculatedEndDate = new Date(year, month + 1, 0, 23, 59, 59, 999)
      
      // console.log('Monthly period calculated:', {
      //   start: calculatedStartDate,
      //   end: calculatedEndDate,
      //   startDateStr: `${year}-${String(month + 1).padStart(2, '0')}-01`,
      //   endDateStr: `${year}-${String(month + 1).padStart(2, '0')}-${calculatedEndDate.getDate()}`
      // })
    }

    //////////
    //■[ 統計データ取得（軽量化：最小限のクエリ） ]
    const statsData = await prisma.adStats.findMany({
      where: {
        advertisementId: adId,
        date: {
          gte: calculatedStartDate,
          lte: calculatedEndDate
        }
      },
      select: {
        date: true,
        impressions: true,
        clicks: true,
        spentPoints: true
      },
      orderBy: {
        date: 'asc'
      }
    })

    // console.log('Prisma result:', statsData.length, 'records found')
    // if (statsData.length > 0) {
    //   console.log('First record:', statsData[0])
    //   console.log('Last record:', statsData[statsData.length - 1])
    // }

    //////////
    //■[ 軽量データ変換（0埋めはクライアントサイドで実行） ]
    const stats: AdStatsData[] = statsData.map(stat => ({
      date: stat.date.getFullYear() + '-' + 
            String(stat.date.getMonth() + 1).padStart(2, '0') + '-' + 
            String(stat.date.getDate()).padStart(2, '0'), // JST対応YYYY-MM-DD形式
      impressions: stat.impressions,
      clicks: stat.clicks,
      spentPoints: Number(stat.spentPoints)
    }))

    
    // デバッグ：期間情報をログ出力
    // console.log('Period boundaries:', {
    //   calculatedStart: calculatedStartDate,
    //   calculatedEnd: calculatedEndDate,
    //   periodType: period
    // })

    //////////
    //■[ サマリー計算（軽量化） ]
    const totalImpressions = stats.reduce((sum, stat) => sum + stat.impressions, 0)
    const totalClicks = stats.reduce((sum, stat) => sum + stat.clicks, 0)
    const totalSpentPoints = stats.reduce((sum, stat) => sum + stat.spentPoints, 0)
    
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
    const cpc = totalClicks > 0 ? totalSpentPoints / totalClicks : 0

    //////////
    //■[ レスポンス形成（確実な期間情報付き） ]
    const responseData = {
      success: true,
      data: {
        stats,
        summary: {
          totalImpressions,
          totalClicks,
          totalSpentPoints,
          ctr: Math.round(ctr * 100) / 100, // 小数点2桁
          cpc: Math.round(cpc * 100) / 100
        },
        period: {
          type: period,
          startDate: calculatedStartDate.getFullYear() + '-' + 
                    String(calculatedStartDate.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(calculatedStartDate.getDate()).padStart(2, '0'),
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
    console.error('AdStats fetch error:', err)
    return {
      success: false,
      data: null,
      errMsg: err instanceof Error ? err.message : 'Internal Server Error.',
      statusCode: 500
    }
  }
}

//////////
//■[ 2. データ可用性チェック（prev/nextボタン制御用） ]
export async function checkDataAvailability(
  adId: number,
  period: PeriodType,
  currentDate: string // YYYY-MM-DD形式
): Promise<DataAvailabilityResponse> {
  try {
    //////////
    //■[ バリデーション ]
    if (!adId || adId <= 0) {
      return { success: false, data: null, errMsg: 'Invalid advertisement ID.', statusCode: 400 }
    }

    const validPeriods: PeriodType[] = ['7days', 'monthly']
    if (!validPeriods.includes(period)) {
      return { success: false, data: null, errMsg: 'Invalid period type.', statusCode: 400 }
    }

    //////////
    //■[ 期間移動計算（軽量化版 - データ存在チェック不要） ]
    const [year, month, day] = currentDate.split('-').map(Number)
    const current = new Date(year, month - 1, day) // monthは0ベース
    const today = new Date()
    const limitDate = new Date(2025, 8, 1) // 2025年8月1日（下限）
    
    let previousDate: Date, nextDate: Date
    let hasPrevious = false, hasNext = false

    if (period === '7days') {
      // 前の7日間
      previousDate = new Date(current)
      previousDate.setDate(current.getDate() - 7)
      
      // 次の7日間
      nextDate = new Date(current)
      nextDate.setDate(current.getDate() + 7)
      
      // prev判定: 前期間の終了日が2025/06/01以降
      const prevEndDate = new Date(previousDate)
      prevEndDate.setDate(previousDate.getDate() + 6) // 7日間の終了日
      hasPrevious = prevEndDate >= limitDate
      
      // next判定: 次期間の開始日が今日以前
      hasNext = nextDate <= today
      
    } else { // monthly
      // 前月
      const prevYear = month === 1 ? year - 1 : year
      const prevMonth = month === 1 ? 12 : month - 1
      previousDate = new Date(prevYear, prevMonth - 1, 1) // 前月1日
      
      // 次月
      const nextYear = month === 12 ? year + 1 : year
      const nextMonth = month === 12 ? 1 : month + 1
      nextDate = new Date(nextYear, nextMonth - 1, 1) // 次月1日
      
      // prev判定: 前月が2025年8月以降
      hasPrevious = prevYear > 2025 || (prevYear === 2025 && prevMonth >= 8)
      
      // next判定: 次月が今月以前
      const currentYear = today.getFullYear()
      const currentMonth = today.getMonth() + 1
      hasNext = nextYear < currentYear || (nextYear === currentYear && nextMonth <= currentMonth)
    }

    //////////
    //■[ レスポンス形成（軽量化版） ]
    const response = {
      success: true,
      data: {
        hasPrevious,
        hasNext,
        previousDate: hasPrevious ? (previousDate.getFullYear() + '-' + 
                                     String(previousDate.getMonth() + 1).padStart(2, '0') + '-' + 
                                     String(previousDate.getDate()).padStart(2, '0')) : undefined,
        nextDate: hasNext ? (nextDate.getFullYear() + '-' + 
                             String(nextDate.getMonth() + 1).padStart(2, '0') + '-' + 
                             String(nextDate.getDate()).padStart(2, '0')) : undefined
      },
      errMsg: '',
      statusCode: 200
    }

    return response

  } catch (err) {
    console.error('Data availability check error:', err)
    return {
      success: false,
      data: null,
      errMsg: err instanceof Error ? err.message : 'Internal Server Error.',
      statusCode: 500
    }
  }
}

//////////
//■[ 3. 統計データ日付範囲取得 ]
export async function getStatsDateRange(adId: number): Promise<DateRangeResponse> {
  try {
    //////////
    //■[ バリデーション ]
    if (!adId || adId <= 0) {
      return { success: false, data: null, errMsg: 'Invalid advertisement ID.', statusCode: 400 }
    }

    //////////
    //■[ 効率的な範囲取得 ]
    const dateRange = await prisma.adStats.aggregate({
      where: {
        advertisementId: adId
      },
      _min: {
        date: true
      },
      _max: {
        date: true
      }
    })

    //////////
    //■[ データ存在チェック ]
    if (!dateRange._min.date || !dateRange._max.date) {
      return {
        success: true,
        data: null, // データが存在しない場合
        errMsg: 'No statistics data available for this advertisement.',
        statusCode: 200
      }
    }

    //////////
    //■[ レスポンス形成 ]
    return {
      success: true,
      data: {
        earliestDate: dateRange._min.date.toISOString().split('T')[0],
        latestDate: dateRange._max.date.toISOString().split('T')[0]
      },
      errMsg: '',
      statusCode: 200
    }

  } catch (err) {
    console.error('Date range fetch error:', err)
    return {
      success: false,
      data: null,
      errMsg: err instanceof Error ? err.message : 'Internal Server Error.',
      statusCode: 500
    }
  }
}

//////////
//■[ 4. 集計統計データ取得（グラフ用） ]
export async function getAggregatedStats(
  adId: number,
  aggregationType: AggregationType,
  startDate?: string,
  endDate?: string
): Promise<AggregatedStatsResponse> {
  try {
    //////////
    //■[ バリデーション ]
    if (!adId || adId <= 0) {
      return { success: false, data: null, errMsg: 'Invalid advertisement ID.', statusCode: 400 }
    }

    const validTypes: AggregationType[] = ['daily', 'monthly']
    if (!validTypes.includes(aggregationType)) {
      return { success: false, data: null, errMsg: 'Invalid aggregation type.', statusCode: 400 }
    }

    //////////
    //■[ 期間設定（修正版） ]
    let queryStartDate: Date, queryEndDate: Date
    
    if (startDate && endDate) {
      queryStartDate = new Date(startDate)
      queryStartDate.setHours(0, 0, 0, 0)
      
      queryEndDate = new Date(endDate)
      queryEndDate.setHours(23, 59, 59, 999)
    } else {
      // デフォルト期間設定
      const today = new Date()
      queryEndDate = new Date(today)
      queryEndDate.setHours(23, 59, 59, 999)
      
      queryStartDate = new Date(today)
      if (aggregationType === 'daily') {
        queryStartDate.setDate(today.getDate() - 29) // 過去30日（今日含む）
      } else { // monthly
        queryStartDate.setMonth(today.getMonth() - 11) // 過去12ヶ月（今月含む）
      }
      queryStartDate.setHours(0, 0, 0, 0)
    }

    //////////
    //■[ 統計データ取得 ]
    const statsData = await prisma.adStats.findMany({
      where: {
        advertisementId: adId,
        date: {
          gte: queryStartDate,
          lte: queryEndDate
        }
      },
      select: {
        date: true,
        impressions: true,
        clicks: true,
        spentPoints: true
      },
      orderBy: {
        date: 'asc'
      }
    })

    //////////
    //■[ データ集計処理 ]
    const aggregatedData = new Map<string, {
      impressions: number
      clicks: number
      spentPoints: number
    }>()

    statsData.forEach(stat => {
      let periodKey: string

      if (aggregationType === 'daily') {
        periodKey = stat.date.toISOString().split('T')[0] // YYYY-MM-DD
      } else { // monthly
        const year = stat.date.getFullYear()
        const month = (stat.date.getMonth() + 1).toString().padStart(2, '0')
        periodKey = `${year}-${month}` // YYYY-MM
      }

      const existing = aggregatedData.get(periodKey) || { impressions: 0, clicks: 0, spentPoints: 0 }
      aggregatedData.set(periodKey, {
        impressions: existing.impressions + stat.impressions,
        clicks: existing.clicks + stat.clicks,
        spentPoints: existing.spentPoints + Number(stat.spentPoints)
      })
    })

    //////////
    //■[ 最終データ形成 ]
    const stats: AggregatedStatsData[] = Array.from(aggregatedData.entries())
      .map(([period, data]) => {
        const ctr = data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0
        const cpc = data.clicks > 0 ? data.spentPoints / data.clicks : 0

        return {
          period,
          impressions: data.impressions,
          clicks: data.clicks,
          spentPoints: data.spentPoints,
          ctr: Math.round(ctr * 100) / 100,
          cpc: Math.round(cpc * 100) / 100
        }
      })
      .sort((a, b) => a.period.localeCompare(b.period))

    //////////
    //■[ レスポンス形成 ]
    return {
      success: true,
      data: {
        stats,
        aggregationType,
        totalPeriods: stats.length
      },
      errMsg: '',
      statusCode: 200
    }

  } catch (err) {
    console.error('Aggregated stats fetch error:', err)
    return {
      success: false,
      data: null,
      errMsg: err instanceof Error ? err.message : 'Internal Server Error.',
      statusCode: 500
    }
  }
}

//////////
//■[ 広告総統計データ取得 ]
export async function getAdTotals(
  adId: number
): Promise<{
  success: boolean
  data: {
    totalImpressions: number
    totalClicks: number
    remainingBudget_number: number
  } | null
  errMsg: string
  statusCode: number
}> {
  try {
    //////////
    //■[ バリデーション ]
    if (!adId || adId <= 0) {
      return { 
        success: false, 
        data: null, 
        errMsg: 'Invalid advertisement ID.', 
        statusCode: 400 
      }
    }

    //////////
    //■[ 総統計データ取得（効率的なaggregateクエリ） ]
    const [aggregatedStats, ad] = await prisma.$transaction([
      prisma.adStats.aggregate({
        where: {
          advertisementId: adId  // 条件：特定の広告IDのデータのみ
        },
        _sum: {                  // 合計計算
          impressions: true,     // 表示数の合計を計算
          clicks: true,          // クリック数の合計を計算  
        }
      }),
      prisma.advertisement.findUnique({
        where: { id: adId },
        select: { remainingBudget: true },
      }),
    ])

    //////////
    //■[ 統計値計算 ]
    const totalImpressions = aggregatedStats._sum.impressions || 0
    const totalClicks = aggregatedStats._sum.clicks || 0
    const remainingBudget_number = ad?.remainingBudget.toNumber() || 0

    //////////
    //■[ レスポンス形成 ]
    const responseData = {
      success: true,
      data: {
        totalImpressions,
        totalClicks,
        remainingBudget_number,
      },
      errMsg: '',
      statusCode: 200
    }
    return responseData

  } catch (err) {
    //////////
    //■[ エラーハンドリング ]
    console.error('getAdTotals error:', err)
    return {
      success: false,
      data: null,
      errMsg: err instanceof Error ? err.message : 'Internal Server Error.',
      statusCode: 500
    }
  }
}

export const getAdStatsDataAction = async({
  userId, // 0の場合は全ユーザー、有効値の場合は特定ユーザー
  startDate, // 指定月の1日（YYYY-MM-01形式、未指定時は今月）
}:{
  userId: number  
  startDate?: string 
}):Promise<StatsResponse> => {
  try{
    // userIdが0の場合、headersのcookiesからaccessToken直取得して、DBとの照合無しの簡易的な認証を実行

    // データ取得
    const result = await getAdStatsData({userId,startDate}) as StatsResponse;
    return result;
  }catch(err){
    return {
      success: false,
      data: null,
      errMsg: err instanceof Error ? err.message : 'Internal Server Error.',
      statusCode: 500
    }
  }
}

export const checkAdStatsDataAvailabilityAction = async({
  userId, // undefined/0の場合は全ユーザー、有効値の場合は特定ユーザー
  currentDate, // YYYY-MM-01形式
}:{
  userId?: number,
  currentDate: string
}): Promise<DataAvailabilityResponse> => {
  try{
    const result = await checkAdStatsDataAvailability({ userId, currentDate });
    return result;
  }catch(err){
    return {
      success: false,
      data: null,
      errMsg: err instanceof Error ? err.message : 'Internal Server Error.',
      statusCode: 500
    }
  }
}