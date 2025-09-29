'use client'
import { useState, useRef, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import useStore from '@/store'

import SpinnerModal from '@/components/SpinnerModal'
import PriorityAdComponent from '@/components/ad/previews/PriorityAdComponent'
import BudgetCalculator from '../common/BudgetCalculator'
import { useUpdateAmount } from '@/hooks/point/useUpdateAmount'

import { createPriorityAd } from '@/actions/ad/adCreateActions'


export default function PriorityAdCreateForm({
  advertiserId,
}: {
  advertiserId: number
}) {
  const [targetIdData, setTargetIdData] = useState({value: 0, error: ''})
  const [budgetData, setBudgetData] = useState({value: 500, error: ''})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const updateAmount = useUpdateAmount();
  const {user} = useStore()

  // 記事ID変更処理
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputVal = Number(e.target.value);
    // 基本バリデーション
    if (isNaN(inputVal) || inputVal <= 0) {
      setTargetIdData({value: inputVal, error: '0以上の半角数字で入力して下さい。'})
      return
    }
    setTargetIdData({value: inputVal, error: ''})
  }

  // 送信処理
  const handleSubmit = async () => {
    const confirmed = confirm('この内容で間違いありませんか？')
    if (!confirmed) return
    
    setIsSubmitting(true)
    if (error) setError('')

    // バリデーション
    let alertFlag = false
    // targetId
    if (!targetIdData.value || targetIdData.value <= 0) {
      setTargetIdData(prev => ({...prev, error: '記事IDを入力してください'}))
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
      const {success,errMsg,statusCode,advertisementId,updatedAmountNumber} = await createPriorityAd({
        targetId:targetIdData.value,
        budget: budgetData.value,
      })
      if (statusCode === 401) {
        alert(errMsg)
        router.push('/auth/advertiser')
        return
      }else if (success) {
        if(updatedAmountNumber!==undefined)updateAmount(updatedAmountNumber);
        alert('Success.')
        router.push(`/advertiser/${advertiserId}/ad/${advertisementId}`)
        return
      } else if(statusCode===404 && errMsg.startsWith('TargetId error.')){
        setTargetIdData({...targetIdData,error:errMsg})
      }
      alert(errMsg);
      setError(errMsg);
      setIsSubmitting(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : '作成に失敗しました。もう一度お試しください。'
      alert(message)
      setError(message)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-rose-100">
      {isSubmitting&&<SpinnerModal/>}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
                動画記事優先表示広告
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
           記事一覧ページで指定した記事を専用枠で優先表示します。審査不要で即座に配信を開始できます。
          </p>
        </div>
        

        <div className="grid lg:grid-cols-2 gap-8">
          {/* フォーム */}
          <div className="space-y-6">
            {/* 記事ID入力 */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/30 shadow-lg p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                記事ID <span className="text-red-500">*</span>
              </label>
              
              <div className="relative">
                <input
                  type="number"
                  value={targetIdData.value || ''}
                  onChange={handleChange}
                  placeholder="記事IDを入力してください"
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-white/80 focus:outline-none transition-all duration-300 ${
                    targetIdData.error 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-gray-200 focus:border-pink-500'
                  }`}
                  disabled={isSubmitting}
                />
                
                {/* 検証状態アイコン */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {targetIdData.value > 0 && !targetIdData.error && (
                    <div className="w-5 h-5 text-green-500">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {targetIdData.error && (
                <span className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {targetIdData.error}
                </span>
              )}

              <div className="mt-3 text-xs text-gray-500">
                <p>movieAppの記事ページURLから記事IDを確認できます</p>
                <p className="mt-1">例: /single/123 → 記事IDは「123」</p>
              </div>
            </div>

            {/* 予算設定 */}
            <BudgetCalculator 
              adType="priority" 
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
                disabled={isSubmitting || targetIdData.error !== '' || budgetData.error !== ''}
                className="group relative overflow-hidden bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-12 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed transform"
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
          <div className="lg:sticky lg:top-8">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/30 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <span className="text-xl">👁️</span>
                  プレビュー
                </h3>
                <p className="text-pink-100 text-sm mt-1">
                  実際の表示イメージを確認できます
                </p>
              </div>

              <div className="p-6">
                <div className="transform scale-90 origin-top">
                  <PriorityAdComponent />
                </div>
              </div>

              <div className="bg-gray-50/80 p-4 border-t border-gray-200/50">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-pink-500 rounded-full" />
                    <span>記事一覧ページの専用枠で優先表示</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-rose-500 rounded-full" />
                    <span>審査不要で即座に配信開始</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    <span>クリック後1時間非表示</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}