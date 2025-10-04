'use client'
// src/components/point/advertiser/CryptoPurchaseForm.tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CryptoCurrency, PaymentData } from '@/lib/types/payment/crypt/cryptTypes'
import { createCryptoPayment } from '@/actions/payment/crypt/cryptActions'
import CryptoPurchaseWaiting from './CryptoPurchaseWaiting'

//////////
//■[ 通貨情報 ]
const currencies = {
    ltc: {
        name: 'Litecoin',
        symbol: 'LTC',
        icon: '🟡',
        features: ['⭐ 推奨', 'ガス代約数十円', '送金速度: 約2.5分'],
        description: 'ガス代が安く、送金速度が速いためおすすめです'
    },
    eth: {
        name: 'Ethereum',
        symbol: 'ETH',
        icon: '⚪',
        features: ['ガス代高め', '送金時間: 数分～数時間'],
        description: 'ガス代が高額になる場合があります'
    },
    btc: {
        name: 'Bitcoin',
        symbol: 'BTC',
        icon: '🟠',
        features: ['最もメジャー', 'ガス代高め', '送金時間: 10分～数時間'],
        description: '最も信頼性が高いですが、ガス代と送金時間にご注意ください'
    },
    usdc: {
        name: 'USD Coin(Ethereum)',
        symbol: 'USDC',
        icon: '🟦',
        features: ['ネットワーク: Ethereum(ERC-20)', 'ガス代高め', '送金時間: 数分～数十分'],
        description: 'ERC-20ベースのUSDC。＊「USD Coin(Polygon)」と間違わない様に注意'
    },
    usdcmatic: {
        name: 'USD Coin(Polygon)',
        symbol: 'USDC',
        icon: '🟩',
        features: ['ネットワーク: Polygon(MATIC)', 'ガス代非常に安い', '送金時間: 数秒～数分'],
        description: 'Polygon上のUSDC。手数料が低く高速です。＊「USD Coin(Ethereum)」と間違わない様に注意'
    }
}

export default function CryptoPurchaseForm({
    advertiserId, 
    amount, 
    setProcessingData,
    fee,
    totalAmount,
}: {
    advertiserId: number
    amount: number
    setProcessingData: React.Dispatch<React.SetStateAction<'entry' | 'purchase'>>
    fee: number
    totalAmount: number
}) {
    const router = useRouter()

    //////////
    //■[ フォーム状態 ]
    const [selectedCurrency, setSelectedCurrency] = useState<CryptoCurrency>('ltc')
    const [isCreatingPayment, setIsCreatingPayment] = useState(false)
    const [error, setError] = useState<string>('')
    const [paymentDataState,setPaymentDataState] = useState<null|PaymentData>(null)

    // ProcessingDataの変更で、表示が切り替わる際、スクロール位置の調整が必要

    //////////
    //■[ ブラウザバック制御 ]
    useEffect(() => {
        // コンポーネントがマウントされた後にスクロール
        const scrollTarget = document.getElementById('scrollTarget')
        if (scrollTarget) {
            const targetPosition = scrollTarget.offsetTop - 80;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            })
        }

        //・BeforeUnloadEvent:
        //  - ブラウザで 「ページを離れる直前（閉じる・リロード・別ページへ遷移）」に発生するイベント。*ブラウザバックは含まれない
        //  - 「e.returnValue」は非推奨＆ここで設定した文字列が表示されることは無い。← にもかかわらず必要な理由を順を追って説明：
        //      1. 昔のブラウザでは設定文字列がページを離れる際の確認ダイアログに表示されていたが、フィッシング詐欺などで悪用される事例が！
        //      2. そのため、現在の主要なブラウザでは、セキュリティ上の理由からこのカスタムメッセージを無視。代わりに、ブラウザが用意した標準のメッセージを常に表示するように！
        //      3. しかし、一部の古いブラウザでは、確認ダイアログを出すために、e.preventDefault()だけでなく e.returnValueに値を設定する必要が！
        //          e.returnValueに何らかの(空でない)値を設定するかのいずれかを行うことで、ブラウザに「確認ダイアログを出してほしい」と伝える合図に。
        //          両方書くのは、さまざまなブラウザで確実に動作させるための、いわば「おまじない」のようなもの。
        //      4. 現在のモダンブラウザのみを対象とするなら、e.preventDefault()だけで十分！
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault()
            e.returnValue = '現在の入力情報が失われる可能性があります。よろしいですか？'//実際に表示される文字列「行った変更が保存されない可能性があります。」
        }

        //・PopStateEvent:
        //  - ユーザーが履歴を移動したときに発生するイベント。SPA で「戻る／進む」をフックするのに使用。
        //  - PopStateEvent は、ブラウザの 「戻る／進む」操作や history.back() / history.forward() / history.go() の呼び出しで発生するイベント。
        //      - history.go(-1);   //1 つページを戻す場合 、back() の呼び出しと同等
        //      - history.go(1);    //1 つページを進める場合、 forward() の呼び出しと同等
        //      - history.go(2);    //2 つページを進める場合
        //      - history.go(-2);   //2 つページを戻す場合
        //      - 「history.go();」or「history.go(0);」 //現在のページを再読み込み
        const handlePopState = () => {
            const confirmed = confirm('現在の入力情報が失われる可能性があります。よろしいですか？')
            if (confirmed)setProcessingData('entry')
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        window.addEventListener('popstate', handlePopState)
        //・「 window.history.pushState(null, '', window.location.href)」：
        //  - null: 履歴に関連付けるデータオブジェクト。今回は特にデータは不要なのでnullです。
        //  - '': 新しい履歴のタイトル。現在ほとんどのブラウザで無視されるため空文字でOKです。
        //  - window.location.href: 新しい履歴のURL。現在のURLそのものを指定しています。
        window.history.pushState(null, '', window.location.href)// これが無いと「popstate発火 > handlePopState > confirm確認」の際、確認完了前に、urlが1つ前に戻ってしまう

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
            window.removeEventListener('popstate', handlePopState)
        }
    }, [])


    //////////
    //■[ 決済作成処理 ]
    const handleCreatePayment = async () => {
        setIsCreatingPayment(true)
        setError('')

        try {
            // TODO: Server Actionを呼び出し
            const { success, errMsg, statusCode, paymentData } = await createCryptoPayment({
                advertiserId,
                currency: selectedCurrency,
                totalAmount: totalAmount,
                purchaseAmount: amount,
            })
            if (statusCode === 401) {
                alert(errMsg)
                router.push('/auth/advertiser')
                return
            }
            if (!success || !paymentData) {
                throw new Error(errMsg)
            }
            // 決済作成成功 - 待機画面に遷移
            setPaymentDataState(paymentData)

        } catch (error) {
            // const errMsg = error instanceof Error ? error.message : '決済の作成に失敗しました。再度お試しください。'
            console.error('Payment creation error:', error)
            const errMsg = '決済の作成に失敗しました。再度お試しください。';
            setError(errMsg)
        } finally {
            setIsCreatingPayment(false)
        }
    }

    //////////
    //■[ 戻る処理 ]
    const handleBack = () => {
        const confirmed = confirm('現在の入力情報が失われる可能性があります。よろしいですか？')
        if (confirmed) {
            setProcessingData('entry')
        }
    }


    if(paymentDataState===null){
        return (
            <div className="space-y-8" id="scrollTarget">
                {/* ヘッダー */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">仮想通貨を選択</h2>
                    <p className="text-gray-600">決済に使用する仮想通貨を選択してください</p>
                </div>

                {/* 購入内容確認 */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">購入内容</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">取得ポイント:</span>
                            <span className="font-medium">{amount.toLocaleString()}ポイント</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">購入金額:</span>
                            <span className="font-medium">¥{amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">決済手数料 (1.5%):</span>
                            <span className="font-medium">¥{fee.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-gray-300 pt-2 mt-2">
                            <div className="flex justify-between text-lg font-bold">
                                <span>合計金額:</span>
                                <span>¥{totalAmount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 通貨選択 */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        仮想通貨を選択
                    </h3>

                    <div className="space-y-4">
                        {Object.entries(currencies).map(([key, currency]) => (
                            <div key={key} className="group relative">
                                <div className="flex items-start space-x-4 p-6 border-2 rounded-xl hover:border-green-300 transition-all cursor-pointer">
                                    <input
                                        type="radio"
                                        name="currency"
                                        value={key}
                                        checked={selectedCurrency === key}
                                        onChange={(e) => setSelectedCurrency(e.target.value as CryptoCurrency)}
                                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 mt-1"
                                    />
                                    <div className="flex-1">
                                        <label className="font-semibold flex items-center gap-3 text-lg cursor-pointer">
                                            <span className="text-2xl">{currency.icon}</span>
                                            <span>{currency.name} ({currency.symbol})</span>
                                        </label>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {currency.features.map((feature, index) => (
                                                <span
                                                    key={index}
                                                    className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${
                                                        feature.includes('推奨') 
                                                            ? 'bg-green-100 text-green-800 border border-green-200' 
                                                            : feature.includes('高め')
                                                            ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                                                    }`}
                                                >
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">{currency.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* エラー表示 */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="text-red-500 text-xl">⚠</div>
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* ボタン群 */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="flex-1 py-4 px-6 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                        disabled={isCreatingPayment}
                    >
                        ← 戻る
                    </button>
                    
                    <button
                        type="button"
                        onClick={handleCreatePayment}
                        disabled={isCreatingPayment}
                        className={`
                            flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all
                            ${isCreatingPayment
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                            }
                        `}
                    >
                        {isCreatingPayment ? (
                            <div className="flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                決済情報を作成中...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                {currencies[selectedCurrency].icon}
                                {currencies[selectedCurrency].name} で決済を開始 →
                            </div>
                        )}
                    </button>
                </div>
            </div>
        )
    }else{
        return <CryptoPurchaseWaiting 
            advertiserId={advertiserId}
            selectedCurrency={selectedCurrency} 
            paymentDataState={paymentDataState}
            setPaymentDataState={setPaymentDataState}
            setProcessingData={setProcessingData}
        />
    }
}