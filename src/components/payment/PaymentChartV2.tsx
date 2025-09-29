'use client'
// src/components/admin/payment/PaymentChart.tsx
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
import { CreditCard, Receipt, DollarSign, TrendingUp, BarChart3 } from 'lucide-react'
import { PaymentStatsData } from '@/lib/types/payment/paymentTypes'

// ========== 型定義 ==========
interface ChartDataItem extends PaymentStatsData {
  formattedDate: string
  originalDate: string
}

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
}

interface StatsMetrics {
  hasData: true
  totalPaymentCount: number
  totalAmount: number
  totalFees: number
  maxPaymentCount: number
  maxAmount: number
  maxFees: number
  originalDataPoints: number
  filledDataPoints: number
}

type ChartType = 'combined' | 'paymentCount' | 'totalAmount' | 'totalFees'

// ========== 定数 ==========
const CHART_TABS = [
  { key: 'combined' as const, label: '複合表示', icon: TrendingUp },
  { key: 'paymentCount' as const, label: '決済件数', icon: Receipt },
  { key: 'totalAmount' as const, label: '決済金額', icon: CreditCard },
  { key: 'totalFees' as const, label: '手数料', icon: DollarSign }
] as const

const CHART_CONFIG = {
  margin: { top: 20, right: 30, left: 20, bottom: 20 },
  animation: { duration: 1500 },
  colors: {
    paymentCount: '#3B82F6',
    totalAmount: '#10B981',
    totalFees: '#F59E0B'
  }
}

// ========== ユーティリティ関数 ==========
const formatDateForChart = (dateStr: string): string => {
  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? dateStr : date.getDate().toString()
}

const formatDateForTooltip = (dateStr: string): string => {
  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? dateStr : `${date.getMonth() + 1}月${date.getDate()}日`
}

const fillMissingDates = (
  statsData: PaymentStatsData[], 
  periodInfo: { startDate: string, endDate: string }
): PaymentStatsData[] => {
  if (!statsData) return []

  const startDate = new Date(periodInfo.startDate)
  const endDate = new Date(periodInfo.endDate)
  const dataMap = new Map(statsData.map(item => [item.date, item]))
  const filledData: PaymentStatsData[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
    
    filledData.push(
      dataMap.get(dateStr) || {
        date: dateStr,
        paymentCount: 0,
        totalAmount: 0,
        totalFees: 0
      }
    )
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return filledData
}

// ========== カスタムコンポーネント ==========
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload?.length) return null

  const data = payload[0].payload as ChartDataItem

  return (
    <motion.div
      className="bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl p-4 shadow-2xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
        {formatDateForTooltip(data.originalDate)}
      </div>
      
      <div className="space-y-2">
        {[
          { key: 'paymentCount', label: '決済件数', icon: Receipt, value: data.paymentCount, suffix: '件' },
          { key: 'totalAmount', label: '決済金額', icon: CreditCard, value: data.totalAmount, suffix: '' },
          { key: 'totalFees', label: '手数料', icon: DollarSign, value: data.totalFees, suffix: '' }
        ].map(({ key, label, icon: Icon, value, suffix }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Icon 
                className="w-3 h-3" 
                style={{ color: CHART_CONFIG.colors[key as keyof typeof CHART_CONFIG.colors] }} 
              />
              <span className="text-xs text-gray-600">{label}</span>
            </div>
            <span className="text-xs font-medium">
              {suffix ? `${value.toLocaleString()}${suffix}` : `¥${value.toLocaleString()}`}
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
    transition={{ duration: 0.6 }}
  >
    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-blue-100 rounded-full flex items-center justify-center shadow-lg">
      <BarChart3 className="w-10 h-10 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">グラフデータなし</h3>
    <p className="text-gray-600 text-sm">この期間にはグラフ表示できるデータがありません</p>
  </motion.div>
)

// ========== メインコンポーネント ==========
export default function PaymentChartV2({ 
  data, 
  periodInfo 
}: {
  data: PaymentStatsData[]
  periodInfo: { startDate: string; endDate: string }
}) {
  const [chartType, setChartType] = useState<ChartType>('combined')

  const { chartData, stats } = useMemo(() => {
    if (!data) return { chartData: [], stats: null }
    
    const filledData = fillMissingDates(data, periodInfo)
    
    if (filledData.length === 0) return { chartData: [], stats: null }
    
    const formattedData: ChartDataItem[] = filledData.map(item => ({
      ...item,
      formattedDate: formatDateForChart(item.date),
      originalDate: item.date
    }))
    
    const metrics: StatsMetrics = {
      hasData: true,
      totalPaymentCount: filledData.reduce((sum, item) => sum + item.paymentCount, 0),
      totalAmount: filledData.reduce((sum, item) => sum + item.totalAmount, 0),
      totalFees: filledData.reduce((sum, item) => sum + item.totalFees, 0),
      maxPaymentCount: Math.max(...filledData.map(item => item.paymentCount)),
      maxAmount: Math.max(...filledData.map(item => item.totalAmount)),
      maxFees: Math.max(...filledData.map(item => item.totalFees)),
      originalDataPoints: data.length,
      filledDataPoints: filledData.length
    }

    return { chartData: formattedData, stats: metrics }
  }, [data, periodInfo])

  if (!stats?.hasData || !data || data.length === 0) {
    return <EmptyState />
  }

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

  const tooltipContent = (props: object) => {
    const typedProps = props as CustomTooltipProps
    return <CustomTooltip {...typedProps} />
  }

  const renderChart = () => {
    switch (chartType) {
      case 'paymentCount':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="paymentCountGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_CONFIG.colors.paymentCount} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={CHART_CONFIG.colors.paymentCount} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            <XAxis dataKey="formattedDate" {...commonAxisProps} />
            <YAxis {...commonAxisProps} tickFormatter={(value: number) => `${value}件`} />
            <Tooltip content={tooltipContent} />
            <Area
              type="monotone"
              dataKey="paymentCount"
              stroke={CHART_CONFIG.colors.paymentCount}
              strokeWidth={3}
              fill="url(#paymentCountGradient)"
              animationDuration={CHART_CONFIG.animation.duration}
            />
          </AreaChart>
        )

      case 'totalAmount':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="totalAmountGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_CONFIG.colors.totalAmount} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={CHART_CONFIG.colors.totalAmount} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            <XAxis dataKey="formattedDate" {...commonAxisProps} />
            <YAxis {...commonAxisProps} tickFormatter={(value: number) => `¥${value.toLocaleString()}`} />
            <Tooltip content={tooltipContent} />
            <Area
              type="monotone"
              dataKey="totalAmount"
              stroke={CHART_CONFIG.colors.totalAmount}
              strokeWidth={3}
              fill="url(#totalAmountGradient)"
              animationDuration={CHART_CONFIG.animation.duration}
            />
          </AreaChart>
        )

      case 'totalFees':
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            <XAxis dataKey="formattedDate" {...commonAxisProps} />
            <YAxis {...commonAxisProps} tickFormatter={(value: number) => `¥${value.toLocaleString()}`} />
            <Tooltip content={tooltipContent} />
            <Bar
              dataKey="totalFees"
              fill={CHART_CONFIG.colors.totalFees}
              radius={[4, 4, 0, 0]}
              animationDuration={CHART_CONFIG.animation.duration}
            />
          </ComposedChart>
        )

      default: // combined
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.5} />
            <XAxis dataKey="formattedDate" {...commonAxisProps} />
            <YAxis yAxisId="left" {...commonAxisProps} tickFormatter={(value: number) => value.toLocaleString()} />
            <YAxis yAxisId="right" orientation="right" {...commonAxisProps} tickFormatter={(value: number) => `¥${value.toLocaleString()}`} />
            <Tooltip content={tooltipContent} />
            <Bar
              yAxisId="right"
              dataKey="totalFees"
              fill={CHART_CONFIG.colors.totalFees}
              opacity={0.7}
              radius={[2, 2, 0, 0]}
              animationDuration={1000}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="paymentCount"
              stroke={CHART_CONFIG.colors.paymentCount}
              strokeWidth={3}
              dot={{ fill: CHART_CONFIG.colors.paymentCount, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: CHART_CONFIG.colors.paymentCount }}
              animationDuration={CHART_CONFIG.animation.duration}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="totalAmount"
              stroke={CHART_CONFIG.colors.totalAmount}
              strokeWidth={3}
              dot={{ fill: CHART_CONFIG.colors.totalAmount, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: CHART_CONFIG.colors.totalAmount }}
              animationDuration={CHART_CONFIG.animation.duration}
            />
          </ComposedChart>
        )
    }
  }

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* チャート切り替えタブ */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {CHART_TABS.map(({ key, label, icon: Icon }) => (
          <motion.button
            key={key}
            onClick={() => setChartType(key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
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

      {/* メインチャート */}
      <motion.div
        className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/50"
        key={chartType}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* データサマリー */}
      <motion.div
        className="mt-6 grid grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="text-center bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/40">
          <div className="text-lg font-bold text-blue-600">
            {stats.maxPaymentCount.toLocaleString()}件
          </div>
          <div className="text-xs text-gray-600">最大決済件数</div>
        </div>
        
        <div className="text-center bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/40">
          <div className="text-lg font-bold text-green-600">
            ¥{stats.maxAmount.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">最大決済金額</div>
        </div>
        
        <div className="text-center bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/40">
          <div className="text-lg font-bold text-orange-600">
            ¥{stats.maxFees.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">最大手数料</div>
        </div>
      </motion.div>

      {/* 期間情報 */}
      <motion.div
        className="mt-4 text-center text-xs text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        月間データ（日別表示）
        • 実データ{stats.originalDataPoints}点
        {stats.originalDataPoints !== stats.filledDataPoints && (
          <span className="text-blue-600 ml-1">
            • 0埋め{stats.filledDataPoints - stats.originalDataPoints}点
          </span>
        )}
        • 全{stats.filledDataPoints}ポイント表示
        <div className="mt-1 text-gray-400">
          期間: {periodInfo.startDate} 〜 {periodInfo.endDate}
        </div>
      </motion.div>
    </motion.div>
  )
}