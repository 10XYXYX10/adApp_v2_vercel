// src/app/(main)/admin/[adminId]/payment/page.tsx
import { redirect } from 'next/navigation'
import PaymentOverview from '@/components/payment/PaymentOverview'
import PaymentHistoryForAdmin from '@/components/payment/PaymentHistoryForAdmin'



export default async function AdminPaymentPage({ 
  params 
}:{
 params: Promise<{
   adminId: string
 }>
}) {
 const resolvedParams = await params
 const adminId = Number(resolvedParams.adminId)
 
 //////////
 //■ [ パラメータバリデーション ]
 if (!adminId || isNaN(adminId) || adminId <= 0) redirect('/auth/admin');

 return (
   <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/40 relative overflow-hidden">
     {/* 背景装飾 */}
     <div className="absolute inset-0 overflow-hidden pointer-events-none">
       <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
       <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
     </div>

     <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
       {/* ヘッダーセクション */}
       <div className="text-center space-y-4">
         <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-xl rounded-full px-6 py-3 shadow-lg border border-white/40">
           <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
             <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
             </svg>
           </div>
           <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-green-900 to-emerald-900 bg-clip-text text-transparent">
             決済管理ダッシュボード
           </h1>
         </div>
         <p className="text-gray-600 text-lg max-w-2xl mx-auto">
           全ユーザーの決済状況を統合管理し、売上分析とリアルタイム監視を実現
         </p>
       </div>

       {/* 決済統計概要 */}
       <PaymentOverview/>

       {/* 決済履歴 */}
       <PaymentHistoryForAdmin adminId={adminId} />

       {/* フッター装飾 */}
       <div className="text-center pt-8">
         <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
           <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
           <span>決済データはリアルタイムで更新されます</span>
           <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
         </div>
       </div>
     </div>

     {/* グリッド装飾 */}
     <div className="absolute inset-0 bg-grid-gray-100/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none"></div>
   </div>
 )
}