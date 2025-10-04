'use client'
// src/components/payment/PaymentPolling.tsx
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useUpdateAmount } from '@/hooks/point/useUpdateAmount'
import { CompletedPaymentItem, PendingPaymentItem } from '@/lib/types/payment/paymentTypes'
import { formatDate } from '@/lib/functions/usefulFunctions'
import { checkPendingPayments } from '@/actions/payment/paymentActions'

const getPaymentMethodName = (method: string) => {
    switch (method) {
        case 'creditcard': return 'クレジットカード'
        case 'btc': return 'Bitcoin'
        case 'eth': return 'Ethereum'
        case 'ltc': return 'Litecoin'
        default: return method.toUpperCase()
    }
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'completed': return 'text-green-600 bg-green-100'
        case 'failed': return 'text-red-600 bg-red-100'
        case 'expired': return 'text-gray-600 bg-gray-100'
        default: return 'text-orange-600 bg-orange-100'
    }
}

export default function PaymentPolling({
    advertiserId
}:{
    advertiserId: number
}) {
    const updateAmount = useUpdateAmount()
    const [pendingPayments, setPendingPayments] = useState<PendingPaymentItem[]>([])
    const [completedPayments, setCompletedPayments] = useState<CompletedPaymentItem[]>([])
    const [isPolling, setIsPolling] = useState(false)
    const [pollingCount, setPollingCount] = useState(0)
    const [error, setError] = useState<string>('')
    
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    
    // **非同期処理の競合状態回避**
    // - `executePolling`は非同期関数で、コンポーネントがアンマウントされた後も実行される可能性がある
    // - stateは非同期処理中に変更されると再レンダリングが発生し、予期しない副作用を起こす
    // - refは即座に値を変更でき、非同期処理内で最新の状態を確実に参照できる
    // **stateで管理しない理由：**
    // 1. **レンダリング不要** - アクティブ状態はUIに影響しない内部制御用
    // 2. **即座の更新** - useEffect cleanup時に即座に無効化する必要がある
    // 3. **競合回避** - setState の非同期性により、古い状態で処理が継続されるリスクを回避
    const isActiveRef = useRef(true);//レンダリングに影響しない、即座に参照可能な値

    const executePolling = async () => {
        if (!isActiveRef.current) return //非同期処理開始前のチェック
        
        setIsPolling(true)
        setError('')
        try {
            const result = await checkPendingPayments({ advertiserId }) 
            // executePolling開始 → checkPendingPayments実行中... → ユーザーがページ離脱 → cleanup実行 → checkPendingPayments完了 → ここで2回目チェックが重要
            if (!isActiveRef.current) return//非同期処理完了後、state更新前のチェック
            
            if (result.success) {
                setPendingPayments(result.pendingPayments)
                
                // 新しく完了した決済があれば追加
                if (result.completedPayments.length > 0) {
                    setCompletedPayments(prev => [...result.completedPayments, ...prev])
                }
                
                // 残高更新があれば store を更新
                if (result.newBalance) {
                    updateAmount(Number(result.newBalance))
                }
                
                // polling 終了条件
                if (result.pendingPayments.length === 0) {
                    setIsPolling(false)
                    return
                }
                
                // 次回 polling スケジュール
                setPollingCount(prev => prev + 1)
                const nextInterval = pollingCount < 5 ? 30000 : 90000 // 5回まで30s、以降90s
                
                timeoutRef.current = setTimeout(() => {
                    executePolling()
                }, nextInterval)
                
            } else {
                setError(result.errMsg || 'ポーリング処理に失敗しました')
            }
        } catch (err) {
            if (isActiveRef.current) {
                setError('ネットワークエラーが発生しました')
            }
        } finally {
            if (isActiveRef.current) {
                setIsPolling(false)
            }
        }
    }

    // 初回実行
    useEffect(() => {
        // ## メモ：`isActiveRef.current = true;` が必要な理由
        // * **完全リロード時**
        //   * コンポーネントが最初から生成されるため、`useRef(true)` の初期値がそのまま使われる
        //   * → `isActiveRef.current = true` なので問題なくポーリング開始できる
        // * **SPA遷移（Link遷移）+ 開発環境（React18 StrictMode）**
        //   * StrictModeの挙動で `useEffect` が「マウント → cleanup → 再マウント」される
        //   * 1回目 cleanup で `isActiveRef.current = false` になる
        //   * 2回目マウントでも初期値に戻らず **false のまま**
        //   * → `executePolling()` 冒頭で return して処理が進まない
        isActiveRef.current = true;

        executePolling()
        
        return () => {
            isActiveRef.current = false
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])


    const hasPendingPayments = pendingPayments.length > 0
    const hasCompletedPayments = completedPayments.length > 0

    if (!hasPendingPayments && !hasCompletedPayments && !isPolling) {
        return (
            <div className="p-4 text-center">
                <div className="text-gray-500 text-sm">
                    処理中の決済はありません
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-red-800 text-sm">{error}</div>
                </div>
            )}

            {/* PC: 横並び表示 */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4">
                {/* A: Pending 決済 */}
                <div className="space-y-2">
                    {hasPendingPayments && (
                        <>
                            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                <h3 className="text-sm font-medium text-orange-800">
                                    処理中 ({pendingPayments.length}件)
                                </h3>
                            </div>
                            <div className="space-y-2">
                                {pendingPayments.map((payment) => (
                                    <div key={payment.id} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                                        <div className="text-xs text-orange-700 font-medium mb-1">
                                            {getPaymentMethodName(payment.paymentMethod)}
                                        </div>
                                        <div className="text-sm font-semibold text-orange-800">
                                            ¥{Number(payment.totalAmount).toLocaleString()}
                                        </div>
                                        <div className="text-xs text-orange-600 mt-1">
                                            {formatDate(payment.createdAt)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* B: Completed 決済 */}
                <div className="space-y-2">
                    {hasCompletedPayments && (
                        <>
                            <div className="px-3 py-2 bg-blue-50 rounded-lg">
                                <h3 className="text-sm font-medium text-blue-800">
                                    処理完了 ({completedPayments.length}件)
                                </h3>
                            </div>
                            <div className="space-y-2">
                                {completedPayments.map((payment) => (
                                    <div key={payment.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-xs text-blue-700 font-medium">
                                                {getPaymentMethodName(payment.paymentMethod)}
                                            </div>
                                            <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                                                {payment.status === 'completed' ? '完了' : 
                                                 payment.status === 'failed' ? '失敗' : '期限切れ'}
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-blue-800 mb-2">
                                            ¥{Number(payment.totalAmount).toLocaleString()}
                                        </div>
                                        <div className="flex gap-2">
                                            {/*<Link
                                                href={`/advertiser/${advertiserId}/payment/${payment.id}`}
                                                className="text-xs text-blue-600 hover:text-blue-800 underline"
                                            >
                                                決済詳細
                                            </Link>*/}
                                            {payment.pointId && (
                                                <Link
                                                    href={`/advertiser/${advertiserId}/point/${payment.pointId}`}
                                                    className="ml-auto text-xs text-green-600 hover:text-green-800 underline"
                                                >
                                                    ポイント詳細
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* モバイル: 縦積み表示 */}
            <div className="lg:hidden space-y-4">
                {hasPendingPayments && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg">
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                            <h3 className="text-sm font-medium text-orange-800">
                                処理中 ({pendingPayments.length}件)
                            </h3>
                        </div>
                        {pendingPayments.map((payment) => (
                            <div key={payment.id} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-xs text-orange-700 font-medium mb-1">
                                            {getPaymentMethodName(payment.paymentMethod)}
                                        </div>
                                        <div className="text-xs text-orange-600">
                                            {formatDate(payment.createdAt)}
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold text-orange-800">
                                        ¥{Number(payment.totalAmount).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {hasCompletedPayments && (
                    <div className="space-y-2">
                        <div className="px-3 py-2 bg-blue-50 rounded-lg">
                            <h3 className="text-sm font-medium text-blue-800">
                                処理完了 ({completedPayments.length}件)
                            </h3>
                        </div>
                        {completedPayments.map((payment) => (
                            <div key={payment.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-xs text-blue-700 font-medium">
                                        {getPaymentMethodName(payment.paymentMethod)}
                                    </div>
                                    <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                                        {payment.status === 'completed' ? '完了' : 
                                         payment.status === 'failed' ? '失敗' : '期限切れ'}
                                    </div>
                                </div>
                                <div className="text-sm font-semibold text-blue-800 mb-2">
                                    ¥{Number(payment.totalAmount).toLocaleString()}
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/advertiser/${advertiserId}/payment/${payment.id}`}
                                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                                    >
                                        決済詳細
                                    </Link>
                                    {payment.pointId && (
                                        <Link
                                            href={`/advertiser/${advertiserId}/point/${payment.pointId}`}
                                            className="text-xs text-green-600 hover:text-green-800 underline"
                                        >
                                            ポイント詳細
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ポーリング状態インジケータ */}
            {isPolling && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
                    <span className="text-xs text-gray-600">
                        決済状況を確認中... ({pollingCount + 1}回目)
                    </span>
                </div>
            )}
        </div>
    )
}