// src/app/(main)/admin/[adminId]/support/[supportId]/page.tsx
import SupportDetail from "@/components/support/detail/SupportDetail";
import SupportDetailSkeleton from "@/components/support/detail/SupportDetailSkeleton";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const AdminSupportDetailPage = async( 
    props:{
        params: Promise<{ adminId: string, supportId: string }>
    }
) => {
    const resolvedParams = await props.params;
    const adminId = Number(resolvedParams.adminId)
    const supportId = Number(resolvedParams.supportId)
    if (
        !adminId || isNaN(adminId) || adminId <= 0 ||
        !supportId || isNaN(supportId) || supportId <= 0 
    ) redirect('/auth/advertiser');

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-cyan-50/40 relative overflow-hidden">
            {/* 背景装飾 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-300/10 to-blue-300/10 rounded-full blur-3xl"></div>
            </div>

            {/* グリッド装飾 */}
            <div className="absolute inset-0 bg-grid-blue-100/30 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none"></div>

            {/* メインコンテンツ */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-5xl mx-auto">
                    {/* ヘッダー装飾 */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-xl rounded-full px-6 py-3 shadow-xl border border-white/50">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                                サポート詳細管理
                            </span>
                        </div>
                    </div>

                    {/* メインカード */}
                    <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
                        <Suspense fallback={<SupportDetailSkeleton/>}>
                            <SupportDetail
                                userType="admin"
                                supportId={Number(supportId)}
                                advertiserId={0} // 修正：admin判定用に0を指定
                                isAdmin={true} // 修正：admin表示モード
                            />
                        </Suspense>
                    </div>

                    {/* 浮遊装飾 */}
                    <div className="absolute top-20 left-4 w-4 h-4 bg-gradient-to-br from-blue-400/40 to-indigo-500/40 rounded-full blur-sm animate-bounce"></div>
                    <div className="absolute top-40 right-8 w-3 h-3 bg-gradient-to-br from-indigo-400/40 to-cyan-500/40 rounded-full blur-sm animate-bounce" style={{animationDelay: '1s'}}></div>
                    <div className="absolute bottom-32 left-12 w-2 h-2 bg-gradient-to-br from-cyan-400/40 to-blue-500/40 rounded-full blur-sm animate-bounce" style={{animationDelay: '2s'}}></div>
                </div>
            </div>
        </div>
    )
}
export default AdminSupportDetailPage;