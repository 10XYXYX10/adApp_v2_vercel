'use client'
// // src/components/landing/CTASection.tsx
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const CTASection = () => {
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
            {/* Main CTA */}
            <div className="relative overflow-hidden bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center">
                {/* Animated Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute -top-1/2 -left-1/2 w-96 h-96 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-3xl animate-spin-slow"></div>
                    <div className="absolute -bottom-1/2 -right-1/2 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse"></div>
                </div>

                <div className="relative z-10">
                    <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent mb-6">
                        今すぐ始める
                    </h2>
                    
                    <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
                        登録に必要なのは、メールアドレス・アカウント名・パスワードのみ
                    </p>
                    
                    <p className="text-lg text-gray-400 mb-8">
                        gmailアドレスでもOK！手軽にスタート
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                        <Link href="/auth/advertiser" className="group">
                            <button className="relative px-12 py-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-xl font-bold rounded-2xl shadow-2xl hover:shadow-pink-500/30 transform hover:scale-110 transition-all duration-500 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                <span className="relative">無料登録・広告開始</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
                <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <div className="text-3xl mb-3">⚡</div>
                    <h3 className="text-white font-semibold mb-2">即座に開始</h3>
                    <p className="text-sm text-gray-400">登録後すぐに広告配信可能</p>
                </div>
                
                <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <div className="text-3xl mb-3">💯</div>
                    <h3 className="text-white font-semibold mb-2">100円から</h3>
                    <p className="text-sm text-gray-400">最低入金額で気軽にお試し</p>
                </div>
                
                <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <div className="text-3xl mb-3">📊</div>
                    <h3 className="text-white font-semibold mb-2">リアルタイム</h3>
                    <p className="text-sm text-gray-400">配信状況を即座に確認</p>
                </div>
                
                <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <div className="text-3xl mb-3">🔒</div>
                    <h3 className="text-white font-semibold mb-2">安全・安心</h3>
                    <p className="text-sm text-gray-400">SSL暗号化・審査システム</p>
                </div>
            </div>

            {/* Final Message */}
            <div className="text-center mt-12 p-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm border border-green-400/20 rounded-2xl">
                <p className="text-lg text-green-300 mb-2">
                    成人向けサイトの収益化を、もっと簡単に
                </p>
                <p className="text-gray-400">
                    従来の広告プラットフォームでは難しかった分野での広告配信を実現
                </p>
            </div>
        </div>
    )
}

// Custom animation for slow rotation
const style = `
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}
`

if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style')
    styleElement.textContent = style
    document.head.appendChild(styleElement)
}

export default CTASection