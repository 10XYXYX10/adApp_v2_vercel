// src/components/point/detail/PointDetailSkeleton.tsx

const PointDetailSkeleton = () => {
    return (
        <div className="relative animate-pulse">
            {/* ヘッダーセクション */}
            <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/60 p-6 sm:p-8 border-b border-green-100/50">
                <div className="space-y-6">
                    {/* ナビゲーション */}
                    <div className="flex items-center gap-3">
                        <div className="h-4 bg-green-200 rounded w-32"></div>
                    </div>

                    {/* 基本情報 */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="h-8 sm:h-10 lg:h-12 bg-gray-200 rounded w-48 sm:w-64"></div>
                            <div className="h-8 bg-gray-200 rounded-full w-24"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-6 bg-gray-200 rounded w-full max-w-md"></div>
                    </div>

                    {/* 日時情報 */}
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                </div>
            </div>

            {/* アクションリンクセクション */}
            <div className="bg-blue-50/50 p-6 sm:p-8 border-b border-blue-100/50">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="h-6 bg-gray-200 rounded w-32"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white/70 rounded-xl p-4 border border-white/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/70 rounded-xl p-4 border border-white/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    <div className="h-3 bg-gray-200 rounded w-28"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 詳細情報セクション */}
            <div className="p-6 sm:p-8 space-y-8">
                {/* 決済情報セクション */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <div className="bg-blue-50/50 rounded-2xl p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-12"></div>
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-blue-200/50 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                            <div className="h-4 bg-gray-200 rounded w-40"></div>
                        </div>
                    </div>
                </div>

                {/* 追加の情報セクション（条件付き表示をシミュレート） */}
                <div className="bg-yellow-50/50 border border-yellow-200/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-gray-200 rounded"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                            <div className="h-3 bg-gray-200 rounded w-48"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 装飾要素 */}
            <div className="absolute top-4 right-4 w-12 h-12 bg-gray-100 rounded-full blur-lg"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 bg-gray-100 rounded-full blur-lg"></div>
        </div>
    )
}
export default PointDetailSkeleton;