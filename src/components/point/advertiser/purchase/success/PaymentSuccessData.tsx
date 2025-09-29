// src/components/point/advertiser/purchase/success/PaymentSuccessData.tsx
import Link from 'next/link'
import { getPaymentSuccessData } from '@/dal/payment/paymentFunctions'
import PaymentSuccessClient from './PaymentSuccessClient'

export default async function PaymentSuccessData({
    advertiserId,
    paymentId
}:{
    advertiserId: number
    paymentId: number
}) {
    //////////
    //■[ データ取得 ]
    const { success, errMsg, data } = await getPaymentSuccessData({
        advertiserId,
        paymentId,
    })
    if(!success || !data) throw new Error(errMsg);
    const { purchasedPoints, totalPaid, userPointAmount, payment } = data

    //////////
    //■[ 決済方法情報 ]
    const getPaymentMethodInfo = () => {
        if (payment.paymentMethod === 'creditcard') {
            return {
                icon: (
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                ),
                name: 'クレジットカード',
                color: 'from-blue-400 to-blue-600',
                bgColor: 'from-blue-50 to-blue-100'
            }
        } else {
            const cryptoInfo = {
                btc: { icon: '🟠', name: 'Bitcoin', color: 'from-orange-400 to-yellow-500' },
                eth: { icon: '⚪', name: 'Ethereum', color: 'from-blue-400 to-purple-500' },
                ltc: { icon: '🟡', name: 'Litecoin', color: 'from-gray-400 to-blue-400' }
            }
            const currency = payment.currency?.toLowerCase() as keyof typeof cryptoInfo
            const info = cryptoInfo[currency] || { icon: '💎', name: '仮想通貨', color: 'from-purple-400 to-pink-500' }
            
            return {
                icon: <span className="text-4xl">{info.icon}</span>,
                name: info.name,
                color: info.color,
                bgColor: 'from-green-50 to-emerald-100'
            }
        }
    }
    const paymentMethodInfo = getPaymentMethodInfo()

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
            <PaymentSuccessClient amount={data.userPointAmount}/>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* 成功ヘッダー */}
                <div className="text-center mb-12">
                    <div className="relative inline-block">
                        <div className="w-24 h-24 mx-auto mb-6 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                                <div className="text-4xl text-green-500">✓</div>
                            </div>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                            決済完了
                        </h1>
                        <p className="text-xl text-gray-600 font-medium">
                            ポイント購入が正常に完了しました
                        </p>
                    </div>
                </div>

                {/* メインコンテンツ */}
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    {/* 購入詳細カード */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                購入詳細
                            </h2>
                        </div>
                        
                        <div className="p-8 space-y-6">
                            {/* 取得ポイント */}
                            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                <span className="text-gray-700 font-medium">取得ポイント</span>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-600">
                                        +{purchasedPoints.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-green-500">ポイント</div>
                                </div>
                            </div>

                            {/* 支払い金額 */}
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                <span className="text-gray-700 font-medium">支払い金額</span>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-gray-800">
                                        ¥{totalPaid.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-500">手数料込み</div>
                                </div>
                            </div>

                            {/* 決済方法 */}
                            <div className={`flex justify-between items-center p-4 bg-gradient-to-r ${paymentMethodInfo.bgColor} rounded-xl border border-blue-200`}>
                                <span className="text-gray-700 font-medium">決済方法</span>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 text-lg font-bold text-blue-700">
                                        {paymentMethodInfo.icon}
                                        {paymentMethodInfo.name}
                                    </div>
                                    {payment.currency && payment.paymentMethod !== 'creditcard' && (
                                        <div className="text-sm text-blue-600">
                                            {payment.currency.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 現在の残高カード */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                現在の残高
                            </h2>
                        </div>
                        
                        <div className="p-8">
                            {/* メイン残高表示 */}
                            <div className="text-center mb-6">
                                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                    {userPointAmount.toLocaleString()}
                                </div>
                                <div className="text-lg text-gray-600 font-medium">ポイント</div>
                            </div>
                            
                            {/* 購入詳細 */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                                <div className="text-center mb-4">
                                    <div className="text-sm text-gray-600 mb-1">購入前の残高</div>
                                    <div className="text-lg font-semibold text-gray-800">
                                        {(userPointAmount - purchasedPoints).toLocaleString()} ポイント
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-center gap-2 text-green-600 pt-2 border-t border-blue-200">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                    </svg>
                                    <span className="font-bold text-sm sm:text-base">+{purchasedPoints.toLocaleString()} ポイント追加</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* アクションボタン */}
                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {/* 広告作成ボタン */}
                    <Link 
                        href={`/advertiser/${advertiserId}/ad/create`}
                        className="group relative overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-center text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                            <div className="text-4xl mb-4">🚀</div>
                            <h3 className="text-2xl font-bold mb-2">広告を作成する</h3>
                            <p className="text-green-100">
                                取得したポイントで広告配信を開始
                            </p>
                            <div className="mt-4 inline-flex items-center gap-2 text-green-100 group-hover:text-white transition-colors">
                                <span>今すぐ開始</span>
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* ダッシュボードボタン */}
                    <Link 
                        href={`/advertiser/${advertiserId}`}
                        className="group relative overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-center text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-2xl font-bold mb-2">ダッシュボード</h3>
                            <p className="text-blue-100">
                                アカウント管理と統計を確認
                            </p>
                            <div className="mt-4 inline-flex items-center gap-2 text-blue-100 group-hover:text-white transition-colors">
                                <span>確認する</span>
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* 追加情報 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        重要な情報
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <span className="text-green-500 mt-1">✓</span>
                                <span>ポイントは即座にアカウントに反映されています</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-blue-500 mt-1">🔒</span>
                                <span>すべての取引は暗号化されて安全に処理されています</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <span className="text-purple-500 mt-1">📧</span>
                                <span>取引完了の確認メールが送信されています</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-orange-500 mt-1">💬</span>
                                <span>ご質問は<Link href={`/advertiser/${advertiserId}/support`} className="text-blue-600 hover:underline">サポート</Link>までお気軽にどうぞ</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* フッター */}
                <div className="text-center mt-12">
                    <p className="text-gray-500 text-sm">
                        ご利用いただき、ありがとうございます
                    </p>
                </div>
            </div>
        </div>
    )
}