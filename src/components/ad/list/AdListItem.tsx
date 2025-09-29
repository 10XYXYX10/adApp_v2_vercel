// src/components/ad/list/AdListItem.tsx
import { Advertisement } from "@prisma/client";
import Link from "next/link";

const AdListItem = ({
    AdListItem,
    path,
}:{
    AdListItem: Advertisement
    path: string
}) => {
    // 予算進捗計算
    const budgetUsed = Number(AdListItem.budget) - Number(AdListItem.remainingBudget);
    const budgetProgress = Number(AdListItem.budget) > 0 ? (budgetUsed / Number(AdListItem.budget)) * 100 : 0;

    return (
        <div className="mb-6 lg:w-1/2 xl:w-1/3 p-3">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
                {/* ヘッダー */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900 text-lg capitalize">
                            {AdListItem.adType.replace('-', ' ')}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            AdListItem.status === 'active' ? 'bg-green-100 text-green-700' :
                            AdListItem.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                            AdListItem.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                            {AdListItem.status}
                        </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm">ID: #{AdListItem.id}</p>
                    
                    {AdListItem.targetId && (
                        <div className="mt-2 text-sm text-gray-600">
                            <span>Target: </span>
                            <span className="font-medium">{AdListItem.targetId}</span>
                        </div>
                    )}
                </div>

                {/* メインコンテンツ */}
                <div className="p-4 space-y-4">
                    {/* 予算情報 */}
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">予算進捗</span>
                            <span className="font-medium">{budgetProgress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                                style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>残り: {Number(AdListItem.remainingBudget).toLocaleString()}P</span>
                            <span>総額: {Number(AdListItem.budget).toLocaleString()}P</span>
                        </div>
                    </div>

                    {/* 基本情報 */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-gray-600 mb-1">作成日</div>
                            <div className="font-medium">
                                {new Date(AdListItem.createdAt).toLocaleDateString('ja-JP')}
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-gray-600 mb-1">更新日</div>
                            <div className="font-medium">
                                {new Date(AdListItem.updatedAt).toLocaleDateString('ja-JP')}
                            </div>
                        </div>
                    </div>

                    {/* 詳細リンク */}
                    <Link
                        prefetch={true}
                        href={path}
                        className="block w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-3 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                    >
                        詳細を表示 →
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default AdListItem;