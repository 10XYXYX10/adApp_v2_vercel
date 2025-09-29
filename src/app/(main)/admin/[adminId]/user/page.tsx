// src/app/(main)/admin/[adminId]/user/page.tsx
import UsersFilterForm from "@/components/user/list/UsersFilterForm";
import UsersDataLoader from "@/components/user/list/UsersDataLoader";
import UsersDataSkeleton from "@/components/user/list/UsersDataSkeleton";
import { UserListSortType, UserListStatusType, UserListBusinessType } from "@/lib/types/user/userTypes";
import { dangerousCharToSpace } from "@/lib/seculity/validation";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const AdminUsersPage = async(
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
    //■ [ パラメーターの調整：「search,sort,status,businessType,page」 ]
    //・search
    let initialSearch = searchParams.search ? searchParams.search : "";
    if(initialSearch){
        initialSearch = dangerousCharToSpace(initialSearch.trim());//URLに含まれる危険文字を半角スペースに変換      
        initialSearch = initialSearch.replace(/\%20/g, ' ').replace(/　/g, ' ').replace(/ +/g, ' ');//「%20,全角スペース,連続する半角スペース」→「半角スペース」
    }

    //・sort
    const initialSort = searchParams.sort;
    const sort:UserListSortType = initialSort!='asc' ? 'desc' : initialSort;

    //・status
    const initialStatus = searchParams.status;
    const status:UserListStatusType
        = initialStatus!='active'&&initialStatus!='inactive'
            ? ''
            : initialStatus
    ;

    //・businessType
    const initialBusinessType = searchParams.businessType;
    const businessType:UserListBusinessType
        = initialBusinessType!='individual'&&initialBusinessType!='corporate'
            ? ''
            : initialBusinessType
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                            ユーザー管理
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        全ユーザーの一覧表示・検索・アカウント管理を統合的に行えます
                    </p>
                    
                    {/* 管理者向け機能説明 */}
                    <div className="pt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">全件検索</h3>
                                <p className="text-sm text-gray-600">ユーザー名・メール・企業名での検索</p>
                            </div>
                            
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">アカウント制御</h3>
                                <p className="text-sm text-gray-600">有効・無効切り替え・通知機能</p>
                            </div>
                            
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/40">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">詳細情報</h3>
                                <p className="text-sm text-gray-600">事業者情報・統計データ・履歴管理</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 検索・フィルターセクション */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                        <h2 className="text-xl font-bold text-gray-900">ユーザーを検索・絞り込み</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl overflow-hidden">
                        <div className="p-6">
                            <UsersFilterForm
                                search={initialSearch}
                                sort={sort}
                                status={status}
                                businessType={businessType}
                                urlPath="./user/"
                            />
                        </div>
                    </div>
                </div>

                {/* ユーザー一覧セクション */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"></div>
                            <h2 className="text-xl font-bold text-gray-900">登録ユーザー一覧</h2>
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
                        <Suspense fallback={<UsersDataSkeleton />}>
                            <UsersDataLoader
                                search={initialSearch}
                                sort={sort}
                                status={status}
                                businessType={businessType}
                                page={page}
                                path={`/admin/${adminId}/user`}
                            />
                        </Suspense>
                    </div>
                </div>

                {/* フッター装飾 */}
                <div className="text-center pt-8">
                    <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span>各ユーザーの詳細確認・管理はカードをクリックしてください</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* グリッド装飾 */}
            <div className="absolute inset-0 bg-grid-gray-100/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none"></div>
        </div>
    )
}
export default AdminUsersPage;