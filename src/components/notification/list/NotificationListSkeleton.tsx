// src/components/notifications/list/NotificationListSkeleton.tsx

const NotificationListSkeleton = () => {
   return (
       <div className="p-6">
           {/* 通知カードスケルトングリッド */}
           <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
               {Array.from({ length: 6 }).map((_, index) => (
                   <div 
                       key={index}
                       className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg overflow-hidden animate-pulse"
                   >
                       {/* ヘッダー */}
                       <div className="bg-gray-100 p-4 border-b border-gray-200">
                           <div className="flex items-center gap-3 mb-2">
                               <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                               <div className="flex-1">
                                   <div className="flex items-center gap-2 mb-1">
                                       <div className="w-16 h-5 bg-gray-300 rounded-full"></div>
                                       <div className="w-12 h-5 bg-gray-300 rounded-full"></div>
                                   </div>
                                   <div className="w-20 h-3 bg-gray-200 rounded"></div>
                               </div>
                           </div>
                           <div className="w-4/5 h-6 bg-gray-300 rounded mb-1"></div>
                           <div className="w-3/5 h-6 bg-gray-300 rounded"></div>
                       </div>

                       {/* メインコンテンツ */}
                       <div className="p-4 space-y-4">
                           {/* 内容プレビュー */}
                           <div className="space-y-2">
                               <div className="w-full h-4 bg-gray-200 rounded"></div>
                               <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
                               <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                           </div>

                           {/* 日時情報 */}
                           <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                   <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                   <div className="w-24 h-4 bg-gray-200 rounded"></div>
                               </div>
                               <div className="flex items-center gap-2">
                                   <div className="w-8 h-4 bg-gray-200 rounded"></div>
                                   <div className="w-4 h-4 bg-gray-200 rounded"></div>
                               </div>
                           </div>

                           {/* 読み取り状況バー */}
                           <div className="pt-2 border-t border-gray-100">
                               <div className="flex items-center justify-between mb-2">
                                   <div className="w-16 h-3 bg-gray-200 rounded"></div>
                                   <div className="w-8 h-3 bg-gray-200 rounded"></div>
                               </div>
                               <div className="w-full bg-gray-200 rounded-full h-1.5">
                                   <div className="w-2/3 h-1.5 bg-gray-300 rounded-full"></div>
                               </div>
                           </div>
                       </div>
                   </div>
               ))}
           </div>

           {/* ページネーションスケルトン */}
           <div className="border-t border-gray-100 bg-white/50 backdrop-blur-sm mt-6">
               <div className="flex items-center justify-between px-6 py-6">
                   <div className="w-32 h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
                   <div className="w-24 h-12 bg-gray-300 rounded-2xl animate-pulse"></div>
                   <div className="w-32 h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
               </div>
               <div className="text-center pb-6">
                   <div className="w-40 h-8 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
               </div>
           </div>
       </div>
   )
}
export default NotificationListSkeleton;