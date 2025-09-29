// src/components/user/list/UserListItem.tsx
import { UserListItemType } from "@/lib/types/user/userTypes";
import Link from "next/link";

// Helper functions - 外部定義でパフォーマンス最適化
const getBusinessTypeDisplay = (businessType: string | null) => {
    switch(businessType) {
        case 'individual': return '個人事業主';
        case 'corporate': return '法人';
        case null: return '未設定';
        default: return businessType || '未設定';
    }
};

const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ja-JP').format(amount);
};

const UserListItem = ({
    user,
    path,
}:{
    user: UserListItemType
    path: string
}) => {
    return (
        <div className="mb-6 lg:w-1/2 xl:w-1/3 p-3">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden">
                {/* ヘッダー */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
                            {user.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {user.isActive ? 'アクティブ' : '無効'}
                        </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2">ID: #{user.id}</p>
                    <p className="text-gray-600 text-sm truncate">{user.email}</p>
                    
                    <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-700">
                            {getBusinessTypeDisplay(user.businessType)}
                        </span>
                        {user.companyName && (
                            <span className="text-xs text-gray-500 truncate ml-2 max-w-[120px]">
                                {user.companyName}
                            </span>
                        )}
                    </div>
                </div>

                {/* メインコンテンツ */}
                <div className="p-4 space-y-4">
                    {/* ポイント残高 */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span className="text-sm font-medium text-blue-900">ポイント残高</span>
                        </div>
                        <div className="text-lg font-bold text-blue-900 mt-1">
                            {formatAmount(Number(user.amount))} pt
                        </div>
                    </div>

                    {/* 基本情報 */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-gray-600 mb-1">登録日</div>
                            <div className="font-medium">
                                {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-gray-600 mb-1">最終ログイン</div>
                            <div className="font-medium">
                                {user.lastLoginAt ? 
                                    new Date(user.lastLoginAt).toLocaleDateString('ja-JP') : 
                                    '未ログイン'
                                }
                            </div>
                        </div>
                    </div>

                    {/* 詳細リンク */}
                    <Link
                        href={path}
                        className="block w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-3 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
                    >
                        詳細確認・管理 →
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default UserListItem;