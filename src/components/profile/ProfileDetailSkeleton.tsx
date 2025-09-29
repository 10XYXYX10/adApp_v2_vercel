// src/components/profile/ProfileDetailSkeleton.tsx

const ProfileDetailSkeleton = () => {
    return (
        <div className="relative">
            {/* ヘッダーセクション */}
            <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/60 p-6 sm:p-8 border-b border-emerald-100/50">
                <div className="max-w-7xl mx-auto">
                    <div className="h-8 sm:h-10 lg:h-12 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                    <div className="h-4 sm:h-5 bg-gray-200 rounded-lg animate-pulse w-3/4"></div>
                </div>
            </div>

            {/* メインコンテンツ */}
            <div className="p-6 sm:p-8 lg:p-12">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* 進捗インジケーター */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-1">
                                <div className="h-6 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                                <div className="w-full bg-gray-200 rounded-full h-3 animate-pulse"></div>
                            </div>
                            <div className="text-right">
                                <div className="h-8 w-12 bg-gray-200 rounded-lg animate-pulse mb-1"></div>
                                <div className="h-4 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
                            </div>
                        </div>
                        
                        {/* ステータスバッジ */}
                        <div className="flex flex-wrap gap-3 mt-4">
                            {Array.from({length: 4}).map((_, i) => (
                                <div key={i} className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                            ))}
                        </div>
                    </div>

                    {/* フォームグリッド */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {Array.from({length: 4}).map((_, formIndex) => (
                            <div key={formIndex} className="bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg overflow-hidden">
                                {/* フォームヘッダー */}
                                <div className="p-4 bg-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                                        <div className="h-5 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                                        <div className="h-4 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                                
                                {/* フォーム内容 */}
                                <div className="p-6 space-y-6">
                                    <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-full"></div>
                                    
                                    {/* フィールド群 */}
                                    {Array.from({length: 3}).map((_, fieldIndex) => (
                                        <div key={fieldIndex} className="space-y-2">
                                            <div className="h-4 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                                            <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                                            <div className="h-3 w-16 bg-gray-200 rounded-lg animate-pulse ml-auto"></div>
                                        </div>
                                    ))}
                                    
                                    {/* 保存ボタン */}
                                    <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 装飾要素 */}
            <div className="absolute top-4 right-4 w-12 h-12 bg-gray-200/50 rounded-full blur-lg animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 bg-gray-200/50 rounded-full blur-lg animate-pulse"></div>
        </div>
    )
}

export default ProfileDetailSkeleton;