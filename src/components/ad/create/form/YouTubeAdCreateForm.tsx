'use client'
import { useState, useRef, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useUpdateAmount } from '@/hooks/point/useUpdateAmount'
import useStore from '@/store'

import YouTubeShortAdComponent from '@/components/ad/previews/YouTubeShortAdComponent'
import YouTubeLongAdComponent from '@/components/ad/previews/YouTubeLongAdComponent'
import BudgetCalculator from '../common/BudgetCalculator'

import { validateSimpleYouTubeId } from '@/lib/seculity/validation'
import { createYouTubeAd } from '@/actions/ad/adCreateActions'
import SpinnerModal from '@/components/SpinnerModal'


// 広告タイプ設定
const AD_TYPE_CONFIG = {
  'youtube-short': {
    title: 'YouTube Short広告',
    subtitle: 'YouTubeショート動画の再生数向上',
    description: 'EchiEchiTube上でYouTube動画を再生し、再生数を増加させます。15秒後にスキップ可能で、30秒で自動終了。',
    price: 1.5,
    skipTime: 15,
    maxTime: 30,
    gradient: 'from-red-500 to-pink-600',
    icon: '🔹',
    features: [
      '15秒後スキップ可能',
      '30秒で自動終了',
      'YouTube再生数向上',
      'ショート動画に最適'
    ]
  },
  'youtube-long': {
    title: 'YouTube Long広告',
    subtitle: 'YouTube動画の高品質な再生数向上',
    description: 'EchiEchiTube上でYouTube動画を再生し、より多くの再生数を獲得します。30秒後にスキップ可能で、60秒で自動終了。',
    price: 3,
    skipTime: 30,
    maxTime: 60,
    gradient: 'from-orange-500 to-red-600',
    icon: '🎥',
    features: [
      '30秒後スキップ可能',
      '60秒で自動終了',
      '高い視聴継続率',
      'より多くの再生数獲得'
    ]
  }
} as const

export default function YouTubeAdCreateForm({
  advertiserId,
  youtubeType,
}: {
  advertiserId: number
  youtubeType: 'youtube-short' | 'youtube-long'
}) {
  const [youtubeIdData, setYoutubeIdData] = useState({value: '', error: ''})
  const [budgetData, setBudgetData] = useState({value: 500, error: ''})
  const [isSubmitting, setIsSubmitting] = useState(false)
  //const [isCheckingVideo, setIsCheckingVideo] = useState(false)
  const [error, setError] = useState('')
  
  //const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const updateAmount = useUpdateAmount()
  const {user} = useStore()
  const config = AD_TYPE_CONFIG[youtubeType]

  // YouTube ID変更処理
  const handleYouTubeIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value.trim()
    setYoutubeIdData({value: inputVal, error: ''})

    // // 既存のタイマーをクリア
    // if (checkTimeoutRef.current) {
    //   clearTimeout(checkTimeoutRef.current)
    // }
    // // 基本バリデーション
    // if (!inputVal) return
    // const youtubeIdRegex = /^[a-zA-Z0-9_-]{11}$/
    // if (!youtubeIdRegex.test(inputVal)) {
    //   setYoutubeIdData({value: inputVal, error: 'YouTube動画IDの形式が正しくありません'})
    //   return
    // }
    // // デバウンス: 1000ms後に動画存在確認
    // checkTimeoutRef.current = setTimeout(async () => {
    //   setIsCheckingVideo(true)
    //   try {
    //     const result = await validateSimpleYouTubeId(inputVal)
    //     if (!result.exists || result.error) {
    //       setYoutubeIdData({
    //         value: inputVal,
    //         error: result.error || 'YouTube動画が見つかりません'
    //       })
    //     }
    //   } catch (error) {
    //     setYoutubeIdData({
    //       value: inputVal,
    //       error: 'YouTube動画の確認に失敗しました'
    //     })
    //   } finally {
    //     setIsCheckingVideo(false)
    //   }
    // }, 1000)
  }

  // 送信処理
  const handleSubmit = async () => {
    const confirmed = confirm('この内容で間違いありませんか？')
    if (!confirmed) return
    
    setIsSubmitting(true)
    if (error) setError('')
      
    //////////      
    // ■[ バリデーション ]
    let alertFlag = false
    // ・youtubeId
    try {
      const result = await validateSimpleYouTubeId(youtubeIdData.value)
      if (!result.exists || result.error) {
        setYoutubeIdData({...youtubeIdData, error:result.error || 'YouTube動画が見つかりません'})
        alertFlag = true
      }
    } catch (err) {
      const addmsg = err instanceof Error ? `\n${err.message}` : '';
      setYoutubeIdData({
        value:'',
        error:'YouTube動画の確認に失敗しました。もう一度お試し下さい🙇‍♀️'+addmsg
      })
      alertFlag = true
    }
    // ・budget
    if (budgetData.value < 100 || budgetData.value > 100000) {
      setBudgetData(prev => ({...prev, error: '予算は100ポイント以上、100,000ポイント以下で設定してください'}))
      alertFlag = true
    }
    // ・user.amountとbudgetData.valueの比較バリデーション
    if (budgetData.value > user.amount) {
      setBudgetData(prev => ({...prev, error: `予算が保有ポイント（${user.amount.toLocaleString()}P）を超えています`}))
      alertFlag = true
    }
    // ・バリデーション結果を通知
    if (alertFlag) {
      alert('入力内容に問題があります')
      setError('入力内容に問題があります')
      setIsSubmitting(false)
      return
    }

    //////////
    // ■[ 通信 ]
    try {
      const {success, errMsg, statusCode, advertisementId, updatedAmountNumber} = await createYouTubeAd({
        youtubeId: youtubeIdData.value,
        youtubeType,
        budget: budgetData.value,
      })
      if (statusCode === 401) {
        alert(errMsg)
        router.push('/auth/advertiser')
        return
      } else if (success) {
        if (updatedAmountNumber !== undefined) updateAmount(updatedAmountNumber)
        alert('Success.')
        //router.push(`/advertiser/${advertiserId}/ads/create/confirmation/${advertisementId}`)
        router.push(`/advertiser/${advertiserId}/ad/${advertisementId}`)
        return
      }
      alert(errMsg)
      setError(errMsg)
      setIsSubmitting(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : '作成に失敗しました。もう一度お試しください。'
      alert(message)
      setError(message)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-100">
      {isSubmitting&&<SpinnerModal/>}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent mb-4`}>
                {config.title}
              </h1>
            </div>
            {/* 保有ポイント表示 */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg px-4 py-2">
              <div className="text-xs text-gray-500 mb-1">保有ポイント</div>
              <div className="text-lg font-bold text-purple-600 flex items-center gap-1">
                <span className="text-sm">💎</span>
                {user.amount?.toLocaleString() || 0}P
              </div>
            </div>
          </div>
          <p className="text-gray-600">
            {config.description}
          </p>
        </div>

        <div className="grid xl:grid-cols-3 gap-8">
          {/* フォーム */}
          <div className="xl:col-span-2 space-y-6">
            {/* YouTube動画ID入力 */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/30 shadow-lg p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                YouTube動画ID <span className="text-red-500">*</span>
              </label>
              
              <div className="relative">
                <input
                  type="text"
                  value={youtubeIdData.value}
                  onChange={handleYouTubeIdChange}
                  placeholder="dQw4w9WgXcQ"
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-white/80 focus:outline-none transition-all duration-300 ${
                    youtubeIdData.error 
                      ? 'border-red-400 focus:border-red-500' 
                      : youtubeIdData.value && !youtubeIdData.error //&& !isCheckingVideo
                        ? 'border-green-400 focus:border-green-500'
                        : 'border-gray-200 focus:border-red-500'
                  }`}
                  disabled={isSubmitting}
                />
                
                {/* 検証状態アイコン */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {/*isCheckingVideo && (
                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  )*/}
                  {
                    //!isCheckingVideo && 
                    youtubeIdData.value && !youtubeIdData.error && (
                    <div className="w-5 h-5 text-green-500">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {
                    //!isCheckingVideo && 
                    youtubeIdData.error && (
                    <div className="w-5 h-5 text-red-500">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {youtubeIdData.error && (
                <span className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {youtubeIdData.error}
                </span>
              )}

              {/* {
                //!isCheckingVideo && 
                youtubeIdData.value && !youtubeIdData.error && (
                <span className="text-green-600 text-sm mt-2 flex items-center gap-1">
                  ✅ YouTube動画が見つかりました
                </span>
              )} */}

              <div className="mt-3 text-xs text-gray-500">
                <p>YouTube動画URLから動画IDを確認できます</p>
                <p className="mt-1">例: https://www.youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong> → 動画IDは「dQw4w9WgXcQ」</p>
              </div>
            </div>

            {/* 料金・仕様情報 */}
            <div className={`bg-gradient-to-r ${config.gradient} rounded-3xl p-6 text-white shadow-lg`}>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">{config.icon}</span>
                {config.subtitle}
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm opacity-90 mb-1">料金</div>
                  <div className="text-2xl font-bold">{config.price}円 / 再生</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-sm opacity-90 mb-1">視聴時間</div>
                  <div className="text-lg font-semibold">
                    {config.skipTime}秒後スキップ可 / {config.maxTime}秒で終了
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm opacity-90 mb-2">特徴</div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {config.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 bg-white rounded-full opacity-80" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 予算設定 */}
            <BudgetCalculator 
              adType={youtubeType} 
              budgetData={budgetData} 
              setBudgetData={setBudgetData}
            />

            {/* 全体エラーメッセージ */}
            {error && (
              <div className="p-4 bg-red-50/70 backdrop-blur-sm border border-red-200 rounded-2xl">
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {/* 送信ボタン */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-xl font-medium transition-all duration-300 border border-gray-200"
                disabled={isSubmitting}
              >
                戻る
              </button>
              
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || youtubeIdData.error !== '' || budgetData.error !== '' || !youtubeIdData.value}
                className={`group relative overflow-hidden bg-gradient-to-r ${config.gradient} hover:shadow-lg disabled:from-gray-400 disabled:to-gray-500 text-white px-12 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed transform`}
              >
                <div className="relative flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>作成中...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>広告を作成</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* プレビュー */}
          <div className="xl:sticky xl:top-8">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/30 shadow-lg overflow-hidden">
              <div className={`bg-gradient-to-r ${config.gradient} p-4`}>
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <span className="text-xl">👁️</span>
                  プレビュー
                </h3>
                <p className="text-white/80 text-sm mt-1">
                  実際の表示イメージを確認できます
                </p>
              </div>

              <div className="p-6">
                <div className="transform scale-90 origin-top">
                  {youtubeType === 'youtube-short' ? (
                    <YouTubeShortAdComponent />
                  ) : (
                    <YouTubeLongAdComponent />
                  )}
                </div>
              </div>

              <div className="bg-gray-50/80 p-4 border-t border-gray-200/50">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 bg-${youtubeType === 'youtube-short' ? 'red' : 'orange'}-500 rounded-full`} />
                    <span>YouTube動画を再生して再生数向上</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 bg-${youtubeType === 'youtube-short' ? 'pink' : 'red'}-500 rounded-full`} />
                    <span>{config.skipTime}秒後スキップ可能</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>視聴後1時間非表示</span>
                  </div>
                </div>
              </div>
            </div>

            {/* YouTube成長について */}
            <div className="mt-6 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 p-6 shadow-lg">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-lg">📈</span>
                YouTube成長効果
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">📊</span>
                  <span>再生数増加でランキング向上</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">🔍</span>
                  <span>YouTube検索での露出拡大</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">👥</span>
                  <span>チャンネル登録者数増加</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}