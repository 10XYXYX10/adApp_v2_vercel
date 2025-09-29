'use client'
// src/components/point/list/PointListItem.tsx
import Link from 'next/link'
import { PointListItemType } from '@/lib/types/point/pointTypes'
import { formatDate } from '@/lib/functions/usefulFunctions'

//////////
//■[ ポイントタイプ別スタイル設定 ]
const getPointTypeStyle = (type: string) => {
    switch (type) {
        case 'purchase':
            return {
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                ),
                color: 'text-green-600',
                bgColor: 'bg-green-100',
                borderColor: 'border-green-200',
                sign: '+',
                label: '購入'
            }
        case 'consume':
            return {
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                ),
                color: 'text-blue-600',
                bgColor: 'bg-blue-100',
                borderColor: 'border-blue-200',
                sign: '-',
                label: '使用'
            }
        case 'refund':
            return {
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                ),
                color: 'text-orange-600',
                bgColor: 'bg-orange-100',
                borderColor: 'border-orange-200',
                sign: '+',
                label: '返金'
            }
        default:
            return {
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                ),
                color: 'text-gray-600',
                bgColor: 'bg-gray-100',
                borderColor: 'border-gray-200',
                sign: '',
                label: '不明'
            }
    }
}

//////////
//■[ 決済方法名変換 ]
const getPaymentMethodName = (method: string) => {
    switch (method) {
        case 'creditcard': return 'クレジットカード'
        case 'btc': return 'Bitcoin'
        case 'eth': return 'Ethereum'
        case 'ltc': return 'Litecoin'
        default: return method.toUpperCase()
    }
}

export default function PointListItem({
    point, 
    advertiserId 
 }:{
    point: PointListItemType
    advertiserId: number
 }) {
    const style = getPointTypeStyle(point.type)

    return (
        <div className={`group bg-white rounded-xl border ${style.borderColor} shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden`}>
            <div className="p-4">
                <div className="flex items-center justify-between">
                    
                    {/* 左側：アイコン・情報エリア */}
                    <div className="flex items-center gap-4">
                        
                        {/* タイプアイコン */}
                        <div className={`p-3 ${style.bgColor} ${style.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                            {style.icon}
                        </div>

                        {/* メイン情報 */}
                        <div className="space-y-1">
                            
                            {/* タイプ・日付 */}
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 text-xs font-semibold ${style.color} ${style.bgColor} rounded-full`}>
                                    {style.label}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {formatDate(point.createdAt)}
                                </span>
                            </div>

                            {/* 説明文 */}
                            <p className="text-sm text-gray-700 leading-relaxed max-w-md">
                                {point.description}
                            </p>

                            {/* 決済情報（関連する場合のみ） */}
                            {point.payment && (
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        <span>{getPaymentMethodName(point.payment.paymentMethod)}</span>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        ID: {point.payment.orderId.slice(0, 8)}...
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 右側：金額・アクションエリア */}
                    <div className="text-right space-y-2">
                        
                        {/* ポイント金額 */}
                        <div className="space-y-1">
                            <div className={`text-xl font-bold ${style.color}`}>
                                {style.sign}{Number(point.amount).toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">ポイント</div>
                        </div>

                        {/* 詳細リンク */}
                        <div className="flex items-center justify-end gap-2">
                            {/* 決済詳細リンク（決済関連の場合のみ） */}
                            {/*point.payment && (
                                <Link
                                    href={`/advertiser/${advertiserId}/payment/${point.payment.id}`}
                                    className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors duration-200"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    決済
                                </Link>
                            )*/}
                            <Link
                                href={`/advertiser/${advertiserId}/point/${point.id}`}
                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors duration-200"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                詳細
                            </Link>
                        </div>
                    </div>
                </div>

                {/* モバイル対応：決済情報を下部に表示 */}
                {point.payment && (
                    <div className="sm:hidden mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                <span>{getPaymentMethodName(point.payment.paymentMethod)}</span>
                            </div>
                            <div>
                                ¥{Number(point.payment.totalAmount).toLocaleString()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}