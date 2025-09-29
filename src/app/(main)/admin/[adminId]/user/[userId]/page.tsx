// src/app/(main)/admin/[adminId]/user/[userId]/page.tsx
import UserDetail from "@/components/user/detail/UserDetail";
import UserDetailSkeleton from "@/components/user/detail/UserDetailSkeleton";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const AdminUserDetailPage = async( 
    props:{
        params: Promise<{ adminId: string, userId: string }>
    }
) => {
    const resolvedParams = await props.params;
    const adminId = Number(resolvedParams.adminId)
    const userId = Number(resolvedParams.userId)
    if (
        !adminId || isNaN(adminId) || adminId <= 0 ||
        !userId || isNaN(userId) || userId <= 0 
    ) redirect('/auth/admin');

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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                                ユーザー詳細管理
                            </span>
                        </div>
                    </div>

                    {/* メインカード */}
                    <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
                        <Suspense
                            fallback={<UserDetailSkeleton/>}
                        >
                            <UserDetail
                                userId={userId}
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
export default AdminUserDetailPage;