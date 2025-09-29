// src/components/user/detail/UserDetail.tsx
import { getUserDetail } from "@/dal/user/userFunctions";
import UserManagementPanel from "./UserManagementPanel";

//////////
//■ [ Helper関数をコンポーネント外で定義 ]
//・パフォーマンス向上: 毎回レンダリング時の関数再作成を回避
//・メモリ効率: 全インスタンスで関数オブジェクトを共有
//・再利用性: 他コンポーネントでもimport可能

// 事業者種別表示名
const getBusinessTypeDisplayName = (businessType: string | null) => {
    switch(businessType) {
        case 'individual': return '個人事業主';
        case 'corporate': return '法人';
        case null: return '未設定';
        default: return businessType || '未設定';
    }
};

// 金額フォーマット
const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ja-JP').format(amount);
};

const UserDetail = async({
    userId,
}:{
    userId: number
}) => {
    //////////
    //■ [ データ取得 ]
    const {result, message, data} = await getUserDetail({userId});
    if(!result || !data) throw new Error(message);

    return (
        <div className="relative">
            {/* ヘッダーセクション */}
            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/60 p-6 sm:p-8 border-b border-blue-100/50">
                <div className="space-y-6">
                    {/* 基本情報 */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                {data.name}
                            </h1>
                            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                                data.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {data.isActive ? 'アクティブ' : '無効'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">ID: #{data.id}</p>
                        <p className="text-lg text-gray-700">{data.email}</p>
                    </div>

                    {/* ステータス・カテゴリー情報 */}
                    <div className="flex flex-wrap gap-4">
                        {/* 事業者種別 */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-600">事業者種別</span>
                            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm">
                                <span className="text-sm font-bold">
                                    {getBusinessTypeDisplayName(data.businessType)}
                                </span>
                            </div>
                        </div>

                        {/* ポイント残高 */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-600">ポイント残高</span>
                            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm">
                                <span className="text-sm font-bold">
                                    {formatAmount(data.amount)} pt
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 日時情報 */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-600">登録日:</span>
                            <span className="font-medium text-gray-800">
                                {new Date(data.createdAt).toLocaleDateString('ja-JP')}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            <span className="text-gray-600">最終ログイン:</span>
                            <span className="font-medium text-gray-800">
                                {data.lastLoginAt ? 
                                    new Date(data.lastLoginAt).toLocaleDateString('ja-JP') : 
                                    '未ログイン'
                                }
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="text-gray-600">生年月日:</span>
                            <span className="font-medium text-gray-800">
                                {new Date(data.birthDate).toLocaleDateString('ja-JP')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 詳細情報セクション */}
            <div className="p-6 sm:p-8 space-y-8">
                {/* 事業者情報 */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">事業者情報</h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
                    </div>

                    <div className="bg-blue-50/50 rounded-2xl p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.companyName && (
                                <div>
                                    <span className="text-sm font-medium text-blue-700">会社名・屋号:</span>
                                    <p className="text-gray-900 font-semibold">{data.companyName}</p>
                                </div>
                            )}
                            {data.representativeName && (
                                <div>
                                    <span className="text-sm font-medium text-blue-700">代表者氏名:</span>
                                    <p className="text-gray-900 font-semibold">{data.representativeName}</p>
                                </div>
                            )}
                            {data.businessNumber && (
                                <div>
                                    <span className="text-sm font-medium text-blue-700">事業者登録番号:</span>
                                    <p className="text-gray-900 font-semibold">{data.businessNumber}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 住所情報 */}
                {data.Address.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">住所情報</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent"></div>
                        </div>

                        {data.Address.map((address) => (
                            <div key={address.id} className="bg-green-50/50 rounded-2xl p-6">
                                <div className="space-y-2">
                                    {address.postalCode && (
                                        <p className="text-sm text-gray-600">〒{address.postalCode}</p>
                                    )}
                                    <div className="text-gray-900">
                                        {[
                                            address.country,
                                            address.state,
                                            address.city,
                                            address.addressLine1,
                                            address.addressLine2
                                        ].filter(Boolean).join(' ')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 電話番号情報 */}
                {data.Phone && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">連絡先情報</h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
                        </div>

                        <div className="bg-purple-50/50 rounded-2xl p-6">
                            <div className="text-sm text-purple-700 mb-1">電話番号（ハッシュ化済み）</div>
                            <div className="text-gray-900 font-mono text-sm">
                                {data.Phone.hashedPhoneNumber}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 管理パネルセクション */}
            <div className="border-t border-gray-100 bg-gray-50/50 p-6 sm:p-8">
                <UserManagementPanel
                    user={data}
                />
            </div>

            {/* 装飾要素 */}
            <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-lg"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-lg"></div>
        </div>
    )
}
export default UserDetail;