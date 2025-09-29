'use client'
// src/components/landing/AdTypeShowcase.tsx
import { useState, useEffect, useRef } from 'react'
import PriorityAdComponent from '@/components/ad/previews/PriorityAdComponent'
import VideoPlayerHover from '@/components/ad/previews/VideoPlayerHover'
import PrerollAdComponent from '@/components/ad/previews/PrerollAdComponent'
import YouTubeShortAdComponent from '@/components/ad/previews/YouTubeShortAdComponent'

const adTypes = [
    {
        id: 1,
        title: '動画記事優先表示',
        description: '一覧ページで優先表示、最大10枠',
        pricing: 'クリック1P / 表示0.1P',
        component: PriorityAdComponent
    },
    {
        id: 2,
        title: 'オーバーレイ広告',
        description: '動画プレイヤー上に表示',
        pricing: 'クリック1P / 表示0.1P',
        component: VideoPlayerHover
    },
    {
        id: 3,
        title: 'プレロール広告',
        description: '30秒動画、10秒必須視聴',
        pricing: '1再生2円',
        component: PrerollAdComponent
    },
    {
        id: 4,
        title: 'YouTube広告',
        description: 'YouTube動画再生数増加',
        pricing: 'Short 1.5円 / Long 3円',
        component: YouTubeShortAdComponent
    }
]

const AdTypeShowcase = () => {
    const [visibleItems, setVisibleItems] = useState<number[]>([])
    const observerRef = useRef<IntersectionObserver | null>(null)
    const itemRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const itemId = parseInt(entry.target.getAttribute('data-item-id') || '0')
                    if (entry.isIntersecting) {
                        setVisibleItems(prev => prev.includes(itemId) ? prev : [...prev, itemId])
                    }
                })
            },
            { threshold: 0.2 }
        )

        itemRefs.current.forEach((ref, index) => {
            if (ref && observerRef.current) {
                ref.setAttribute('data-item-id', String(index + 1))
                observerRef.current.observe(ref)
            }
        })

        return () => observerRef.current?.disconnect()
    }, [])

    return (
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    広告タイプ
                </h2>
                <p className="text-xl text-gray-400">
                    4つの広告形式から選択可能
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                {adTypes.map((adType, index) => {
                    const Component = adType.component
                    const isVisible = visibleItems.includes(adType.id)
                    
                    return (
                        <div
                            key={adType.id}
                            ref={(el) => { itemRefs.current[index] = el }}
                            className={`transform transition-all duration-700 ${
                                isVisible 
                                    ? 'opacity-100 translate-y-0' 
                                    : 'opacity-0 translate-y-8'
                            }`}
                        >
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all duration-300">
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {adType.title}
                                    </h3>
                                    <p className="text-gray-400 mb-2">
                                        {adType.description}
                                    </p>
                                    <p className="text-pink-400 font-semibold">
                                        {adType.pricing}
                                    </p>
                                </div>
                                
                                <div className="flex justify-center">
                                    {isVisible && <Component />}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
export default AdTypeShowcase