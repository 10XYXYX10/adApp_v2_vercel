// src/app/(main)/advertiser/[advertiserId]/ad/[adId]/page.tsx
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { TrendingUp, BarChart3, Settings, AlertCircle } from 'lucide-react'
import AdDetailDataLoader from '@/components/ad/detail/AdDetailDataLoader'
import AdDetailSkeleton from '@/components/ad/detail/AdDetailSkeleton'
import Link from 'next/link'



export default async function AdDetailPage({
  params
}:{
  params: Promise<{
    advertiserId: string
    adId: string
  }>
}) {
  const resolvedParams = await params
  const advertiserId = Number(resolvedParams.advertiserId)
  const adId = Number(resolvedParams.adId)

  //////////
  //■[ パラメータバリデーション ]
  if (!advertiserId || isNaN(advertiserId) || advertiserId <= 0) {
    redirect('/auth/advertiser')
  }
  if (!adId || isNaN(adId) || adId <= 0) {
    redirect(`/advertiser/${advertiserId}/ad`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* 背景装飾エフェクト */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-violet-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse" />
        
        {/* 動的なパーティクル効果 */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-emerald-400/30 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }} />
      </div>

      <div className="relative z-10">
        {/* ヘッダーセクション */}
        <header className="backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* 左側：タイトルエリア */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                      広告詳細
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base mt-1">
                      パフォーマンス分析と設定管理
                    </p>
                  </div>
                </div>

                {/* ナビゲーションパン屑 */}
                <nav className="flex items-center gap-2 text-sm text-gray-600" aria-label="パンくずナビゲーション">
                  <Link 
                    href={`/advertiser/${advertiserId}`}
                    className="hover:text-blue-600 transition-colors duration-200 flex items-center gap-1"
                  >
                    <Settings className="w-4 h-4" />
                    ダッシュボード
                  </Link>
                  <span className="text-gray-400">/</span>
                  <Link 
                    href={`/advertiser/${advertiserId}/ad`}
                    className="hover:text-blue-600 transition-colors duration-200 flex items-center gap-1"
                  >
                    <TrendingUp className="w-4 h-4" />
                    広告一覧
                  </Link>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-900 font-medium flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" />
                    広告詳細
                  </span>
                </nav>
              </div>

              {/* 右側：クイックアクション */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/advertiser/${advertiserId}/ad/create`}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">新しい広告を作成</span>
                  <span className="sm:hidden">新規作成</span>
                </Link>
                
                <Link
                  href={`/advertiser/${advertiserId}/ad`}
                  className="inline-flex items-center justify-center gap-2 bg-white/70 hover:bg-white/90 text-gray-700 px-4 py-2.5 rounded-xl font-medium border border-white/50 hover:border-gray-200 transition-all duration-300 backdrop-blur-sm"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">広告一覧に戻る</span>
                  <span className="sm:hidden">一覧</span>
                </Link>
              </div>
            </div>

            {/* リアルタイム状況インジケーター */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-green-50/70 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border border-green-200/50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>リアルタイム更新中</span>
              </div>
              
              <div className="flex items-center gap-2 bg-blue-50/70 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border border-blue-200/50">
                <TrendingUp className="w-3 h-3" />
                <span>データ同期済み</span>
              </div>

              <div className="flex items-center gap-2 bg-purple-50/70 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border border-purple-200/50">
                <AlertCircle className="w-3 h-3" />
                <span>24時間監視中</span>
              </div>
            </div>
          </div>
        </header>

        {/* メインコンテンツエリア */}
        <main className="container mx-auto px-4 py-8">
          {/* データローディングとSuspense */}
          <Suspense fallback={<AdDetailSkeleton />}>
            <AdDetailDataLoader 
              userId={advertiserId}
              adId={adId}
              isAdmin={false}
            />
          </Suspense>

        </main>
      </div>
    </div>
  )
}
