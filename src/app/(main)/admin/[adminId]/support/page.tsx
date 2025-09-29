// src/app/(main)/admin/[adminId]/support/page.tsx
import SupportFilterForm from "@/components/support/list/SupportFilterForm";
import SupportList from "@/components/support/list/SupportList";
import SupportListSkeleton from "@/components/support/list/SupportListSkeleton";
import { SupportListSortType, SupportListStatusType, SupportListCategoryType } from "@/lib/types/support/supportTypes";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const AdminSupportPage = async(
    props:{
        params: Promise<{ adminId: string }>
        searchParams: Promise<{ [key: string]: string | undefined }>
    }
) => {
    const resolvedParams = await props.params;
    const adminId = Number(resolvedParams.adminId)
    const searchParams = await props.searchParams;
    if (!adminId || isNaN(adminId) || adminId <= 0) redirect('/auth/admin');

    //////////
    //■[ パラメーターの調整：「sort,status,category,page」 ]
    //・sort
    const initialSort = searchParams.sort;
    const sort:SupportListSortType = initialSort!='asc' ? 'desc' : initialSort;

    //・status
    const initialStatus = searchParams.status;
    const status:SupportListStatusType
        = initialStatus!='open'&&initialStatus!='in_progress'&&initialStatus!='closed'
            ? ''
            : initialStatus
    ;

    //・category
    const initialCategory = searchParams.category;
    const category:SupportListCategoryType
        = initialCategory!='payment'&&initialCategory!='advertisement'&&initialCategory!='technical'&&initialCategory!='other'
            ? ''
            : initialCategory
    ;

    //・page
    const page = searchParams.page && !isNaN(Number(searchParams.page))  ? Number(searchParams.page) : 1;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 relative overflow-hidden">
            {/* 背景装飾 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* ヘッダーセクション */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg border border-white/40">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                            サポート管理
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        全ユーザーからのお問い合わせを確認・対応できます。迅速な対応でユーザー満足度を向上させましょう
                    </p>
                    
                    {/* 管理者向け機能説明 */}
                    <div className="pt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">全件管理</h3>
                                <p className="text-sm text-gray-600">全ユーザーのサポート一覧表示・管理</p>
                            </div>
                            
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">迅速対応</h3>
                                <p className="text-sm text-gray-600">リアルタイム返信・ステータス管理</p>
                            </div>
                            
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">ユーザー情報</h3>
                                <p className="text-sm text-gray-600">詳細なユーザー情報・履歴確認</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* フィルターセクション */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                        <h2 className="text-xl font-bold text-gray-900">サポートを絞り込み</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl overflow-hidden">
                        <div className="p-6">
                            <SupportFilterForm
                                sort={sort}
                                status={status}
                                category={category}
                                urlPath="./support/"
                            />
                        </div>
                    </div>
                </div>

                {/* サポート一覧セクション */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"></div>
                            <h2 className="text-xl font-bold text-gray-900">全ユーザーサポート一覧</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                        </div>

                        {/* ページ情報 */}
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-700">Page {page}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl overflow-hidden">
                        <Suspense fallback={<SupportListSkeleton />}>
                            <SupportList
                                advertiserId={0} // admin判定用: 0を指定
                                sort={sort}
                                status={status}
                                category={category}
                                page={page}
                                path={`/admin/${adminId}/support`}
                                isAdmin={true} // admin表示モード
                            />
                        </Suspense>
                    </div>
                </div>

                {/* フッター装飾 */}
                <div className="text-center pt-8">
                    <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span>各サポートの詳細確認・返信はカードをクリックしてください</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* グリッド装飾 */}
            <div className="absolute inset-0 bg-grid-gray-100/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none"></div>
        </div>
    )
}
export default AdminSupportPage;