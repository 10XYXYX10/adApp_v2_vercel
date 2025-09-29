// src/app/(main)/advertiser/[advertiserId]/notification/page.tsx
import NotificationFilterForm from "@/components/notification/list/NotificationFilterForm";
import NotificationListSkeleton from "@/components/notification/list/NotificationListSkeleton";
import NotificationList from "@/components/notification/list/NotificationList";
import { NotificationType, NotificationSortOrder, NotificationReadStatus } from "@/lib/types/notification/notificationTypes";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { dangerousCharToSpace } from "@/lib/seculity/validation";

const NotificationPage = async(
   props:{
       params: Promise<{ advertiserId: string }>
       searchParams: Promise<{ [key: string]: string | undefined }>
   }
) => {
    const resolvedParams = await props.params;
    const advertiserId = Number(resolvedParams.advertiserId)
    if (!advertiserId || isNaN(advertiserId) || advertiserId <= 0) redirect('/auth/advertiser');
   const searchParams = await props.searchParams;

    //////////
    //■ [ パラメーターの調整：「search,isRead,type,sort,page」 ]
    //・search
    let initialSearch = searchParams.search ? searchParams.search : "";
    if(initialSearch){
        initialSearch = dangerousCharToSpace(initialSearch.trim());//URLに含まれる危険文字を半角スペースに変換      
        initialSearch = initialSearch.replace(/\%20/g, ' ').replace(/　/g, ' ').replace(/ +/g, ' ');//「%20,全角スペース,連続する半角スペース」→「半角スペース」
    }

    //・isRead
    const initialIsRead = searchParams.isRead;
    const isRead: NotificationReadStatus = 
        initialIsRead !== 'true' && initialIsRead !== 'false' && initialIsRead !== 'all'
            ? 'all'
            : initialIsRead as NotificationReadStatus;

    //・type
    const initialType = searchParams.type;
    const type: NotificationType = 
        initialType !== 'payment' && initialType !== 'advertisement' && initialType !== 'system' && initialType !== 'other'
            ? 'other'
            : initialType as NotificationType;

    //・sort
    const initialSort = searchParams.sort;
    const sort: NotificationSortOrder = initialSort !== 'asc' ? 'desc' : initialSort;

    //・page
    const page = searchParams.page && !isNaN(Number(searchParams.page)) ? Number(searchParams.page) : 1;

   return (
       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/40 relative overflow-hidden">
           {/* 背景装飾 */}
           <div className="absolute inset-0 overflow-hidden pointer-events-none">
               <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
               <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
           </div>

           <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
               {/* ヘッダーセクション */}
               <div className="text-center space-y-4">
                   <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg border border-white/40">
                       <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                           <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 12a3 3 0 100-6 3 3 0 000 6zM21 21a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>
                       </div>
                       <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
                           通知・お知らせ
                       </h1>
                   </div>
                   <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                       システムからの重要なお知らせや広告配信の状況をご確認いただけます
                   </p>
               </div>

               {/* フィルターセクション */}
               <div className="space-y-6">
                   <div className="flex items-center gap-3">
                       <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-600 rounded-full"></div>
                       <h2 className="text-xl font-bold text-gray-900">通知を絞り込み</h2>
                       <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                   </div>

                   <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl overflow-hidden">
                       <div className="p-6">
                            <NotificationFilterForm
                                isRead={isRead}
                                type={type}
                                sort={sort}
                                search={initialSearch}
                            />
                       </div>
                   </div>
               </div>

               {/* 通知一覧セクション */}
               <div className="space-y-6">
                   <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                           <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"></div>
                           <h2 className="text-xl font-bold text-gray-900">通知一覧</h2>
                           <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                       </div>

                       {/* ページ情報 */}
                       <div className="flex items-center gap-3">
                           <div className="hidden sm:flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                               <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                               <span className="text-sm font-medium text-gray-700">Page {page}</span>
                           </div>
                       </div>
                   </div>

                   <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl overflow-hidden">
                        <Suspense fallback={<NotificationListSkeleton />}>
                            <NotificationList
                                userType="advertiser"
                                userId={0}
                                advertiserId={advertiserId}
                                isRead={isRead}
                                type={type}
                                sort={sort}
                                search={initialSearch}
                                page={page}
                                path={`/advertiser/${advertiserId}/notification`}
                            />
                       </Suspense>
                   </div>
               </div>

               {/* フッター装飾 */}
               <div className="text-center pt-8">
                   <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
                       <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                       <span>通知の詳細は各カードをクリックしてください</span>
                       <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                   </div>
               </div>
           </div>

           {/* グリッド装飾 */}
           <div className="absolute inset-0 bg-grid-gray-100/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none"></div>
       </div>
   )
}
export default NotificationPage;