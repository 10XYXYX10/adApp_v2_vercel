// src/components/users/detail/UserDetailSkeleton.tsx
const UserDetailSkeleton = () => {
    return (
        <div className="relative">
            {/* ヘッダーセクションスケルトン */}
            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/60 p-6 sm:p-8 border-b border-blue-100/50">
                <div className="space-y-6">
                    {/* 基本情報スケルトン */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            {/* 名前スケルトン */}
                            <div className="h-10 bg-gray-200 rounded-lg w-64 animate-pulse"></div>
                            {/* ステータススケルトン */}
                            <div className="h-8 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                        </div>
                        {/* IDスケルトン */}
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                        {/* メールスケルトン */}
                        <div className="h-6 bg-gray-200 rounded w-80 animate-pulse"></div>
                    </div>

                    {/* ステータス・カテゴリー情報スケルトン */}
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                            <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                            <div className="h-8 bg-gray-200 rounded-full w-32 animate-pulse"></div>
                        </div>
                    </div>

                    {/* 日時情報スケルトン */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 詳細情報セクションスケルトン */}
            <div className="p-6 sm:p-8 space-y-8">
                {/* 事業者情報スケルトン */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <div className="bg-blue-50/50 rounded-2xl p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index}>
                                    <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                                    <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 住所情報スケルトン */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <div className="bg-green-50/50 rounded-2xl p-6">
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                            <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* 電話番号情報スケルトン */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <div className="bg-purple-50/50 rounded-2xl p-6">
                        <div className="h-4 bg-gray-200 rounded w-40 mb-1 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* 管理パネルセクションスケルトン */}
            <div className="border-t border-gray-100 bg-gray-50/50 p-6 sm:p-8">
                <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {/* アカウント制御セクションスケルトン */}
                    <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/60 rounded-2xl p-6 border border-blue-200/50">
                        <div className="h-5 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                    <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 通知送信セクションスケルトン */}
                    <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/60 rounded-2xl p-6 border border-purple-200/50">
                        <div className="h-5 bg-gray-200 rounded w-20 mb-4 animate-pulse"></div>
                        
                        <div className="space-y-4">
                            <div>
                                <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                                <div className="h-12 bg-gray-200 rounded-xl w-full animate-pulse"></div>
                            </div>

                            <div>
                                <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                                <div className="h-24 bg-gray-200 rounded-xl w-full animate-pulse"></div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                                    <div className="h-12 bg-gray-200 rounded-xl w-full animate-pulse"></div>
                                </div>
                                <div className="flex items-end">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 実行ボタンスケルトン */}
                    <div className="flex justify-end">
                        <div className="h-12 bg-gray-200 rounded-xl w-24 animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* 装飾要素 */}
            <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-lg"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-lg"></div>
        </div>
    )
}
export default UserDetailSkeleton;