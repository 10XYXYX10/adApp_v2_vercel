'use client'
// src/components/ad/detail/admin/AdminReviewPageClient.tsx
import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Shield, CheckCircle, Clock, User, Calendar, AlertTriangle } from 'lucide-react'

import { AdStatsTypes, AdvertisementDetail } from '@/lib/types/ad/adTypes'
import { ReviewAction, RejectReason } from '@/lib/types/ad/adAdminTypes'

import { reviewAction } from '@/actions/ad/adminReviewActions'

import SpinnerModal from '@/components/SpinnerModal'
import AdminReviewActions from './AdminReviewActions' //L198
import AdOverviewCard from '../AdOverviewCard' //L212
import AdTypeSpecificContent from '../AdTypeSpecificContent' //L226
import Link from 'next/link'


type Props = {
    adminId: number
    advertisement: AdvertisementDetail
}

const statusConfigs = {
    draft: { label: '下書き', color: 'gray', bg: 'bg-gray-100', text: 'text-gray-700' },
    pending: { label: '審査待ち', color: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-700' },
    approved: { label: '承認済み', color: 'green', bg: 'bg-green-100', text: 'text-green-700' },
    rejected: { label: '却下', color: 'red', bg: 'bg-red-100', text: 'text-red-700' },
    active: { label: '配信中', color: 'blue', bg: 'bg-blue-100', text: 'text-blue-700' },
    paused: { label: '一時停止', color: 'orange', bg: 'bg-orange-100', text: 'text-orange-700' }
}

export default function AdminReviewPageClient({ adminId, advertisement }: Props) {
    const router = useRouter()
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [adStatus,setAdStatus] = useState(advertisement.status as AdStatsTypes);
    //const statusConfig = statusConfigs[adStatus as keyof typeof statusConfigs] || statusConfigs.draft;
    const statusConfig = useMemo( () => {
        return statusConfigs[adStatus as keyof typeof statusConfigs] || statusConfigs.draft
    },[adStatus] )

    //////////
    //■[ 審査アクション実行 ]
    const handleReviewAction = async (action: ReviewAction, reason: RejectReason, comment: string) => {
        setIsProcessing(true)
        setError(null)

        try {
            const result = await reviewAction({
                adminId,
                adId: advertisement.id,
                action,
                reason,
                comment
            })

            if (result.statusCode === 401 || result.statusCode === 403) {
                alert(result.errMsg)
                router.push('/auth/admin')
                return
            }

            if (!result.success) {
                setError(result.errMsg)
                return
            }

            // 成功時の処理
            if (action === 'approve') {
                alert('広告を承認しました')
                setAdStatus('active')
            } else {
                alert('広告を却下し、削除しました')
                router.push(`/admin/${adminId}/review`)
                return;
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : '処理中にエラーが発生しました')
        } finally {
            setIsProcessing(false)
        }
    }

    return (<>
        {isProcessing&&<SpinnerModal/>}
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* 背景装飾エフェクト */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="relative z-10">
                {/* ヘッダーセクション */}
                <header className="backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            {/* 左側：基本情報 */}
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <motion.div
                                        className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg"
                                        whileHover={{ scale: 1.05, rotate: 5 }}
                                    >
                                        <Shield className="w-6 h-6 text-white" />
                                    </motion.div>
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent">
                                            広告審査
                                        </h1>
                                        <p className="text-gray-600 text-sm sm:text-base mt-1">
                                            ID: #{advertisement.id} の詳細審査
                                        </p>
                                    </div>
                                </div>

                                {/* 審査情報カード */}
                                <div className="grid sm:grid-cols-3 gap-3">
                                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/40">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                            <User className="w-4 h-4" />
                                            申請者
                                        </div>
                                        <div className="font-medium text-gray-900">{advertisement.user.name}</div>
                                    </div>

                                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/40">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                            <Calendar className="w-4 h-4" />
                                            申請日時
                                        </div>
                                        <div className="font-medium text-gray-900">
                                            {new Date(advertisement.createdAt).toLocaleDateString('ja-JP')}
                                        </div>
                                    </div>

                                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/40">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                            <Clock className="w-4 h-4" />
                                            ステータス
                                        </div>
                                        <div className={`${statusConfig.bg} ${statusConfig.text} px-2 py-1 rounded-full text-xs font-medium inline-block`}>
                                            {statusConfig.label}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 右側：ナビゲーション */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                    href={`/admin/${adminId}/review`}
                                    className="inline-flex items-center justify-center gap-2 bg-white/70 hover:bg-white/90 text-gray-700 px-4 py-2.5 rounded-xl font-medium border border-white/50 hover:border-gray-200 transition-all duration-300 backdrop-blur-sm"
                                >
                                    ← 審査一覧に戻る
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* メインコンテンツエリア */}
                <main className="container mx-auto px-4 py-8">
                    {/* グローバルエラー表示 */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-red-50/70 backdrop-blur-xl border border-red-200 rounded-2xl p-4 mb-8"
                            >
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-red-700 font-medium text-sm">エラーが発生しました</p>
                                        <p className="text-red-600 text-sm mt-1">{error}</p>
                                    </div>
                                    <button
                                        onClick={() => setError(null)}
                                        className="ml-auto text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-8">
                        {/* 審査アクションエリア */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <AdminReviewActions
                                advertisement={advertisement}
                                isProcessing={isProcessing}
                                onReviewAction={handleReviewAction}
                                adStatus={adStatus}
                            />
                        </motion.section>

                        {/* 詳細統計セクション */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <AdOverviewCard advertisement={advertisement} />
                        </motion.section>

                        {/* 広告コンテンツセクション */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-6"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                広告コンテンツ審査
                            </h2>
                            <AdTypeSpecificContent advertisement={advertisement} />
                        </motion.section>
                    </div>
                </main>
            </div>
        </div>
    </>)
}