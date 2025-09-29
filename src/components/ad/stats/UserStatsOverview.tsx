'use client'
// src/components/ad/stats/UserStatsOverview.tsx
import { useState, useEffect } from 'react'
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
  Sparkles
} from 'lucide-react'
import { AdStatsData, StatsSummary, PeriodInfo } from '@/lib/types/ad/adStatsTypes'
import { checkAdStatsDataAvailabilityAction, getAdStatsDataAction } from '@/actions/ad/adStatsActions'
import AdStatsChartV2 from '../detail/stats/AdStatsChartV2'

const now = new Date()
const initialCurrentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

//////////
//■[ 期間表示 ]
const formatPeriod = (dateStr: string) => {
  const [year, month] = dateStr.split('-')
  return `${year}年${Number(month)}月`
}

export default function UserStatsOverview({
  userId, 
  data:initialData
}:{
  userId: number //adminの際は「0」
  data: {
    stats: AdStatsData[]
    summary: StatsSummary
    period: PeriodInfo
  }
}) {
  //////////
  //■[ ステート管理 ]
  const [currentDate, setCurrentDate] = useState(initialCurrentDate)
  const [data, setData] = useState(initialData)
  const [navigation, setNavigation] = useState({ hasPrevious: false, hasNext: false })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  //////////
  //■[ 統計データ取得 ]
  const fetchData = async (targetDate: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const [statsResult, navResult] = await Promise.all([
        getAdStatsDataAction({userId, startDate:targetDate}),
        checkAdStatsDataAvailabilityAction({userId, currentDate:targetDate})
      ])
      
      if (!statsResult.success || !statsResult.data) {
        setError(statsResult.errMsg || 'データの取得に失敗しました')
        return
      }

      setData(statsResult.data)
      setNavigation({
        hasPrevious: navResult.success ? navResult.data?.hasPrevious || false : false,
        hasNext: navResult.success ? navResult.data?.hasNext || false : false
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  //////////
  //■[ 前後移動 ]
  const handleNavigation = (direction: 'prev' | 'next') => {
    const [year, month] = currentDate.split('-').map(Number)
    const newMonth = direction === 'next' 
      ? (month === 12 ? 1 : month + 1)
      : (month === 1 ? 12 : month - 1)
    const newYear = direction === 'next' 
      ? (month === 12 ? year + 1 : year)
      : (month === 1 ? year - 1 : year)
    
    const newDate = `${newYear}-${String(newMonth).padStart(2, '0')}-01`
    setCurrentDate(newDate)
  }

  //////////
  //■[ 期間変更時データ取得 ]
  useEffect(() => {
    if (
      currentDate!==initialCurrentDate || // 初期データはサーバーサイドで取得済み.初回のみスキップ
      data.period.startDate!==initialCurrentDate //この条件がないと、prev→nextなどで戻って来た際、処理が走らない
    ){
      fetchData(currentDate)
    }
  }, [currentDate])

  //////////
  //■[ 初期ナビゲーション設定 ]
  useEffect(() => {
    checkAdStatsDataAvailabilityAction({userId, currentDate}).then(result => {
      if (result.success && result.data) {
        setNavigation({
          hasPrevious: result.data.hasPrevious,
          hasNext: result.data.hasNext
        })
      }
    })
  }, [])

  //////////
  //■[ サマリーカード ]
  const summaryCards = [
    {
      title: '総表示数',
      value: data.summary.totalImpressions.toLocaleString(),
      icon: Eye,
      gradient: 'from-blue-500 via-cyan-500 to-blue-600',
      shadow: 'shadow-blue-500/30'
    },
    {
      title: '総クリック数',
      value: data.summary.totalClicks.toLocaleString(),
      icon: MousePointer,
      gradient: 'from-emerald-500 via-green-500 to-teal-600',
      shadow: 'shadow-emerald-500/30'
    },
    {
      title: 'CTR',
      value: `${data.summary.ctr.toFixed(2)}%`,
      icon: TrendingUp,
      gradient: 'from-purple-500 via-violet-500 to-indigo-600',
      shadow: 'shadow-purple-500/30'
    },
    {
      title: '総消費ポイント',
      value: `${data.summary.totalSpentPoints.toLocaleString()}P`,
      icon: DollarSign,
      gradient: 'from-orange-500 via-amber-500 to-yellow-600',
      shadow: 'shadow-orange-500/30'
    }
  ]

  return (
    <>
      <motion.div
        className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-6">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <BarChart3 className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                  月別パフォーマンス統計
                </h2>
                <p className="text-gray-600 text-sm">全広告の月間データ統合表示</p>
              </div>
            </div>

            <motion.button
              onClick={() => fetchData(currentDate)}
              disabled={isLoading}
              className="w-11 h-11 bg-white/80 hover:bg-white disabled:bg-gray-100 rounded-xl border border-white/60 flex items-center justify-center transition-all duration-300 disabled:cursor-not-allowed shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>

          {/* ナビゲーション */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.button
              onClick={() => handleNavigation('prev')}
              disabled={!navigation.hasPrevious || isLoading}
              className="w-11 h-11 bg-white/80 hover:bg-white disabled:bg-gray-100 disabled:text-gray-400 rounded-xl border border-white/60 flex items-center justify-center transition-all duration-300 disabled:cursor-not-allowed shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <motion.div 
              className="bg-gradient-to-r from-white via-blue-50 to-purple-50 px-6 py-3 rounded-xl border border-indigo-200/60 shadow-lg min-w-[160px] text-center"
              key={currentDate}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                    <span>読込中...</span>
                  </div>
                ) : (
                  formatPeriod(currentDate)
                )}
              </div>
            </motion.div>

            <motion.button
              onClick={() => handleNavigation('next')}
              disabled={!navigation.hasNext || isLoading}
              className="w-11 h-11 bg-white/80 hover:bg-white disabled:bg-gray-100 disabled:text-gray-400 rounded-xl border border-white/60 flex items-center justify-center transition-all duration-300 disabled:cursor-not-allowed shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* エラー表示 */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mb-6 bg-red-50/80 backdrop-blur-xl border border-red-200 rounded-2xl p-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
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
        </div>

        {/* サマリーカード */}
        {!isLoading && !error && (
          <div className="p-6 pt-0">
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {summaryCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} rounded-2xl p-4 sm:p-6 shadow-xl ${card.shadow} group`}
                  initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4, rotateY: 5 }}
                >
                  {/* 背景エフェクト */}
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
                  
                  {/* コンテンツ */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <card.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg" />
                      <motion.div 
                        className="w-2 h-2 bg-white/80 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 drop-shadow-lg">
                      {card.value}
                    </div>
                    
                    <div className="text-xs sm:text-sm text-white/90 font-medium">
                      {card.title}
                    </div>
                  </div>

                  {/* グリッターエフェクト */}
                  <motion.div 
                    className="absolute top-2 right-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4 text-white/60" />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* データなし状態 */}
        {!isLoading && !error && data.stats.length === 0 && (
          <motion.div
            className="text-center py-12 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-100 via-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
              <BarChart3 className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">統計データなし</h3>
            <p className="text-gray-600 mb-4">この月には統計データがありません。</p>
            <div className="text-sm text-gray-500">
              広告の配信が開始されると、ここに詳細な統計が表示されます。
            </div>
          </motion.div>
        )}

        {/* ローディング状態 */}
        {isLoading && (
          <motion.div
            className="flex items-center justify-center gap-3 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
            <span className="text-gray-600 font-medium">統計データを読み込み中...</span>
          </motion.div>
        )}
      </motion.div>

      {/* グラフエリア */}
      {!isLoading && !error && data.stats.length > 0 && (
        <motion.div
          className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl overflow-hidden mt-6"
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
                <h3 className="text-xl font-bold text-gray-900">月別推移グラフ</h3>
                <p className="text-gray-600 text-sm">日別パフォーマンス変化の詳細分析</p>
              </div>
            </div>

            <AdStatsChartV2 
              data={data.stats}
              period={data.period.type}
              periodInfo={{
                startDate: data.period.startDate,
                endDate: data.period.endDate
              }}
            />
          </div>
        </motion.div>
      )}
    </>
  )
}