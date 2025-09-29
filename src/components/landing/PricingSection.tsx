'use client'
// src/components/landing/PricingSection.tsx
import { useState, useEffect, useRef } from 'react'

const PricingSection = () => {
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
                    料金体系
                </h2>
                <p className="text-xl text-gray-400">
                    シンプルで分かりやすいポイント制
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Point System */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6 text-center hover:scale-105 transition-all duration-300">
                    <div className="text-4xl mb-4">💰</div>
                    <h3 className="text-xl font-bold text-white mb-2">ポイント制</h3>
                    <p className="text-2xl font-bold text-purple-400 mb-2">1P = 1円</p>
                    <p className="text-sm text-gray-400">分かりやすい料金設定</p>
                </div>

                {/* Priority Display */}
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-6 text-center hover:scale-105 transition-all duration-300">
                    <div className="text-4xl mb-4">📍</div>
                    <h3 className="text-xl font-bold text-white mb-2">優先表示</h3>
                    <p className="text-lg text-blue-400 mb-1">クリック 1P</p>
                    <p className="text-lg text-blue-400 mb-2">表示 0.1P</p>
                    <p className="text-sm text-gray-400">記事一覧で優先表示</p>
                </div>

                {/* Overlay Ad */}
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-6 text-center hover:scale-105 transition-all duration-300">
                    <div className="text-4xl mb-4">🎯</div>
                    <h3 className="text-xl font-bold text-white mb-2">オーバーレイ</h3>
                    <p className="text-lg text-green-400 mb-1">クリック 1P</p>
                    <p className="text-lg text-green-400 mb-2">表示 0.1P</p>
                    <p className="text-sm text-gray-400">動画プレイヤー上表示</p>
                </div>

                {/* Video Ads */}
                <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-6 text-center hover:scale-105 transition-all duration-300">
                    <div className="text-4xl mb-4">🎬</div>
                    <h3 className="text-xl font-bold text-white mb-2">動画広告</h3>
                    <p className="text-lg text-red-400 mb-1">プレロール 2円</p>
                    <p className="text-lg text-red-400 mb-2">YouTube 1.5-3円</p>
                    <p className="text-sm text-gray-400">1再生あたり</p>
                </div>
            </div>

            {/* Key Benefits */}
            <div className="mt-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <div className="text-3xl text-green-400 font-bold mb-2">100円</div>
                        <p className="text-white font-semibold mb-1">最低入金額</p>
                        <p className="text-sm text-gray-400">気軽にお試し可能</p>
                    </div>
                    <div>
                        <div className="text-3xl text-blue-400 font-bold mb-2">前払い制</div>
                        <p className="text-white font-semibold mb-1">ポイント消費</p>
                        <p className="text-sm text-gray-400">予算管理が簡単</p>
                    </div>
                    <div>
                        <div className="text-3xl text-purple-400 font-bold mb-2">リアルタイム</div>
                        <p className="text-white font-semibold mb-1">消費状況確認</p>
                        <p className="text-sm text-gray-400">透明性の高い課金</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PricingSection