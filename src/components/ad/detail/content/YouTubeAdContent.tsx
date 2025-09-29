// src/components/advertiser/ads/detail/content/YouTubeAdContent.tsx
'use client'
import { useState, useEffect } from 'react'
import { AdvertisementDetail } from '@/lib/types/ad/adTypes'
import { AlertCircle, ExternalLink, Youtube, Play } from 'lucide-react'

type Props = {
  advertisement: AdvertisementDetail
  refreshTrigger?: number
}

export default function YouTubeAdContent({ advertisement, refreshTrigger }: Props) {
  // YouTube広告の設定（2秒加算）
  const isShort = advertisement.adType === 'youtube-short'
  const totalDuration = isShort ? 30 : 60 // short: 30秒, long: 60秒
  const forcedViewTime = isShort ? 17 : 32 // short: 15+2秒, long: 30+2秒
  
  // プレロール広告の状態管理
  const [phase, setPhase] = useState('waiting') // 'waiting', 'ad', 'video'
  const [adTimer, setAdTimer] = useState(totalDuration)
  const [showSkipButton, setShowSkipButton] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [videoLoaded, setVideoLoaded] = useState(false) // iframe読み込み完了状態

  // タイマー参照を保存（メモリリーク防止）
  const [adTimerRef, setAdTimerRef] = useState<NodeJS.Timeout | null>(null)
  const [progressTimerRef, setProgressTimerRef] = useState<NodeJS.Timeout | null>(null)

  //////////
  //■[ YouTube広告タイマー処理 ]
  useEffect(() => {
    // 既存のタイマーをクリア
    if (adTimerRef) {
      clearTimeout(adTimerRef)
      setAdTimerRef(null)
    }

    // 動画が読み込まれてからタイマー開始
    if (phase === 'ad' && videoLoaded && adTimer > 0) {
      const timer = setTimeout(() => {
        setAdTimer(adTimer - 1)
        // 強制視聴時間経過後にスキップボタン表示
        const skipThreshold = totalDuration - forcedViewTime + 1
        if (adTimer === skipThreshold) {
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
  }, [phase, adTimer, totalDuration, forcedViewTime, videoLoaded])

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
  //■[ イベントハンドラー ]
  const handlePlayClick = () => {
    setPhase('ad')
    setVideoLoaded(false) // リセット
  }

  const handleIframeLoad = () => {
    // iframe読み込み完了時にタイマー開始
    setVideoLoaded(true)
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
    setAdTimer(totalDuration)
    setShowSkipButton(false)
    setVideoProgress(0)
    setVideoLoaded(false) // 追加
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
  //■[ targetId検証 ]
  if (!advertisement.targetId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2">YouTube動画IDが設定されていません</h3>
        <p className="text-gray-600 text-center mb-4">
          YouTube動画IDを設定してから再度お試しください
        </p>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-700">
            設定が必要: <span className="font-medium">YouTube動画ID (例: dQw4w9WgXcQ)</span>
          </p>
        </div>
      </div>
    )
  }

  //////////
  //■[ 広告タイプ設定 ]
  const adTypeConfig = {
    'youtube-short': {
      title: 'YouTube Short広告',
      icon: '📹',
      gradient: 'from-red-500 to-pink-600',
      description: `YouTube動画の再生数向上（${forcedViewTime}秒強制視聴）`,
      duration: `${totalDuration}秒`
    },
    'youtube-long': {
      title: 'YouTube Long広告',
      icon: '🎥',
      gradient: 'from-orange-500 to-red-600',
      description: `より長時間のYouTube広告（${forcedViewTime}秒強制視聴）`,
      duration: `${totalDuration}秒`
    }
  }

  const currentConfig = adTypeConfig[advertisement.adType as keyof typeof adTypeConfig]

  return (
    <div className="space-y-6">
      {/* メインYouTube広告プレイヤー */}
      <div className="w-full max-w-lg mx-auto bg-black rounded-2xl overflow-hidden shadow-2xl">
        {/* メインビデオエリア */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black">
          
          {/* 待機状態 */}
          {phase === 'waiting' && (
            <>
              {/* サムネイル */}
              <div className={`absolute inset-0 bg-gradient-to-r ${currentConfig.gradient}`}>
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-2xl sm:text-3xl mb-2">{currentConfig.icon}</div>
                    <div className="text-sm sm:text-base font-medium mb-1">{currentConfig.title}</div>
                    <div className="text-xs sm:text-sm text-white/80">YouTube ID: {advertisement.targetId}</div>
                  </div>
                </div>
              </div>
              
              {/* 大きな再生ボタン */}
              <button
                onClick={handlePlayClick}
                className="absolute inset-0 flex items-center justify-center group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white ml-1" fill="currentColor" />
                </div>
              </button>
            </>
          )}

          {/* YouTube広告再生中 */}
          {phase === 'ad' && (
            <>
              {/* YouTube iframe */}
              <div className="absolute inset-0">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${advertisement.targetId}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0&showinfo=0&disablekb=1&enablejsapi=1`}
                  title="YouTube広告"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ pointerEvents: 'none' }}
                  onLoad={handleIframeLoad}
                />
              </div>

              {/* YouTube動画クリック用オーバーレイ */}
              <a
                href={`https://www.youtube.com/watch?v=${advertisement.targetId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-5 cursor-pointer"
                aria-label="YouTube動画を開く"
              />

              {/* 広告表示バッジ */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold z-10 flex items-center gap-1">
                <Youtube className="w-3 h-3" />
                <span>広告 {adTimer}s</span>
                <span className="text-xs">🔊</span>
              </div>

              {/* 進行バー */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600 z-10">
                <div 
                  className="h-full bg-red-500 transition-all duration-1000"
                  style={{ width: `${((totalDuration - adTimer) / totalDuration) * 100}%` }}
                ></div>
              </div>

              {/* スキップボタン（強制視聴時間経過後のみ） */}
              {showSkipButton && (
                <button
                  onClick={handleSkipAd}
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-gray-800 bg-opacity-90 hover:bg-opacity-100 text-white px-3 py-2 sm:px-4 sm:py-2 rounded text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 z-20 shadow-lg"
                >
                  広告をスキップ →
                </button>
              )}

              {/* カウントダウン表示 */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-base sm:text-lg font-mono z-10 shadow-lg">
                {adTimer.toString().padStart(2, '0')}
              </div>

              {/* 強制視聴インジケーター */}
              {!showSkipButton && (
                <div className="absolute bottom-12 right-3 sm:bottom-16 sm:right-4 bg-red-600 bg-opacity-90 text-white px-3 py-1 rounded-full text-xs font-medium z-10 shadow-lg animate-pulse">
                  {!videoLoaded ? (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      <span>読み込み中...</span>
                    </span>
                  ) : (
                    <>
                      <span className="hidden sm:inline">必須視聴中 </span>
                      {Math.max(0, forcedViewTime - (totalDuration - adTimer))}s
                    </>
                  )}
                </div>
              )}

              {/* クリック可能エリア（遷移先URL設定時 - YouTube動画クリックより下の階層） */}
              {advertisement.destinationUrl && (
                <a
                  href={advertisement.destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-1"
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
                    <div className="text-sm opacity-90">YouTube広告効果で再生数アップ！</div>
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
                    <Youtube className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 説明エリア */}
        <div className="bg-gray-900 p-3 sm:p-4 text-white">
          <div className="text-sm font-medium mb-2 flex items-center gap-2">
            <Youtube className="w-4 h-4 text-red-500" />
            {currentConfig.title}の流れ
          </div>
          <div className="text-xs text-gray-300 space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${phase === 'waiting' ? 'bg-blue-400' : 'bg-gray-600'}`}></span>
              <span>1. 再生ボタンクリック</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${phase === 'ad' ? 'bg-red-400' : 'bg-gray-600'}`}></span>
              <span>2. {currentConfig.duration}YouTube広告表示 ({forcedViewTime}秒後スキップ可)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${phase === 'video' ? 'bg-green-400' : 'bg-gray-600'}`}></span>
              <span>3. 本編動画再生</span>
            </div>
          </div>
          
          {phase === 'video' && (
            <button
              onClick={handleReset}
              className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <span>🔄</span>
              デモをリセット
            </button>
          )}
        </div>
      </div>

      {/* 追加情報 */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/40">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <div className={`w-5 h-5 bg-gradient-to-r ${currentConfig.gradient} rounded-lg flex items-center justify-center`}>
            <span className="text-white text-xs">{currentConfig.icon}</span>
          </div>
          広告詳細情報
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* YouTube情報 */}
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-600 mb-1">YouTube動画情報</div>
              <div className="text-sm bg-gray-50 rounded-lg p-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">動画ID:</span>
                  <span className="font-mono font-medium text-red-700">{advertisement.targetId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">タイプ:</span>
                  <span className="font-medium">{isShort ? 'Short' : 'Long'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">再生時間:</span>
                  <span className="font-medium">{currentConfig.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">強制視聴:</span>
                  <span className="font-medium text-red-600">{forcedViewTime}秒</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-600 mb-1">YouTube URL</div>
              <div className="bg-gray-50 rounded-lg p-2">
                <a 
                  href={`https://www.youtube.com/watch?v=${advertisement.targetId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-red-600 hover:text-red-800 transition-colors flex items-center gap-1 break-all"
                >
                  <Youtube className="w-3 h-3 flex-shrink-0" />
                  youtube.com/watch?v={advertisement.targetId}
                </a>
              </div>
            </div>
          </div>

          {/* 効果情報 */}
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
              <div className="text-xs text-gray-600 mb-1">期待効果</div>
              <div className="text-sm text-green-700 bg-green-50 rounded-lg p-2">
                YouTube動画の再生数・チャンネル登録者数の増加効果を期待できます
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-600 mb-1">課金方式</div>
              <div className="text-sm text-purple-700 bg-purple-50 rounded-lg p-2">
                1再生あたり{isShort ? '1.5' : '3'}円の課金
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200/50 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://www.youtube.com/watch?v=${advertisement.targetId}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r ${currentConfig.gradient} text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all duration-300`}
          >
            <Youtube className="w-4 h-4" />
            YouTube動画を確認
          </a>
          
          {advertisement.destinationUrl && (
            <a
              href={advertisement.destinationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl font-medium border border-gray-200 transition-all duration-300"
            >
              <ExternalLink className="w-4 h-4" />
              遷移先を確認
            </a>
          )}
        </div>
      </div>
    </div>
  )
}