// src/components/point/advertiser/purchase/success/PaymentSuccessSkelton.tsx
export default function PaymentSuccessSkelton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* ヘッダースケルトン */}
                <div className="text-center mb-12">
                    <div className="relative inline-block">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-12 w-64 mx-auto bg-gray-200 rounded-lg animate-pulse mb-4"></div>
                        <div className="h-6 w-80 mx-auto bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                </div>

                {/* メインコンテンツスケルトン */}
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    {/* 購入詳細カードスケルトン */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gray-200 px-8 py-6 animate-pulse">
                            <div className="h-8 w-32 bg-gray-300 rounded animate-pulse"></div>
                        </div>
                        
                        <div className="p-8 space-y-6">
                            {/* 取得ポイント */}
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                                <div className="text-right space-y-2">
                                    <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>

                            {/* 支払い金額 */}
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                                <div className="text-right space-y-2">
                                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>

                            {/* 決済方法 */}
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                                <div className="text-right space-y-2">
                                    <div className="flex items-center gap-2 justify-end">
                                        <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 現在の残高カードスケルトン */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gray-200 px-8 py-6 animate-pulse">
                            <div className="h-8 w-32 bg-gray-300 rounded animate-pulse"></div>
                        </div>
                        
                        <div className="p-8">
                            {/* メイン残高表示 */}
                            <div className="text-center mb-6">
                                <div className="h-16 w-48 mx-auto bg-gray-200 rounded-lg animate-pulse mb-2"></div>
                                <div className="h-6 w-16 mx-auto bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            
                            {/* 購入詳細 */}
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                <div className="text-center mb-4">
                                    <div className="h-4 w-20 mx-auto bg-gray-200 rounded animate-pulse mb-1"></div>
                                    <div className="h-6 w-32 mx-auto bg-gray-200 rounded animate-pulse"></div>
                                </div>
                                
                                <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-200">
                                    <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* アクションボタンスケルトン */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-gray-200 rounded-2xl p-8 animate-pulse">
                        <div className="text-center">
                            <div className="h-12 w-12 mx-auto bg-gray-300 rounded animate-pulse mb-4"></div>
                            <div className="h-8 w-32 mx-auto bg-gray-300 rounded animate-pulse mb-2"></div>
                            <div className="h-5 w-40 mx-auto bg-gray-300 rounded animate-pulse mb-4"></div>
                            <div className="h-6 w-24 mx-auto bg-gray-300 rounded animate-pulse"></div>
                        </div>
                    </div>

                    <div className="bg-gray-200 rounded-2xl p-8 animate-pulse">
                        <div className="text-center">
                            <div className="h-12 w-12 mx-auto bg-gray-300 rounded animate-pulse mb-4"></div>
                            <div className="h-8 w-32 mx-auto bg-gray-300 rounded animate-pulse mb-2"></div>
                            <div className="h-5 w-40 mx-auto bg-gray-300 rounded animate-pulse mb-4"></div>
                            <div className="h-6 w-24 mx-auto bg-gray-300 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* 追加情報スケルトン */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mt-1"></div>
                                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mt-1"></div>
                                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mt-1"></div>
                                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mt-1"></div>
                                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* フッタースケルトン */}
                <div className="text-center mt-12">
                    <div className="h-4 w-40 mx-auto bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}