// src/app/(main)/advertiser/[advertiserId]/ad/page.tsx
import AdsList from "@/components/ad/list/AdList";
import AdsListSkeleton from "@/components/ad/list/AdsListSkeleton";
import AdFilterForm from "@/components/ad/list/AdFilterForm";
import { dangerousCharToSpace } from "@/lib/seculity/validation";
import { AdListAdType, AdListSortType, AdListStatusType } from "@/lib/types/ad/adTypes";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";

const AdsPage = async( 
    props:{
        params: Promise<{ advertiserId: string }>
        searchParams: Promise<{ [key: string]: string | undefined }>
    }
) => {
    const resolvedParams = await props.params
    const advertiserId = Number(resolvedParams.advertiserId)
    const searchParams = await props.searchParams;

    //////////
    //■[ パラメータバリデーション ]
    if (!advertiserId || isNaN(advertiserId) || advertiserId <= 0) redirect('/auth/advertiser');

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
            ? '' // admin reviewではデフォルトで審査待ちのみ表示
            : initialStatus
    ;
    //・page
    const page = searchParams.page && !isNaN(Number(searchParams.page))  ? Number(searchParams.page) : 1;
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/40 relative overflow-hidden">
            {/* 背景装飾 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* ヘッダーセクション */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg border border-white/40">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                            広告管理ダッシュボード
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        配信中の広告を一元管理し、パフォーマンスを最適化しましょう
                    </p>
                    {/* 新規作成 & パフォーマンス統計 ボタンエリア */}
                    <div className="pt-4">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href={`/advertiser/${advertiserId}/ad/create`}>
                                <button className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/30 hover:-translate-y-1">
                                    ✨ 新しい広告を作成する
                                </button>
                            </Link>
                            <Link href={`/advertiser/${advertiserId}/ad/stats`}>
                                <button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/30 hover:-translate-y-1">
                                    📊 パフォーマンス統計を確認
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 検索・フィルターセクション */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-teal-600 rounded-full"></div>
                        <h2 className="text-xl font-bold text-gray-900">広告を検索・フィルター</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl overflow-hidden">
                        <div className="p-6">
                            <AdFilterForm
                                search={initialSearch}
                                sort={sort}
                                adType={adType}
                                urlPath="./ad/"
                            />
                        </div>
                    </div>
                </div>

                {/* 広告一覧セクション */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"></div>
                            <h2 className="text-xl font-bold text-gray-900">広告一覧</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                        </div>
                        
                        {/* 広告作成ボタン + ページ情報 */}
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
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
                                path={`/advertiser/${advertiserId}/ad`}
                                advertiserId={advertiserId}
                            />
                        </Suspense>
                    </div>
                </div>

                {/* フッター装飾 */}
                <div className="text-center pt-8">
                    <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span>広告の詳細や編集は各カードをクリックしてください</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* グリッド装飾 */}
            <div className="absolute inset-0 bg-grid-gray-100/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none"></div>
        </div>
    )
}
export default AdsPage;
