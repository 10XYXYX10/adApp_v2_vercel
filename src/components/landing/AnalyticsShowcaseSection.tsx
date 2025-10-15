'use client'
// src/components/landing/AnalyticsShowcaseSection.tsx
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

const AnalyticsShowcaseSection = () => {
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
        <section className="py-20 px-4">
            <div 
                ref={sectionRef}
                className={`max-w-6xl mx-auto transform transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
                {/* Section Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        配信状況をリアルタイムで確認
                    </h2>
                    <p className="text-xl text-gray-400">
                        詳細な分析データでパフォーマンスを最適化
                    </p>
                </div>

                {/* Analytics Image */}
                <div className="text-center mb-16">
                    <Image 
                        src="/images/analytics_small.png" 
                        width={1024}
                        height={787}
                        alt="リアルタイム分析ダッシュボード"
                        className="w-full max-w-3xl mx-auto rounded-2xl shadow-2xl border border-white/10"
                    />
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300">
                        <div className="text-4xl mb-4">📈</div>
                        <h3 className="text-xl font-bold text-white mb-4">詳細分析</h3>
                        <p className="text-gray-300">日別・時間別の詳細なパフォーマンス分析でROIを最大化</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300">
                        <div className="text-4xl mb-4">⚡</div>
                        <h3 className="text-xl font-bold text-white mb-4">リアルタイム更新</h3>
                        <p className="text-gray-300">数秒間隔でデータが自動更新され、即座に効果を確認可能</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300">
                        <div className="text-4xl mb-4">💡</div>
                        <h3 className="text-xl font-bold text-white mb-4">改善提案</h3>
                        <p className="text-gray-300">データに基づく広告最適化のヒントで成果を向上</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default AnalyticsShowcaseSection