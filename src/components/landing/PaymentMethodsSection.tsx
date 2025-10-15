'use client'
// // src/components/landing/PaymentMethodsSection.tsx
import { useState, useEffect, useRef } from 'react'

const PaymentMethodsSection = () => {
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true)
            },
            { threshold: 0.2 }
        )

        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <div 
            ref={sectionRef}
            className={`max-w-6xl mx-auto transform transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    決済方法
                </h2>
                <p className="text-xl text-gray-400">
                    クレジットカード・仮想通貨に対応
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 mb-12">
                {/* Crypto Payment */}
                <div className="bg-gradient-to-br from-orange-500/20 to-yellow-600/20 backdrop-blur-sm border border-orange-400/30 rounded-[50%] p-8 hover:scale-105 transition-all duration-300">
                    <div className="text-center">
                        <div className="text-5xl mb-6">₿</div>
                        <h3 className="text-2xl font-bold text-white mb-4">
                            仮想通貨決済
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-center space-x-4">
                                <div className="bg-orange-500/20 px-3 py-2 rounded-lg">
                                    <span className="text-orange-300 font-bold">BTC</span>
                                </div>
                                <div className="bg-blue-500/20 px-3 py-2 rounded-lg">
                                    <span className="text-blue-300 font-bold">ETH</span>
                                </div>
                                <div className="bg-gray-500/20 px-3 py-2 rounded-lg">
                                    <span className="text-gray-300 font-bold">LTC</span>
                                </div>
                                <div className="bg-gray-500/20 px-3 py-2 rounded-lg">
                                    <span className="text-gray-300 font-bold">USDC</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-orange-500/10 rounded-lg inline-block">
                            <p className="text-sm text-orange-300 text-left">
                                ・匿名性重視<br/>
                                ・国際送金手数料削減
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Points */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <div className="text-3xl text-green-400 font-bold mb-2">100円</div>
                        <p className="text-white font-semibold mb-1">最低入金額</p>
                        <p className="text-sm text-gray-400">初めての方におすすめ</p>
                    </div>
                    <div>
                        <div className="text-3xl text-blue-400 font-bold mb-2">即時反映</div>
                        <p className="text-white font-semibold mb-1">ポイント付与</p>
                        <p className="text-sm text-gray-400">決済完了後すぐ利用可能</p>
                    </div>
                    <div>
                        <div className="text-3xl text-purple-400 font-bold mb-2">安全</div>
                        <p className="text-white font-semibold mb-1">セキュア決済</p>
                        <p className="text-sm text-gray-400">SSL暗号化・PCI準拠</p>
                    </div>
                </div>
            </div>

            {/* Try Now Banner */}
            <div className="mt-8 bg-gradient-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-sm border border-pink-400/30 rounded-2xl p-6 text-center">
                <p className="text-white text-lg mb-2">
                    まずは100円から試してみませんか？
                </p>
                <p className="text-gray-400 text-sm">
                    gmailアドレスでも登録可能！手軽にスタート
                </p>
            </div>
        </div>
    )
}
export default PaymentMethodsSection