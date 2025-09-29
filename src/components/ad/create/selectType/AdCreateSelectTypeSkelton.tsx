// src/components/advertiser/ads/create/data/AdCreateSelectTypeSkeleton.tsx
export default function AdCreateSelectTypeSkelton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* 背景装飾 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400/10 to-red-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-400/5 to-cyan-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* ヘッダースケルトン */}
        <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="bg-gray-200 rounded-lg h-8 w-32 sm:w-40 animate-pulse" />
                <div className="bg-gray-200 rounded-lg h-4 w-48 sm:w-64 animate-pulse" />
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 rounded-lg h-6 w-20 animate-pulse" />
                <div className="bg-gray-200 rounded-full h-8 w-24 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* プログレスバースケルトン */}
        <div className="sticky top-[88px] sm:top-[96px] z-20 backdrop-blur-xl bg-white/60 border-b border-white/10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between relative">
              {/* プログレスライン */}
              <div className="absolute top-1/2 left-0 right-0 bg-gray-200 h-0.5 -translate-y-1/2 animate-pulse" />
              
              {/* ステップスケルトン */}
              {[0, 1, 2].map((index) => (
                <div key={index} className="flex flex-col items-center relative z-10">
                  <div className="bg-gray-200 w-10 h-10 sm:w-12 sm:h-12 rounded-full animate-pulse" />
                  <div className="mt-2 text-center space-y-1">
                    <div className="bg-gray-200 rounded-lg h-4 w-16 sm:w-20 animate-pulse" />
                    <div className="bg-gray-200 rounded-lg h-3 w-20 sm:w-28 hidden sm:block animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* メインコンテンツスケルトン */}
        <div className="container mx-auto px-4 py-8">
          <div className="w-full">
            {/* タイトルセクション */}
            <div className="text-center mb-12">
              <div className="bg-gray-200 rounded-lg h-8 w-64 mx-auto mb-4 animate-pulse" />
              <div className="bg-gray-200 rounded-lg h-4 w-96 mx-auto animate-pulse" />
            </div>

            {/* カードグリッドスケルトン */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
              {[0, 1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl"
                >
                  {/* カードヘッダー */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gray-200 rounded-lg h-6 w-24 animate-pulse" />
                    <div className="bg-gray-200 rounded-full h-5 w-16 animate-pulse" />
                  </div>

                  {/* プレビューエリア */}
                  <div className="bg-gray-200 h-48 w-full mb-4 rounded-2xl animate-pulse" />

                  {/* 説明テキスト */}
                  <div className="space-y-2 mb-4">
                    <div className="bg-gray-200 rounded-lg h-4 w-full animate-pulse" />
                    <div className="bg-gray-200 rounded-lg h-4 w-3/4 animate-pulse" />
                    <div className="bg-gray-200 rounded-lg h-4 w-1/2 animate-pulse" />
                  </div>

                  {/* 料金情報 */}
                  <div className="space-y-2 mb-6">
                    <div className="bg-gray-200 rounded-lg h-3 w-20 animate-pulse" />
                    <div className="bg-gray-200 rounded-lg h-5 w-32 animate-pulse" />
                  </div>

                  {/* ボタン */}
                  <div className="bg-gray-200 rounded-xl h-12 w-full animate-pulse" />
                </div>
              ))}
            </div>

            {/* フッターセクション */}
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-xl">
              <div className="text-center space-y-4">
                <div className="bg-gray-200 rounded-lg h-6 w-48 mx-auto animate-pulse" />
                <div className="bg-gray-200 rounded-lg h-4 w-80 mx-auto animate-pulse" />
                <div className="bg-gray-200 rounded-xl h-12 w-40 mx-auto animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* ローディングインジケーター */}
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-2xl border border-white/20">
            {/* スピナー */}
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-gray-700 font-medium">
              データを読み込み中...
            </div>
          </div>
        </div>

        {/* フローティングアクションボタンスケルトン（モバイル） */}
        <div className="fixed bottom-6 right-6 z-50 sm:hidden">
          <div className="bg-gray-200 w-14 h-14 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  )
}