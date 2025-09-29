// src/components/notification/list/NotificationList.tsx
import NotificationItem from "./NotificationItem";
import Link from "next/link";
import { NotificationReadStatus, NotificationType, NotificationSortOrder } from "@/lib/types/notification/notificationTypes";
import { getNotificationList } from "@/dal/notification/notificationFunctions";

const fetchCount = process.env.NEXT_PUBLIC_FETCH_COUNT ? Number(process.env.NEXT_PUBLIC_FETCH_COUNT) : 10;
const appUrl = process.env.NEXT_PUBLIC_APP_URL as string;

const NotificationList = async({
    userType,
    userId,
    advertiserId,
    isRead,
    type,
    sort,
    search,
    page = 1,
    path,
}: {
    userType: 'admin' | 'advertiser';
    userId: number;
    advertiserId: number;
    isRead: NotificationReadStatus;
    type: NotificationType;
    sort: NotificationSortOrder;
    search: string;
    page?: number;
    path: string;
}) => {
    //////////
    //■ [ データ取得 ]
    const {result, message, data} = await getNotificationList({
        advertiserId,
        isRead,
        type,
        sort,
        search,
        page
    });
    if(!result || !data) throw new Error(message);

    //////////
    //■ [ ページネーション ]
    const hasMore = data.length > fetchCount;
    const displayData = data.slice(0, fetchCount);
    
    const buildPageUrl = (targetPage: number) => {
        const url = new URL(`${appUrl}${path}`);
        url.searchParams.set('page', String(targetPage));
        if(sort !== 'desc') url.searchParams.set('sort', sort);
        if(search) url.searchParams.set('search', search);
        if(isRead !== 'all') url.searchParams.set('isRead', isRead);
        if(type !== 'other') url.searchParams.set('type', type);
        return url.toString() + "#NotificationList";
    };

    return (
        <div className="relative">
            {/* メイン通知一覧 */}
            <div className="p-6" id="NotificationList">
                {/* 通知カードグリッド */}
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {displayData.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            path={`${path}/${notification.id}`}
                        />
                    ))}
                </div>

                {/* 空状態 */}
                {displayData.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-5 5v-5zM9 12a3 3 0 100-6 3 3 0 000 6z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">通知が見つかりません</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            {search || isRead !== 'all' || type !== 'other' ? 
                                'フィルター条件に一致する通知がありません。条件を調整してみてください。' : 
                                'まだ通知がありません。新しいお知らせがあるとここに表示されます。'
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* ページネーション */}
            {(page > 1 || hasMore) && (
                <div className="border-t border-gray-100 bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between px-6 py-6">
                        {/* 前ページボタン */}
                        <div className="flex-1 flex justify-start">
                            {page > 1 ? (
                                <Link 
                                    href={buildPageUrl(page - 1)}
                                    className="group inline-flex items-center gap-3 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:from-purple-500 group-hover:to-blue-600 transition-all duration-300">
                                        <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-medium text-gray-900">前のページ</div>
                                        <div className="text-xs text-gray-500">ページ {page - 1}</div>
                                    </div>
                                </Link>
                            ) : (
                                <div></div>
                            )}
                        </div>

                        {/* 現在ページ表示 */}
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-2xl px-6 py-3 shadow-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    <span className="font-bold">ページ {page}</span>
                                </div>
                            </div>
                        </div>

                        {/* 次ページボタン */}
                        <div className="flex-1 flex justify-end">
                            {hasMore ? (
                                <Link 
                                    href={buildPageUrl(page + 1)}
                                    className="group inline-flex items-center gap-3 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-gray-900">次のページ</div>
                                        <div className="text-xs text-gray-500">ページ {page + 1}</div>
                                    </div>
                                    <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:from-purple-500 group-hover:to-blue-600 transition-all duration-300">
                                        <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>

                    {/* ページネーション情報 */}
                    <div className="text-center pb-6">
                        <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {displayData.length}件表示中
                            {hasMore && <span>（さらに表示可能）</span>}
                            {(search || isRead !== 'all' || type !== 'other') && (
                                <span className="ml-1">• フィルター適用中</span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 背景装飾 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
            </div>
        </div>
    )
}
export default NotificationList;