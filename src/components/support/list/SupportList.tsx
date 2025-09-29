// src/components/support/list/SupportList.tsx
import Link from "next/link";
import SupportListItem from "./SupportListItem";
import { SupportListSortType, SupportListStatusType, SupportListCategoryType } from "@/lib/types/support/supportTypes";
import { getSupportList } from "@/dal/support/supportFunctions";

const fetchCount = process.env.NEXT_PUBLIC_FETCH_COUNT ? Number(process.env.NEXT_PUBLIC_FETCH_COUNT) : 10;
const appUrl = process.env.NEXT_PUBLIC_APP_URL as string;

const SupportList = async({
    advertiserId, // 修正：userId → advertiserId
    sort,
    status,
    category,
    page,
    path,
    isAdmin = false, // 修正：admin表示モード追加
}:{
    advertiserId: number // 修正：userId → advertiserId
    sort: SupportListSortType
    status: SupportListStatusType
    category: SupportListCategoryType
    page: number
    path: string
    isAdmin?: boolean // 修正：admin表示モード追加
}) => {
  //////////
  //■[ データ取得 ]
  const parameter = {advertiserId, sort, status, category, page}; // 修正：userId → advertiserId
  const {result, message, data} = await getSupportList(parameter);
  if(!result || !data)throw new Error(message);

  //////////
  //■[ next,prev ]
  let queryParameter:string = `page=${page}`;
  queryParameter+=`&sort=${sort}&`;
  if(status)queryParameter+=`status=${status}`;
  if(category)queryParameter+=`category=${category}`;
  const url = new URL(`${appUrl+path}?${queryParameter}`);
  const params = new URLSearchParams(url.search);
  let nextPageUrl='';
  let prevPageUrl='';
  if(page>1){
      //□offset更新：-1
      params.set('page', String(page-1));
      url.search = params.toString();
      prevPageUrl = url.toString() + "#SupportList";
  }
  if(data.length>fetchCount){
      //□offset更新：+1
      params.set('page', String(page+1));
      url.search = params.toString();
      nextPageUrl = url.toString() + "#SupportList";
  }

  return (
    <div className="relative">
        {/* メインサポート一覧 */}
        <div className="p-6" id="SupportList">
          {/* サポートカードグリッド */}
          <div className="p-1 mt-5 sm:p-2 sm:mt-0 w-full" id="SupportList">
            <div className="sm:flex sm:flex-wrap sm:items-stretch container mx-auto">
              {data.slice(0,fetchCount).map( (support) => 
                <SupportListItem 
                    key={support.id} 
                    supportItem={support} 
                    path={`${path}/${support.id}`}
                    isAdmin={isAdmin} // 修正：admin表示モード追加
                /> 
              )}
            </div>
          </div>

            {/* 空状態 */}
            {data.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-emerald-100 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {/* 修正：admin/advertiser別メッセージ */}
                        {isAdmin ? 'サポート案件が見つかりません' : 'お問い合わせが見つかりません'}
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        {status || category ? 'フィルター条件に一致するお問い合わせがありません。条件を調整してみてください。' : 
                         isAdmin ? 'サポート案件がまだありません。' : 'まだお問い合わせがありません。困ったことがあればお気軽にお問い合わせください。'}
                    </p>
                    {/* 修正：advertiserのみ新規作成ボタン表示 */}
                    {!status && !category && !isAdmin && (
                        <Link 
                            href={`./support/create`}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            お問い合わせを作成
                        </Link>
                    )}
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
                                <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:from-emerald-500 group-hover:to-teal-600 transition-all duration-300">
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
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl px-6 py-3 shadow-lg">
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
                                <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:from-emerald-500 group-hover:to-teal-600 transition-all duration-300">
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
                        {data.length > fetchCount ? 
                            `${fetchCount}件表示中（さらに表示可能）` : 
                            `${data.length}件表示中`
                        }
                        {(status || category) && (
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
            <div className="absolute top-1/4 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-400/10 to-emerald-400/10 rounded-full blur-3xl"></div>
        </div>
    </div>
  )
}
export default SupportList