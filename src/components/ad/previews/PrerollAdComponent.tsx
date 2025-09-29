'use client'
//「src/components/ad/preview/PrerollAdComponent.tsx」
import React, { useState, useEffect } from 'react';

const PrerollAdComponent = () => {
  const [phase, setPhase] = useState('waiting'); // 'waiting', 'ad', 'video'
  const [adTimer, setAdTimer] = useState(15);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  useEffect(() => {
    if (phase === 'ad' && adTimer > 0) {
      const timer = setTimeout(() => {
        setAdTimer(adTimer - 1);
        // 10秒経過後にスキップボタン表示
        if (adTimer === 6) { // 15-6=9, つまり10秒後
          setShowSkipButton(true);
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'ad' && adTimer === 0) {
      // CM終了後、自動的に本編再生
      setPhase('video');
      startVideoProgress();
    }
  }, [phase, adTimer]);

  const startVideoProgress = () => {
    const progressTimer = setInterval(() => {
      setVideoProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 1;
      });
    }, 100);
  };

  const handlePlayClick = () => {
    setPhase('ad');
  };

  const handleSkipAd = () => {
    setPhase('video');
    startVideoProgress();
  };

  const handleReset = () => {
    setPhase('waiting');
    setAdTimer(15);
    setShowSkipButton(false);
    setVideoProgress(0);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-black rounded-lg overflow-hidden shadow-2xl">
      {/* メインビデオエリア */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black">
        
        {/* 待機状態 */}
        {phase === 'waiting' && (
          <>
            {/* サムネイル */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900">
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-2xl mb-2 mt-[-11px]">🎬</div>
                  <div className="text-sm font-medium mt-24">動画コンテンツ: 13:19</div>
                </div>
              </div>
            </div>
            
            {/* 大きな再生ボタン */}
            <button
              onClick={handlePlayClick}
              className="absolute inset-0 flex items-center justify-center group"
            >
              <div className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white" className="ml-1">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </button>
          </>
        )}

        {/* 広告再生中 */}
        {phase === 'ad' && (
          <>
            {/* 広告コンテンツ */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <div className="text-4xl mb-4 animate-pulse">✨</div>
                  <div className="text-xl font-bold mb-2">素晴らしい商品をご紹介！</div>
                  <div className="text-sm opacity-90 mb-3">15秒で分かる魅力的な広告</div>
                  <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              </div>
            </div>

            {/* 広告表示バッジ */}
            <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
              広告 {adTimer}s
            </div>

            {/* 進行バー */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
              <div 
                className="h-full bg-red-500 transition-all duration-1000"
                style={{ width: `${((15 - adTimer) / 15) * 100}%` }}
              ></div>
            </div>

            {/* スキップボタン */}
            {showSkipButton && (
              <button
                onClick={handleSkipAd}
                className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded text-sm font-medium transition-all duration-300 transform hover:scale-105"
              >
                広告をスキップ →
              </button>
            )}

            {/* カウントダウン表示 */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-lg font-mono">
              {adTimer.toString().padStart(2, '0')}
            </div>
          </>
        )}

        {/* 本編動画再生中 */}
        {phase === 'video' && (
          <>
            {/* 本編コンテンツ */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-teal-700 to-blue-800">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-3xl mb-4">🎥</div>
                  <div className="text-lg font-bold mb-2">本編動画が再生中...</div>
                  <div className="text-sm opacity-90">素晴らしいコンテンツをお楽しみください</div>
                </div>
              </div>
            </div>

            {/* 動画コントロール */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <div className="flex items-center space-x-3 text-white">
                <button className="hover:text-red-400 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                  </svg>
                </button>
                
                <div className="flex-1">
                  <div className="w-full h-1 bg-gray-600 rounded-full">
                    <div 
                      className="h-full bg-red-500 rounded-full transition-all duration-100"
                      style={{ width: `${videoProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                <span className="text-xs font-mono">{Math.floor(videoProgress/10)}:0{Math.floor(videoProgress%10)}/13:19</span>
                
                <button className="hover:text-red-400 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 説明エリア */}
      <div className="bg-gray-900 p-4 text-white">
        <div className="text-sm font-medium mb-2">プレロール広告の流れ</div>
        <div className="text-xs text-gray-300 space-y-1">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${phase === 'waiting' ? 'bg-blue-400' : 'bg-gray-600'}`}></span>
            <span>1. 再生ボタンクリック</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${phase === 'ad' ? 'bg-red-400' : 'bg-gray-600'}`}></span>
            <span>2. 15秒CM表示 (10秒後スキップ可)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${phase === 'video' ? 'bg-green-400' : 'bg-gray-600'}`}></span>
            <span>3. 本編動画再生</span>
          </div>
        </div>
        
        {phase === 'video' && (
          <button
            onClick={handleReset}
            className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-medium transition-colors"
          >
            🔄 デモをリセット
          </button>
        )}
      </div>
    </div>
  );
};
export default PrerollAdComponent;