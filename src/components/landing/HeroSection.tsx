// src/components/landing/HeroSection.tsx
import Link from "next/link"

const HeroSection = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>
            
            {/* Main Content */}
            <div className="relative z-10 max-w-6xl mx-auto text-center">
                {/* Logo/Brand Area */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                        AdultAd Platform
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-light">
                        成人向けサイト専用広告プラットフォーム
                    </p>
                </div>

                {/* Key Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                        <div className="text-3xl mb-3">🎯</div>
                        <h3 className="text-lg font-semibold text-white mb-2">手軽に広告配信</h3>
                        <p className="text-sm text-gray-400">EchiEchiTubeなどの動画配信サービスに誰でも簡単に広告出稿</p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                        <div className="text-3xl mb-3">🔞</div>
                        <h3 className="text-lg font-semibold text-white mb-2">アダルト広告OK</h3>
                        <p className="text-sm text-gray-400">大手では取扱不可のアダルト広告も安心して配信可能</p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                        <div className="text-3xl mb-3">💯</div>
                        <h3 className="text-lg font-semibold text-white mb-2">100円から開始</h3>
                        <p className="text-sm text-gray-400">Google広告などと違って最低100円から気軽にスタート</p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                        <div className="text-3xl mb-3">📊</div>
                        <h3 className="text-lg font-semibold text-white mb-2">リアルタイム分析</h3>
                        <p className="text-sm text-gray-400">配信状況を リアルタイムで確認可能</p>
                    </div>
                </div>

                {/* Main CTA */}
                <div className="space-y-4">
                    <p className="text-lg text-gray-300">
                        まずは100円から試してみませんか？
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                          href='/auth/advertiser'
                          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"  
                        >
                            無料で始める
                        </Link>
                    </div>
                </div>
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
                </div>
            </div>
        </section>
    )
}
export default HeroSection