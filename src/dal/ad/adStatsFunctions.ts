// src/fetches/adStatsFunctions.ts
import prisma from '@/lib/prisma'
import { 
  PeriodType, 
  AdStatsData, 
  StatsResponse,
  DataAvailabilityResponse
} from '@/lib/types/ad/adStatsTypes'


//////////
//■[ ユーザー/管理者統計データを取得する関数（修正版 - userId判定対応） ]
export async function getAdStatsData({
  userId,
  startDate,
}:{
  userId: number, // 0の場合は全ユーザー、有効値の場合は特定ユーザー
  startDate?: string // 指定月の1日（YYYY-MM-01形式、未指定時は今月）
}): Promise<StatsResponse> {
  try {
    //////////
    //■[ バリデーション ]
    // userIdが指定されている場合のみ有効性チェック
    if (userId && userId <= 0) {
      return { success: false, data: null, errMsg: 'Invalid user ID.', statusCode: 400 }
    }

    //////////
    //■[ 期間計算（月別専用） ]
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
    //■[ ユーザー/管理者統計データ取得（日別集計） ]
    const statsData = await prisma.adStats.groupBy({
      by: ['date'],
      where: {
        ...(userId ? { userId } : {}), // userIdがあれば特定ユーザー、なければ全ユーザー
        date: {
          gte: calculatedStartDate,
          lte: calculatedEndDate
        }
      },
      _sum: {
        impressions: true,
        clicks: true,
        spentPoints: true
      },
      orderBy: {
        date: 'asc'
      }
    })

    //////////
    //■[ 軽量データ変換（0埋めはクライアントサイドで実行） ]
    const stats: AdStatsData[] = statsData.map(stat => ({
      date: stat.date.getFullYear() + '-' + 
            String(stat.date.getMonth() + 1).padStart(2, '0') + '-' + 
            String(stat.date.getDate()).padStart(2, '0'), // JST対応YYYY-MM-DD形式
      impressions: stat._sum.impressions || 0,
      clicks: stat._sum.clicks || 0,
      spentPoints: Number(stat._sum.spentPoints) || 0
    }))

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
          type: 'monthly' as PeriodType,
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
//■[ ユーザー/管理者データ可用性チェック（prev/nextボタン制御用） ]
export async function checkAdStatsDataAvailability({
  userId, // undefined/0の場合は全ユーザー、有効値の場合は特定ユーザー
  currentDate, // YYYY-MM-01形式 
}:{
  userId?: number, 
  currentDate: string
}): Promise<DataAvailabilityResponse> {
  try {
    //////////
    //■[ バリデーション ]
    // userIdが指定されている場合のみ有効性チェック
    if (userId && userId <= 0) {
      return { success: false, data: null, errMsg: 'Invalid user ID.', statusCode: 400 }
    }

    // YYYY-MM-01形式チェック
    const dateMatch = currentDate.match(/^(\d{4})-(\d{2})-01$/)
    if (!dateMatch) {
      return { success: false, data: null, errMsg: 'Invalid date format. Use YYYY-MM-01.', statusCode: 400 }
    }

    // モード判定ログ
    const isAdminMode = !userId
    
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
    //■[ prev判定：前月が2025年8月以降 ]
    hasPrevious = prevYear > 2025 || (prevYear === 2025 && prevMonth >= 8)
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
    console.error('Data availability check error:', err)
    return {
      success: false,
      data: null,
      errMsg: err instanceof Error ? err.message : 'Internal Server Error.',
      statusCode: 500
    }
  }
}