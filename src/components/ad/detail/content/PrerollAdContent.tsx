// src/components/advertiser/ads/detail/content/PrerollAdContent.tsx
'use client'
import { useState, useEffect } from 'react'
import { AdvertisementDetail } from '@/lib/types/ad/adTypes'
import { getMediaFileData } from '@/actions/ad/adDetailActions'
import { AlertCircle, Loader2, FileVideo, ExternalLink } from 'lucide-react'

type Props = {
  advertisement: AdvertisementDetail
  refreshTrigger?: number
}

type MediaFileData = {
  id: number
  filePath: string
  filePathV2: string | null
  mimeType: string
  fileSize: number
  destination: string
}

export default function PrerollAdContent({ advertisement, refreshTrigger }: Props) {
  const [mediaFileData, setMediaFileData] = useState<MediaFileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // プレロール広告の状態管理
  const [phase, setPhase] = useState('waiting') // 'waiting', 'ad', 'video'
  const [adTimer, setAdTimer] = useState(30) // 30秒広告
  const [showSkipButton, setShowSkipButton] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)

  // タイマー参照を保存（メモリリーク防止）
  const [adTimerRef, setAdTimerRef] = useState<NodeJS.Timeout | null>(null)
  const [progressTimerRef, setProgressTimerRef] = useState<NodeJS.Timeout | null>(null)

  const prefixMediaPath = process.env.NEXT_PUBLIC_MEDIA_PATH as string

  //////////
  //■[ プレロール広告タイマー処理 ]
  useEffect(() => {
    // 既存のタイマーをクリア
    if (adTimerRef) {
      clearTimeout(adTimerRef)
      setAdTimerRef(null)
    }

    if (phase === 'ad' && adTimer > 0) {
      const timer = setTimeout(() => {
        setAdTimer(adTimer - 1)
        // 10秒経過後にスキップボタン表示
        if (adTimer === 21) { // 30-21=9, つまり10秒後
          setShowSkipButton(true)
        }
      }, 1000)
      setAdTimerRef(timer)
      
      return () => {
        clearTimeout(timer)
        setAdTimerRef(null)
      }
    } else if (phase === 'ad' && adTimer === 0) {
      // 広告終了後、自動的に本編再生
      setPhase('video')
      startVideoProgress()
    }
  }, [phase, adTimer])

  //////////
  //■[ 本編動画進行処理 ]
  const startVideoProgress = () => {
    // 既存の進行タイマーをクリア
    if (progressTimerRef) {
      clearInterval(progressTimerRef)
      setProgressTimerRef(null)
    }

    const timer = setInterval(() => {
      setVideoProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          setProgressTimerRef(null)
          return 100
        }
        return prev + 1
      })
    }, 100)
    setProgressTimerRef(timer)
  }

  //////////
  //■[ MediaFileデータ取得 ]
  const fetchMediaFileData = async () => {
    if (!advertisement.mediaFileId) {
      setError('メディアファイルが設定されていません')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await getMediaFileData(advertisement.mediaFileId)
      
      if (result.success && result.data) {
        setMediaFileData(result.data)
      } else {
        setError(result.errMsg || 'メディアファイルの取得に失敗しました')
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
    fetchMediaFileData()
  }, [advertisement.mediaFileId, refreshTrigger])

  //////////
  //■[ イベントハンドラー ]
  const handlePlayClick = () => {
    setPhase('ad')
  }

  const handleSkipAd = () => {
    // 広告タイマーをクリア
    if (adTimerRef) {
      clearTimeout(adTimerRef)
      setAdTimerRef(null)
    }
    setPhase('video')
    startVideoProgress()
  }

  const handleReset = () => {
    // 全てのタイマーをクリア
    if (adTimerRef) {
      clearTimeout(adTimerRef)
      setAdTimerRef(null)
    }
    if (progressTimerRef) {
      clearInterval(progressTimerRef)
      setProgressTimerRef(null)
    }
    
    // 状態をリセット
    setPhase('waiting')
    setAdTimer(30)
    setShowSkipButton(false)
    setVideoProgress(0)
  }

  //////////
  //■[ コンポーネントアンマウント時のクリーンアップ ]
  useEffect(() => {
    return () => {
      if (adTimerRef) {
        clearTimeout(adTimerRef)
      }
      if (progressTimerRef) {
        clearInterval(progressTimerRef)
      }
    }
  }, [])

  //////////
  //■[ ローディング状態 ]
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          <p className="text-gray-600 text-sm">メディアファイルを取得中...</p>
        </div>
      </div>
    )
  }

  //////////
  //■[ エラー状態 ]
  if (error || !mediaFileData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2">メディアファイルを取得できませんでした</h3>
        <p className="text-gray-600 text-center mb-4">
          {error || 'ファイルが見つからないか、一時的にアクセスできません'}
        </p>
        
        {advertisement.mediaFileId && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-700">
              メディアファイルID: <span className="font-mono font-medium">{advertisement.mediaFileId}</span>
            </p>
          </div>
        )}
        
        <button
          onClick={fetchMediaFileData}
          className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl font-medium transition-colors"
        >
          <FileVideo className="w-4 h-4" />
          再試行
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* メインプレロール広告プレイヤー */}
      <div className="w-full max-w-lg mx-auto bg-black rounded-2xl overflow-hidden shadow-2xl">
        {/* メインビデオエリア */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black">
          
          {/* 待機状態 */}
          {phase === 'waiting' && (
            <>
              {/* サムネイル */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900">
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-2xl sm:text-3xl mb-2">🎬</div>
                    <div className="text-sm sm:text-base font-medium mb-2">動画コンテンツ: 13:19</div>
                    <div className="text-xs text-white/60 bg-white/20 px-2 py-1 rounded-full inline-flex items-center gap-1">
                      <span>🔊</span>
                      <span>音声付きで再生</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 大きな再生ボタン */}
              <button
                onClick={handlePlayClick}
                className="absolute inset-0 flex items-center justify-center group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white" className="ml-1">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </button>
            </>
          )}

          {/* 広告再生中 */}
          {phase === 'ad' && (
            <>
              {/* 広告動画コンテンツ（MediaFileの実際のMP4） */}
              <div className="absolute inset-0">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  onError={(e) => {
                    console.error('Video playback error:', e)
                  }}
                >
                  <source src={`${prefixMediaPath}/${mediaFileData.filePath}`} type={mediaFileData.mimeType} />
                </video>
              </div>

              {/* 広告表示バッジ */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-yellow-400 text-black px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <span>広告 {adTimer}s</span>
                <span className="text-xs">🔊</span>
              </div>

              {/* 進行バー */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                <div 
                  className="h-full bg-red-500 transition-all duration-1000"
                  style={{ width: `${((30 - adTimer) / 30) * 100}%` }}
                ></div>
              </div>

              {/* 強制視聴インジケーター */}
              {!showSkipButton && (
                <div className="absolute bottom-12 right-3 sm:bottom-16 sm:right-4 bg-purple-600 bg-opacity-90 text-white px-3 py-1 rounded-full text-xs font-medium z-10 shadow-lg animate-pulse">
                  <span className="hidden sm:inline">必須視聴中 </span>
                  {Math.max(0, 10 - (30 - adTimer))}s
                </div>
              )}

              {/* スキップボタン（10秒経過後のみ） */}
              {showSkipButton && (
                <button
                  onClick={handleSkipAd}
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 text-white px-3 py-2 sm:px-4 sm:py-2 rounded text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 z-20"
                >
                  広告をスキップ →
                </button>
              )}

              {/* カウントダウン表示 */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-base sm:text-lg font-mono">
                {adTimer.toString().padStart(2, '0')}
              </div>

              {/* クリック可能エリア（遷移先URL設定時） */}
              {advertisement.destinationUrl && (
                <a
                  href={advertisement.destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10"
                  aria-label="広告をクリック"
                />
              )}
            </>
          )}

          {/* 本編動画再生中 */}
          {phase === 'video' && (
            <>
              {/* 本編コンテンツ */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-teal-700 to-blue-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-2xl sm:text-3xl mb-4">🎥</div>
                    <div className="text-base sm:text-lg font-bold mb-2">本編動画が再生中...</div>
                    <div className="text-sm opacity-90">素晴らしいコンテンツをお楽しみください</div>
                  </div>
                </div>
              </div>

              {/* 動画コントロール */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3 text-white">
                  <button className="hover:text-red-400 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="sm:w-5 sm:h-5">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                  </button>
                  
                  <div className="flex-1">
                    <div className="w-full h-1 bg-gray-600 rounded-full">
                      <div 
                        className="h-full bg-red-500 rounded-full transition-all duration-100"
                        style={{ width: `${videoProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <span className="text-xs font-mono">{Math.floor(videoProgress/10)}:0{Math.floor(videoProgress%10)}/13:19</span>
                  
                  <button className="hover:text-red-400 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="sm:w-5 sm:h-5">
                      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 説明エリア */}
        <div className="bg-gray-900 p-3 sm:p-4 text-white">
          <div className="text-sm font-medium mb-2">プレロール広告の流れ</div>
          <div className="text-xs text-gray-300 space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${phase === 'waiting' ? 'bg-blue-400' : 'bg-gray-600'}`}></span>
              <span>1. 再生ボタンクリック</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${phase === 'ad' ? 'bg-red-400' : 'bg-gray-600'}`}></span>
              <span>2. 30秒CM表示 (10秒後スキップ可)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${phase === 'video' ? 'bg-green-400' : 'bg-gray-600'}`}></span>
              <span>3. 本編動画再生</span>
            </div>
          </div>
          
          {phase === 'video' && (
            <button
              onClick={handleReset}
              className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-medium transition-colors"
            >
              🔄 デモをリセット
            </button>
          )}
        </div>
      </div>

      {/* 追加情報 */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/40">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs">🎬</span>
          </div>
          広告詳細情報
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* メディア情報 */}
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-600 mb-1">ファイル情報</div>
              <div className="text-sm bg-gray-50 rounded-lg p-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-mono font-medium text-purple-700">#{mediaFileData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">タイプ:</span>
                  <span className="font-medium">{mediaFileData.mimeType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">サイズ:</span>
                  <span className="font-medium">{(mediaFileData.fileSize / 1024 / 1024).toFixed(2)}MB</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-600 mb-1">MIME Type</div>
              <div className="text-sm font-mono font-medium text-purple-700 bg-purple-50 rounded-lg p-2">
                {mediaFileData.mimeType}
              </div>
            </div>
          </div>

          {/* リンク情報 */}
          <div className="space-y-3">
            {advertisement.destinationUrl && (
              <div>
                <div className="text-xs text-gray-600 mb-1">遷移先URL</div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <a 
                    href={advertisement.destinationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 break-all"
                  >
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    {advertisement.destinationUrl.length > 40 
                      ? `${advertisement.destinationUrl.substring(0, 40)}...` 
                      : advertisement.destinationUrl
                    }
                  </a>
                </div>
              </div>
            )}

            <div>
              <div className="text-xs text-gray-600 mb-1">表示効果</div>
              <div className="text-sm text-green-700 bg-green-50 rounded-lg p-2">
                動画再生前の30秒間確実に表示され、強力なブランド認知効果を期待できます
              </div>
            </div>
          </div>
        </div>

        {/* プレビューでない場合の外部リンク */}
        {advertisement.destinationUrl && (
          <div className="mt-6 pt-4 border-t border-gray-200/50 text-center">
            <a
              href={advertisement.destinationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
            >
              <ExternalLink className="w-4 h-4" />
              遷移先を確認
            </a>
          </div>
        )}
      </div>
    </div>
  )
}