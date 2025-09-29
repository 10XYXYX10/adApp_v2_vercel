// src/components/advertiser/ads/detail/content/PriorityAdContent.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AdvertisementDetail } from '@/lib/types/ad/adTypes'
import { ExternalLink, AlertCircle, Eye, Loader2 } from 'lucide-react'
import { getMovieAppMetadata } from '@/actions/ad/adDetailActions'

type Props = {
  advertisement: AdvertisementDetail
  refreshTrigger?: number
}

type MovieAppData = {
  title: string
  imageUrl: string
  articleUrl: string
}

export default function PriorityAdContent({ advertisement, refreshTrigger }: Props) {
  const [movieAppData, setMovieAppData] = useState<MovieAppData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  //////////
  //■[ movieAppデータ取得 ]
  const fetchMovieAppData = async () => {
    if (!advertisement.targetId) {
      setError('記事IDが設定されていません')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await getMovieAppMetadata(advertisement.targetId)
      
      if (result.success && result.data) {
        setMovieAppData(result.data)
      } else {
        setError(result.errMsg || '記事情報の取得に失敗しました')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  //////////
  //■[ 初期データ取得 & リフレッシュ対応 ]
  useEffect(() => {
    fetchMovieAppData()
  }, [advertisement.targetId, refreshTrigger])

  //////////
  //■[ ローディング状態 ]
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 text-blue-500" />
          </motion.div>
          <p className="text-gray-600 text-sm">記事情報を取得中...</p>
        </motion.div>
      </div>
    )
  }

  //////////
  //■[ エラー状態 ]
  if (error || !movieAppData) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-12 px-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2">記事情報を取得できませんでした</h3>
        <p className="text-gray-600 text-center mb-4">
          {error || '記事が見つからないか、一時的にアクセスできません'}
        </p>
        
        {advertisement.targetId && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-700">
              対象記事ID: <span className="font-mono font-medium">{advertisement.targetId}</span>
            </p>
          </div>
        )}
        
        <motion.button
          onClick={fetchMovieAppData}
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Eye className="w-4 h-4" />
          再試行
        </motion.button>
      </motion.div>
    )
  }

  //////////
  //■[ 記事カード（既存レイアウト準拠） ]
  const ArticleCard = () => (
    <motion.div
      className="mb-3 sm:w-1/2 p-1 mx-auto max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -5 }}
    >
      <div className="bg-white shadow-md rounded h-full overflow-hidden">
        {/* タイトル部分 */}
        <a
          className="shadow-md hover:shadow-none transition-shadow duration-300"
          href={movieAppData.articleUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <motion.h2 
            className='text-center text-base bg-gray-900 text-white box-shadow rounded-tl rounded-tr px-3 py-2'
            whileHover={{ backgroundColor: '#1f2937' }}
            transition={{ duration: 0.2 }}
          >
            {movieAppData.title.length > 50 
              ? movieAppData.title.substring(0, 50) + '…' 
              : movieAppData.title
            }
          </motion.h2>
        </a>

        {/* 画像部分 */}
        <div className="py-2 px-1">
          <div style={{paddingTop: 10}} className="text-center">
            <a
              className="block"
              href={movieAppData.articleUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={movieAppData.imageUrl}
                  width={300}
                  height={250}
                  alt={movieAppData.title}
                  className='mx-auto box-shadow rounded-sm'
                  onError={(e) => {
                    // フォールバック画像
                    const target = e.target as HTMLImageElement
                    target.src = '/images/no-image.png' // フォールバック画像パス
                  }}
                />
              </motion.div>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      {/* メイン記事カード */}
      <div className="flex justify-center">
        <ArticleCard />
      </div>

      {/* 追加情報 */}
      <motion.div
        className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/40"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs">🎯</span>
          </div>
          広告詳細情報
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* 記事情報 */}
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-600 mb-1">記事タイトル</div>
              <div className="text-sm font-medium text-gray-900 bg-gray-50 rounded-lg p-2">
                {movieAppData.title}
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-600 mb-1">記事ID</div>
              <div className="text-sm font-mono font-medium text-blue-700 bg-blue-50 rounded-lg p-2">
                {advertisement.targetId}
              </div>
            </div>
          </div>

          {/* リンク情報 */}
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-600 mb-1">記事URL</div>
              <div className="bg-gray-50 rounded-lg p-2">
                <a 
                  href={movieAppData.articleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 break-all"
                >
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  {movieAppData.articleUrl.length > 40 
                    ? `${movieAppData.articleUrl.substring(0, 40)}...` 
                    : movieAppData.articleUrl
                  }
                </a>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-600 mb-1">優先表示効果</div>
              <div className="text-sm text-green-700 bg-green-50 rounded-lg p-2">
                記事一覧の上位に表示され、露出機会が向上します
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200/50 text-center">
          <motion.a
            href={movieAppData.articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ExternalLink className="w-4 h-4" />
            実際の記事を確認
          </motion.a>
        </div>
      </motion.div>
    </div>
  )
}