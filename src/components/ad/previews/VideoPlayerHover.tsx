'use client'
//「src/components/ad/preview/VideoPlayerHover.tsx」
import { useState, useEffect } from 'react';

const VideoPlayerHover = () => {
  const [countdown, setCountdown] = useState(10);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [adVisible, setAdVisible] = useState(true);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowCloseButton(true);
    }
  }, [countdown]);

  const handleClose = () => {
    setAdVisible(false);
  };

  const resetAd = () => {
    setCountdown(10);
    setShowCloseButton(false);
    setAdVisible(true);
  };

  return (
    <div className="w-96 h-96 max-w-full bg-gray-200 flex flex-col items-center justify-center px-1 mx-auto">
      {/* 動画プレイヤー */}
      <div className="relative w-80 h-60 max-w-full bg-gray-900 rounded-xl overflow-hidden">
        {/* 上部コントロール */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
          <div className="w-16 h-2 bg-gray-600 rounded-full">
            <div className="w-6 h-2 bg-blue-400 rounded-full"></div>
          </div>
        </div>

        {/* 下部コントロール */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center space-x-2">
          {/* 再生ボタン（シークバー左の●位置） */}
          <button className="text-blue-400 hover:text-blue-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
          
          {/* シークバー */}
          <div className="flex-1 h-1.5 bg-gray-600 rounded-full">
            <div className="w-1/4 h-1.5 bg-blue-400 rounded-full"></div>
          </div>
          
          {/* 時間表示 */}
          <span className="text-gray-300 text-xs font-mono">0:00</span>
        </div>

        {/* オーバーレイ広告 */}
        {adVisible && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[74%] h-[74%] bg-white rounded-lg border-4 border-pink-400 p-4">
              {/* 広告コンテンツ */}
              <div className="space-y-3 text-sm text-gray-800">
                <p>
                    • 動画クリック時、<br/>
                    　広告を被せる形で表示
                </p>
                <p>
                    • 10秒間、確実に視聴!!<br/>
                </p>
                <p>• アクセス数アップ!!</p>
              </div>

              {/* カウントダウン表示（右上） */}
              {countdown > 0 && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {countdown}
                </div>
              )}

              {/* ×ボタン（カウントダウン終了後） */}
              {showCloseButton && (
                <button
                  onClick={handleClose}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-lg transition-colors"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* リセットボタン（デモ用） */}
      {!adVisible && (
        <button
          onClick={resetAd}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          広告を再表示
        </button>
      )}
    </div>
  );
};
export default VideoPlayerHover;