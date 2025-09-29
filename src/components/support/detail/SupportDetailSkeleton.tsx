// src/components/support/detail/SupportDetailSkeleton.tsx

const SupportDetailSkeleton = () => {
    return (
        <div className="relative">
            {/* ヘッダーセクション */}
            <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/60 p-6 sm:p-8 border-b border-emerald-100/50">
                <div className="space-y-6">
                    {/* タイトル */}
                    <div className="space-y-3">
                        <div className="h-8 sm:h-10 lg:h-12 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </div>

                    {/* ステータス・カテゴリー情報 */}
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                            <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                            <div className="h-8 w-32 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                            <div className="h-6 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    {/* 日時情報 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* メッセージスレッドセクション */}
            <div className="p-6 sm:p-8 space-y-8">
                {/* スレッドヘッダー */}
                <div className="flex items-center gap-3 pb-4 border-b border-emerald-100/50">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="flex-1 h-px bg-gray-200 animate-pulse"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                </div>

                {/* メッセージリスト */}
                <div className="space-y-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                            <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] ${
                                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                            }`}>
                                {/* アバター */}
                                <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>

                                {/* メッセージ本体 */}
                                <div className={`flex flex-col ${index % 2 === 0 ? 'items-start' : 'items-end'}`}>
                                    {/* 送信者名・日時 */}
                                    <div className={`flex items-center gap-2 mb-2 ${
                                        index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                                    }`}>
                                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                                        <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                                    </div>

                                    {/* メッセージ内容 */}
                                    <div className="bg-gray-200 rounded-2xl p-4 animate-pulse">
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-300 rounded w-48 sm:w-64"></div>
                                            <div className="h-4 bg-gray-300 rounded w-32 sm:w-48"></div>
                                            {index === 1 && <div className="h-4 bg-gray-300 rounded w-40 sm:w-56"></div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 返信フォーム */}
                <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/60 rounded-2xl p-6 border border-emerald-100/50">
                    <div className="space-y-4">
                        {/* ヘッダー */}
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                        </div>

                        {/* テキストエリア */}
                        <div className="relative">
                            <div className="w-full h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
                            <div className="absolute bottom-3 right-3 h-5 w-12 bg-gray-300 rounded-full animate-pulse"></div>
                        </div>

                        {/* 送信ボタン */}
                        <div className="flex justify-end">
                            <div className="h-14 w-32 bg-gray-200 rounded-2xl animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 装飾要素 */}
            <div className="absolute top-4 right-4 w-12 h-12 bg-gray-200/50 rounded-full blur-lg animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 bg-gray-200/50 rounded-full blur-lg animate-pulse"></div>
        </div>
    )
}

export default SupportDetailSkeleton