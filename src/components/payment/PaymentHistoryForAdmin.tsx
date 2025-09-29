'use client'
// src/components/payment/PaymentHistoryForAdmin.tsx
import { useState, useEffect } from 'react'
import { IconCreditCard, IconRefresh, IconChevronLeft, IconChevronRight, IconClock, IconCheck, IconX, IconAlertTriangle, IconUser } from '@tabler/icons-react'
import { PaymentData_Strict } from '@/lib/types/payment/paymentTypes'
import { formatDate } from '@/lib/functions/usefulFunctions'
import { getPaymentHistory, checkPendingPayments } from '@/actions/payment/paymentActions'

const dispCount = Number(process.env.NEXT_PUBLIC_DISPLAY_PAYMENT_AND_POINT_COUNT) || 5

// ========== 型定義 ==========
interface PaymentWithUser extends PaymentData_Strict {
  userName?: string
  advertiserIdInfo?: number
}

type PaymentStatus = 'completed' | 'pending' | 'failed' | 'expired'

interface StatusStyle {
  icon: typeof IconCheck
  color: string
  bgColor: string
  label: string
}

// ========== 定数 ==========
const STATUS_STYLES: Record<PaymentStatus | 'default', StatusStyle> = {
  completed: { icon: IconCheck, color: 'text-green-600', bgColor: 'bg-green-100', label: '完了' },
  pending: { icon: IconClock, color: 'text-orange-600', bgColor: 'bg-orange-100', label: '処理中' },
  failed: { icon: IconX, color: 'text-red-600', bgColor: 'bg-red-100', label: '失敗' },
  expired: { icon: IconAlertTriangle, color: 'text-gray-600', bgColor: 'bg-gray-100', label: '期限切れ' },
  default: { icon: IconClock, color: 'text-gray-600', bgColor: 'bg-gray-100', label: '不明' }
}

const PAYMENT_METHOD_NAMES: Record<string, string> = {
  creditcard: 'クレジットカード',
  btc: 'Bitcoin',
  eth: 'Ethereum',
  ltc: 'Litecoin'
}

// ========== ユーティリティ関数 ==========
const getStatusStyle = (status: string): StatusStyle => {
  return STATUS_STYLES[status as PaymentStatus] || STATUS_STYLES.default
}

const getPaymentMethodName = (method: string): string => {
  return PAYMENT_METHOD_NAMES[method] || method.toUpperCase()
}

// ========== Props型定義 ==========
interface Props {
  adminId: number
}

export default function PaymentHistoryForAdmin({ adminId }: Props) {
  const [paymentHistory, setPaymentHistory] = useState<PaymentWithUser[]>([])
  const [pendingPayments, setPendingPayments] = useState<PaymentWithUser[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string>('')

  // データ取得
  const fetchPaymentHistory = async (page: number) => {
    try {
      if (page === 1) setIsRefreshing(true)
      
      const result = await getPaymentHistory({ advertiserId: 0, page }) // Admin mode
      
      if (result.success) {
        if (result.data) setPaymentHistory(result.data as PaymentWithUser[])
        if (result.pendingData) setPendingPayments(result.pendingData as PaymentWithUser[])
        setError('')
      } else {
        setError(result.errMsg || '決済履歴の取得に失敗しました')
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // pending決済チェック
  const checkPending = async () => {
    try {
      const result = await checkPendingPayments({ advertiserId: 0 }) // Admin mode
      if (result.success) {
        fetchPaymentHistory(1) // 更新があった場合は履歴を再取得
      }
    } catch (err) {
      console.error('Pending check error:', err)
    }
  }

  // 初回データ取得
  useEffect(() => {
    fetchPaymentHistory(1)
  }, [])

  // 定期的なpending決済チェック
  useEffect(() => {
    if (pendingPayments.length > 0) {
      const interval = setInterval(checkPending, 30000) // 30秒間隔
      return () => clearInterval(interval)
    }
  }, [pendingPayments.length])

  // ページ変更
  const handlePageChange = (newPage: number) => {
    if (newPage !== currentPage && newPage > 0) {
      setCurrentPage(newPage)
      fetchPaymentHistory(newPage)
    }
  }

  // 表示用データ
  const displayPayments = paymentHistory.slice(0, dispCount)
  const hasMore = paymentHistory.length > dispCount

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
              <IconCreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">全ユーザー決済履歴</h2>
              <p className="text-sm text-gray-600">
                システム全体の決済状況
                {pendingPayments.length > 0 && (
                  <span className="ml-2 text-orange-600 font-medium">
                    ({pendingPayments.length}件処理中)
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => fetchPaymentHistory(1)}
            disabled={isRefreshing}
            className={`p-2 rounded-xl bg-white/80 hover:bg-white shadow-sm border border-gray-200 transition-all ${
              isRefreshing ? 'animate-spin' : 'hover:scale-105'
            }`}
          >
            <IconRefresh className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="p-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {isLoading ? (
          // ローディング
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* pending決済セクション */}
            {pendingPayments.length > 0 && (
              <div className="mb-6">
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4">
                  <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                    <IconClock className="w-5 h-5 animate-pulse" />
                    未確定決済 ({pendingPayments.length}件)
                  </h3>
                  
                  <div className="space-y-3">
                    {pendingPayments.map((payment) => {
                      const style = getStatusStyle(payment.status)
                      const Icon = style.icon
                      return (
                        <div key={payment.id} className="flex items-center justify-between p-3 bg-white/80 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 ${style.bgColor} rounded-lg ${style.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">{getPaymentMethodName(payment.paymentMethod)}</span>
                                {payment.userName && (
                                  <span className="text-gray-500">by {payment.userName}</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">{formatDate(payment.createdAt)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-orange-700">¥{Number(payment.totalAmount).toLocaleString()}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 通常の決済履歴 */}
            {displayPayments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <IconCreditCard className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">決済履歴がありません</h3>
                <p className="text-gray-500 text-sm">決済が実行されると、こちらに履歴が表示されます</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {displayPayments.map((payment) => {
                    const style = getStatusStyle(payment.status)
                    const Icon = style.icon
                    return (
                      <div key={payment.id} className="group flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 ${style.bgColor} rounded-xl ${style.color} group-hover:scale-110 transition-transform`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-800">{getPaymentMethodName(payment.paymentMethod)}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${style.bgColor} ${style.color}`}>
                                {style.label}
                              </span>
                              {payment.userName && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <IconUser className="w-3 h-3" />
                                  {payment.userName}
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {payment.provider === 'ccbill' ? 'クレジットカード決済' : '仮想通貨決済'}
                            </p>
                            <p className="text-xs text-gray-500">{formatDate(payment.createdAt)}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-800">¥{Number(payment.totalAmount).toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{payment.currency}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* ページネーション */}
                {(currentPage > 1 || hasMore) && (
                  <div className="mt-8 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      ページ {currentPage} - {displayPayments.length}件表示中
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <IconChevronLeft className="w-4 h-4" />
                      </button>
                      
                      <span className="px-3 py-1 bg-purple-500 text-white rounded-lg text-sm font-medium">
                        {currentPage}
                      </span>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!hasMore}
                        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <IconChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}