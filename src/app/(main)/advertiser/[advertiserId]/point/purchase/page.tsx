// src/app/advertiser/[advertiserId]/point/purchase/page.tsx
import Link from 'next/link'
import PointsDisplay from '@/components/point/advertiser/PointsDisplay'
import { redirect } from 'next/navigation'

export default async function PointPurchasePage({ 
    params 
}:{
    params: Promise<{
        advertiserId: string
    }>
}) {
    const resolvedParams = await params
    const advertiserId = Number(resolvedParams.advertiserId)
    if(!advertiserId || isNaN(advertiserId) || advertiserId < 0)redirect('/auth/advertiser');

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* ヘッダー */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">ポイント購入</h1>
                <p className="text-gray-600">ポイントを購入して広告配信を開始しましょう</p>
            </div>

            {/* 現在のポイント残高 */}
            <div className="mb-8">
                <PointsDisplay />
            </div>

            {/* 戻るリンク */}
            <div className="mb-8">
                <Link 
                    href={`/advertiser/${advertiserId}/points`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    ポイント・決済履歴に戻る
                </Link>
            </div>

            {/* 決済方法選択 */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* クレジットカード決済 */}
                {/* <Link 
                    href={`/advertiser/${advertiserId}/point/purchase/creditCard`}
                    className="group"
                >
                    <div className="border-2 border-gray-200 rounded-xl p-8 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">クレジットカード決済</h2>
                            <p className="text-gray-600 mb-4">Visa, Mastercard, American Express</p>
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                                <p className="text-sm text-orange-700">手数料: 3.5%</p>
                            </div>
                            <div className="text-sm text-gray-500">
                                <p>• 即座に決済完了</p>
                                <p>• セキュアな決済処理</p>
                            </div>
                        </div>
                    </div>
                </Link> */}

                {/* 仮想通貨決済 */}
                <Link 
                    href={`/advertiser/${advertiserId}/point/purchase/crypt`}
                    className="group"
                >
                    <div className="border-2 border-gray-200 rounded-xl p-8 hover:border-green-500 hover:shadow-lg transition-all cursor-pointer">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">仮想通貨決済</h2>
                            <p className="text-gray-600 mb-4">BTC, ETH, USDT, USDC, DAI, Litecoin</p>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                                <p className="text-sm text-green-700">手数料: 1.5%</p>
                                <p className="text-xs text-green-600 mt-1">推奨: Litecoin（ガス代安い）</p>
                            </div>
                            <div className="text-sm text-gray-500">
                                <p>• 低い手数料</p>
                                <p>• 匿名性が高い</p>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* 注意事項 */}
            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">ご注意事項</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                        <p>• 購入したポイントは即座にアカウントに反映されます</p>
                        <p>• アプリケーションの仕様上、<br/>　ポイントの返金は出来ませんのでご注文下さい</p>
                    </div>
                    <div>
                        <p>• 全ての取引は暗号化されて保護されています</p>
                        <p>• 最小購入金額は100円、最大は100,000円です</p>
                    </div>
                </div>
            </div>
        </div>
    )
}