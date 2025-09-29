// src/components/ads/detail/content/AdTypeSpecificContent.tsx
'use client'
import { motion } from 'framer-motion'
import { AdvertisementDetail } from '@/lib/types/ad/adTypes'
import { Play, ExternalLink, Target } from 'lucide-react'
import PriorityAdContent from './content/PriorityAdContent'
import OverlayAdContent from './content/OverlayAdContent'
import PrerollAdContent from './content/PrerollAdContent'
import YouTubeAdContent from './content/YouTubeAdContent'

type Props = {
  advertisement: AdvertisementDetail
  refreshTrigger?: number
}

  const adTypeConfig = {
    priority: {
      title: '動画記事優先表示',
      icon: '🎯',
      gradient: 'from-pink-500 to-rose-600',
      description: 'movieAppの記事一覧で優先表示',
    },
    overlay: {
      title: 'オーバーレイ広告',
      icon: '📺',
      gradient: 'from-blue-500 to-cyan-600',
      description: '動画プレイヤー上に表示',
    },
    preroll: {
      title: 'プレロール広告',
      icon: '🎬',
      gradient: 'from-purple-500 to-violet-600',
      description: '動画再生前に表示される広告',
    },
    'youtube-short': {
      title: 'YouTube Short広告',
      icon: '📹',
      gradient: 'from-red-500 to-pink-600',
      description: 'YouTube動画の再生数向上（15秒）',
    },
    'youtube-long': {
      title: 'YouTube Long広告',
      icon: '🎥',
      gradient: 'from-orange-500 to-red-600',
      description: 'YouTube動画の再生数向上（60秒）',
    }
  }

export default function AdTypeSpecificContent({ advertisement, refreshTrigger }: Props) {
  //////////
  //■[ 広告タイプ設定 ]
  const currentConfig = adTypeConfig[advertisement.adType]

  //////////
  //■[ 詳細コンテンツレンダリング ]
  const renderDetailContent = () => {
    switch (advertisement.adType) {
      case 'priority':
        return (
          <PriorityAdContent 
            advertisement={advertisement}
            refreshTrigger={refreshTrigger}
          />
        )
      case 'overlay':
        return (
          <OverlayAdContent 
            advertisement={advertisement}
            refreshTrigger={refreshTrigger}
          />
        )
      case 'preroll':
        return (
          <PrerollAdContent 
            advertisement={advertisement}
            refreshTrigger={refreshTrigger}
          />
        )
      case 'youtube-short':
      case 'youtube-long':
        return (
          <YouTubeAdContent 
            advertisement={advertisement}
            refreshTrigger={refreshTrigger}
          />
        )
      default:
        return (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🚧</div>
            <p className="text-gray-500">このタイプの詳細表示は準備中です</p>
          </div>
        )
    }
  }

  return (
    <>
      {/* メインコンテンツエリア */}
      <div className="space-y-6">
        {/* ヘッダー情報 */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className={`w-12 h-12 bg-gradient-to-r ${currentConfig.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentConfig.icon}
            </motion.div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                {currentConfig.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {currentConfig.description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* 広告情報カード */}
        <motion.div
          className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl p-4 sm:p-6 border border-gray-200/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* ターゲットID表示 */}
            {advertisement.targetId && (
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/40">
                <Target className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-gray-600 mb-1">ターゲットID</div>
                  <div className="text-sm font-mono font-medium text-blue-700 truncate">
                    {advertisement.targetId}
                  </div>
                </div>
              </div>
            )}

            {/* 遷移先URL表示 */}
            {advertisement.destinationUrl && (
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/40">
                <ExternalLink className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-gray-600 mb-1">遷移先URL</div>
                  <a 
                    href={advertisement.destinationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-700 hover:text-green-800 transition-colors truncate block"
                  >
                    {advertisement.destinationUrl.length > 30 
                      ? `${advertisement.destinationUrl.substring(0, 30)}...` 
                      : advertisement.destinationUrl
                    }
                  </a>
                </div>
              </div>
            )}

            {/* メディアファイル表示 */}
            {advertisement.mediaFileId && (
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/40">
                <Play className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-gray-600 mb-1">メディアファイル</div>
                  <div className="text-sm font-medium text-purple-700">
                    #{advertisement.mediaFileId}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* 詳細コンテンツ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {renderDetailContent()}
        </motion.div>
      </div>
    </>
  )
}