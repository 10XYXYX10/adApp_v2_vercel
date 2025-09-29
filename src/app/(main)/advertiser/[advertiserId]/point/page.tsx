// src/app/(main)/advertiser/[advertiserId]/point/page.tsx
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import PointsDisplay from '@/components/point/advertiser/PointsDisplay'
import PaymentPolling from '@/components/payment/PaymentPolling'
import PointList from '@/components/point/list/PointList'

type Props = {
  params: Promise<{ advertiserId: string }>
}

export default async function PointPage({ params }: Props) {
  const { advertiserId } = await params
  const id = Number(advertiserId)
  if (!id || isNaN(id) || id <= 0) redirect('/auth/advertiser')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        
        {/* ヘッダーセクション */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* タイトル・残高エリア */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ポイント管理
                </h1>
                <p className="text-gray-600 mt-2">ポイント残高の確認や履歴をご覧いただけます</p>
              </div>
              
              {/* ポイント残高表示 */}
              <PointsDisplay />
            </div>

            {/* アクションボタン */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/advertiser/${id}/point/purchase`}
                className="group flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                ポイント購入
              </Link>
              
              <Link
                href={`/advertiser/${id}/ads/create`}
                className="group flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                広告作成
              </Link>
            </div>
          </div>
        </div>

        {/* メインコンテンツエリア */}
        <div className="grid xl:grid-cols-8 gap-6">
          
          {/* サイドバー（決済処理状況） */}
          <div className="xl:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-100 p-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  決済状況
                </h2>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <Suspense fallback={
                  <div className="p-4">
                    <div className="animate-pulse space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                      ))}
                    </div>
                  </div>
                }>
                  <PaymentPolling advertiserId={id} />
                </Suspense>
              </div>
            </div>
          </div>

          {/* メインコンテンツ（ポイント履歴） */}
          <div className="xl:col-span-5">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-100 p-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  ポイント履歴
                </h2>
              </div>
              
              <Suspense fallback={
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                          </div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                    ))}
                  </div>
                </div>
              }>
                <PointList advertiserId={id} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}