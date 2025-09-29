// src/components/notifications/detail/NotificationDetailSkeleton.tsx

const NotificationDetailSkeleton = () => {
   return (
       <div className="relative animate-pulse">
           {/* ヘッダーセクション */}
           <div className="bg-gray-100 p-6 sm:p-8 border-b border-gray-200">
               <div className="space-y-6">
                   {/* タイトル */}
                   <div className="space-y-3">
                       <div className="w-4/5 h-8 sm:h-10 lg:h-12 bg-gray-300 rounded"></div>
                       <div className="w-20 h-4 bg-gray-200 rounded"></div>
                   </div>

                   {/* タイプ・ステータス情報 */}
                   <div className="flex flex-wrap gap-4">
                       <div className="flex items-center gap-3">
                           <div className="w-12 h-4 bg-gray-200 rounded"></div>
                           <div className="w-24 h-8 bg-gray-300 rounded-full"></div>
                       </div>
                       <div className="flex items-center gap-3">
                           <div className="w-16 h-4 bg-gray-200 rounded"></div>
                           <div className="w-16 h-8 bg-gray-300 rounded-full"></div>
                       </div>
                   </div>

                   {/* 日時情報 */}
                   <div className="flex items-center gap-2">
                       <div className="w-4 h-4 bg-gray-200 rounded"></div>
                       <div className="w-16 h-4 bg-gray-200 rounded"></div>
                       <div className="w-40 h-4 bg-gray-300 rounded"></div>
                   </div>
               </div>
           </div>

           {/* メインコンテンツセクション */}
           <div className="p-6 sm:p-8">
               <div className="space-y-6">
                   {/* 内容ヘッダー */}
                   <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                       <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                       <div className="w-20 h-6 bg-gray-300 rounded"></div>
                       <div className="flex-1 h-px bg-gray-200"></div>
                   </div>

                   {/* 通知内容 */}
                   <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                       <div className="space-y-3">
                           <div className="w-full h-5 bg-gray-200 rounded"></div>
                           <div className="w-5/6 h-5 bg-gray-200 rounded"></div>
                           <div className="w-4/5 h-5 bg-gray-200 rounded"></div>
                           <div className="w-3/4 h-5 bg-gray-200 rounded"></div>
                           <div className="w-2/3 h-5 bg-gray-200 rounded"></div>
                       </div>
                   </div>

                   {/* 戻るボタン */}
                   <div className="flex justify-center pt-6">
                       <div className="w-40 h-12 bg-gray-300 rounded-2xl"></div>
                   </div>
               </div>
           </div>

           {/* 装飾要素 */}
           <div className="absolute top-4 right-4 w-12 h-12 bg-gray-200 rounded-full blur-lg opacity-50"></div>
           <div className="absolute bottom-4 left-4 w-8 h-8 bg-gray-200 rounded-full blur-lg opacity-50"></div>
       </div>
   )
}
export default NotificationDetailSkeleton;