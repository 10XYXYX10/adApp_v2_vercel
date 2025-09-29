'use client'
// src/components/point/advertiser/CryptoPurchaseWaiting.tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CryptoCurrency, PaymentData } from '@/lib/types/payment/crypt/cryptTypes'
import { checkCryptoPaymentStatus } from '@/actions/payment/crypt/cryptActions'
import { formatTime } from '@/lib/functions/usefulFunctions'


//////////
//■[ 通貨情報 ]
const getCurrencyInfo = (currency: CryptoCurrency) => {
    switch (currency) {
        case 'btc':
            return { icon: '🟠', name: 'Bitcoin', color: 'from-orange-400 to-yellow-500' }
        case 'eth':
            return { icon: '⚪', name: 'Ethereum', color: 'from-blue-400 to-purple-500' }
        case 'ltc':
            return { icon: '🟡', name: 'Litecoin', color: 'from-gray-400 to-blue-400' }
        default:
            return { icon: '💎', name: 'Cryptocurrency', color: 'from-purple-400 to-pink-500' }
    }
}

export default function CryptoPurchaseWaiting({ 
    advertiserId, 
    selectedCurrency, 
    paymentDataState,
    setPaymentDataState,
    setProcessingData, 
}:{
    advertiserId: number
    selectedCurrency: CryptoCurrency
    paymentDataState: PaymentData
    setPaymentDataState: React.Dispatch<React.SetStateAction<PaymentData | null>>
    setProcessingData: React.Dispatch<React.SetStateAction<'entry' | 'purchase'>>
}) {
    const router = useRouter()

    //////////
    //■[ 状態管理 ]
    const [timeRemaining, setTimeRemaining] = useState<number>(60 * 60) // 60分
    const [copiedAddress, setCopiedAddress] = useState(false)
    const [copiedAmount, setCopiedAmount] = useState(false)
    const [hasSentPayment, setHasSentPayment] = useState(false)
    const [error, setError] = useState<string>('')

    //////////
    //■[ ブラウザバック制御 ]
    useEffect(() => {
        // コンポーネントがマウントされた後にスクロール
        const scrollTarget = document.getElementById('scrollTargetV1')
        if (scrollTarget) {
            const targetPosition = scrollTarget.offsetTop - 80;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            })
        }

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault()
            e.returnValue = '現在の入力情報が失われる可能性があります。よろしいですか？'
        }

        const handlePopState = (e: PopStateEvent) => {
            const confirmed = confirm('現在の入力情報が失われる可能性があります。よろしいですか？')
            if (confirmed) setProcessingData('entry')
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        window.addEventListener('popstate', handlePopState)
        window.history.pushState(null, '', window.location.href)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
            window.removeEventListener('popstate', handlePopState)
        }
    }, [])

    //////////
    //■[ タイマー管理 ]
    useEffect(() => {
        if (timeRemaining > 0) {
            const timer = setTimeout(() => setTimeRemaining(prev => prev - 1), 1000)
            return () => clearTimeout(timer)
        } else if (timeRemaining === 0) {
            setError('決済時間が過ぎました。最初からやり直してください。')
        }
    }, [timeRemaining])

    //////////
    //■[ 決済状態確認 ]
    useEffect(() => {
        //if (!hasSentPayment) return // 「送金しました」がクリックされてなくても、実行したいので、コメントアウト

        const checkPaymentStatus = async () => {
            try {
                // TODO: Server Actionを呼び出し
                const result = await checkCryptoPaymentStatus({transactionId:paymentDataState.transactionId})
                if (result.statusCode===401) {
                    alert(result.errMsg)
                    router.push('/auth/advertiser')
                    return
                }
                if (!result.success) {
                    throw new Error(result.errMsg)
                }
                if (result.success) {
                    if (result.status === 'completed') {
                        router.push(`/advertiser/${advertiserId}/point/purchase/success?paymentId=${paymentDataState.id}`)
                    } else if (result.status==='failed' || result.status==='expired') {
                        const errMsg = result.status==='failed' ? '決済が失敗しました。再度お試しください。' : '決済の有効期限が切れました。最初からやり直してください。';
                        setError(errMsg);
                        setHasSentPayment(false);
                        setPaymentDataState(null);
                        setProcessingData('entry');
                    }
                }
            } catch (error) {
                console.error(error)
                setError('Payment status check error.')
            }
        }

        const interval = setInterval(checkPaymentStatus, 30000) // 20秒ごと
        return () => clearInterval(interval)
    }, [hasSentPayment])


    const currencyInfo = getCurrencyInfo(selectedCurrency)

    //////////
    //■[ コピー処理 ]
    const copyToClipboard = async (text: string, type: 'address' | 'amount') => {
        try {
            await navigator.clipboard.writeText(text)
            if (type === 'address') {
                setCopiedAddress(true)
                setTimeout(() => setCopiedAddress(false), 2000)
            } else {
                setCopiedAmount(true)
                setTimeout(() => setCopiedAmount(false), 2000)
            }
        } catch (error) {
            alert(`Copy failed:${error instanceof Error ? error.message : "Something went wrong."}`);
        }
    }

    //////////
    //■[ 「送金しました」クリック時、スクロール制御 ]
    const handleSetHasSentPaymentTrue = () => {
        setHasSentPayment(true);
        setTimeout(()=>{
            // コンポーネントがマウントされた後にスクロール
            const scrollTarget = document.getElementById('scrollTargetV2')
            if (scrollTarget) {
                const targetPosition = scrollTarget.offsetTop - 80;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                })
            }
        },500)
    }



    if (!hasSentPayment) {
        return (
            <div className="space-y-6" id="scrollTargetV1">
                {/* 警告バナー */}
                <div className={`bg-gradient-to-r from-red-500 to-pink-600 rounded-xl shadow-lg overflow-hidden`}>
                    <div className="px-6 py-5">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 p-3 bg-white/20 rounded-full">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <div className="text-white">
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-start gap-2">
                                        <span className="text-yellow-300 mt-1">•</span>
                                        <span><strong className="text-yellow-200">送金金額は必ず正確に入力してください</strong> - 金額が間違っていると決済が失敗します</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-yellow-300 mt-1">•</span>
                                        <span><strong className="text-yellow-200">ウォレットアドレスは必ず正確に入力してください</strong> - アドレスが間違っていると送金が失われる可能性があります</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-yellow-300 mt-1">•</span>
                                        <span><strong className="text-yellow-200">手入力は避け、必ずコピー機能を使用してください</strong> - 手入力によるミスを防ぐため</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* タイマー */}
                <div className={`bg-gradient-to-r ${timeRemaining < 600 ? 'from-red-500 to-pink-500' : 'from-orange-500 to-red-500'} rounded-xl shadow-lg`}>
                    <div className="px-6 py-2">
                        <div className="flex items-center justify-center space-x-3">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-2xl font-mono font-bold text-white tracking-wider">
                                残り時間: {formatTime(timeRemaining)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 送金情報 */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <div className="text-2xl mr-3">{currencyInfo.icon}</div>
                        <div>
                            <div className="text-xl">{currencyInfo.name} で送金</div>
                            <div className="text-sm text-gray-500 font-normal">ご自身のウォレットを開き、以下の情報を正確に入力</div>
                        </div>
                    </h2>

                    <div className="space-y-6">
                        {/* 送金先アドレス */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                送金先アドレス
                                <span className="text-red-500 text-xs ml-2">⚠️ 必ずコピーしてください</span>
                            </label>
                            <div className="relative">
                                <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200 font-mono text-sm break-all">
                                    {paymentDataState.payAddress}
                                </div>
                                <button
                                    className="absolute top-2 right-2 h-8 w-8 p-0 bg-white border border-gray-300 rounded hover:bg-blue-50 transition-colors"
                                    onClick={() => copyToClipboard(paymentDataState.payAddress, 'address')}
                                >
                                    {copiedAddress ? (
                                        <svg className="w-4 h-4 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* 送金金額 */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                送金金額
                                <span className="text-red-500 text-xs ml-2">⚠️ 正確に入力してください</span>
                            </label>
                            <div className="relative">
                                <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200 font-mono text-xl font-bold text-green-800">
                                    {paymentDataState.payAmount} {selectedCurrency.toUpperCase()}
                                </div>
                                <button
                                    className="absolute top-2 right-2 h-8 w-8 p-0 bg-white border border-gray-300 rounded hover:bg-green-50 transition-colors"
                                    onClick={() => copyToClipboard(paymentDataState.payAmount, 'amount')}
                                >
                                    {copiedAmount ? (
                                        <svg className="w-4 h-4 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* ガス代注意 */}
                        {/* <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl">
                            <div className="flex items-start gap-3">
                                <div className="text-amber-500 text-lg">⚡</div>
                                <div>
                                    <h4 className="font-semibold text-amber-800 text-sm">ガス代について</h4>
                                    <p className="text-amber-700 text-xs mt-1">
                                        送金時に別途ガス代（ネットワーク手数料）が必要です。
                                        {selectedCurrency === 'ltc' && ' Litecoinは約数十円と最も安価です。'}
                                        {selectedCurrency === 'btc' && ' Bitcoinは数百円～数千円程度かかります。'}
                                        {selectedCurrency === 'eth' && ' Ethereumは数百円～数千円程度かかる場合があります。'}
                                    </p>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>

                {/* 送金完了ボタン */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                    <div className="p-4 text-center">
                        <div className="mb-3">
                            <h3 className="text-2xl font-bold text-white mb-2">
                                送金は完了しましたか
                                <span className="text-2xl animate-pulse">❔</span>
                            </h3>
                            <p className="text-green-100 text-sm">
                                ウォレットアプリで送金を実行した後、下のボタンを必ずクリック
                            </p>
                        </div>
                        <button
                            onClick={handleSetHasSentPaymentTrue}
                            className="bg-white text-green-600 font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-gray-100 transition-all text-lg cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl animate-bounce">✅</span>
                                送金しました
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // 送金後の待機画面
    return (
        <div className="space-y-8" id="scrollTargetV2">
            {/* 決済処理中カード */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg">
                <div className="p-8 text-center">
                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
                            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">決済処理中</h2>
                        <p className="text-gray-600">送金を確認しています。しばらくお待ちください。</p>
                    </div>
                    
                    {/* 処理時間の案内 */}
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-white/70 rounded-xl p-4">
                            <div className="text-blue-600 font-semibold mb-1">⏱️ 処理時間の目安</div>
                            <p className="text-gray-700">
                                ネットワークの混雑状況により
                                <br />
                                <span className="font-bold text-blue-700">数分～数十分</span>かかる場合があります
                            </p>
                        </div>
                        <div className="bg-white/70 rounded-xl p-4">
                            <div className="text-green-600 font-semibold mb-1">🔄 自動確認</div>
                            <p className="text-gray-700">
                                決済状況を確認中...
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 送金情報の再確認 */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-xl">📋</span>
                    送金情報の再確認
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <label className="text-sm font-semibold text-gray-600 mb-2 block">送金先アドレス</label>
                        <div className="font-mono text-xs text-gray-800 break-all">
                            {paymentDataState.payAddress}
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <label className="text-sm font-semibold text-gray-600 mb-2 block">送金金額</label>
                        <div className="font-mono text-lg font-bold text-green-700">
                            {paymentDataState.payAmount} {selectedCurrency.toUpperCase()}
                        </div>
                    </div>
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

            {/* トラブルシューティング */}
            <div className="bg-purple-50 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
                    <span className="text-xl">🛠️</span>
                    30分以上経っても反映されない場合
                </h3>
                <div className="space-y-3 text-base">
                    <div className="bg-white/80 p-4 rounded-xl">
                        <div className="text-purple-700">
                            <ul className='list-decimal list-inside'>
                                <li>
                                    送金金額,送金先アドレスに間違いがないかご確認ください。
                                    <br/>
                                    <span className='text-gray-500 text-sm pl-[16px]'>送金情報にミスがある場合、決済に失敗します。その場合は、サポート対象外です🙇‍♀️</span>
                                </li>
                                <li>
                                    サポートにお問い合わせください。取引IDや送金情報をお知らせいただくとスムーズです。
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <Link
                            href={`/advertiser/${advertiserId}/support`}
                            className="bg-white text-purple-600 border border-purple-600 px-6 py-3 rounded-xl hover:bg-purple-50 transition-colors text-sm font-medium"
                        >
                            サポートに連絡
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}