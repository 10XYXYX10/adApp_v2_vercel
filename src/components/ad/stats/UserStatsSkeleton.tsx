// src/components/ad/stats/UserStatsSkeleton.tsx

export default function UserStatsSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse" />
            <div>
              <div className="h-6 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse mb-2" />
              <div className="h-4 w-32 bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="w-11 h-11 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse" />
        </div>

        {/* ナビゲーション */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-11 h-11 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse" />
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-3 rounded-xl min-w-[160px] h-12 animate-pulse" />
          <div className="w-11 h-11 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* サマリーカード */}
      <div className="p-6 pt-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 rounded-2xl p-4 sm:p-6 shadow-xl animate-pulse"
            >
              {/* 背景エフェクト */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10" />
              
              {/* コンテンツ */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/60 rounded animate-pulse" />
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
                </div>
                
                <div className="h-6 sm:h-8 lg:h-10 w-20 bg-white/60 rounded mb-1 animate-pulse" />
                <div className="h-3 sm:h-4 w-16 bg-white/40 rounded animate-pulse" />
              </div>

              {/* グリッターエフェクト */}
              <div className="absolute top-2 right-2 w-4 h-4 bg-white/40 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* グラフエリア */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl overflow-hidden mt-6 mx-6 mb-6">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse" />
            <div>
              <div className="h-5 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-2" />
              <div className="h-3 w-48 bg-gradient-to-r from-gray-100 to-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* チャート切り替えタブ */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 sm:w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"
              />
            ))}
          </div>

          {/* メインチャート */}
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
            <div className="h-80 w-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded-xl animate-pulse relative overflow-hidden">
              {/* チャートライン模擬 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              
              {/* データポイント模擬 */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-white/60 rounded-full animate-pulse"
                  style={{
                    left: `${15 + i * 10}%`,
                    top: `${30 + Math.sin(i) * 20}%`,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* データサマリー */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/40">
                <div className="h-6 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded mx-auto mb-2 animate-pulse" />
                <div className="h-3 w-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded mx-auto animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}