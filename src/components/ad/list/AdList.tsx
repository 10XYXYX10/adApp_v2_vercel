//「src/components/ad/list/AdsList.tsx」
import Link from "next/link";
import AdListItem from "./AdListItem";
import { AdListAdType, AdListSortType, AdListStatusType } from "@/lib/types/ad/adTypes";
import { getAdList } from "@/dal/ad/adFunctions";
const fetchCount = process.env.NEXT_PUBLIC_FETCH_COUNT ? Number(process.env.NEXT_PUBLIC_FETCH_COUNT) : 10;
const appUrl = process.env.NEXT_PUBLIC_APP_URL as string;

const AdsList = async({
    search,
    sort,
    adType,
    status,
    page,
    path,
    advertiserId
}:{
    search:string
    sort:AdListSortType
    adType:AdListAdType
    status:AdListStatusType
    page:number
    path:string //「/advertiser/${advertiserId}/ads」or「/admin/${adminId}/review」
    advertiserId?:number
}) => {
  //////////
  //■[ データ取得 ]
  const parameter = {search,sort,adType,status,page,advertiserId};
  const {result,message,data} = await getAdList(parameter);
  if(!result || !data)throw new Error(message);

  //////////
  //■[ next,prev ]
  let queryParameter:string = `page=${page}`;
  queryParameter+=`&sort=${sort}&`;
  if(search)queryParameter+=`search=${search}`;
  if(adType)queryParameter+=`adType=${adType}`;
  if(status)queryParameter+=`status=${status}`;
  const url = new URL(`${appUrl+path}?${queryParameter}`);
  const params = new URLSearchParams(url.search);
  let nextPageUrl='';
  let prevPageUrl='';
  if(page>1){
      //□offset更新：-1
      params.set('page', String(page-1));
      url.search = params.toString(); //「url.search = ?page=2&sort='desc」「params.toString() = ?page=1&sort='desc」
      prevPageUrl = url.toString() + "#AdsList";//「url.toString() = http://localhost:3000/user/userId?page=1&sort='desc」
  }
  if(data.length>fetchCount){
      //□offset更新：+1
      params.set('page', String(page+1));
      url.search = params.toString();
      nextPageUrl = url.toString() + "#AdsList";
  }

  // src/components/common/advertisement/list/AdsList.tsx のreturn部分
  return (
    <div className="relative">
        {/* メイン広告一覧 */}
        <div className="p-6" id="AdsList">

        {!search && !adType && !status && advertiserId && (
            <div className="mb-4 text-gray-700 font-medium">
                {`広告は最大10件まで作成可能です。（残り ${Math.max(0, 10 - data.length)} 件）`}
            </div>
        )}


          {/* 広告カードグリッド */}
          <div className="p-1 mt-5 sm:p-2 sm:mt-0 w-full" id="AdsList">
            <div className="sm:flex sm:flex-wrap sm:items-stretch container mx-auto">
              {data.slice(0,fetchCount).map( (ad) => <AdListItem key={ad.id} AdListItem={ad} path={`${path}/${ad.id}`} /> )}
            </div>
          </div>

            {/* 空状態 */}
            {data.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {advertiserId ? '広告が見つかりません' : '審査対象の広告がありません'}
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        {search || adType || status ? 
                            '検索条件に一致する広告がありません。フィルターを調整してみてください。' : 
                            (advertiserId ? 
                                'まだ広告が作成されていません。最初の広告を作成してみましょう。' :
                                '現在審査待ちの広告はありません。'
                            )
                        }
                    </p>
                    {!search && !adType && !status && advertiserId && (<>
                        {/* 残り作成可能件数 */}
                        <div className="mb-4 text-gray-700 font-medium">
                            {`広告は最大10件まで作成可能です。（残り ${Math.max(0, 10 - data.length)} 件）`}
                        </div>

                        <Link 
                            href={`./ads/create`}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            広告を作成
                        </Link>
                    </>)}
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
                                <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">
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
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl px-6 py-3 shadow-lg">
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
                                <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">
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
                        {(search || adType || status) && (
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
            <div className="absolute top-1/4 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
        </div>
    </div>
  )
}
export default AdsList