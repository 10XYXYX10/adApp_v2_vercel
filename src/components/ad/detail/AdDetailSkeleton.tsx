// src/components/advertiser/ads/detail/data/AdDetailSkeleton.tsx

export default function AdDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* 背景装飾エフェクト */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-violet-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 space-y-8 animate-pulse">
        {/* メイン概要カードセクション */}
        <section>
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl overflow-hidden">
            {/* カードヘッダー */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 p-6 border-b border-white/20">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl animate-pulse" />
                  <div className="space-y-2">
                    <div className="w-48 h-7 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="w-32 h-5 bg-gray-200 rounded-lg animate-pulse" />
                  </div>
                </div>
                
                <div className="flex-1 lg:flex lg:justify-end">
                  <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse" />
                </div>
              </div>
            </div>

            {/* メトリクスグリッド */}
            <div className="p-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/40"
                  >
                    <div className="w-12 h-4 bg-gray-200 rounded mb-2 animate-pulse" />
                    <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>

              {/* アクションボタンエリア */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 h-11 bg-gray-200 rounded-xl animate-pulse" />
                <div className="flex-1 h-11 bg-gray-200 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* 2カラムレイアウト */}
        <section className="grid lg:grid-cols-3 gap-8">
          {/* 左カラム: 広告コンテンツ */}
          <div className="lg:col-span-2 space-y-6">
            {/* 広告コンテンツカード */}
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-6">
              <div className="w-40 h-6 bg-gray-200 rounded-lg mb-6 animate-pulse" />
              
              {/* メディアプレビューエリア */}
              <div className="aspect-video bg-gray-200 rounded-2xl mb-6 flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-gray-300 border-t-blue-400 rounded-full animate-spin" />
              </div>

              {/* コンテンツ詳細 */}
              <div className="space-y-4">
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* 統計グラフカード */}
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-6">
              <div className="w-32 h-6 bg-gray-200 rounded-lg mb-6 animate-pulse" />
              
              {/* グラフエリア */}
              <div className="h-80 bg-gray-100 rounded-2xl p-4 flex flex-col justify-end">
                <div className="flex items-end justify-between h-full">
                  {[40, 60, 45, 80, 55, 70, 65].map((height, index) => (
                    <div
                      key={index}
                      className="bg-gray-200 rounded-t w-8"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* グラフ凡例 */}
              <div className="flex flex-wrap gap-4 mt-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse" />
                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右カラム: コントロールパネル */}
          <div className="space-y-6">
            {/* 予算管理カード */}
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-6">
              <div className="w-24 h-6 bg-gray-200 rounded-lg mb-6 animate-pulse" />
              
              {/* 予算情報 */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
                
                <div className="w-full h-2 bg-gray-200 rounded-full animate-pulse" />
              </div>

              {/* 予算更新フォーム */}
              <div className="space-y-3">
                <div className="w-full h-10 bg-gray-200 rounded-xl animate-pulse" />
                <div className="w-full h-10 bg-gray-200 rounded-xl animate-pulse" />
              </div>
            </div>

            {/* 広告コントロールカード */}
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-6">
              <div className="w-32 h-6 bg-gray-200 rounded-lg mb-6 animate-pulse" />
              
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="w-full h-10 bg-gray-200 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* パフォーマンス指標カード */}
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-xl p-6">
              <div className="w-28 h-6 bg-gray-200 rounded-lg mb-6 animate-pulse" />
              
              {/* 指標グリッド */}
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="text-center">
                    <div className="w-12 h-4 bg-gray-200 rounded mx-auto mb-2 animate-pulse" />
                    <div className="w-8 h-3 bg-gray-200 rounded mx-auto animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 中央ローディングインジケーター */}
        <div className="fixed bottom-8 right-8 z-50">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl p-4 flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-gray-700">データを読み込み中...</span>
          </div>
        </div>
      </div>


    </div>
  )
}