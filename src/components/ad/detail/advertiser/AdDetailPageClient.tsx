'use client'
// src/components/ad/detail/advertiser/AdDetailPageClient.tsx
import Link from 'next/link'
import { useUpdateAmount } from '@/hooks/point/useUpdateAmount'
import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { AlertCircle, RefreshCw, TrendingUp, Settings, Eye, MousePointer, DollarSign, Wallet, Coins } from 'lucide-react'

import { AdvertisementDetail } from '@/lib/types/ad/adTypes'

import SpinnerModal from '@/components/SpinnerModal'
import AdOverviewCard from '../AdOverviewCard' //L617
import AdTypeSpecificContent from '../AdTypeSpecificContent'  //L636
import AdStatsOverview from '../stats/AdStatsOverview' //L655

import { getAdTotals } from '@/actions/ad/adStatsActions'
import { updateAdStatus, updateAdBudget, deleteAd, getAdDetail } from '@/actions/ad/adDetailActions'



export default function AdDetailPageClient({
  advertiserId, 
  advertisement, 
}:{
  advertiserId: number
  advertisement: AdvertisementDetail
}) {
  const router = useRouter()
  const updateAmount = useUpdateAmount()
  //////////
  //■[ メインステート管理 ]
  const [adState, setAdState] = useState<AdvertisementDetail>(advertisement);
  const [error,setError] = useState('');
  const [isLoading,setIsLoading] = useState(false);

  const [statsData, setStatsData] = useState({
    totalImpressions: 0,
    totalClicks: 0,
  })

  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [budgetAmount, setBudgetAmount] = useState(100)

  //////////
  //■[ 統計データ更新 ]
  useEffect(() => {
    let isMounted = true; // アンマウント後に setState しないためのフラグ
    const updateStatsData = async () => {
      try {
        const {data} = await getAdTotals(advertisement.id);
        if (isMounted && data){
          setStatsData({totalImpressions:data.totalImpressions, totalClicks:data.totalClicks});
          setAdState({...adState,remainingBudget:data.remainingBudget_number})
        }
      } catch (error) {
        console.error('Failed to fetch ad totals:', error);
      }
    };
    // 初回実行
    updateStatsData();
    // // 90秒(=90,000ms)ごとに定期実行
    // const intervalId = window.setInterval(updateStatsData, 90_000);

    // クリーンアップ
    return () => {
      isMounted = false;
      //clearInterval(intervalId);
    };
  }, []);

  
  //////////
  //■[ 予算追加モーダル処理 ]
  const handleBudgetModalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (budgetAmount < 100) {
      alert('最小入力値は100ポイントです')
      return
    }
    if (budgetAmount > adState.user.amount) {
      alert('残高が足りません')
      return
    }
    setShowBudgetModal(false)
    handleBudgetUpdate('add', budgetAmount)
    setBudgetAmount(100) // リセット
  }


    //////////
    //■[ 広告予算更新 ]
    const handleBudgetUpdate = async (operation: 'add' | 'subtract', amount: number) => {
        //////////
        //・事前バリデーション：残高チェック（追加の場合のみ）
        if (operation === 'add' && amount > adState.user.amount) {
            alert('残高が足りません')
            return
        }
        setIsLoading(true)
        setError('');

        try {
          alert('updateAdBudget')
            const result = await updateAdBudget(adState.id, operation, amount)
            if (result.statusCode === 401) {
                router.push('/auth/advertiser');
                return
            } else if (!result.success || !result.data) {
                throw new Error(result.errMsg)
            }
            //////////
            //・広告情報＆store.user更新
            setAdState(result.data);
            console.log(JSON.stringify(result.data))
            updateAmount(Number(result.data.user.amount));
            alert('Success.')
        } catch (err) {
            console.log(err instanceof Error && err.message);
            alert('予算更新中にエラーが発生しました')
            setError('予算更新中にエラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    }

    //////////
    //■[ 広告ステータス更新（停止/再開用） ]
    const handleStatusUpdate = async (newStatus: 'active' | 'paused') => {
      if(isLoading)return;
      setIsLoading(true);
      setError('');
      try {
          const result = await updateAdStatus(adState.id, newStatus)
          if (result.statusCode === 401) {
              router.push('/auth/advertiser')
              return
          } else if (!result.success || !result.data) {
              throw new Error(result.errMsg)
          }
          setAdState(result.data)
          alert('Success.')
      } catch (err) {
          console.log(err instanceof Error && err.message);
          alert('ステータス更新中にエラーが発生しました')
          setError('ステータス更新中にエラーが発生しました');
      } finally {
          setIsLoading(false);
      }
  }

    //////////
    //■[ 広告削除 ]
    const handleDelete = async () => {
        setIsLoading(true);
        setError('');
        try {
            const result = await deleteAd(adState.id)
            if (result.statusCode === 401) {
                router.push('/auth/advertiser')
                return
            } else if (!result.success || !result.updatedAmount) {
                throw new Error(result.errMsg ? result.errMsg : 'Somethin went wrong.')
            }
            updateAmount(Number(result.updatedAmount));
            // 削除成功時は広告一覧ページに遷移
            router.push(`/advertiser/${advertiserId}/ad`)
        } catch (err) {
            console.log(err instanceof Error && err.message);
            alert('広告削除中にエラーが発生しました')
            setError('広告削除中にエラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    }

    //////////
    //■[ リフレッシュ機能 ]
    const handleRefresh = async () => {
        setRefreshTrigger(prev => prev + 1)
        setIsLoading(true)
        setError('')
        try {
            const result = await getAdDetail(adState.id)
            if (result.statusCode === 401) {
                router.push('/auth/advertiser')
                return
            } else if (!result.success || !result.data) {
                throw new Error(result.errMsg)
            }
            setAdState(result.data)
        } catch (err) {
                console.log(err instanceof Error && err.message);
                alert('データ更新中にエラーが発生しました');
                setError('データ更新中にエラーが発生しました');
        } finally {
            setIsLoading(false)
        }
    }

  //////////
  //■[ 広告タイプ別設定 ]
  const adTypeConfig = useMemo(() => {
    const configs = {
      priority: {
        title: '動画記事優先表示',
        icon: '🎯',
        gradient: 'from-pink-500 to-rose-600',
        description: '記事一覧で優先表示される広告',
        category: 'プロモーション'
      },
      overlay: {
        title: 'オーバーレイ広告',
        icon: '📺',
        gradient: 'from-blue-500 to-cyan-600',
        description: '動画プレイヤー上に表示される広告',
        category: 'インタラクティブ'
      },
      preroll: {
        title: 'プレロール広告',
        icon: '🎬',
        gradient: 'from-purple-500 to-violet-600',
        description: '動画再生前に表示される広告',
        category: 'ビデオ'
      },
      'youtube-short': {
        title: 'YouTube Short広告',
        icon: '📹',
        gradient: 'from-red-500 to-pink-600',
        description: 'YouTube動画の再生数向上',
        category: 'ソーシャル'
      },
      'youtube-long': {
        title: 'YouTube Long広告',
        icon: '🎥',
        gradient: 'from-orange-500 to-red-600',
        description: 'より長時間のYouTube広告',
        category: 'ソーシャル'
      }
    }
    return configs[adState.adType]
  }, [adState.adType])

  //////////
  //■[ ステータス設定 ]
  const statusConfig = useMemo(() => {
    const configs = {
      draft: { label: '下書き', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-700' },
      pending: { label: '審査中', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
      approved: { label: '承認済み', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-700' },
      rejected: { label: '却下', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-700' },
      active: { label: '配信中', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
      paused: { label: '一時停止', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-700' }
    }
    return configs[adState.status as keyof typeof configs] || configs.draft
  }, [adState.status])

  //////////
  //■[ アクションボタンの表示制御 ]
  const actionButtonsConfig = useMemo(() => {
    const status = adState.status
    const canToggleStatus = ['active', 'paused'].includes(status)
    const canDelete = !['deleted'].includes(status)
    const canUpdateBudget = !['rejected', 'deleted'].includes(status)

    return {
      canToggleStatus,
      canDelete,
      canUpdateBudget,
      currentAction: status === 'active' ? 'pause' : 'activate'
    }
  }, [adState.status])

  return (
    <div className="space-y-8">
      {isLoading && <SpinnerModal/>}
      {/* グローバルエラー表示 */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50/70 backdrop-blur-xl border border-red-200 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-700 font-medium text-sm">エラーが発生しました</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={() => setAdState(prev => ({ ...prev, error: null }))}
                className="ml-auto text-red-400 hover:text-red-600 transition-colors"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ヘッダーセクション */}
      <section>
        <motion.div
          className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* ヘッダー */}
          <div className={`bg-gradient-to-r ${adTypeConfig.gradient} p-6 relative overflow-hidden`}>
            {/* 装飾的背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* 左側：基本情報 */}
                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {adTypeConfig.icon}
                  </motion.div>
                  
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                      {adTypeConfig.title}
                    </h1>
                    <p className="text-white/90 text-sm sm:text-base">
                      {adTypeConfig.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-white/80 text-sm">
                        ID: #{adState.id}
                      </span>
                      <div className={`${statusConfig.bgColor} ${statusConfig.textColor} px-2 py-1 rounded-full text-xs font-medium`}>
                        {statusConfig.label}
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
                        {adTypeConfig.category}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 右側：アクション */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl font-medium backdrop-blur-sm border border-white/30 transition-all duration-300 disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">更新</span>
                  </motion.button>
                  
                  <a
                    href={`/advertiser/${advertiserId}/ad`}
                    className="inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl font-medium backdrop-blur-sm border border-white/30 transition-all duration-300"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span className="hidden sm:inline">広告一覧</span>
                  </a>
                </div>
              </div>

              {/* 最終更新時間 */}
              <div className="mt-4 text-white/70 text-sm">
                最終更新: {adState.updatedAt.toLocaleString('ja-JP')}
              </div>
            </div>
          </div>

          {/* 基本メトリクス（シンプル表示） */}
          <div className="p-6">
            {/* ユーザー残高表示 */}
            <motion.div 
              className="mb-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-200/50"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Wallet className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">現在の残高</h3>
                    <p className="text-gray-600 text-sm">利用可能ポイント</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <motion.div 
                    className="text-2xl sm:text-3xl font-bold text-emerald-600"
                    key={adState.user.amount} // キー変更でアニメーション発火
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {adState.user.amount.toLocaleString()}P
                  </motion.div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <Coins className="w-3 h-3" />
                    <span>ポイント残高</span>
                  </div>
                </div>
              </div>

              {/* 残高ステータスインジケーター */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {adState.user.amount >= 10000 ? (
                    <>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-emerald-700 font-medium text-sm">十分な残高</span>
                    </>
                  ) : adState.user.amount >= 1000 ? (
                    <>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                      <span className="text-yellow-700 font-medium text-sm">残高注意</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-red-700 font-medium text-sm">残高不足</span>
                    </>
                  )}
                </div>
                
                <Link 
                  href={`/advertiser/${advertiserId}/point/purchase`}
                  className="inline-flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105"
                >
                  <Coins className="w-3 h-3" />
                  ポイント購入
                </Link>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/40 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <div className="text-gray-600 text-sm">総予算</div>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {adState.budget.toLocaleString()}P
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/40 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <div className="text-gray-600 text-sm">残り予算</div>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {adState.remainingBudget.toLocaleString()}P
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/40 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-purple-600" />
                  <div className="text-gray-600 text-sm">総表示数</div>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {statsData.totalImpressions ? statsData.totalImpressions.toLocaleString() : '...'}
                </div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/40 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MousePointer className="w-4 h-4 text-orange-600" />
                  <div className="text-gray-600 text-sm">総クリック数</div>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {statsData.totalClicks ? statsData.totalClicks.toLocaleString() : '...'}
                </div>
              </div>
            </div>
          </div>

          {/* クイックアクションエリア */}
          <div className="p-6 pt-0">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-2xl p-4 border border-gray-200/50">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                クイックアクション
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* ステータス切り替えボタン */}
                {actionButtonsConfig.canToggleStatus && (
                  <motion.button
                    onClick={() => handleStatusUpdate(
                      actionButtonsConfig.currentAction === 'pause' ? 'paused' : 'active'
                    )}
                    disabled={isLoading}
                    className={`
                      inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 
                      ${
                        actionButtonsConfig.currentAction === 'pause'
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {actionButtonsConfig.currentAction === 'pause' ? '⏸️' : '▶️'}
                    <span className="text-sm">
                      {actionButtonsConfig.currentAction === 'pause' ? '一時停止' : '再開'}
                    </span>
                  </motion.button>
                )}

                {/* 予算追加ボタン（モーダル版） */}
                {actionButtonsConfig.canUpdateBudget && (
                  <motion.button
                    onClick={() => {
                      if(adState.status==='pending')return alert('＜現在審査/確認中＞\nそのアクションは実行できません🙇‍♀️')
                      setShowBudgetModal(true)
                    }}
                    disabled={isLoading || adState.user.amount < 100}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                      adState.user.amount < 100 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50'
                    }`}
                    whileHover={adState.user.amount >= 100 ? { scale: 1.02 } : {}}
                    whileTap={adState.user.amount >= 100 ? { scale: 0.98 } : {}}
                  >
                    💰
                    <span className="text-sm">
                      {adState.user.amount < 100 ? '残高不足' : '予算追加'}
                    </span>
                  </motion.button>
                )}

                {/* 削除ボタン */}
                {actionButtonsConfig.canDelete && (
                  <motion.button
                    onClick={() => {
                      if(adState.status==='pending')return alert('＜現在審査/確認中＞\nそのアクションは実行できません🙇‍♀️')
                      if (window.confirm('広告を削除しますか？この操作は取り消せません。')) {
                        handleDelete()
                      }
                    }}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🗑️
                    <span className="text-sm">削除</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 詳細統計セクション */}
      <section>
        <AdOverviewCard 
          advertisement={adState}
        />
      </section>

      {/* メインコンテンツセクション */}
      <section className="space-y-8">
        {/* 広告タイプ別コンテンツ */}
        <motion.div
          className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            広告コンテンツ
          </h2>
          <AdTypeSpecificContent 
            advertisement={adState}
            refreshTrigger={refreshTrigger}
          />

        </motion.div>

        {/* 統計グラフ */}
        <motion.div
          className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            パフォーマンス統計
          </h2>
          <AdStatsOverview
            adId={advertisement.id}
            refreshTrigger={refreshTrigger}
          />
          
        </motion.div>
      </section>
      
      {/* 予算追加モーダル */}
      <AnimatePresence>
        {showBudgetModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBudgetModal(false)}
          >
            <motion.div
              className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl max-w-md w-full mx-4"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 32 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* モーダルヘッダー */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">予算を追加</h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowBudgetModal(false)}
                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* モーダルコンテンツ */}
              <form onSubmit={handleBudgetModalSubmit} className="p-6">
                <div className="space-y-6">
                  {/* 現在の残高表示 */}
                  <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/50">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-700 font-medium text-sm">現在の残高</span>
                      <span className="text-emerald-600 font-bold text-lg">
                        {adState.user.amount.toLocaleString()}P
                      </span>
                    </div>
                  </div>

                  {/* 金額入力 */}
                  <div className="space-y-3">
                    <label className="block text-gray-700 font-medium text-sm">
                      追加するポイント数
                    </label>
                    <div className="relative">
                      {/* {数値が記入しずら過ぎ} */}
                      <input
                        type="number"
                        min="100"
                        max={adState.user.amount}
                        value={budgetAmount}
                        onChange={(e) => setBudgetAmount(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-2xl text-center text-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="100"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                        P
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span className='text-red-500'>最小: 100P</span>
                      <span>最大: {adState.user.amount.toLocaleString()}P</span>
                    </div>
                  </div>

                  {/* クイック選択ボタン */}
                  <div className="space-y-2">
                    <span className="text-sm text-gray-600">クイック選択</span>
                    <div className="grid grid-cols-4 gap-2">
                      {[100, 500, 1000, 5000].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setBudgetAmount(Math.min(amount, adState.user.amount))}
                          disabled={amount > adState.user.amount}
                          className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                            amount > adState.user.amount
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : budgetAmount === amount
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {amount}P
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 確認メッセージ */}
                  <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200/50">
                    <div className="text-blue-700 text-sm text-center">
                      <strong>{budgetAmount.toLocaleString()}P</strong> を広告予算に追加します
                      <br />
                      <span className="text-blue-600">
                        残高: {(adState.user.amount - budgetAmount).toLocaleString()}P
                      </span>
                    </div>
                  </div>
                </div>

                {/* ボタン */}
                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowBudgetModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-medium transition-all"
                  >
                    キャンセル
                  </button>
                  <motion.button
                    type="submit"
                    disabled={budgetAmount < 100 || budgetAmount > adState.user.amount}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    追加する
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}