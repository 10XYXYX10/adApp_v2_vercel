// src/app/(main)/admin/[adminId]/notification/create/page.tsx
import NotificationCreateForm from "@/components/notification/create/NotificationCreateForm";
import { redirect } from "next/navigation";

const NotificationCreatePage = async( 
    props:{
        params: Promise<{ adminId: string }>
    }
) => {
    const resolvedParams = await props.params;
    const adminId = Number(resolvedParams.adminId);
    if (!adminId || isNaN(adminId) || adminId <= 0) redirect('/auth/admin');

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50/80 via-blue-50/60 to-indigo-50/40 relative overflow-hidden">
            {/* 背景装飾 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                                一斉通知作成
                            </span>
                        </div>
                        <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
                            全advertiserユーザーに重要なお知らせを一斉配信できます。送信前に内容をよくご確認ください。
                        </p>
                    </div>

                    {/* 機能説明カード */}
                    <div className="mb-8">
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1">全ユーザー配信</h3>
                                    <p className="text-sm text-gray-600">有効なadvertiserユーザー全員に配信</p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 12a3 3 0 100-6 3 3 0 000 6z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1">即座に反映</h3>
                                    <p className="text-sm text-gray-600">送信後すぐにユーザーに表示</p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1">メール連携</h3>
                                    <p className="text-sm text-gray-600">システム通知+メール配信（予定）</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* メインフォーム */}
                    <NotificationCreateForm
                        adminId={adminId}
                    />

                    {/* 浮遊装飾 */}
                    <div className="absolute top-20 left-4 w-4 h-4 bg-gradient-to-br from-purple-400/40 to-blue-500/40 rounded-full blur-sm animate-bounce"></div>
                    <div className="absolute top-40 right-8 w-3 h-3 bg-gradient-to-br from-blue-400/40 to-indigo-500/40 rounded-full blur-sm animate-bounce" style={{animationDelay: '1s'}}></div>
                    <div className="absolute bottom-32 left-12 w-2 h-2 bg-gradient-to-br from-indigo-400/40 to-purple-500/40 rounded-full blur-sm animate-bounce" style={{animationDelay: '2s'}}></div>
                    <div className="absolute bottom-20 right-16 w-5 h-5 bg-gradient-to-br from-purple-300/30 to-blue-400/30 rounded-full blur-lg animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}
export default NotificationCreatePage;