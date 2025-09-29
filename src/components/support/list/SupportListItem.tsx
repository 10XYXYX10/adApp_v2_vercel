// src/components/support/list/SupportListItem.tsx
import { entityToDangerousChar } from "@/lib/seculity/validation";
import { SupportListItemType } from "@/lib/types/support/supportTypes";
import Link from "next/link";

// カテゴリー表示名
const getCategoryDisplayName = (category: string) => {
    switch(category) {
        case 'payment': return '決済・ポイント';
        case 'advertisement': return '広告配信';
        case 'technical': return '技術的問題';
        case 'other': return 'その他';
        default: return category;
    }
};

// ステータス表示名
const getStatusDisplayName = (status: string) => {
    switch(status) {
        case 'open': return '未対応';
        case 'in_progress': return '対応中';
        case 'closed': return '解決済み';
        default: return status;
    }
};

// 優先度表示
const getPriorityColor = (priority: string) => {
    switch(priority) {
        case 'high': return 'bg-red-100 text-red-700';
        case 'medium': return 'bg-yellow-100 text-yellow-700';
        case 'low': return 'bg-green-100 text-green-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

const getPriorityDisplayName = (priority: string) => {
    switch(priority) {
        case 'high': return '高';
        case 'medium': return '中';
        case 'low': return '低';
        default: return priority;
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

const SupportListItem = ({
    supportItem,
    path,
    isAdmin = false, // 修正：admin表示モード追加
}:{
    supportItem: SupportListItemType
    path: string
    isAdmin?: boolean // 修正：admin表示モード追加
}) => {
    // 未読管理者返信があるかどうか
    const hasUnreadAdminReply = supportItem.respondedAt !== null;

    return (
        <div className="mb-6 lg:w-1/2 xl:w-1/3 p-3">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
                {/* ヘッダー */}
                <div className="bg-gradient-to-r from-slate-50 to-emerald-50 p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
                            {entityToDangerousChar(supportItem.title,'full')}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            supportItem.status === 'closed' ? 'bg-green-100 text-green-700' :
                            supportItem.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                            supportItem.status === 'open' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                            {getStatusDisplayName(supportItem.status)}
                        </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm">ID: #{supportItem.id}</p>
                    
                    {/* 修正：admin時はユーザー情報表示 */}
                    {isAdmin && supportItem.user && (
                        <div className="mt-3 p-3 bg-blue-50/80 border border-blue-200/50 rounded-lg">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="text-sm font-bold text-blue-900">{supportItem.user.name}</span>
                                </div>
                                <div className="text-xs text-blue-700 ml-6">
                                    {supportItem.user.email}
                                </div>
                                <div className="text-xs text-blue-600 ml-6">
                                    {getBusinessTypeDisplayName(supportItem.user.businessType)}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">{getCategoryDisplayName(supportItem.category)}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(supportItem.priority)}`}>
                            優先度: {getPriorityDisplayName(supportItem.priority)}
                        </span>
                    </div>
                </div>

                {/* メインコンテンツ */}
                <div className="p-4 space-y-4">
                    {/* 未読通知 */}
                    {hasUnreadAdminReply && (
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-emerald-700">
                                    {/* 修正：admin/advertiser別メッセージ */}
                                    {isAdmin ? '対応済み案件です' : '新しい返信があります'}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* 対応状況 */}
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">対応状況</span>
                            <span className="font-medium">
                                {supportItem.status === 'closed' ? '解決済み' :
                                 supportItem.status === 'in_progress' ? '対応中' : '未対応'}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full ${
                                    supportItem.status === 'closed' ? 'bg-gradient-to-r from-green-500 to-emerald-600 w-full' :
                                    supportItem.status === 'in_progress' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 w-2/3' :
                                    'bg-gradient-to-r from-yellow-500 to-orange-600 w-1/3'
                                }`}
                            ></div>
                        </div>
                    </div>

                    {/* 基本情報 */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-gray-600 mb-1">作成日</div>
                            <div className="font-medium">
                                {new Date(supportItem.createdAt).toLocaleDateString('ja-JP')}
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-gray-600 mb-1">最終返信</div>
                            <div className="font-medium">
                                {supportItem.respondedAt ? 
                                    new Date(supportItem.respondedAt).toLocaleDateString('ja-JP') : 
                                    '未返信'
                                }
                            </div>
                        </div>
                    </div>

                    {/* 詳細リンク */}
                    <Link
                        href={path}
                        className="block w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center py-3 rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
                    >
                        {/* 修正：admin/advertiser別ボタンテキスト */}
                        {isAdmin ? '詳細確認・対応 →' : '詳細を表示 →'}
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default SupportListItem;