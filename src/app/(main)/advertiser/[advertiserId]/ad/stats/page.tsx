//「src/app/(main)/advertiser/[advertiserId]/ad/page.tsx」
import UserStatsDataLoader from "@/components/ad/stats/UserStatsDataLoader";
import UserStatsSkeleton from "@/components/ad/stats/UserStatsSkeleton";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const AdsStatsPage = async(
    props:{
        params: Promise<{ advertiserId: string }>
    }
 ) => {
    const resolvedParams = await props.params
    const advertiserId = Number(resolvedParams.advertiserId)
    //////////
    //■[ パラメータバリデーション ]
    if (!advertiserId || isNaN(advertiserId) || advertiserId <= 0) redirect('/auth/advertiser');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/40 relative overflow-hidden">
            {/* 背景装飾 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* ヘッダーセクション */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg border border-white/40">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                            パフォーマンス統計
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        全広告のパフォーマンスを月別で分析し、効果的な広告戦略を立案しましょう
                    </p>
                    {/* 新規作成 & 広告一覧確認 ボタンエリア */}
                    <div className="pt-4">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href={`/advertiser/${advertiserId}/ads/create`}>
                                <button className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/30 hover:-translate-y-1">
                                    ✨ 新しい広告を作成する
                                </button>
                            </Link>
                            <Link href={`/advertiser/${advertiserId}/ads`}>
                                <button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/30 hover:-translate-y-1">
                                    📋 広告一覧を確認する
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 統計セクション */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                        <h2 className="text-xl font-bold text-gray-900">月別データ分析</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                    </div>
                    
                    <Suspense fallback={<UserStatsSkeleton/>}>
                        <UserStatsDataLoader advertiserId={Number(advertiserId)} />
                    </Suspense>
                </div>
            </div>

            {/* グリッド装飾 */}
            <div className="absolute inset-0 bg-grid-gray-100/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none"></div>
        </div>
    )
}

export default AdsStatsPage;
