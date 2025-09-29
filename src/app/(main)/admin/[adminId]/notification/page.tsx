// src/app/(main)/admin/[adminId]/notification/page.tsx
import NotificationFilterForm from "@/components/notification/list/NotificationFilterForm";
import NotificationListSkeleton from "@/components/notification/list/NotificationListSkeleton";
import NotificationList from "@/components/notification/list/NotificationList";
import { NotificationType, NotificationSortOrder, NotificationReadStatus } from "@/lib/types/notification/notificationTypes";
import { dangerousCharToSpace } from "@/lib/seculity/validation";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";

const AdminNotificationPage = async(
    props:{
        params: Promise<{ adminId: string }>
        searchParams: Promise<{ [key: string]: string | undefined }>
    }
) => {
    const resolvedParams = await props.params;
    const adminId = Number(resolvedParams.adminId)
    if (!adminId || isNaN(adminId) || adminId <= 0) redirect('/auth/admin');
    const searchParams = await props.searchParams;

    //////////
    //■ [ パラメーターの調整：「search,isRead,type,sort,page」 ]
    //・search
    let initialSearch = searchParams.search ? searchParams.search : "";
    if(initialSearch){
        initialSearch = dangerousCharToSpace(initialSearch.trim());//URLに含まれる危険文字を半角スペースに変換      
        initialSearch = initialSearch.replace(/\%20/g, ' ').replace(/　/g, ' ').replace(/ +/g, ' ');//「%20,全角スペース,連続する半角スペース」→「半角スペース」
    }

    //・isRead
    const initialIsRead = searchParams.isRead;
    const isRead: NotificationReadStatus = 
        initialIsRead !== 'true' && initialIsRead !== 'false' && initialIsRead !== 'all'
            ? 'all'
            : initialIsRead as NotificationReadStatus;

    //・type
    const initialType = searchParams.type;
    const type: NotificationType = 
        initialType !== 'payment' && initialType !== 'advertisement' && initialType !== 'system' && initialType !== 'other'
            ? 'other'
            : initialType as NotificationType;

    //・sort
    const initialSort = searchParams.sort;
    const sort: NotificationSortOrder = initialSort !== 'asc' ? 'desc' : initialSort;

    //・page
    const page = searchParams.page && !isNaN(Number(searchParams.page)) ? Number(searchParams.page) : 1;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/40 relative overflow-hidden">
            {/* 背景装飾 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* ヘッダーセクション */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg border border-white/40">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 12a3 3 0 100-6 3 3 0 000 6z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
                            通知管理
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        システム内全通知の一覧表示・検索・編集・削除・新規作成を統合的に行えます
                    </p>
                    
                    {/* 管理者向け機能説明 */}
                    <div className="pt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-5xl mx-auto">
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">全件検索</h3>
                                <p className="text-sm text-gray-600">タイトル・内容での検索</p>
                            </div>
                            
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">編集・削除</h3>
                                <p className="text-sm text-gray-600">通知の更新・削除機能</p>
                            </div>
                            
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">一斉通知</h3>
                                <p className="text-sm text-gray-600">advertiser全員への配信</p>
                            </div>

                            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">統計・履歴</h3>
                                <p className="text-sm text-gray-600">配信状況・既読統計</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 新規作成ボタン */}
                <div className="text-center">
                    <Link
                        href={`/admin/${adminId}/notification/create`}
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-700 hover:from-purple-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 transform"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>新規通知を作成</span>
                    </Link>
                </div>

                {/* フィルターセクション */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-600 rounded-full"></div>
                        <h2 className="text-xl font-bold text-gray-900">通知を検索・絞り込み</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl overflow-hidden">
                        <div className="p-6">
                            <NotificationFilterForm
                                isRead={isRead}
                                type={type}
                                sort={sort}
                                search={initialSearch}
                            />
                        </div>
                    </div>
                </div>

                {/* 通知一覧セクション */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"></div>
                            <h2 className="text-xl font-bold text-gray-900">通知一覧</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                        </div>

                        {/* ページ情報 */}
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-700">Page {page}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl overflow-hidden">
                        <Suspense fallback={<NotificationListSkeleton />}>
                            <NotificationList
                                userType="admin"
                                userId={0}
                                advertiserId={0}
                                isRead={isRead}
                                type={type}
                                sort={sort}
                                search={initialSearch}
                                page={page}
                                path={`/admin/${adminId}/notification`}
                            />
                        </Suspense>
                    </div>
                </div>

                {/* フッター装飾 */}
                <div className="text-center pt-8">
                    <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span>通知の詳細確認・編集は各カードをクリックしてください</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* グリッド装飾 */}
            <div className="absolute inset-0 bg-grid-gray-100/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none"></div>
        </div>
    )
}
export default AdminNotificationPage;