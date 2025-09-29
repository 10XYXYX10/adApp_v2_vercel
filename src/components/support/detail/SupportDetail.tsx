// src/components/support/detail/SupportDetail.tsx
import { getSupportDetail } from "@/dal/support/supportFunctions";
import MessageThread from "./MessageThread";
import { entityToDangerousChar } from "@/lib/seculity/validation";

//////////
//■[ Helperfunction をコンポーネント外で定義 ]
//・パフォーマンス向上: 毎回レンダリング時の関数再作成を回避
//・メモリ効率: 全インスタンスで関数オブジェクトを共有
//・再利用性: 他コンポーネントでもimport可能
//・Pure関数: 副作用なしの純粋関数は外部定義が適切

// ステータス表示名・色情報
const getStatusDisplay = (status: string) => {
    switch(status) {
        case 'open': return { name: '未対応', color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-100', text: 'text-yellow-800' };
        case 'in_progress': return { name: '対応中', color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-100', text: 'text-blue-800' };
        case 'closed': return { name: '解決済み', color: 'from-green-500 to-emerald-500', bg: 'bg-green-100', text: 'text-green-800' };
        default: return { name: status, color: 'from-gray-500 to-gray-600', bg: 'bg-gray-100', text: 'text-gray-800' };
    }
};

// カテゴリー表示名・色情報
const getCategoryDisplay = (category: string) => {
    switch(category) {
        case 'payment': return { name: '💳 決済・ポイント', color: 'from-purple-500 to-pink-500' };
        case 'advertisement': return { name: '📢 広告配信', color: 'from-blue-500 to-cyan-500' };
        case 'technical': return { name: '⚙️ 技術的問題', color: 'from-red-500 to-orange-500' };
        case 'other': return { name: '❓ その他', color: 'from-gray-500 to-slate-500' };
        default: return { name: category, color: 'from-gray-500 to-slate-500' };
    }
};

// 修正：事業者種別表示名
const getBusinessTypeDisplayName = (businessType: string | null) => {
    switch(businessType) {
        case 'individual': return '個人事業主';
        case 'corporate': return '法人';
        case null: return '未設定';
        default: return businessType || '未設定';
    }
};

const SupportDetail = async({
    userType,
    supportId,
    advertiserId, // 修正：userId → advertiserId
    isAdmin = false, // 修正：admin表示モード追加
}:{
    userType: 'advertiser' | 'admin'
    supportId: number
    advertiserId: number // 修正：userId → advertiserId
    isAdmin?: boolean // 修正：admin表示モード追加
}) => {
    //////////
    //■[ データ取得 ]
    const {result, message, data} = await getSupportDetail({supportId, advertiserId}); // 修正：userId → advertiserId
    if(!result || !data) throw new Error(message);

    const statusInfo = getStatusDisplay(data.status);
    const categoryInfo = getCategoryDisplay(data.category);

    return (
        <div className="relative">
            {/* ヘッダーセクション */}
            <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/60 p-6 sm:p-8 border-b border-emerald-100/50">
                <div className="space-y-6">
                    {/* タイトル */}
                    <div className="space-y-3">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                            {entityToDangerousChar(data.title,'full')}
                        </h1>
                        <p className="text-sm text-gray-500">ID: #{data.id}</p>
                    </div>

                    {/* 修正：admin時はユーザー詳細情報表示 */}
                    {isAdmin && (
                        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border border-blue-200/50 rounded-2xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <h3 className="text-lg font-bold text-blue-900">ユーザー情報</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-blue-600 font-medium">ユーザー名:</span>
                                            <span className="ml-2 text-blue-900 font-bold">{data.user.name}</span>
                                        </div>
                                        {data.user.email && (
                                            <div>
                                                <span className="text-blue-600 font-medium">メールアドレス:</span>
                                                <span className="ml-2 text-blue-900">{data.user.email}</span>
                                            </div>
                                        )}
                                        {data.user.businessType !== undefined && (
                                            <div>
                                                <span className="text-blue-600 font-medium">事業者種別:</span>
                                                <span className="ml-2 text-blue-900">{getBusinessTypeDisplayName(data.user.businessType)}</span>
                                            </div>
                                        )}
                                        {data.user.companyName && (
                                            <div>
                                                <span className="text-blue-600 font-medium">会社名:</span>
                                                <span className="ml-2 text-blue-900">{data.user.companyName}</span>
                                            </div>
                                        )}
                                    </div>
                                    {data.user.isActive !== undefined && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-600 font-medium text-sm">アカウント状態:</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                data.user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {data.user.isActive ? 'アクティブ' : '無効'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ステータス・カテゴリー情報 */}
                    <div className="flex flex-wrap gap-4">
                        {/* ステータス */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-600">ステータス</span>
                            <div className={`px-4 py-2 rounded-full ${statusInfo.bg} border border-white/50 shadow-sm`}>
                                <span className={`text-sm font-bold ${statusInfo.text}`}>
                                    {statusInfo.name}
                                </span>
                            </div>
                        </div>

                        {/* カテゴリー */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-600">カテゴリー</span>
                            <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${categoryInfo.color} text-white shadow-sm`}>
                                <span className="text-sm font-bold">
                                    {categoryInfo.name}
                                </span>
                            </div>
                        </div>

                        {/* 優先度 */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-600">優先度</span>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                data.priority === 'high' ? 'bg-red-100 text-red-700' :
                                data.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                            }`}>
                                {data.priority === 'high' ? '高' : data.priority === 'medium' ? '中' : '低'}
                            </div>
                        </div>
                    </div>

                    {/* 日時情報 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-600">作成日:</span>
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
                        {data.respondedAt && (
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                                <span className="text-gray-600">最終返信:</span>
                                <span className="font-medium text-gray-800">
                                    {new Date(data.respondedAt).toLocaleDateString('ja-JP', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* メッセージスレッドセクション */}
            <div className="p-6 sm:p-8">
                <MessageThread
                    userType={userType}
                    initialMessages={data.messages}
                    supportId={supportId}
                />
            </div>

            {/* 装飾要素 */}
            <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-lg"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-full blur-lg"></div>
        </div>
    )
}
export default SupportDetail;