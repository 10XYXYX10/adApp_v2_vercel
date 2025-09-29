'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

import { AdType } from '@/lib/types/ad/adTypes'

import PointsDisplay from '@/components/point/advertiser/PointsDisplay'
import PriorityAdComponent from '../../previews/PriorityAdComponent'
import VideoPlayerHover from '../../previews/VideoPlayerHover'
import PrerollAdComponent from '../../previews/PrerollAdComponent'
import YouTubeShortAdComponent from '../../previews/YouTubeShortAdComponent'
import YouTubeLongAdComponent from '../../previews/YouTubeLongAdComponent'
import SpinnerModal from '@/components/SpinnerModal'

const adTypes = [
  {
    type: 'priority' as AdType,
    title: '動画記事優先表示',
    subtitle: '記事一覧で特定記事を優先表示',
    description: 'EchiEchiTubeの記事一覧ページで、指定した記事を専用枠（最大10枠）で優先表示します。記事ID指定のシンプルな設定で、審査なしで即座に配信開始できます。',
    pricing: { display: '0.1ポイント / 表示', click: '1ポイント / クリック' },
    features: ['審査なしで即座に配信開始', '記事ID指定のシンプル設定', '専用枠での確実な露出'],
    icon: '🎯',
    color: 'from-pink-500 to-rose-600',
    estimatedCost: '500～2,000ポイント',
    previewComponent: <PriorityAdComponent />
  },
  {
    type: 'overlay' as AdType,
    title: 'オーバーレイ広告',
    subtitle: 'ビデオプレイヤー上に広告表示',
    description: '動画再生中にプレイヤー上に画像広告を表示します。10秒のカウントダウン後に閉じるボタンが表示され、確実に視聴者の注意を引きつけることができます。',
    pricing: { display: '0.1ポイント / 表示', click: '1ポイント / クリック' },
    features: ['400×225の画像ファイル対応', '10秒強制表示で確実なリーチ', '遷移先URL設定可能', '詐欺防止審査あり'],
    icon: '📺',
    color: 'from-blue-500 to-cyan-600',
    estimatedCost: '500～2,000ポイント',
    previewComponent: <VideoPlayerHover />
  },
  {
    type: 'preroll' as AdType,
    title: 'プレロール広告',
    subtitle: '動画再生前の15秒CM',
    description: 'ユーザーが動画を再生する前に15秒間の動画広告を表示します。冒頭10秒は必須視聴で、その後スキップ可能。高いエンゲージメント率を誇ります。',
    pricing: { play: '2ポイント / 再生' },
    features: ['15秒の動画広告（mp4形式）', '冒頭10秒必須視聴', '高いエンゲージメント率', '詐欺防止審査あり'],
    icon: '🎬',
    color: 'from-purple-500 to-violet-600',
    estimatedCost: '500～2,000ポイント',
    previewComponent: <PrerollAdComponent />
  },
  {
    type: 'youtube-short' as AdType,
    title: 'YouTube Short広告',
    subtitle: 'YouTube動画の再生数向上',
    description: 'EchiEchiTube上でYouTube動画を再生し、再生数を増加させます。15秒後にスキップ可能で、30秒で自動終了。YouTubeチャンネルの成長に最適です。',
    pricing: { play: '1.5ポイント / 再生' },
    features: ['YouTube動画ID指定', '15秒後スキップ可能', '30秒で自動終了', 'YouTubeの再生数向上'],
    icon: '📹',
    color: 'from-red-500 to-pink-600',
    estimatedCost: '500～3,000ポイント',
    previewComponent: <YouTubeShortAdComponent />
  },
  {
    type: 'youtube-long' as AdType,
    title: 'YouTube Long広告',
    subtitle: 'より長時間のYouTube動画広告',
    description: 'EchiEchiTube上でYouTube動画を再生し、より多くの再生数を獲得します。30秒後にスキップ可能で、60秒で自動終了。高品質なコンテンツの訴求に効果的です。',
    pricing: { play: '3ポイント / 再生' },
    features: ['YouTube動画ID指定', '30秒後スキップ可能', '60秒で自動終了', '高い視聴継続率'],
    icon: '🎥',
    color: 'from-orange-500 to-amber-600',
    estimatedCost: '500～3,000ポイント',
    previewComponent: <YouTubeLongAdComponent />
  }
]

const AdCreateSelectTypeClient = ({
  advertiserId,
  priorityAdCount
}: {
  advertiserId: number
  priorityAdCount: number
}) => {
  const router = useRouter()
  const [previewType, setPreviewType] = useState<AdType | null>(null)
  const [isLoading,setIsLoading] = useState(false);

  const handleTypeSelect = (adType: AdType) => {
    setIsLoading(true)
    router.push(`/advertiser/${advertiserId}/ad/create/form/${adType}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {isLoading&&<SpinnerModal/>}
      {/* 背景装飾 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-red-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* ヘッダー */}
        <div className="backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  広告作成
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  効果的な広告でターゲットオーディエンスにリーチしましょう
                </p>
              </div>
              <div className="w-full lg:w-auto">
                <PointsDisplay />
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="container mx-auto px-4 py-8">
          {/* タイトルセクション */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
              広告タイプを選択
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              目的に最適な広告タイプを選択してください。各タイプにはそれぞれ異なる特徴と効果があります。
            </p>
          </motion.div>

          <div className="grid gap-6 max-w-5xl mx-auto">
            {adTypes.map((adType, index) => (
              <div key={adType.type}>
                <motion.div
                  className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/30 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className={`bg-gradient-to-r ${adType.color} p-6 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-3xl">
                          {adType.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-xl mb-1">{adType.title}</h3>
                          <p className="text-white/90 text-sm">{adType.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                            previewType === adType.type 
                              ? 'bg-white text-gray-900' 
                              : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                          }`}
                          onClick={() => setPreviewType(previewType === adType.type ? null : adType.type)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {previewType === adType.type ? '閉じる' : 'プレビュー'}
                        </motion.button>
                        <motion.button
                          className={`px-6 py-2 rounded-xl font-medium transition-colors ${
                            adType.type === 'priority' && priorityAdCount >= 10
                              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                              : 'bg-white text-gray-900 hover:bg-gray-100'
                          }`}
                          onClick={() => handleTypeSelect(adType.type)}
                          disabled={adType.type === 'priority' && priorityAdCount >= 10}
                          whileHover={adType.type === 'priority' && priorityAdCount >= 10 ? {} : { scale: 1.05 }}
                          whileTap={adType.type === 'priority' && priorityAdCount >= 10 ? {} : { scale: 0.95 }}
                        >
                          選択
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-700 mb-4 leading-relaxed">{adType.description}</p>
                    
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50/70 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">料金</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          {Object.entries(adType.pricing).map(([key, value]) => (
                            <div key={key}>{value}</div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gray-50/70 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">予想費用</h4>
                        <div className="text-sm text-gray-600">{adType.estimatedCost}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {adType.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {adType.type === 'priority' && priorityAdCount >= 10 && (
                      <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                        <p className="text-orange-700 text-sm font-medium">
                          現在、広告枠が埋まっています。しばらく時間をおいてからお試しください。
                        </p>
                      </div>
                    )}
                  </div>

                  {/* プレビュー表示 */}
                  {previewType === adType.type && (
                    <motion.div
                      className="bg-gradient-to-br from-gray-50 to-indigo-50/50 rounded-2xl border border-indigo-200/50 overflow-hidden m-2"
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      transition={{ 
                        duration: 0.4, 
                        ease: "easeInOut",
                        height: { duration: 0.3 }
                      }}
                    >
                      {/* プレビューヘッダー */}
                      <div className="bg-gradient-to-r from-indigo-500/85 to-purple-600/75 p-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-white">
                            <span className="text-lg">👁️</span>
                            <span className="font-bold text-sm sm:text-base">
                              リアルタイムプレビュー
                            </span>
                          </div>
                          <motion.button
                            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-all duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setPreviewType(previewType === adType.type ? null : adType.type)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>

                      {/* プレビューコンテンツ */}
                      <div className="p-6">
                        <motion.div
                          className="transform scale-90 origin-top"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          {adType.previewComponent}
                        </motion.div>
                      </div>

                      {/* プレビューフッター */}
                      <div className="bg-gray-50/80 p-4 border-t border-gray-200/50">
                        <div className="text-center">
                          <motion.button
                            className={`w-full bg-gradient-to-r ${adType.color} text-white py-2.5 px-4 rounded-xl font-medium text-sm hover:shadow-lg transition-all duration-300`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleTypeSelect(adType.type)}
                          >
                            このタイプで作成開始 →
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>

                  )}

                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdCreateSelectTypeClient

// ・レイアウトびみゅ～
// ・viewPortに入ったタイミングで、プレビューコンポーネント表示させよう