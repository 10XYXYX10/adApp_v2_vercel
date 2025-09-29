// src/components/point/detail/PointDetail.tsx
import { getPointDetail } from "@/dal/point/pointFunctions";
import Link from "next/link";

//////////
//■[ Helper関数をコンポーネント外で定義 ]
//・パフォーマンス向上: 毎回レンダリング時の関数再作成を回避
//・メモリ効率: 全インスタンスで関数オブジェクトを共有

// 取引種別表示名
const getTransactionTypeDisplay = (type: string) => {
    switch(type) {
        case 'purchase': return 'ポイント購入';
        case 'consume': return 'ポイント消費';
        case 'refund': return 'ポイント返金';
        default: return type;
    }
};

// 取引種別カラー
const getTransactionTypeColor = (type: string) => {
    switch(type) {
        case 'purchase': return 'from-blue-500 to-indigo-600';
        case 'consume': return 'from-red-500 to-pink-600';
        case 'refund': return 'from-green-500 to-teal-600';
        default: return 'from-gray-500 to-slate-600';
    }
};

// 決済ステータス表示名
const getPaymentStatusDisplay = (status: string) => {
    switch(status) {
        case 'pending': return '処理中';
        case 'completed': return '完了';
        case 'failed': return '失敗';
        case 'expired': return '期限切れ';
        default: return status;
    }
};

// 決済ステータスカラー
const getPaymentStatusColor = (status: string) => {
    switch(status) {
        case 'pending': return 'bg-yellow-100 text-yellow-700';
        case 'completed': return 'bg-green-100 text-green-700';
        case 'failed': return 'bg-red-100 text-red-700';
        case 'expired': return 'bg-gray-100 text-gray-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

// 金額フォーマット
const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ja-JP').format(amount);
};

const PointDetail = async({
    pointId,
    advertiserId,
}:{
    pointId: number
    advertiserId: number
}) => {
    //////////
    //■[ データ取得 ]
    const {success, errMsg, data} = await getPointDetail({pointId, advertiserId});
    if(!success || !data) throw new Error(errMsg);

    //////////
    //■[ ナビゲーション用パス ]
    const pointListPath = advertiserId === 0 
        ? `/admin/0/points` 
        : `/advertiser/${advertiserId}/point`;
    const adCreatePath = `/advertiser/${advertiserId}/ad/create`;
    const pointPurchasePath = `/advertiser/${advertiserId}/point/purchase`;

    return (
        <div className="relative">
            {/* ヘッダーセクション */}
            <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/60 p-6 sm:p-8 border-b border-green-100/50">
                <div className="space-y-6">
                    {/* ナビゲーション */}
                    <div className="flex items-center gap-3">
                        <Link 
                            href={pointListPath}
                            className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 transition-colors duration-200"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="text-sm font-medium">ポイント一覧に戻る</span>
                        </Link>
                    </div>

                    {/* 基本情報 */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                {getTransactionTypeDisplay(data.type)}
                            </h1>
                            <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getTransactionTypeColor(data.type)} text-white shadow-sm`}>
                                <span className="text-sm font-bold">
                                    {data.type === 'consume' ? '-' : '+'}{formatAmount(Number(data.amount))} pt
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">取引ID: #{data.id}</p>
                        <p className="text-lg text-gray-700">{data.description}</p>
                    </div>

                    {/* 日時情報 */}
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">取引日時:</span>
                        <span className="font-medium text-gray-800">
                            {new Date(data.createdAt).toLocaleString('ja-JP')}
                        </span>
                    </div>
                </div>
            </div>

            {/* アクションリンクセクション */}
            {advertiserId !== 0 && (
                <div className="bg-blue-50/50 p-6 sm:p-8 border-b border-blue-100/50">
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            クイックアクション
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link
                                href={adCreatePath}
                                className="group bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">広告を作成</div>
                                        <div className="text-sm text-gray-600">新しい広告キャンペーンを開始</div>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href={pointPurchasePath}
                                className="group bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">ポイント購入</div>
                                        <div className="text-sm text-gray-600">追加ポイントを購入する</div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* 詳細情報セクション */}
            <div className="p-6 sm:p-8 space-y-8">
                {/* 決済情報 */}
                {data.payment && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">決済情報</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
                        </div>

                        <div className="bg-blue-50/50 rounded-2xl p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm font-medium text-blue-700">注文ID:</span>
                                    <p className="text-gray-900 font-mono text-sm">{data.payment.orderId}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-blue-700">決済ステータス:</span>
                                    <div className="mt-1">
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getPaymentStatusColor(data.payment.status)}`}>
                                            {getPaymentStatusDisplay(data.payment.status)}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-blue-700">決済方法:</span>
                                    <p className="text-gray-900 font-semibold">{data.payment.paymentMethod}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-blue-700">通貨:</span>
                                    <p className="text-gray-900 font-semibold">{data.payment.currency}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-blue-700">購入金額:</span>
                                    <p className="text-gray-900 font-semibold">
                                        {formatAmount(Number(data.payment.purchaseAmount))} {data.payment.currency}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-blue-700">総額（手数料込）:</span>
                                    <p className="text-gray-900 font-semibold">
                                        {formatAmount(Number(data.payment.totalAmount))} {data.payment.currency}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-blue-200/50">
                                <span className="text-sm font-medium text-blue-700">決済日時:</span>
                                <p className="text-gray-900 font-medium">
                                    {new Date(data.payment.createdAt).toLocaleString('ja-JP')}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 取引がconsumeまたはrefundの場合の注意書き */}
                {(data.type === 'consume' || data.type === 'refund') && !data.payment && (
                    <div className="bg-yellow-50/50 border border-yellow-200/50 rounded-2xl p-6">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="font-bold text-yellow-800">お知らせ</h3>
                                <p className="text-sm text-yellow-700">
                                    この取引は決済を伴わない{getTransactionTypeDisplay(data.type)}です。
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 装飾要素 */}
            <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-lg"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 rounded-full blur-lg"></div>
        </div>
    )
}
export default PointDetail;