// src/components/ad/detail/stats/AdStatsChart.tsx
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart
} from 'recharts'
import { Eye, MousePointer, DollarSign, TrendingUp, BarChart3 } from 'lucide-react'
import { PeriodType, AdStatsData } from '@/lib/types/ad/adStatsTypes'

// ========== 型定義 ==========
interface ChartDataItem extends AdStatsData {
  formattedDate: string
}

// Rechartsのペイロード型を厳密に定義
interface TooltipPayload {
  dataKey: string
  name: string
  value: number
  color: string
  payload: ChartDataItem
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
  period: PeriodType
}

interface StatsMetrics {
  totals: { impressions: number; clicks: number; points: number }
  maxValues: { impressions: number; clicks: number; points: number }
  dataPoints: { original: number; filled: number }
}

type ChartType = 'combined' | 'impressions' | 'clicks' | 'points'

// ========== 定数 ==========
const CHART_TABS = [
  { key: 'combined' as const, label: '複合表示', icon: TrendingUp },
  { key: 'impressions' as const, label: '表示数', icon: Eye },
  { key: 'clicks' as const, label: 'クリック数', icon: MousePointer },
  { key: 'points' as const, label: '消費ポイント', icon: DollarSign }
] as const

const CHART_CONFIG = {
  margin: { top: 20, right: 30, left: 20, bottom: 20 },
  animation: { duration: 1000 },
  colors: {
    impressions: '#3B82F6',
    clicks: '#10B981',
    points: '#F59E0B'
  }
}

// ========== ユーティリティ関数 ==========
const formatDate = (dateStr: string, period: PeriodType, isTooltip = false): string => {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr

  const month = date.getMonth() + 1
  const day = date.getDate()

  if (period === 'monthly') {
    return isTooltip ? `${month}月${day}日` : day.toString()
  }
  
  const formatted = `${month}/${day}`
  return isTooltip ? formatted : `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`
}

const generateDateRange = (start: string, end: string): string[] => {
  const dates: string[] = []
  const current = new Date(start)
  const endDate = new Date(end)

  while (current <= endDate) {
    dates.push(
      `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`
    )
    current.setDate(current.getDate() + 1)
  }
  
  return dates
}

// ========== カスタムコンポーネント ==========
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, period }) => {
  if (!active || !payload?.length) return null

  const data = payload[0].payload as ChartDataItem

  return (
    <motion.div
      className="bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl p-4 shadow-2xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="text-sm font-medium text-gray-900 mb-3">
        {formatDate(data.date, period, true)}
      </div>
      
      <div className="space-y-2">
        {[
          { key: 'impressions', label: '表示回数', icon: Eye, value: data.impressions },
          { key: 'clicks', label: 'クリック数', icon: MousePointer, value: data.clicks },
          { key: 'spentPoints', label: '消費ポイント', icon: DollarSign, value: data.spentPoints }
        ].map(({ key, label, icon: Icon, value }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Icon className="w-3 h-3" style={{ color: CHART_CONFIG.colors[key as keyof typeof CHART_CONFIG.colors] }} />
              <span className="text-xs text-gray-600">{label}</span>
            </div>
            <span className="text-xs font-medium">
              {key === 'spentPoints' ? `${value.toLocaleString()}P` : value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

const EmptyState: React.FC = () => (
  <motion.div
    className="h-80 flex flex-col items-center justify-center text-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-blue-100 rounded-full flex items-center justify-center shadow-lg">
      <BarChart3 className="w-10 h-10 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">グラフデータなし</h3>
    <p className="text-gray-600 text-sm">この期間にはグラフ表示できるデータがありません</p>
  </motion.div>
)

// ========== メインコンポーネント ==========
export default function AdStatsChartV2({
  data,
  period,
  periodInfo
}: {
  data: AdStatsData[]
  period: PeriodType
  periodInfo?: { startDate: string; endDate: string }
}) {
  const [chartType, setChartType] = useState<ChartType>('combined')

  // データ処理とメトリクス計算
  const { chartData, stats } = useMemo(() => {
    if (!data?.length) {
      return { chartData: [], stats: null }
    }

    // 期間の決定
    let dateRange: string[]
    if (periodInfo) {
      dateRange = generateDateRange(periodInfo.startDate, periodInfo.endDate)
    } else {
      const dates = data.map(d => new Date(d.date))
      const maxDate = new Date(Math.max(...dates.map(d => d.getTime())))
      const minDate = period === '7days' 
        ? new Date(maxDate.getTime() - 6 * 24 * 60 * 60 * 1000)
        : new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)
      dateRange = generateDateRange(
        minDate.toISOString().split('T')[0],
        maxDate.toISOString().split('T')[0]
      )
    }

    // データマップ作成
    const dataMap = new Map(data.map(item => [item.date, item]))

    // 0埋めとフォーマット
    const filledData = dateRange.map(date => ({
      ...(dataMap.get(date) || { impressions: 0, clicks: 0, spentPoints: 0 }),
      date,
      formattedDate: formatDate(date, period)
    }))

    // 統計計算
    const metrics: StatsMetrics = {
      totals: filledData.reduce(
        (acc, item) => ({
          impressions: acc.impressions + item.impressions,
          clicks: acc.clicks + item.clicks,
          points: acc.points + item.spentPoints
        }),
        { impressions: 0, clicks: 0, points: 0 }
      ),
      maxValues: {
        impressions: Math.max(...filledData.map(d => d.impressions)),
        clicks: Math.max(...filledData.map(d => d.clicks)),
        points: Math.max(...filledData.map(d => d.spentPoints))
      },
      dataPoints: {
        original: data.length,
        filled: filledData.length
      }
    }

    return { chartData: filledData, stats: metrics }
  }, [data, period, periodInfo])

  if (!stats) return <EmptyState />

  // チャートレンダリング関数
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: CHART_CONFIG.margin
    }

    const commonAxisProps = {
      stroke: '#6B7280',
      fontSize: 12,
      tickLine: false,
      axisLine: false
    }

    // カスタムツールチップコンポーネントを渡す関数
    const tooltipContent = (props: object) => {
      const typedProps = props as CustomTooltipProps
      return <CustomTooltip {...typedProps} period={period} />
    }

    switch (chartType) {
      case 'impressions':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="grad-impressions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_CONFIG.colors.impressions} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={CHART_CONFIG.colors.impressions} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            <XAxis dataKey="formattedDate" {...commonAxisProps} />
            <YAxis {...commonAxisProps} tickFormatter={(v: number) => v.toLocaleString()} />
            <Tooltip content={tooltipContent} />
            <Area
              type="monotone"
              dataKey="impressions"
              stroke={CHART_CONFIG.colors.impressions}
              strokeWidth={3}
              fill="url(#grad-impressions)"
              animationDuration={CHART_CONFIG.animation.duration}
            />
          </AreaChart>
        )

      case 'clicks':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="grad-clicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_CONFIG.colors.clicks} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={CHART_CONFIG.colors.clicks} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            <XAxis dataKey="formattedDate" {...commonAxisProps} />
            <YAxis {...commonAxisProps} tickFormatter={(v: number) => v.toLocaleString()} />
            <Tooltip content={tooltipContent} />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke={CHART_CONFIG.colors.clicks}
              strokeWidth={3}
              fill="url(#grad-clicks)"
              animationDuration={CHART_CONFIG.animation.duration}
            />
          </AreaChart>
        )

      case 'points':
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            <XAxis dataKey="formattedDate" {...commonAxisProps} />
            <YAxis {...commonAxisProps} tickFormatter={(v: number) => `${v}P`} />
            <Tooltip content={tooltipContent} />
            <Bar
              dataKey="spentPoints"
              fill={CHART_CONFIG.colors.points}
              radius={[4, 4, 0, 0]}
              animationDuration={CHART_CONFIG.animation.duration}
            />
          </ComposedChart>
        )

      default:
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            <XAxis dataKey="formattedDate" {...commonAxisProps} />
            <YAxis yAxisId="left" {...commonAxisProps} tickFormatter={(v: number) => v.toLocaleString()} />
            <YAxis yAxisId="right" orientation="right" {...commonAxisProps} tickFormatter={(v: number) => `${v}P`} />
            <Tooltip content={tooltipContent} />
            <Bar
              yAxisId="right"
              dataKey="spentPoints"
              fill={CHART_CONFIG.colors.points}
              opacity={0.7}
              radius={[2, 2, 0, 0]}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="impressions"
              stroke={CHART_CONFIG.colors.impressions}
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="clicks"
              stroke={CHART_CONFIG.colors.clicks}
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        )
    }
  }

  return (
    <motion.div className="w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* タブ */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {CHART_TABS.map(({ key, label, icon: Icon }) => (
          <motion.button
            key={key}
            onClick={() => setChartType(key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              chartType === key
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'bg-white/40 hover:bg-white/60 text-gray-700 border border-white/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </motion.button>
        ))}
      </div>

      {/* チャート */}
      <motion.div
        className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/50"
        key={chartType}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* サマリー */}
      <motion.div className="mt-6 grid grid-cols-3 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {[
          { label: '最大表示数', value: stats.maxValues.impressions, color: 'text-blue-600' },
          { label: '最大クリック数', value: stats.maxValues.clicks, color: 'text-green-600' },
          { label: '最大消費ポイント', value: stats.maxValues.points, color: 'text-orange-600', suffix: 'P' }
        ].map(({ label, value, color, suffix = '' }) => (
          <div key={label} className="text-center bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/40">
            <div className={`text-lg font-bold ${color}`}>
              {value.toLocaleString()}{suffix}
            </div>
            <div className="text-xs text-gray-600">{label}</div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}