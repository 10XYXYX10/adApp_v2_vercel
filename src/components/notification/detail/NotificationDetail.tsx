// src/components/notifications/detail/NotificationDetail.tsx
import { getNotificationDetail } from "@/dal/notification/notificationFunctions";
import { NOTIFICATION_TYPE_CONFIG, NotificationType } from "@/lib/types/notification/notificationTypes";
import NotificationDetailClient from "./NotificationDetailClient";
import NotificationDetailEditor from "./NotificationDetailEditor";

const NotificationDetail = async({
    notificationId,
    advertiserId = 0,
    adminId = 0,
}:{
    notificationId: number
    advertiserId: number // adminの際は「0」
    adminId: number // advertiserの際は「0」
}) => {
    //////////
    //■ [ データ取得 ]
    const {result, message, data, wasUnread} = await getNotificationDetail({
        notificationId, 
        advertiserId
    });
    if(!result || !data) throw new Error(message);

    const typeConfig = NOTIFICATION_TYPE_CONFIG[data.type as NotificationType];

    // advertiserId === 0でadmin判定
    const isAdmin = advertiserId === 0;

    return (
        <div className="relative">
            {/* ヘッダーセクション */}
            <div className={`${typeConfig.bgColor} p-6 sm:p-8 border-b border-gray-100/50`}>
                <div className="space-y-6">
                    {/* タイトル */}
                    <div className="space-y-3">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                            {data.title}
                        </h1>
                        <p className="text-sm text-gray-500">ID: #{data.id}</p>
                    </div>

                    {/* タイプ・ステータス情報 */}
                    <div className="flex flex-wrap gap-4">
                        {/* タイプ */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-600">タイプ</span>
                            <div className={`px-4 py-2 rounded-full ${typeConfig.bgColor} border border-white/50 shadow-sm`}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-4 h-4 ${typeConfig.color}`}>
                                        {data.type === 'payment' && (
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        )}
                                        {data.type === 'advertisement' && (
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                            </svg>
                                        )}
                                        {data.type === 'system' && (
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                        {data.type === 'other' && (
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 12a3 3 0 100-6 3 3 0 000 6z" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className={`text-sm font-bold ${typeConfig.color}`}>
                                        {typeConfig.label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 読み取り状況 */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-600">ステータス</span>
                            <div className="px-4 py-2 rounded-full bg-green-100 border border-white/50 shadow-sm">
                                <span className="text-sm font-bold text-green-700">既読</span>
                            </div>
                        </div>

                        {/* admin表示時：ユーザー情報 */}
                        {isAdmin && (
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-600">対象ユーザー</span>
                                <div className="px-4 py-2 rounded-full bg-blue-100 border border-white/50 shadow-sm">
                                    <span className="text-sm font-bold text-blue-700">ID: {data.userId}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 日時情報 */}
                    <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-600">受信日時:</span>
                        <span className="font-medium text-gray-800">
                            {new Date(data.createdAt).toLocaleDateString('ja-JP', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                </div>
            </div>

            {/* メインコンテンツセクション */}
            <div className="p-6 sm:p-8">
                <div className="space-y-6">
                    {/* 内容ヘッダー */}
                    <div className="flex items-center gap-3 pb-4 border-b border-purple-100/50">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">通知内容</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
                    </div>

                    {/* 通知内容 */}
                    <div className="bg-gradient-to-br from-gray-50/80 to-purple-50/40 rounded-2xl p-6 border border-gray-100/50">
                        <div className="prose prose-gray max-w-none">
                            <p className="text-gray-800 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
                                {data.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* advertiserId別コンポーネント */}
            {!isAdmin ? (
                <NotificationDetailClient wasUnread={wasUnread || false} />
            ) : (
                <NotificationDetailEditor 
                    notification={data}
                    adminId={adminId}
                />
            )}

            {/* 装飾要素 */}
            <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-blue-500/20 rounded-full blur-lg"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-lg"></div>
        </div>
    )
}
export default NotificationDetail;