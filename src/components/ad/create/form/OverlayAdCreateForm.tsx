'use client'
import { useState, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useUpdateAmount } from '@/hooks/point/useUpdateAmount'
import useStore from '@/store'

import SpinnerModal from '@/components/SpinnerModal'
import VideoPlayerHover from '@/components/ad/previews/VideoPlayerHover'
import ImageUploadZone from '../common/ImageUploadZone'
import BudgetCalculator from '../common/BudgetCalculator'

import { createOverlayAd } from '@/actions/ad/adCreateActions'



export default function OverlayAdCreateForm({
    advertiserId,
}: {
    advertiserId: number
}) {
    const [destinationUrlData, setDestinationUrlData] = useState({value: '', error: ''})
    const [budgetData, setBudgetData] = useState({value: 500, error: ''})
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const updateAmount = useUpdateAmount()
    const {user} = useStore()

    // URL変更処理
    const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value.trim()
        setDestinationUrlData({value: inputVal, error:''})
    }

    // 送信処理
    const handleSubmit = async () => {
        const confirmed = confirm('この内容で間違いありませんか？')
        if (!confirmed) return
        
        setIsSubmitting(true)
        if (error) setError('')

        // バリデーション
        let alertFlag = false
        // destinationUrl
        if (!destinationUrlData.value) {
            setDestinationUrlData(prev => ({...prev, error: '移転先URLを入力してください'}))
            alertFlag = true
        } else {
            try {
                new URL(destinationUrlData.value)
                if (!destinationUrlData.value.startsWith('http://') && !destinationUrlData.value.startsWith('https://')) {
                    setDestinationUrlData(prev => ({...prev, error: 'HTTPまたはHTTPSで始まるURLを入力してください'}))
                    alertFlag = true
                }
            } catch {
                setDestinationUrlData(prev => ({...prev, error: '有効なURL形式で入力してください'}))
                alertFlag = true
            }
        }
        // selectedFile
        if (!selectedFile) {
            alert('画像を選択してください')
            alertFlag = true
        }
        // budget
        if (budgetData.value < 100 || budgetData.value > 100000) {
            setBudgetData(prev => ({...prev, error: '予算は100ポイント以上、100,000ポイント以下で設定してください'}))
            alertFlag = true
        }
        // user.amountとbudgetData.valueの比較バリデーション
        if (budgetData.value > user.amount) {
            setBudgetData(prev => ({...prev, error: `予算が保有ポイント（${user.amount.toLocaleString()}P）を超えています`}))
            alertFlag = true 
        }
        if (alertFlag) {
            alert('入力内容に問題があります')
            setError('入力内容に問題があります')
            setIsSubmitting(false)
            return
        }

        // 通信
        try {
            const formDataToSend = new FormData()
            formDataToSend.append('image', selectedFile!)
            formDataToSend.append('destinationUrl', destinationUrlData.value)
            formDataToSend.append('budget', budgetData.value.toString())
            const {success, errMsg, statusCode, advertisementId, updatedAmountNumber} = await createOverlayAd(formDataToSend)
            if (statusCode === 401) {
                alert(errMsg)
                router.push('/auth/advertiser')
                return
            } else if (success) {
                if (updatedAmountNumber !== undefined) updateAmount(updatedAmountNumber)
                alert('Success.')
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100">
      {isSubmitting&&<SpinnerModal/>}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                オーバーレイ広告
              </h1>
            </div>
            {/* 保有ポイント表示 */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg px-4 py-2">
              <div className="text-xs text-gray-500 mb-1">保有ポイント</div>
              <div className="text-lg font-bold text-blue-600 flex items-center gap-1">
                <span className="text-sm">💎</span>
                {user.amount?.toLocaleString() || 0}P
              </div>
            </div>
          </div>
          <p className="text-gray-600">
            動画再生中にプレイヤー上に画像広告を表示します。10秒間の強制表示で確実にユーザーの注意を引きつけます。
          </p>
        </div>

        <div className="grid xl:grid-cols-3 gap-8">
          {/* フォーム */}
          <div className="xl:col-span-2 space-y-6">
            {/* 画像アップロード */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/30 shadow-lg p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                広告画像 <span className="text-red-500">*</span>
              </label>
              <ImageUploadZone 
                selectedFile={selectedFile} 
                setSelectedFile={setSelectedFile}
              />
            </div>

            {/* 移転先URL */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/30 shadow-lg p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                移転先URL <span className="text-red-500">*</span>
              </label>
              
              <div className="relative">
                <input
                  type="url"
                  value={destinationUrlData.value}
                  onChange={handleUrlChange}
                  placeholder="https://example.com"
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-white/80 focus:outline-none transition-all duration-300 ${
                    destinationUrlData.error 
                      ? 'border-red-400 focus:border-red-500' 
                      : destinationUrlData.value && !destinationUrlData.error
                        ? 'border-green-400 focus:border-green-500'
                        : 'border-gray-200 focus:border-blue-500'
                  }`}
                  disabled={isSubmitting}
                />
                
                {/* URLアイコン */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </div>

              {destinationUrlData.error && (
                <span className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {destinationUrlData.error}
                </span>
              )}

              <div className="mt-3 text-xs text-gray-500">
                <p>広告クリック時にユーザーが移動するページのURLを入力してください</p>
                <p className="mt-1">例: 商品ページ、サービス紹介ページなど</p>
              </div>
            </div>

            {/* 予算設定 */}
            <BudgetCalculator 
              adType="overlay" 
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
                disabled={isSubmitting || destinationUrlData.error !== '' || budgetData.error !== '' || !selectedFile}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-12 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed transform"
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
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <span className="text-xl">👁️</span>
                  プレビュー
                </h3>
                <p className="text-blue-100 text-sm mt-1">
                  実際の表示イメージを確認できます
                </p>
              </div>

              <div className="p-6">
                <div className="transform scale-90 origin-top">
                  <VideoPlayerHover />
                </div>
              </div>

              <div className="bg-gray-50/80 p-4 border-t border-gray-200/50">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>動画プレイヤー上にオーバーレイ表示</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full" />
                    <span>10秒強制表示で確実なリーチ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span>審査完了後に配信開始</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 審査について */}
            <div className="mt-6 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/30 p-6 shadow-lg">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-lg">📋</span>
                審査について
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">📋</span>
                  <span>詐欺・違法コンテンツでないか確認</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">⏱️</span>
                  <span>通常1-2営業日で審査完了</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">🔧</span>
                  <span>結果は通知でお知らせします</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}