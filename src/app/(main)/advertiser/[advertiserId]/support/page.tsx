// src/app/(main)/advertiser/[advertiserId]/support/page.tsx
import SupportFilterForm from "@/components/support/list/SupportFilterForm";
import SupportList from "@/components/support/list/SupportList";
import SupportListSkeleton from "@/components/support/list/SupportListSkeleton";
import { SupportListSortType, SupportListStatusType, SupportListCategoryType } from "@/lib/types/support/supportTypes";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const SupportPage = async(
    props:{
        params: Promise<{ advertiserId: string }>
        searchParams: Promise<{ [key: string]: string | undefined }>
    }
) => {
    const resolvedParams = await props.params;
    const advertiserId = Number(resolvedParams.advertiserId)
    const searchParams = await props.searchParams;
    if (!advertiserId || isNaN(advertiserId) || advertiserId <= 0) redirect('/auth/advertiser');

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
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-emerald-900 to-teal-900 bg-clip-text text-transparent">
                            サポート・問い合わせ
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        困ったことがあればお気軽にお問い合わせください。迅速に対応いたします
                    </p>
                    {/* 新規作成ボタンエリア */}
                    <div className="pt-4">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href={`/advertiser/${advertiserId}/support/create`}>
                                <button className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/30 hover:-translate-y-1">
                                    💬 新しい問い合わせを作成
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* フィルターセクション */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-teal-600 rounded-full"></div>
                        <h2 className="text-xl font-bold text-gray-900">問い合わせを絞り込み</h2>
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
                            <h2 className="text-xl font-bold text-gray-900">問い合わせ一覧</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                        </div>

                        {/* ページ情報 */}
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-700">Page {page}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl overflow-hidden">
                        <Suspense fallback={<SupportListSkeleton />}>
                            <SupportList
                                advertiserId={Number(advertiserId)}
                                sort={sort}
                                status={status}
                                category={category}
                                page={page}
                                path={`/advertiser/${advertiserId}/support`}
                            />
                        </Suspense>
                    </div>
                </div>

                {/* フッター装飾 */}
                <div className="text-center pt-8">
                    <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span>問い合わせの詳細や返信は各カードをクリックしてください</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* グリッド装飾 */}
            <div className="absolute inset-0 bg-grid-gray-100/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none"></div>
        </div>
    )
}

export default SupportPage;