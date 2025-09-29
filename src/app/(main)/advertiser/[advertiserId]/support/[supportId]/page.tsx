// src/app/(main)/advertiser/[advertiserId]/support/[supportId]/page.tsx
import SupportDetail from "@/components/support/detail/SupportDetail";
import SupportDetailSkeleton from "@/components/support/detail/SupportDetailSkeleton";
import { Suspense } from "react";

const SupportDetailPage = async( 
    props:{
        params: Promise<{ advertiserId: string, supportId: string }>
    }
) => {
    const { advertiserId, supportId } = await props.params;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-cyan-50/40 relative overflow-hidden">
            {/* 背景装飾 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-cyan-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-teal-300/10 to-emerald-300/10 rounded-full blur-3xl"></div>
            </div>

            {/* グリッド装飾 */}
            <div className="absolute inset-0 bg-grid-emerald-100/30 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none"></div>

            {/* メインコンテンツ */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-5xl mx-auto">
                    {/* ヘッダー装飾 */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-xl rounded-full px-6 py-3 shadow-xl border border-white/50">
                            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                                問い合わせ詳細
                            </span>
                        </div>
                    </div>

                    {/* メインカード */}
                    <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
                        <Suspense fallback={<SupportDetailSkeleton/>}>
                            <SupportDetail
                                userType="advertiser"
                                supportId={Number(supportId)}
                                advertiserId={Number(advertiserId)}
                            />
                        </Suspense>
                    </div>

                    {/* 浮遊装飾 */}
                    <div className="absolute top-20 left-4 w-4 h-4 bg-gradient-to-br from-emerald-400/40 to-teal-500/40 rounded-full blur-sm animate-bounce"></div>
                    <div className="absolute top-40 right-8 w-3 h-3 bg-gradient-to-br from-teal-400/40 to-cyan-500/40 rounded-full blur-sm animate-bounce" style={{animationDelay: '1s'}}></div>
                    <div className="absolute bottom-32 left-12 w-2 h-2 bg-gradient-to-br from-cyan-400/40 to-emerald-500/40 rounded-full blur-sm animate-bounce" style={{animationDelay: '2s'}}></div>
                </div>
            </div>
        </div>
    )
}

export default SupportDetailPage;