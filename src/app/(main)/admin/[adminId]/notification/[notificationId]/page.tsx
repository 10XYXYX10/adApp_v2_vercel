// src/app/(main)/admin/[adminId]/notification/[notificationId]/page.tsx
import NotificationDetail from "@/components/notification/detail/NotificationDetail";
import NotificationDetailSkeleton from "@/components/notification/detail/NotificationDetailSkeleton";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const AdminNotificationDetailPage = async( 
    props:{
        params: Promise<{ adminId: string, notificationId: string }>
    }
) => {
    const resolvedParams = await props.params;
    const adminId = Number(resolvedParams.adminId)
    const notificationId = Number(resolvedParams.notificationId)
    if (
        !adminId || isNaN(adminId) || adminId <= 0 || 
        !notificationId || isNaN(notificationId) || notificationId <= 0
    ) redirect('/auth/admin');

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50/80 via-blue-50/60 to-indigo-50/40 relative overflow-hidden">
            {/* 背景装飾 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
            </div>

            {/* グリッド装飾 */}
            <div className="absolute inset-0 bg-grid-purple-100/30 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none"></div>

            {/* メインコンテンツ */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* ヘッダー装飾 */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-xl rounded-full px-6 py-3 shadow-xl border border-white/50">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 12a3 3 0 100-6 3 3 0 000 6z" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                                通知詳細管理
                            </span>
                        </div>
                    </div>

                    {/* メインカード */}
                    <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
                        <Suspense fallback={<NotificationDetailSkeleton/>}>
                            <NotificationDetail
                                notificationId={Number(notificationId)}
                                advertiserId={0}
                                adminId={Number(adminId)}
                            />
                        </Suspense>
                    </div>

                    {/* 浮遊装飾 */}
                    <div className="absolute top-20 left-4 w-4 h-4 bg-gradient-to-br from-purple-400/40 to-blue-500/40 rounded-full blur-sm animate-bounce"></div>
                    <div className="absolute top-40 right-8 w-3 h-3 bg-gradient-to-br from-blue-400/40 to-indigo-500/40 rounded-full blur-sm animate-bounce" style={{animationDelay: '1s'}}></div>
                    <div className="absolute bottom-32 left-12 w-2 h-2 bg-gradient-to-br from-indigo-400/40 to-purple-500/40 rounded-full blur-sm animate-bounce" style={{animationDelay: '2s'}}></div>
                </div>
            </div>
        </div>
    )
}
export default AdminNotificationDetailPage;