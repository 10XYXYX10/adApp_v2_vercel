// src/components/advertiser/support/list/SupportListSkeleton.tsx

const SupportListSkeleton = () => {
    return (
        <div className="p-6 space-y-6">
            <div className="sm:flex sm:flex-wrap sm:items-stretch container mx-auto">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="mb-6 lg:w-1/2 xl:w-1/3 p-3">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg h-full overflow-hidden">
                            {/* ヘッダー */}
                            <div className="bg-gradient-to-r from-slate-50 to-emerald-50 p-4 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                    <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                                </div>
                                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse mb-2"></div>
                                <div className="flex items-center justify-between">
                                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                                    <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                                </div>
                            </div>

                            {/* メインコンテンツ */}
                            <div className="p-4 space-y-4">
                                {/* 対応状況 */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 animate-pulse"></div>
                                </div>

                                {/* 基本情報 */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="h-4 bg-gray-200 rounded w-12 mb-1 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="h-4 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                                    </div>
                                </div>

                                {/* 詳細リンク */}
                                <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default SupportListSkeleton