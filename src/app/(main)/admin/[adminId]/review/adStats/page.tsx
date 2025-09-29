// src/app/(main)/admin/[adminId]/review/adStats/page.tsx

import UserStatsSkeleton from "@/components/ad/stats/UserStatsSkeleton";
import UserStatsDataLoader from "@/components/ad/stats/UserStatsDataLoader";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const AdminAdStatsPage = async(
    props:{
        params: Promise<{ adminId: string }>
    }
 ) => {
    const resolvedParams = await props.params
    const adminId = Number(resolvedParams.adminId)
    //////////
    //■[ パラメータバリデーション ]
    if (!adminId || isNaN(adminId) || adminId <= 0) redirect('/auth/admin');

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
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                            広告統計分析
                        </h1>
                        <div className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            ADMIN
                        </div>
                    </div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        全ユーザーの広告パフォーマンスを月別で分析し、プラットフォーム全体の成長指標を把握しましょう
                    </p>
                </div>

                {/* 統計セクション */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                        <h2 className="text-xl font-bold text-gray-900">プラットフォーム統計</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                    </div>               
                    <Suspense fallback={<UserStatsSkeleton/>}>
                        <UserStatsDataLoader advertiserId={0} />
                    </Suspense>
                </div>
            </div>

            {/* グリッド装飾 */}
            <div className="absolute inset-0 bg-grid-gray-100/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none"></div>
        </div>
    )
}
export default AdminAdStatsPage;