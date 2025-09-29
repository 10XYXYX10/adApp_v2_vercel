'use client'
// src/components/point/list/PointListFilterForm.tsx
import { PointFilterData } from '@/lib/types/point/pointTypes'
import { ChangeEvent } from 'react'


export default function PointListFilterForm({
    filterData, 
    onFilterChange 
 }:{
    filterData: PointFilterData
    onFilterChange: (newFilter: Partial<PointFilterData>) => void
 }) {

    //////////
    //■[ フィルター変更処理 ]
    const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as '' | 'purchase' | 'consume' | 'refund'
        onFilterChange({ type: value })
    }

    const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as 'desc' | 'asc'
        onFilterChange({ sort: value })
    }

    return (
        <div className="space-y-4">
            
            {/* フィルターヘッダー */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-800">フィルター・並び替え</h3>
                </div>
                
                {/* アクティブフィルター表示 */}
                {(filterData.type || filterData.sort !== 'desc') && (
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-blue-600 font-medium">フィルター適用中</span>
                    </div>
                )}
            </div>

            {/* フィルターコントロール */}
            <div className="flex flex-col sm:flex-row gap-4">
                
                {/* タイプフィルター */}
                <div className="flex-1 space-y-2">
                    <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700">
                        ポイントタイプ
                    </label>
                    <div className="relative">
                        <select
                            id="type-filter"
                            value={filterData.type}
                            onChange={handleTypeChange}
                            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        >
                            <option value="">すべて表示</option>
                            <option value="purchase">購入 (+)</option>
                            <option value="consume">使用 (-)</option>
                            <option value="refund">返金 (+)</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* ソートフィルター */}
                <div className="flex-1 space-y-2">
                    <label htmlFor="sort-filter" className="block text-sm font-medium text-gray-700">
                        並び順
                    </label>
                    <div className="relative">
                        <select
                            id="sort-filter"
                            value={filterData.sort}
                            onChange={handleSortChange}
                            className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        >
                            <option value="desc">新しい順</option>
                            <option value="asc">古い順</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* リセットボタン */}
                {(filterData.type || filterData.sort !== 'desc') && (
                    <div className="flex items-end">
                        <button
                            onClick={() => onFilterChange({ type: '', sort: 'desc' })}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            リセット
                        </button>
                    </div>
                )}
            </div>

            {/* 現在の設定表示 */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>
                        タイプ: {
                            filterData.type === 'purchase' ? '購入' :
                            filterData.type === 'consume' ? '使用' :
                            filterData.type === 'refund' ? '返金' :
                            'すべて'
                        }
                    </span>
                </div>
                <div className="w-px h-3 bg-gray-300"></div>
                <div className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    <span>並び順: {filterData.sort === 'desc' ? '新しい順' : '古い順'}</span>
                </div>
                <div className="w-px h-3 bg-gray-300"></div>
                <div className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    <span>ページ: {filterData.page}</span>
                </div>
            </div>
        </div>
    )
}