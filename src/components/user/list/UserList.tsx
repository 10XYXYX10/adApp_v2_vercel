// src/components/user/list/UserList.tsx
import Link from "next/link";
import UserListItem from "./UserListItem";
import { UserListItemType, UserListSortType, UserListStatusType, UserListBusinessType } from "@/lib/types/user/userTypes";

const fetchCount = process.env.NEXT_PUBLIC_FETCH_COUNT ? Number(process.env.NEXT_PUBLIC_FETCH_COUNT) : 10;
const appUrl = process.env.NEXT_PUBLIC_APP_URL as string;

const UserList = ({
    users,
    search,
    sort,
    status,
    businessType,
    page,
    path,
}:{
    users: UserListItemType[]
    search: string
    sort: UserListSortType
    status: UserListStatusType
    businessType: UserListBusinessType
    page: number
    path: string
}) => {
    //////////
    //■ [ next,prev ]
    let queryParameter: string = `page=${page}`;
    queryParameter += `&sort=${sort}&`;
    if(search) queryParameter += `search=${search}`;
    if(status) queryParameter += `status=${status}`;
    if(businessType) queryParameter += `businessType=${businessType}`;
    const url = new URL(`${appUrl+path}?${queryParameter}`);
    const params = new URLSearchParams(url.search);
    let nextPageUrl = '';
    let prevPageUrl = '';
    if(page > 1){
        //□offset更新：-1
        params.set('page', String(page - 1));
        url.search = params.toString();
        prevPageUrl = url.toString() + "#UsersList";
    }
    if(users.length > fetchCount){
        //□offset更新：+1
        params.set('page', String(page + 1));
        url.search = params.toString();
        nextPageUrl = url.toString() + "#UsersList";
    }

    return (
        <div className="relative">
            {/* メインユーザー一覧 */}
            <div className="p-6" id="UsersList">
                {/* ユーザーカードグリッド */}
                <div className="p-1 mt-5 sm:p-2 sm:mt-0 w-full" id="UsersList">
                    <div className="sm:flex sm:flex-wrap sm:items-stretch container mx-auto">
                        {users.slice(0, fetchCount).map((user) => 
                            <UserListItem 
                                key={user.id} 
                                user={user} 
                                path={`${path}/${user.id}`}
                            /> 
                        )}
                    </div>
                </div>

                {/* 空状態 */}
                {users.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            ユーザーが見つかりません
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {search || status || businessType ? 
                                '検索条件に一致するユーザーがありません。フィルターを調整してみてください。' : 
                                '現在登録されているユーザーはありません。'
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* ページネーション */}
            {(prevPageUrl || nextPageUrl) && (
                <div className="border-t border-gray-100 bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between px-6 py-6">
                        {/* 前ページボタン */}
                        <div className="flex-1 flex justify-start">
                            {prevPageUrl ? (
                                <Link 
                                    href={prevPageUrl} 
                                    className="group inline-flex items-center gap-3 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:from-blue-500 group-hover:to-indigo-600 transition-all duration-300">
                                        <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-medium text-gray-900">前のページ</div>
                                        <div className="text-xs text-gray-500">ページ {page - 1}</div>
                                    </div>
                                </Link>
                            ) : (
                                <div></div>
                            )}
                        </div>

                        {/* 現在ページ表示 */}
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl px-6 py-3 shadow-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    <span className="font-bold">ページ {page}</span>
                                </div>
                            </div>
                        </div>

                        {/* 次ページボタン */}
                        <div className="flex-1 flex justify-end">
                            {nextPageUrl ? (
                                <Link 
                                    href={nextPageUrl} 
                                    className="group inline-flex items-center gap-3 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-gray-900">次のページ</div>
                                        <div className="text-xs text-gray-500">ページ {page + 1}</div>
                                    </div>
                                    <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:from-blue-500 group-hover:to-indigo-600 transition-all duration-300">
                                        <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>

                    {/* ページネーション情報 */}
                    <div className="text-center pb-6">
                        <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {users.length > fetchCount ? 
                                `${fetchCount}件表示中（さらに表示可能）` : 
                                `${users.length}件表示中`
                            }
                            {(search || status || businessType) && (
                                <span className="ml-1">
                                    • フィルター適用中
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 背景装飾 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
            </div>
        </div>
    )
}
export default UserList;