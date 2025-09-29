// src/components/advertiser/ads/list/AdsListSkeleton.tsx
const AdsListSkeleton = () => {
    return (
        <div className="relative">
            {/* メイン広告一覧スケルトン */}
            <div className="p-6">
                {/* 広告カードスケルトングリッド */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div 
                            key={index}
                            className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg h-full overflow-hidden"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* ヘッダースケルトン */}
                            <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-3">
                                    {/* タイトルスケルトン */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
                                        <div className="h-5 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                                    </div>
                                    
                                    {/* ステータスバッジスケルトン */}
                                    <div className="h-6 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                                </div>
                                
                                {/* IDスケルトン */}
                                <div className="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-2"></div>
                                
                                {/* ターゲット情報スケルトン */}
                                <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                            </div>

                            {/* メインコンテンツスケルトン */}
                            <div className="p-4 space-y-4">
                                {/* 予算進捗スケルトン */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                                        <div className="h-4 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                                    </div>
                                    {/* プログレスバースケルトン */}
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-gray-300 to-gray-400 rounded-full animate-pulse w-3/5"></div>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <div className="h-3 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                                        <div className="h-3 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                                    </div>
                                </div>

                                {/* 基本情報スケルトン */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="h-3 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-2"></div>
                                        <div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="h-3 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-2"></div>
                                        <div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                                    </div>
                                </div>

                                {/* 詳細ボタンスケルトン */}
                                <div className="h-12 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ページネーションスケルトン */}
            <div className="border-t border-gray-100 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center justify-between px-6 py-6">
                    {/* 前ページボタンスケルトン */}
                    <div className="flex-1 flex justify-start">
                        <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/50 shadow-lg">
                            <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
                            <div>
                                <div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-1"></div>
                                <div className="h-3 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* 現在ページスケルトン */}
                    <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl px-6 py-3 shadow-lg animate-pulse">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                            <div className="h-5 w-16 bg-white/50 rounded"></div>
                        </div>
                    </div>

                    {/* 次ページボタンスケルトン */}
                    <div className="flex-1 flex justify-end">
                        <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/50 shadow-lg">
                            <div>
                                <div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-1"></div>
                                <div className="h-3 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* ページネーション情報スケルトン */}
                <div className="text-center pb-6">
                    <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                        <div className="w-4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                        <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* 波打つアニメーション効果 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-400/5 to-indigo-400/5 rounded-full blur-3xl animate-pulse"></div>
            </div>

            {/* グローバルローディングオーバーレイ */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-pulse"></div>
        </div>
    )
}

export default AdsListSkeleton