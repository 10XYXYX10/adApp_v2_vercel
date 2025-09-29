// src/components/notification/list/NotificationItem.tsx
import { NotificationItemProps, NOTIFICATION_TYPE_CONFIG, NotificationType, NotificationWithUser } from "@/lib/types/notification/notificationTypes";
import Link from "next/link";

const NotificationItem = ({
   notification,
   path,
}:{
    notification: NotificationWithUser
    path: string
} & {
   path: string;
}) => {
   const typeConfig = NOTIFICATION_TYPE_CONFIG[notification.type as NotificationType];
   const isUnread = !notification.isRead;

   return (
       <div className="group">
           <Link href={path}>
               <div className={`
                   relative bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 
                   shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden
                   group-hover:scale-105 group-hover:-translate-y-1
                   ${isUnread ? 'ring-2 ring-purple-400/50' : ''}
               `}>
                   {/* 未読バッジ */}
                   {isUnread && (
                       <div className="absolute top-3 right-3 z-10">
                           <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
                       </div>
                   )}

                   {/* ヘッダー */}
                   <div className={`
                       ${typeConfig.bgColor} p-4 border-b border-gray-100 
                       ${isUnread ? 'bg-gradient-to-r from-purple-50 to-blue-50' : ''}
                   `}>
                       <div className="flex items-center gap-3 mb-2">
                           <div className={`
                               w-8 h-8 ${typeConfig.bgColor} rounded-lg flex items-center justify-center
                               ${isUnread ? 'bg-gradient-to-r from-purple-100 to-blue-100' : ''}
                           `}>
                               <div className={`w-4 h-4 ${typeConfig.color}`}>
                                   {notification.type === 'payment' && (
                                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                       </svg>
                                   )}
                                   {notification.type === 'advertisement' && (
                                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                       </svg>
                                   )}
                                   {notification.type === 'system' && (
                                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                       </svg>
                                   )}
                                   {notification.type === 'other' && (
                                       <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 12a3 3 0 100-6 3 3 0 000 6z" />
                                       </svg>
                                   )}
                               </div>
                           </div>
                           <div className="flex-1">
                               <div className="flex items-center gap-2">
                                   <span className={`
                                       px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color} ${typeConfig.bgColor}
                                       ${isUnread ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700' : ''}
                                   `}>
                                       {typeConfig.label}
                                   </span>
                                   {isUnread && (
                                       <span className="px-2 py-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-full text-xs font-medium">
                                           未読
                                       </span>
                                   )}
                               </div>
                               <p className="text-xs text-gray-500 mt-1">
                                   ID: #{notification.id}
                               </p>
                           </div>
                       </div>
                       
                       <h3 className={`
                           font-bold text-gray-900 text-lg line-clamp-2 leading-tight
                           ${isUnread ? 'text-purple-900' : ''}
                       `}>
                           {notification.title}
                       </h3>
                   </div>

                   {/* メインコンテンツ */}
                   <div className="p-4 space-y-4">
                       {/* 内容プレビュー */}
                       <div>
                           <p className="text-gray-600 text-sm leading-relaxed truncate">
                               {notification.description}
                           </p>
                       </div>

                       {/* 日時情報 */}
                       <div className="flex items-center justify-between text-sm">
                           <div className="flex items-center gap-2 text-gray-500">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                               </svg>
                               <span>
                                   {new Date(notification.createdAt).toLocaleDateString('ja-JP', {
                                       year: 'numeric',
                                       month: 'short',
                                       day: 'numeric',
                                       hour: '2-digit',
                                       minute: '2-digit'
                                   })}
                               </span>
                           </div>
                           
                           {/* 詳細表示ボタン */}
                           <div className="flex items-center gap-2 text-purple-600 group-hover:text-purple-700 font-medium">
                               <span className="text-sm">詳細</span>
                               <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                               </svg>
                           </div>
                       </div>

                       {/* 読み取り状況バー */}
                       <div className="pt-2 border-t border-gray-100">
                           <div className="flex items-center justify-between text-xs">
                               <span className="text-gray-500">読み取り状況</span>
                               <span className={`font-medium ${isUnread ? 'text-red-600' : 'text-green-600'}`}>
                                   {isUnread ? '未読' : '既読'}
                               </span>
                           </div>
                           <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                               <div 
                                   className={`h-1.5 rounded-full transition-all duration-300 ${
                                       isUnread ? 
                                       'bg-gradient-to-r from-red-500 to-pink-500 w-0 group-hover:w-1/3' : 
                                       'bg-gradient-to-r from-green-500 to-emerald-600 w-full'
                                   }`}
                               ></div>
                           </div>
                       </div>
                   </div>

                   {/* ホバー効果の装飾 */}
                   <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-300 pointer-events-none"></div>
               </div>
           </Link>
       </div>
   )
}
export default NotificationItem;