//「src/lib/types/ad/adStatsTypes.ts」

//////////
//■[ 期間種別型定義 ]
export type PeriodType = '7days' | 'monthly'

//////////
//■[ 統計データ型定義 ]
export type AdStatsData = {
  date: string // YYYY-MM-DD形式
  impressions: number
  clicks: number
  spentPoints: number
}

//////////
//■[ 統計サマリー型定義 ]
export type StatsSummary = {
  totalImpressions: number
  totalClicks: number
  totalSpentPoints: number
  ctr: number // Click Through Rate
  cpc: number // Cost Per Click
}

//////////
//■[ 期間情報型定義 ]
export type PeriodInfo = {
  type: PeriodType
  startDate: string
  endDate: string
}

//////////
//■[ 統計レスポンス型定義 ]
export type StatsResponse = {
  success: boolean
  data: {
    stats: AdStatsData[]
    summary: StatsSummary
    period: PeriodInfo
  } | null
  errMsg: string
  statusCode: number
}

//////////
//■[ データ可用性チェック型定義 ]
export type DataAvailabilityResponse = {
  success: boolean
  data: {
    hasPrevious: boolean
    hasNext: boolean
    previousDate?: string
    nextDate?: string
  } | null
  errMsg: string
  statusCode: number
}

//////////
//■[ 日付範囲型定義 ]
export type DateRange = {
  earliestDate: string
  latestDate: string
}

//////////
//■[ 日付範囲レスポンス型定義 ]
export type DateRangeResponse = {
  success: boolean
  data: DateRange | null
  errMsg: string
  statusCode: number
}

//////////
//■[ 集計タイプ型定義 ]
export type AggregationType = 'daily' | 'monthly'

//////////
//■[ 集計統計データ型定義 ]
export type AggregatedStatsData = {
  period: string // daily: YYYY-MM-DD, monthly: YYYY-MM, yearly: YYYY
  impressions: number
  clicks: number
  spentPoints: number
  ctr: number
  cpc: number
}

//////////
//■[ 集計統計レスポンス型定義 ]
export type AggregatedStatsResponse = {
  success: boolean
  data: {
    stats: AggregatedStatsData[]
    aggregationType: AggregationType
    totalPeriods: number
  } | null
  errMsg: string
  statusCode: number
}