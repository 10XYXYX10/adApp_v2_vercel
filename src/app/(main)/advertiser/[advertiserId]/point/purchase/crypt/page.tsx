// src/app/advertiser/[advertiserId]/point/purchase/crypt/page.tsx
import PurchaseEntryForm from '@/components/point/advertiser/purchase/crypt/PurchaseEntryForm'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type Props = {
    params: Promise<{
        advertiserId: string
    }>
}

export default async function PointPurchaseCryptPage({ params }: Props) {
    const resolvedParams = await params
    const advertiserId = Number(resolvedParams.advertiserId)
    if(!advertiserId || isNaN(advertiserId) || advertiserId < 0)redirect('/auth/advertiser');

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* ヘッダー */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">仮想通貨決済</h1>
                <p className="text-gray-600">仮想通貨でポイントを購入します</p>
            </div>

            {/* 戻るリンク */}
            <div className="mb-8">
                <Link 
                    href={`/advertiser/${advertiserId}/point/purchase`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    決済方法選択に戻る
                </Link>
            </div>

            {/* 決済情報表示 */}
            <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    仮想通貨決済について
                </h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h3 className="font-semibold text-green-800 mb-2">対応通貨</h3>
                        <ul className="text-green-700 space-y-1">
                            <li>• Bitcoin (BTC)</li>
                            <li>• Ethereum (ETH)</li>
                            <li>• Litecoin (LTC) - 推奨</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-green-800 mb-2">決済情報</h3>
                        <ul className="text-green-700 space-y-1">
                            <li>• 手数料: 1.5%</li>
                            <li>• 決済時間: 数分～数十分程度</li>
                            <li>• ガス代別途必要</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* メインフォーム */}
            <PurchaseEntryForm 
                advertiserId={advertiserId}
                paymentType="crypt"
            />

            {/* 注意事項 */}
            <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    重要な注意事項
                </h3>
                <div className="text-sm text-yellow-800 space-y-2">
                    <p>• 送金時に別途ガス代（ネットワーク手数料）が必要です</p>
                    <p>• Litecoinはガス代が最も安く、送金速度も速いためおすすめです</p>
                    <p>• 決済の有効期限は60分です</p>
                    <p>• アプリケーションの仕様上、<br/>　ポイントの返金は出来ませんのでご注文下さい</p>
                </div>
            </div>
        </div>
    )
}