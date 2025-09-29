// src/app/(main)/advertiser/[advertiserId]/point/[pointId]/page.tsx
import PointDetail from "@/components/point/detail/PointDetail";
import PointDetailSkeleton from "@/components/point/detail/PointDetailSkeleton";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const AdvertiserPointDetailPage = async( 
    props:{
        params: Promise<{ advertiserId: string, pointId: string }>
    }
) => {
    const resolvedParams = await props.params;
    const advertiserId = Number(resolvedParams.advertiserId)
    const pointId = Number(resolvedParams.pointId)
    
    if (
        !advertiserId || isNaN(advertiserId) || advertiserId < 0 ||
        !pointId || isNaN(pointId) || pointId <= 0 
    ) redirect('/auth/advertiser');

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50/80 via-emerald-50/60 to-cyan-50/40 relative overflow-hidden">
            {/* 背景装飾 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-teal-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-300/10 to-green-300/10 rounded-full blur-3xl"></div>
            </div>

            {/* グリッド装飾 */}
            <div className="absolute inset-0 bg-grid-green-100/30 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none"></div>

            {/* メインコンテンツ */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-5xl mx-auto">
                    {/* ヘッダー装飾 */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-xl rounded-full px-6 py-3 shadow-xl border border-white/50">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                                ポイント取引詳細
                            </span>
                        </div>
                    </div>

                    {/* メインカード */}
                    <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
                        <Suspense
                            fallback={<PointDetailSkeleton/>}
                        >
                            <PointDetail
                                pointId={pointId}
                                advertiserId={advertiserId}
                            />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AdvertiserPointDetailPage;