// src/components/ad/detail/overview/AdOverviewCard.tsx
import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AdvertisementDetail } from '@/lib/types/ad/adTypes'
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  FileText,
  ExternalLink,
  Database,
  User,
  Zap,
  Target,
} from 'lucide-react'
import { formatDate } from '@/lib/functions/usefulFunctions'


const AdOverviewCard = memo(function AdOverviewCard({ 
  advertisement 
}:{
  advertisement: AdvertisementDetail
}) {
  
  //////////
  //■[ 予算使用率計算 ]
  const budgetUsageRate = useMemo(() => {
    if (advertisement.budget <= 0) return 0
    return ((advertisement.budget - advertisement.remainingBudget) / advertisement.budget) * 100
  }, [advertisement.budget, advertisement.remainingBudget])

  //////////
  //■[ 使用済み予算 ]
  const usedBudget = useMemo(() => {
    return advertisement.budget - advertisement.remainingBudget
  }, [advertisement.budget, advertisement.remainingBudget])


  //////////
  //■[ 予算ステータス ]
  const budgetStatus = useMemo(() => {
    const rate = budgetUsageRate
    if (rate >= 90) return { label: '残りわずか', color: 'red', bgColor: 'bg-red-50' }
    if (rate >= 70) return { label: '使用中', color: 'orange', bgColor: 'bg-orange-50' }
    if (rate >= 30) return { label: '順調', color: 'blue', bgColor: 'bg-blue-50' }
    return { label: '十分', color: 'green', bgColor: 'bg-green-50' }
  }, [budgetUsageRate])

  return (
    <motion.div
      className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.005 }}
    >
      {/* 予算使用状況セクション */}
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            予算使用状況
          </h2>
          
          <div className={`${budgetStatus.bgColor} px-4 py-2 rounded-full border border-${budgetStatus.color}-200`}>
            <span className={`text-${budgetStatus.color}-700 font-medium text-sm`}>
              {budgetStatus.label}
            </span>
          </div>
        </div>

        {/* プログレスバーとメトリクス */}
        <div className="space-y-6">
          {/* プログレスバー */}
          <div className="relative">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">
                使用率: {budgetUsageRate.toFixed(1)}%
              </span>
              <span className="text-sm text-gray-600">
                {usedBudget.toLocaleString()}P / {advertisement.budget.toLocaleString()}P
              </span>
            </div>
            
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(budgetUsageRate, 100)}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                {/* グリッター効果 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-pulse" />
              </motion.div>
            </div>
            
            {/* 残予算表示 */}
            <div className="flex justify-between mt-3 text-xs text-gray-600">
              <span>使用済み: {usedBudget.toLocaleString()}P</span>
              <span className="font-medium">残り: {advertisement.remainingBudget.toLocaleString()}P</span>
            </div>
          </div>
        </div>
      </div>

      {/* 詳細情報セクション */}
      <div className="px-6 sm:px-8 pb-6 sm:pb-8">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl p-4 sm:p-6 border border-gray-200/50">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Database className="w-5 h-5 text-gray-700" />
            詳細情報
          </h3>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {/* 作成情報 */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
                <Calendar className="w-4 h-4" />
                作成情報
              </h4>
              
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    作成日時:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(new Date(advertisement.createdAt))}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    更新日時:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(new Date(advertisement.updatedAt))}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    作成者:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {advertisement.user.name}
                  </span>
                </div>

                {advertisement.verifiedAt && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      審査完了:
                    </span>
                    <span className="text-sm font-medium text-green-700">
                      {formatDate(new Date(advertisement.verifiedAt))}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 設定情報 */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
                <AlertCircle className="w-4 h-4" />
                設定情報
              </h4>
              
              <div className="space-y-3">
                {advertisement.targetId && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      ターゲットID:
                    </span>
                    <span className="text-sm font-mono font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {advertisement.targetId}
                    </span>
                  </div>
                )}
                
                {advertisement.destinationUrl && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      遷移先URL:
                    </span>
                    <div className="bg-gray-50 rounded-lg p-2 border">
                      <a 
                        href={advertisement.destinationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 break-all transition-colors"
                      >
                        {advertisement.destinationUrl}
                      </a>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    メディアファイル:
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {advertisement.mediaFileId ? (
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded">
                        #{advertisement.mediaFileId}
                      </span>
                    ) : (
                      <span className="text-gray-500">未設定</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
})

export default AdOverviewCard