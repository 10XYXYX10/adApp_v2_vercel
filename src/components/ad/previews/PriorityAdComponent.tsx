'use client'
//「src/components/ad/preview/PriorityAdComponent.tsx」
import { useState } from 'react';

// サンプル動画データ
const videoData = [
    { id: 1, title: "動画タイトル", date: "2025年05月27日", isAd: false },
    { id: 2, title: "【優先表示広告】", date: "2025年06月", isAd: true },
    { id: 3, title: "動画タイトル", date: "2025年06月07日", isAd: false },
    { id: 4, title: "動画タイトル", date: "2025年06月07日", isAd: false },
    // { id: 5, title: "通常の動画タイトル", date: "2024年04月05日17時45分", isAd: false },
    // { id: 6, title: "通常の動画タイトル", date: "2024年06月06日22時15分", isAd: false }
];

const PriorityAdComponent = () => {
  const [hoveredItem, setHoveredItem] = useState<null|number>(null);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* ヘッダー */}
      <div className="bg-pink-100 p-3 border-b">
        <h2 className="text-center text-lg font-bold text-pink-600 mb-2">
          EchiEchi ♡ tube
        </h2>
        
        {/* ナビゲーション */}
        <div className="flex bg-gray-600 rounded text-white text-xs">
          <div className="flex-1 p-1 text-center bg-gray-500 rounded-l">
            🏠 Home
          </div>
          <div className="flex-1 p-1 text-center">
            ♡ favorite
          </div>
          <div className="flex-1 p-1 text-center">
            📞 contact
          </div>
          <div className="flex-1 p-1 text-center rounded-r">
            📝 概要
          </div>
        </div>
        
        {/* 検索バー */}
        <div className="flex mt-2 space-x-1">
          <input 
            type="text" 
            placeholder="検索..."
            className="flex-1 px-2 py-1 border rounded text-sm"
          />
          <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
            🔍
          </button>
        </div>
        
      </div>

      {/* 動画一覧グリッド */}
      <div className="p-3">
        <div className="grid grid-cols-2 gap-2">
          {videoData.map((video) => (
            <div
              key={video.id}
              className={`relative group cursor-pointer ${
                video.isAd 
                  ? 'border-2 border-pink-400 rounded-lg shadow-lg transform scale-105' 
                  : 'border border-gray-200 rounded'
              }`}
              onMouseEnter={() => setHoveredItem(video.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* 広告バッジ */}
              {video.isAd && (
                <div className="absolute -top-1 -right-1 z-10 bg-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  AD
                </div>
              )}
              
              {/* サムネイル部分 */}
              <div className={`relative ${video.isAd ? 'bg-pink-50' : 'bg-gray-900'} rounded-t aspect-video flex items-center justify-center`}>
                {video.isAd ? (
                  <div className="text-center p-2">
                    <div className="text-pink-600 font-bold text-sm mb-1">📺</div>
                    <div className="text-pink-700 text-xs font-medium">
                      一覧ページで、<br/>特定記事を優先表示！！
                    </div>
                  </div>
                ) : (
                  <div className="w-8 h-8 border-2 border-gray-600 border-l-transparent rounded-full animate-pulse"></div>
                )}
                
                {/* ホバーエフェクト */}
                {hoveredItem === video.id && (
                  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-t flex items-center justify-center">
                    <div className="w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                      ▶
                    </div>
                  </div>
                )}
              </div>
              
              {/* タイトル・日時部分 */}
              <div className={`p-2 ${video.isAd ? 'bg-pink-50' : 'bg-gray-800'} rounded-b`}>
                <div className={`text-xs mb-1 ${video.isAd ? 'text-pink-600' : 'text-white'}`}>
                  🕒 {video.date}
                </div>
                <div className={`text-xs font-medium ${video.isAd ? 'text-pink-800' : 'text-white'} line-clamp-2`}>
                  {video.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 説明テキスト */}
      <div className="bg-gray-50 p-3 border-t text-xs text-gray-600">
        <div className="flex items-center space-x-2 mb-1">
          <span className="w-3 h-3 bg-pink-400 rounded-full"></span>
          <span>記事一覧ページの専用枠（最大10枠）で優先表示</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
          <span>クリック1P・表示0.1P | クリック後1時間非表示</span>
        </div>
      </div>
    </div>
  );
};
export default PriorityAdComponent;