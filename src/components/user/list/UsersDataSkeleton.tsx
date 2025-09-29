// src/components/users/list/UsersDataSkeleton.tsx
const UsersDataSkeleton = () => {
    return (
        <div className="relative">
            <div className="p-6">
                {/* ユーザーカードスケルトン */}
                <div className="p-1 mt-5 sm:p-2 sm:mt-0 w-full">
                    <div className="sm:flex sm:flex-wrap sm:items-stretch container mx-auto">
                        {/* スケルトンカード × 6 */}
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="mb-6 lg:w-1/2 xl:w-1/3 p-3">
                                <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg h-full overflow-hidden">
                                    {/* ヘッダースケルトン */}
                                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 border-b border-gray-100">
                                        <div className="flex items-center justify-between mb-3">
                                            {/* ユーザー名スケルトン */}
                                            <div className="h-5 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                                            {/* ステータススケルトン */}
                                            <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                                        </div>
                                        
                                        {/* IDスケルトン */}
                                        <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                                        {/* メールスケルトン */}
                                        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                                        
                                        <div className="mt-3 flex items-center justify-between">
                                            {/* 事業者種別スケルトン */}
                                            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                                            {/* 会社名スケルトン */}
                                            <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                                        </div>
                                    </div>

                                    {/* メインコンテンツスケルトン */}
                                    <div className="p-4 space-y-4">
                                        {/* ポイント残高スケルトン */}
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                                                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                            </div>
                                            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                                        </div>

                                        {/* 基本情報スケルトン */}
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

                                        {/* ボタンスケルトン */}
                                        <div className="h-12 bg-gray-200 rounded-xl w-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ページネーションスケルトン */}
            <div className="border-t border-gray-100 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center justify-between px-6 py-6">
                    {/* 前ページボタンスケルトン */}
                    <div className="flex-1 flex justify-start">
                        <div className="h-16 bg-gray-200 rounded-2xl w-32 animate-pulse"></div>
                    </div>

                    {/* 現在ページスケルトン */}
                    <div className="flex items-center gap-3">
                        <div className="h-12 bg-gray-200 rounded-2xl w-24 animate-pulse"></div>
                    </div>

                    {/* 次ページボタンスケルトン */}
                    <div className="flex-1 flex justify-end">
                        <div className="h-16 bg-gray-200 rounded-2xl w-32 animate-pulse"></div>
                    </div>
                </div>

                {/* ページ情報スケルトン */}
                <div className="text-center pb-6">
                    <div className="h-8 bg-gray-200 rounded-full w-48 mx-auto animate-pulse"></div>
                </div>
            </div>

            {/* 背景装飾 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
            </div>
        </div>
    )
}
export default UsersDataSkeleton;