// src/app/(main)/admin/[adminId]/review/page.tsx
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { dangerousCharToSpace } from "@/lib/seculity/validation";

import AdFilterForm from "@/components/ad/list/AdFilterForm";
import AdsListSkeleton from "@/components/ad/list/AdsListSkeleton";
import AdsList from "@/components/ad/list/AdList";

import { AdListAdType, AdListSortType, AdListStatusType } from "@/lib/types/ad/adListTypes";



const ReviewPage = async( 
    props:{
        params: Promise<{ adminId: string }>
        searchParams: Promise<{ [key: string]: string | undefined }>
    }
) => {
    const resolvedParams = await props.params
    const adminId = Number(resolvedParams.adminId)
    const searchParams = await props.searchParams;

    //////////
    //■[ パラメータバリデーション ]
    if (!adminId || isNaN(adminId) || adminId <= 0) redirect('/auth/admin');

    //////////
    //■[ パラメーターの調整：「search,sort,adType,status,page」 ]
    //・search
    let initialSearch = searchParams.search ? searchParams.search : "";
    if(initialSearch){
        initialSearch = dangerousCharToSpace(initialSearch.trim());//URLに含まれる危険文字を半角スペースに変換      
        initialSearch = initialSearch.replace(/\%20/g, ' ').replace(/　/g, ' ').replace(/ +/g, ' ');//「%20,全角スペース,連続する半角スペース」→「半角スペース」
    }
    //・sort
    const initialSort = searchParams.sort;
    const sort:AdListSortType = initialSort!='asc' ? 'desc' : initialSort;
    //・adType
    const initialAdType = searchParams.adType;
    const adType:AdListAdType
        = initialAdType!='priority'&&initialAdType!='overlay'&&initialAdType!='preroll'&&initialAdType!='youtube-short'&&initialAdType!='youtube-long' 
            ? '' 
            : initialAdType
    ;
    //・status
    const initialStatus = searchParams.status;
    const status:AdListStatusType
        = initialStatus!='draft'&&initialStatus!='pending'&&initialStatus!='approved'&&initialStatus!='rejected'&&initialStatus!='active'&&initialStatus!='paused'
            ? '' 
            : initialStatus
    ;
    //・page
    const page = searchParams.page && !isNaN(Number(searchParams.page))  ? Number(searchParams.page) : 1;
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-orange-50/40 relative overflow-hidden">
            {/* 背景装飾 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-amber-400/20 to-red-400/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* ヘッダーセクション */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg border border-white/40">
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-red-900 to-orange-900 bg-clip-text text-transparent">
                            広告審査ダッシュボード
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        投稿された広告を審査し、品質とガイドライン遵守を確認します
                    </p>
                    {/* 統計情報 & ショートカット ボタンエリア */}
                    <div className="pt-4">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href={`/admin/${adminId}/users`}>
                                <button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/30 hover:-translate-y-1">
                                    👥 ユーザー管理
                                </button>
                            </Link>
                            <Link href={`/admin/${adminId}/review/adStats`}>
                                <button className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/30 hover:-translate-y-1">
                                    📊 分析レポート
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 検索・フィルターセクション */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-orange-600 rounded-full"></div>
                        <h2 className="text-xl font-bold text-gray-900">広告を検索・フィルター</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl overflow-hidden">
                        <div className="p-6">
                            <AdFilterForm
                                search={initialSearch}
                                sort={sort}
                                adType={adType}
                                status={status}
                                urlPath="./review/"
                            />
                        </div>
                    </div>
                </div>

                {/* 広告一覧セクション */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-gradient-to-b from-amber-500 to-red-600 rounded-full"></div>
                            <h2 className="text-xl font-bold text-gray-900">審査待ち広告一覧</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                        </div>
                        
                        {/* ステータス表示 + ページ情報 */}
                        <div className="flex items-center gap-3">
                            {status === 'pending' && (
                                <div className="flex items-center gap-2 bg-yellow-100/60 backdrop-blur-sm rounded-full px-4 py-2 border border-yellow-200/50">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium text-yellow-800">審査待ち</span>
                                </div>
                            )}
                            <div className="hidden sm:flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-700">Page {page}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl overflow-hidden">
                        <Suspense fallback={<AdsListSkeleton />}>
                            <AdsList
                                search={initialSearch}
                                sort={sort}
                                adType={adType}
                                status={status}
                                page={page}
                                path={`/admin/${adminId}/review`}
                                // advertiserId は渡さない（admin用なので全ユーザーの広告を表示）
                            />
                        </Suspense>
                    </div>
                </div>

                {/* フッター装飾 */}
                <div className="text-center pt-8">
                    <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span>広告の詳細審査は各カードをクリックしてください</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* グリッド装飾 */}
            <div className="absolute inset-0 bg-grid-gray-100/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none"></div>
        </div>
    )
}
export default ReviewPage;