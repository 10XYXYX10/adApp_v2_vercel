'use client'
// src/components/ad/admin/AdminReviewActions.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { AdStatsTypes, AdvertisementDetail } from '@/lib/types/ad/adTypes'
import { ReviewAction, RejectReason, REJECT_REASON_MESSAGES } from '@/lib/types/ad/adAdminTypes'
import { CheckCircle, XCircle, MessageSquare, RefreshCw } from 'lucide-react'

type Props = {
    advertisement: AdvertisementDetail
    isProcessing: boolean
    onReviewAction: (action: ReviewAction, reason: RejectReason, comment: string) => void
    adStatus: AdStatsTypes
}

export default function AdminReviewActions({ advertisement, isProcessing, onReviewAction, adStatus }: Props) {
    const [selectedAction, setSelectedAction] = useState<ReviewAction | null>(null)
    const [selectedReason, setSelectedReason] = useState<RejectReason>('other')
    const [comment, setComment] = useState('')

    //////////
    //■[ 審査実行 ]
    const handleSubmit = () => {
        if (!selectedAction) return
        if (selectedAction === 'reject' && !selectedReason) return

        onReviewAction(selectedAction, selectedReason, comment)
        // フォームリセット
        setSelectedAction(null)
        setSelectedReason('other')
        setComment('')
    }

    //////////
    //■[ 審査可能チェック ]
    //const canReview = advertisement.status === 'pending'

    // if (!canReview) {
    //     return (
    //         <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-6">
    //             <div className="text-center py-8">
    //                 <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-blue-100 rounded-full flex items-center justify-center">
    //                     <AlertTriangle className="w-8 h-8 text-gray-400" />
    //                 </div>
    //                 <h3 className="text-lg font-bold text-gray-900 mb-2">審査対象外</h3>
    //                 <p className="text-gray-600">
    //                     この広告は既に審査済みです（ステータス: {advertisement.status}）
    //                 </p>
    //             </div>
    //         </div>
    //     )
    // }

    return (
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl overflow-hidden">
            {/* ヘッダー */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6">
                <div className="flex items-center gap-3">
                    <motion.div 
                        className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                        <CheckCircle className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                        <h2 className="text-xl font-bold text-white">審査アクション</h2>
                        <p className="text-white/90 text-sm">広告ID: #{advertisement.id} の審査を実行</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* アクション選択 */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">審査結果を選択</h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                        {/* 承認ボタン */}
                        <motion.button
                            onClick={() => setSelectedAction('approve')}
                            disabled={isProcessing || adStatus==='active'}
                            className={`p-4 rounded-2xl border-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                                selectedAction === 'approve'
                                    ? 'border-green-300 bg-green-50'
                                    : 'border-gray-200 bg-white hover:border-green-200 hover:bg-green-50/50'
                            }`}
                            whileHover={{ scale: selectedAction === 'approve' ? 1 : 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    selectedAction === 'approve' ? 'bg-green-500' : 'bg-green-100'
                                }`}>
                                    <CheckCircle className={`w-5 h-5 ${
                                        selectedAction === 'approve' ? 'text-white' : 'text-green-600'
                                    }`} />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-gray-900">承認</div>
                                    <div className="text-sm text-gray-600">広告を承認し配信開始</div>
                                </div>
                            </div>
                        </motion.button>

                        {/* 却下ボタン */}
                        <motion.button
                            onClick={() => setSelectedAction('reject')}
                            disabled={isProcessing}
                            className={`p-4 rounded-2xl border-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                                selectedAction === 'reject'
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-gray-200 bg-white hover:border-red-200 hover:bg-red-50/50'
                            }`}
                            whileHover={{ scale: selectedAction === 'reject' ? 1 : 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    selectedAction === 'reject' ? 'bg-red-500' : 'bg-red-100'
                                }`}>
                                    <XCircle className={`w-5 h-5 ${
                                        selectedAction === 'reject' ? 'text-white' : 'text-red-600'
                                    }`} />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-gray-900">却下</div>
                                    <div className="text-sm text-gray-600">広告を却下し削除</div>
                                </div>
                            </div>
                        </motion.button>
                    </div>
                </div>

                {/* 却下理由選択（却下選択時のみ表示） */}
                {selectedAction === 'reject' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-bold text-gray-900">却下理由を選択</h3>
                        
                        <div className="space-y-2">
                            {Object.entries(REJECT_REASON_MESSAGES).map(([key, message]) => (
                                <motion.label
                                    key={key}
                                    className={`block p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                                        selectedReason === key
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-200 bg-white hover:border-red-200'
                                    }`}
                                    whileHover={{ scale: 1.01 }}
                                >
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="radio"
                                            name="rejectReason"
                                            value={key}
                                            checked={selectedReason === key}
                                            onChange={(e) => setSelectedReason(e.target.value as RejectReason)}
                                            className="mt-1 text-red-600 focus:ring-red-500"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 text-sm mb-1">
                                                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </div>
                                            <div className="text-xs text-gray-600">{message}</div>
                                        </div>
                                    </div>
                                </motion.label>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* 追加コメント入力 */}
                {selectedAction && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            追加メッセージ（任意）
                        </h3>
                        
                        <div className="relative">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={`${selectedAction === 'approve' ? '承認' : '却下'}に関する追加コメントがあれば入力してください...`}
                                disabled={isProcessing}
                                className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                rows={3}
                                maxLength={500}
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                                {comment.length}/500
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 実行ボタン */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                    <motion.button
                        onClick={handleSubmit}
                        disabled={!selectedAction || isProcessing}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                            selectedAction === 'approve'
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg'
                                : selectedAction === 'reject'
                                ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg'
                                : 'bg-gray-200 text-gray-500'
                        }`}
                        whileHover={{ scale: selectedAction ? 1.02 : 1 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isProcessing ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                処理中...
                            </>
                        ) : selectedAction === 'approve' ? (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                承認して配信開始
                            </>
                        ) : selectedAction === 'reject' ? (
                            <>
                                <XCircle className="w-4 h-4" />
                                却下して削除
                            </>
                        ) : (
                            '審査結果を選択してください'
                        )}
                    </motion.button>
                </div>
            </div>
        </div>
    )
}