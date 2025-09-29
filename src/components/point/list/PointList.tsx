'use client'
// src/components/point/list/PointList.tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getPointList } from '@/actions/point/pointActions'
import { PointFilterData, PointListItemType } from '@/lib/types/point/pointTypes'
import PointListItem from './PointListItem'
import PointListFilterForm from './PointListFilterForm'

const fetchCount = process.env.NEXT_PUBLIC_FETCH_COUNT ? Number(process.env.NEXT_PUBLIC_FETCH_COUNT) : 10


export default function PointList({ 
    advertiserId 
 }:{
    advertiserId: number
 }) {
    const router = useRouter()

    //////////
    //■[ State管理 ]
    const [filterData, setFilterData] = useState<PointFilterData>({
        type: '',
        sort: 'desc',
        page: 1
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')
    const [displayPoints,setDisplayPoints] = useState<PointListItemType[]>([])
    const [pageNation,setPageNation] = useState({prev:false,next:false});

    //////////
    //■[ データ取得処理 ]
    useEffect(() => {
        const fetchPoints = async () => {
            setLoading(true)
            setError('')

            try {
                const result = await getPointList({
                    advertiserId,
                    type: filterData.type,
                    sort: filterData.sort,
                    page: filterData.page
                })

                if (result.success && result.data) {
                    const points = result.data;
                    setDisplayPoints(points.slice(0, fetchCount));
                    setPageNation({
                        prev: filterData.page > 1,
                        next: points.length > fetchCount
                    });
                } else {
                    if (result.statusCode === 401) {
                        router.push('/auth/advertiser')
                        return
                    }
                    setError(result.errMsg || 'データの取得に失敗しました')
                }
            } catch (err) {
                setError('ネットワークエラーが発生しました')
            } finally {
                setLoading(false)
            }
        }
        fetchPoints()
    }, [filterData.type, filterData.sort, filterData.page])

    //////////
    //■[ ページネーション処理 ]
    const handlePageChange = (newPage: number) => {
        if (newPage !== filterData.page && newPage > 0) {
            setFilterData(prev => ({ ...prev, page: newPage }))
            //・スクロール位置を微調整
            const scrollTarget = document.getElementById('postListScrollTarget')
            if (scrollTarget) {
                const targetPosition = scrollTarget.offsetTop + 150;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                })
            }
        }
    }

    //////////
    //■[ フィルター処理 ]
    const handleFilterChange = (newFilter: Partial<PointFilterData>) => {
        setFilterData(prev => ({
            ...prev,
            ...newFilter,
            page: 1 // フィルター変更時はpage=1にリセット
        }))
    }

    return (
        <div className="space-y-6">
            {/* フィルターフォーム */}
            <div 
                className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200" 
            >
                <PointListFilterForm 
                    filterData={filterData}
                    onFilterChange={handleFilterChange}
                />
            </div>

            {/* エラー表示 */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-red-800 font-medium">{error}</span>
                    </div>
                </div>
            )}

            <div id="postListScrollTarget"></div>

            {/* ローディング状態 */}
            {loading && (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="animate-pulse p-4 bg-white rounded-xl border border-gray-200">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                    <div>
                                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                                    </div>
                                </div>
                                <div className="h-6 bg-gray-200 rounded w-20"></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ポイント一覧 */}
            {!loading && !error && (
                <>
                    {displayPoints.length === 0 ? (
                        // 空状態
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                ポイント履歴がありません
                            </h3>
                            <p className="text-gray-500">
                                {filterData.type || filterData.sort !== 'desc' ? 
                                    'フィルター条件に一致するポイント履歴がありません' :
                                    'ポイントの取得や使用を行うと、こちらに履歴が表示されます'
                                }
                            </p>
                        </div>
                    ) : (
                        // ポイント一覧表示
                        <div className="space-y-3">
                            {displayPoints.map((point) => (
                                <PointListItem 
                                    key={point.id}
                                    point={point}
                                    advertiserId={advertiserId}
                                />
                            ))}
                        </div>
                    )}

                    {/* ページネーション */}
                    {displayPoints.length > 0 && (pageNation.prev || pageNation.next) && (
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                            {/* 前ページボタン */}
                            <div>
                                {pageNation.prev ? (
                                    <button
                                        onClick={() => handlePageChange(filterData.page - 1)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-blue-100 hover:from-blue-500 hover:to-indigo-600 hover:text-white rounded-lg border border-gray-300 hover:border-transparent transition-all duration-300"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        <span className="font-medium">前へ</span>
                                    </button>
                                ) : (
                                    <div></div>
                                )}
                            </div>

                            {/* ページ情報 */}
                            <div className="flex items-center gap-2">
                                <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
                                    <span className="font-bold">ページ {filterData.page}</span>
                                </div>
                            </div>

                            {/* 次ページボタン */}
                            <div>
                                {pageNation.next ? (
                                    <button
                                        onClick={() => handlePageChange(filterData.page + 1)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-blue-100 hover:from-blue-500 hover:to-indigo-600 hover:text-white rounded-lg border border-gray-300 hover:border-transparent transition-all duration-300"
                                    >
                                        <span className="font-medium">次へ</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                ) : (
                                    <div></div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}