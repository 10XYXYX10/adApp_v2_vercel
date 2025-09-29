'use client'
// src/components/landing/PurchaseFlowSection.tsx
import { useState, useEffect, useRef } from 'react'

const flowSteps = [
    {
        step: 1,
        title: 'ポイント購入',
        description: 'クレジットカード or 仮想通貨',
        detail: '最低100円から購入可能',
        icon: '💰',
        color: 'from-green-500/20 to-emerald-600/20 border-green-400/30'
    },
    {
        step: 2,
        title: '広告タイプ選択',
        description: '4つの広告形式から選択',
        detail: '最低100円から購入可能',
        icon: '🎯',
        color: 'from-blue-500/20 to-cyan-600/20 border-blue-400/30'
    },
    {
        step: 3,
        title: '審査・配信開始',
        description: '審査後、すぐに配信開始',
        detail: '審査不通過でもポイント還元',
        icon: '🚀',
        color: 'from-purple-500/20 to-pink-600/20 border-purple-400/30'
    }
]

const PurchaseFlowSection = () => {
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
                    広告枠購入の流れ
                </h2>
                <p className="text-xl text-gray-400">
                    3ステップで簡単スタート
                </p>
            </div>

            {/* Flow Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {flowSteps.map((step, index) => (
                    <div key={step.step} className="relative">
                        {/* Connection Line */}
                        {index < flowSteps.length - 1 && (
                            <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-white/30 to-transparent"></div>
                        )}
                        
                        <div className={`bg-gradient-to-br ${step.color} backdrop-blur-sm border rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300`}>
                            <div className="text-5xl mb-4">{step.icon}</div>
                            <div className="bg-white/10 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4">
                                {step.step}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                                {step.title}
                            </h3>
                            <p className="text-gray-300 mb-2">
                                {step.description}
                            </p>
                            <p className="text-sm text-gray-400">
                                {step.detail}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed Flow */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white text-center mb-8">
                    詳細な流れ
                </h3>
                
                <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                        <div className="bg-green-500/20 text-green-400 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">1</div>
                        <div>
                            <h4 className="text-white font-semibold mb-2">ポイント購入</h4>
                            <ul className="text-gray-400 text-sm space-y-1">
                                <li>• クレジットカード決済 or 仮想通貨決済を選択</li>
                                <li>• 最低100円から購入可能（1P = 1円）</li>
                                <li>• 決済完了後、即座にポイント付与</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="bg-blue-500/20 text-blue-400 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">2</div>
                        <div>
                            <h4 className="text-white font-semibold mb-2">広告タイプ選択・作成</h4>
                            <ul className="text-gray-400 text-sm space-y-1">
                                <li>• 4つの広告タイプから選択</li>
                                <li>• オーバーレイ・プレロール広告は画像/動画アップロード</li>
                                <li>• YouTube広告は動画ID指定のみ</li>
                                <li>• 動画記事優先表示は記事ID指定</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="bg-purple-500/20 text-purple-400 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">3</div>
                        <div>
                            <h4 className="text-white font-semibold mb-2">審査・配信開始</h4>
                            <ul className="text-gray-400 text-sm space-y-1">
                                <li>• オーバーレイ・プレロール広告は審査あり</li>
                                <li>• YouTube広告・動画記事優先表示は審査なし</li>
                                <li>• 審査不通過時は速やかにポイント還元</li>
                                <li>• 配信状況をリアルタイムで確認可能</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Audit Guidelines */}
            <div className="mt-8 bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-sm border border-red-400/30 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-red-300 mb-4">審査基準について</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <h4 className="text-red-400 font-semibold mb-2">審査不通過の基準:</h4>
                        <ul className="text-gray-400 space-y-1">
                            <li>• 無修正画像や動画</li>
                            <li>• 詐欺広告</li>
                            <li>• 児童ポルノ・暴力的コンテンツ</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-green-400 font-semibold mb-2">審査なしの広告:</h4>
                        <ul className="text-gray-400 space-y-1">
                            <li>• YouTube広告（短編・長編）</li>
                            <li>• 動画記事優先表示</li>
                            <li>• 即座に配信開始</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-blue-400 font-semibold mb-2">安心のシステム:</h4>
                        <ul className="text-gray-400 space-y-1">
                            <li>• 審査不通過時のポイント還元</li>
                            <li>• リアルタイム配信状況確認</li>
                            <li>• 透明性の高い課金体系</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PurchaseFlowSection