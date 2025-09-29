// src/components/advertiser/ads/detail/stats/AdStatsOverview.tsx
'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  DollarSign,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  Activity
} from 'lucide-react'
import { PeriodType, AdStatsData, StatsSummary, PeriodInfo } from '@/lib/types/ad/adStatsTypes'
import { getTargetAdStatsData, checkDataAvailability } from '@/actions/ad/adStatsActions'
import AdStatsChartV2 from './AdStatsChartV2'

//////////
//■[ 統計データ型定義（修正版） ]
type StatsData = {
  stats: AdStatsData[]
  summary: StatsSummary
  period: PeriodInfo
}

//////////
//■[ ナビゲーション状態型定義 ]
type NavigationState = {
  hasPrevious: boolean
  hasNext: boolean
  isChecking: boolean
}

//////////
//■[ JST日付取得関数 ]
const getJSTDateString = (date?: Date): string => {
  const targetDate = date || new Date()
  return targetDate.getFullYear() + '-' + 
          String(targetDate.getMonth() + 1).padStart(2, '0') + '-' + 
          String(targetDate.getDate()).padStart(2, '0')
}

//////////
//■[ 期間表示フォーマット（修正版） ]
const formatPeriodDisplay = (periodType: PeriodType, startDate: string, endDate: string) => {
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
1
    // 日付の有効性チェック
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.warn(`Invalid dates: ${startDate} - ${endDate}`)
      return `${startDate} - ${endDate}`
    }

    if (periodType === 'monthly') {
      // 月別表示：2025年7月
      return `${start.getFullYear()}年${start.getMonth() + 1}月`
    } else {
      // 7日間表示：7/9 - 7/15
      const formatDate = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`
      return `${formatDate(start)} - ${formatDate(end)}`
    }
  } catch (error) {
    console.error('Period display formatting error:', error)
    return `${startDate} - ${endDate}`
  }
}


export default function AdStatsOverview({ 
  adId, 
  refreshTrigger = 0 
}: {
  adId: number
  refreshTrigger?: number
}) {
  //////////
  //■[ ステート管理 ]
  const [period, setPeriod] = useState<PeriodType>('monthly')
  const [currentDate, setCurrentDate] = useState<string>(() => getJSTDateString())
  const [statsData, setStatsData] = useState<StatsData | null>(null)
  const [navigation, setNavigation] = useState<NavigationState>({
    hasPrevious: false,
    hasNext: false,
    isChecking: false
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  //////////
  //■[ 統計データ取得 ]
  const fetchStatsData = useCallback(async (periodType: PeriodType, targetDate: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getTargetAdStatsData(adId, periodType, targetDate)
      
      if (result.statusCode === 401) {
        alert(result.errMsg)
        window.location.href = '/auth/advertiser'
        return
      }
      if (!result.success || !result.data) {
        setError(result.errMsg || 'データの取得に失敗しました')
        return
      }
      setStatsData(result.data)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err instanceof Error ? err.message : 'データの取得中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }, [])

  //////////
  //■[ ナビゲーション状態チェック ]
  const checkNavigation = useCallback(async (periodType: PeriodType, targetDate: string) => {
    setNavigation(prev => ({ ...prev, isChecking: true }))

    try {
      const result = await checkDataAvailability(adId, periodType, targetDate)
      
      if (result.success && result.data) {
        setNavigation({
          hasPrevious: result.data.hasPrevious,
          hasNext: result.data.hasNext,
          isChecking: false
        })
      } else {
        // エラー時はナビゲーションを無効化
        setNavigation({
          hasPrevious: false,
          hasNext: false,
          isChecking: false
        })
      }
    } catch (err) {
      console.error('Navigation check failed:', err)
      setNavigation({
        hasPrevious: false,
        hasNext: false,
        isChecking: false
      })
    }
  }, [])

  //////////
  //■[ 期間変更ハンドラー（修正版） ]
  // const handlePeriodChange = (newPeriod: PeriodType) => {
  //   setPeriod(newPeriod)
  //   // 期間変更時は現在日にリセット（JST対応）
  //   const today = getJSTDateString()
  //   setCurrentDate(today)
  // }

  //////////
  //■[ 前後移動ハンドラー（JST対応版） ]
  const handleNavigation = (direction: 'prev' | 'next') => {
    try {
      // 現在の日付をJST基準で解析
      const [year, month, day] = currentDate.split('-').map(Number)
      const current = new Date(year, month - 1, day) // monthは0ベース
      
      let newDate: Date

      if (period === '7days') {
        newDate = new Date(current)
        newDate.setDate(current.getDate() + (direction === 'next' ? 7 : -7))
      } else { // monthly
        newDate = new Date(current)
        if (direction === 'next') {
          // 次月の1日
          newDate.setMonth(current.getMonth() + 1, 1)
        } else {
          // 前月の1日
          newDate.setMonth(current.getMonth() - 1, 1)
        }
      }

      const newDateString = getJSTDateString(newDate)
      setCurrentDate(newDateString)
    } catch (error) {
      console.error('Navigation error:', error)
    }
  }

  //////////
  //■[ 初期データ取得 & 更新時の再取得 ]
  useEffect(() => {
    fetchStatsData(period, currentDate)
    checkNavigation(period, currentDate)
  }, [period, currentDate, refreshTrigger])

  //////////
  //■[ サマリーカード設定（修正版） ]
  const summaryCards = useMemo(() => {
    if (!statsData || !statsData.summary) return []
    const { summary } = statsData
    return [
      {
        title: '総表示数',
        value: summary.totalImpressions.toLocaleString(),
        icon: Eye,
        color: 'blue',
        gradient: 'from-blue-500 to-cyan-600'
      },
      {
        title: '総クリック数',
        value: summary.totalClicks.toLocaleString(),
        icon: MousePointer,
        color: 'green',
        gradient: 'from-green-500 to-emerald-600'
      },
      {
        title: 'CTR',
        value: `${summary.ctr.toFixed(2)}%`,
        icon: TrendingUp,
        color: 'purple',
        gradient: 'from-purple-500 to-violet-600'
      },
      {
        title: '総消費ポイント',
        value: `${summary.totalSpentPoints.toLocaleString()}P`,
        icon: DollarSign,
        color: 'orange',
        gradient: 'from-orange-500 to-red-600'
      }
    ]
  }, [statsData])

  //////////
  //■[ 期間情報の表示文字列 ]
  const periodDisplayText = useMemo(() => {
    if (!statsData || !statsData.period) return '-'
    
    return formatPeriodDisplay(
      statsData.period.type, 
      statsData.period.startDate, 
      statsData.period.endDate
    )
  }, [statsData])

  //////////
  //■[ リフレッシュ機能 ]
  const handleRefresh = () => {
    fetchStatsData(period, currentDate)
    checkNavigation(period, currentDate)
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* ヘッダー & コントロール */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl p-6">
        {/* タイトル */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <BarChart3 className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">パフォーマンス統計</h2>
              <p className="text-gray-600 text-sm">詳細な配信データと分析</p>
            </div>
          </div>

          {/* リフレッシュボタン */}
          <motion.button
            onClick={handleRefresh}
            disabled={isLoading}
            className="w-10 h-10 bg-white/70 hover:bg-white/90 disabled:bg-gray-100 rounded-xl border border-white/50 flex items-center justify-center transition-all duration-300 disabled:cursor-not-allowed shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>

        {/* 期間選択タブ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex bg-gray-100/50 backdrop-blur-sm rounded-2xl p-1 border border-gray-200/50">
            {/*{(['7days', 'monthly'] as PeriodType[]).map((periodType) => (*/}
            {(['monthly'] as PeriodType[]).map((periodType) => (
              <motion.button
                key={periodType}
                //onClick={() => handlePeriodChange(periodType)}
                disabled={isLoading}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 disabled:cursor-not-allowed ${
                  period === periodType
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 disabled:text-gray-400'
                }`}
                whileHover={{ scale: period === periodType ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {periodType === '7days' ? '過去7日' : '月別'}
              </motion.button>
            ))}
          </div>

          {/* 期間表示 & ナビゲーション */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => handleNavigation('prev')}
              disabled={!navigation.hasPrevious || navigation.isChecking || isLoading}
              className="w-10 h-10 bg-white/70 hover:bg-white/90 disabled:bg-gray-100 disabled:text-gray-400 rounded-xl border border-white/50 flex items-center justify-center transition-all duration-300 disabled:cursor-not-allowed shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-xl border border-indigo-200/50 min-w-[140px] text-center">
              <div className="text-sm font-medium text-gray-900">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>読込中...</span>
                  </div>
                ) : (
                  periodDisplayText
                )}
              </div>
            </div>

            <motion.button
              onClick={() => handleNavigation('next')}
              disabled={!navigation.hasNext || navigation.isChecking || isLoading}
              className="w-10 h-10 bg-white/70 hover:bg-white/90 disabled:bg-gray-100 disabled:text-gray-400 rounded-xl border border-white/50 flex items-center justify-center transition-all duration-300 disabled:cursor-not-allowed shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* ローディング・エラー表示 */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="flex items-center justify-center gap-3 py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
              <span className="text-gray-600">統計データを読み込み中...</span>
            </motion.div>
          )}

          {error && !isLoading && (
            <motion.div
              className="bg-red-50/70 backdrop-blur-xl border border-red-200 rounded-2xl p-4 mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-700 font-medium text-sm">エラーが発生しました</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* サマリーカード */}
        {!isLoading && !error && statsData && (
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {summaryCards.map((card, index) => (
              <motion.div
                key={card.title}
                className="relative overflow-hidden bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 p-4 sm:p-6 shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                {/* 背景グラデーション */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-5`} />
                
                {/* コンテンツ */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <card.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${card.color}-600`} />
                    <div className={`w-2 h-2 bg-${card.color}-500 rounded-full animate-pulse`} />
                  </div>
                  
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                    {card.value}
                  </div>
                  
                  <div className="text-xs sm:text-sm text-gray-600">
                    {card.title}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* データなし状態 */}
        {!isLoading && !error && statsData && statsData.stats.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-blue-100 rounded-full flex items-center justify-center shadow-lg">
              <Activity className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">統計データなし</h3>
            <p className="text-gray-600 mb-4">
              この期間には統計データがありません。
            </p>
            <div className="text-sm text-gray-500">
              広告の配信が開始されると、ここに詳細な統計が表示されます。
            </div>
          </motion.div>
        )}
      </div>

      {/* グラフエリア */}
      {!isLoading && !error && statsData && statsData.stats.length > 0 && (
        <motion.div
          className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <TrendingUp className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">推移グラフ</h3>
                <p className="text-gray-600 text-sm">時系列でのパフォーマンス変化</p>
              </div>
            </div>

            <AdStatsChartV2 
              data={statsData.stats}
              period={statsData.period.type}
              periodInfo={{
                startDate: statsData.period.startDate,
                endDate: statsData.period.endDate
              }}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}