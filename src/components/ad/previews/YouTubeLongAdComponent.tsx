'use client'
//「src/components/ad/preview/YouTubeLongAdComponent.tsx」
import React, { useState, useEffect } from 'react';

const YouTubeLongAdComponent = () => {
  const [phase, setPhase] = useState('waiting'); // 'waiting', 'youtube-ad', 'video'
  const [adTimer, setAdTimer] = useState(120); // 2分 = 120秒
  const [youtubeProgress, setYoutubeProgress] = useState(0);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isYoutubePlaying, setIsYoutubePlaying] = useState(false);

  // YouTube広告のタイマー処理
  useEffect(() => {
    if (phase === 'youtube-ad' && isYoutubePlaying) {
      if (adTimer > 0) {
        const timer = setTimeout(() => {
          setAdTimer(adTimer - 1);
          setYoutubeProgress(prev => prev + (100/120)); // 120秒で100%
          
          // 30秒経過後にスキップボタン表示
          if (adTimer === 91) { // 120-106=14, つまり30秒後
            setShowSkipButton(true);
          }
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        // YouTube広告終了後、自動的に本編再生
        setPhase('video');
        startVideoProgress();
      }
    }
  }, [phase, adTimer, isYoutubePlaying]);

  const startVideoProgress = () => {
    const progressTimer = setInterval(() => {
      setVideoProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 0.5; // より遅い進行で2分動画を表現
      });
    }, 100);
  };

  const handlePlayClick = () => {
    setPhase('youtube-ad');
    // YouTube動画再生開始をシミュレート
    setTimeout(() => {
      setIsYoutubePlaying(true);
    }, 1000);
  };

  const handleSkipAd = () => {
    setPhase('video');
    startVideoProgress();
  };

  const handleReset = () => {
    setPhase('waiting');
    setAdTimer(120);
    setYoutubeProgress(0);
    setShowSkipButton(false);
    setVideoProgress(0);
    setIsYoutubePlaying(false);
  };


const formatTime = (seconds: number) => {
    seconds = Math.floor(seconds);
    let res:string|null = null;
    if( 60 <= seconds ) {
        res = String(Math.floor(seconds / 60));//分
        res += ":" + Math.floor(seconds % 60).toString().padStart( 2, '0');
    } else {
        res = "0:" + Math.floor(seconds % 60).toString().padStart( 2, '0');
    }
    return res;
};

  return (
    <div className="w-full max-w-md mx-auto bg-black rounded-lg overflow-hidden shadow-2xl">
      {/* メインビデオエリア */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black">
        
        {/* 待機状態 */}
        {phase === 'waiting' && (
          <>
            {/* サムネイル */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900">
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-2xl mb-2 mt-[-11px]">🎮</div>
                  <div className="text-sm font-medium  mt-24">ゲーム実況動画: 2:00</div>
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

        {/* YouTube広告再生中 */}
        {phase === 'youtube-ad' && (
          <>
            {/* YouTube動画コンテンツ */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-pink-600 to-purple-700">
              {!isYoutubePlaying ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-sm">YouTube動画を読み込み中...</div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="text-center text-white">
                    <div className="text-3xl mb-4">📹</div>
                    <div className="text-lg font-bold mb-2">YouTube動画が再生中</div>
                    <div className="text-sm opacity-90 mb-3">「チャンネル登録お願いします！」</div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <span className="text-sm">YouTube Creator Channel</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* YouTube広告表示バッジ */}
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center space-x-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M23.498 6.186a2.985 2.985 0 0 0-2.101-2.101C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.397.539A2.985 2.985 0 0 0 .502 6.186C.014 8.078.014 12 .014 12s0 3.922.488 5.814a2.985 2.985 0 0 0 2.101 2.101C4.495 20.454 12 20.454 12 20.454s7.505 0 9.397-.539a2.985 2.985 0 0 0 2.101-2.101C23.986 15.922 23.986 12 23.986 12s0-3.922-.488-5.814z"/>
                <path d="M9.546 15.569V8.431L15.818 12z" fill="red"/>
              </svg>
              <span>YouTube広告 {adTimer}s</span>
            </div>

            {/* YouTube進行バー */}
            <div className="absolute bottom-16 left-4 right-4">
              <div className="w-full h-1 bg-gray-600 rounded-full">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all duration-1000"
                  style={{ width: `${youtubeProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-white text-xs mt-1">
                <span>{formatTime(120-adTimer)} / 2:00</span>
              </div>
            </div>

            {/* スキップボタン or カウントダウン */}
            {showSkipButton ? (
              <button
                onClick={handleSkipAd}
                className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-90 hover:bg-opacity-100 text-white px-4 py-2 rounded text-sm font-medium transition-all duration-300 transform hover:scale-105 flex items-center space-x-1"
              >
                <span>広告をスキップ</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/>
                </svg>
              </button>
            ) : (
              <div className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-90 text-white px-4 py-2 rounded text-sm font-medium">
                広告をスキップまであと {Math.max(0, adTimer - 90)}秒
              </div>
            )}

            {/* カウントダウン表示 */}
            <div className="absolute top-4 right-4 bg-red-600 bg-opacity-90 text-white px-3 py-1 rounded text-lg font-mono">
              {adTimer.toString().padStart(2, '0')}
            </div>

            {/* YouTube視聴者数表示 */}
            <div className="absolute top-16 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
              👁 +1 再生数
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
                  <div className="text-3xl mb-4">🎮</div>
                  <div className="text-lg font-bold mb-2">本編ゲーム実況が再生中...</div>
                  <div className="text-sm opacity-90">動画をお楽しみください</div>
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
                
                <span className="text-xs font-mono">
                  {Math.floor(videoProgress/50)}:{Math.floor((videoProgress%50)*1.2).toString().padStart(2, '0')}/2:00
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 説明エリア */}
      <div className="bg-gray-900 p-4 text-white">
        <div className="text-sm font-medium mb-2 flex items-center space-x-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff0000">
            <path d="M23.498 6.186a2.985 2.985 0 0 0-2.101-2.101C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.397.539A2.985 2.985 0 0 0 .502 6.186C.014 8.078.014 12 .014 12s0 3.922.488 5.814a2.985 2.985 0 0 0 2.101 2.101C4.495 20.454 12 20.454 12 20.454s7.505 0 9.397-.539a2.985 2.985 0 0 0 2.101-2.101C23.986 15.922 23.986 12 23.986 12s0-3.922-.488-5.814z"/>
            <path d="M9.546 15.569V8.431L15.818 12z" fill="white"/>
          </svg>
          <span>YouTube広告の流れ</span>
        </div>
        <div className="text-xs text-gray-300 space-y-1">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${phase === 'waiting' ? 'bg-blue-400' : 'bg-gray-600'}`}></span>
            <span>1. 動画再生ボタンクリック</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${phase === 'youtube-ad' ? 'bg-red-400' : 'bg-gray-600'}`}></span>
            <span>2. YouTube動画広告 (30秒後スキップ可)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${phase === 'video' ? 'bg-green-400' : 'bg-gray-600'}`}></span>
            <span>3. 本編動画再生開始</span>
          </div>
        </div>
        
        <div className="mt-3 p-2 bg-red-900 bg-opacity-50 rounded text-xs">
          <div className="font-medium text-red-300 mb-1">💰 広告効果:</div>
          <div className="text-gray-300">
            • YouTube動画再生数増加: +1回<br/>
            • 課金: 1再生3円
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
export default YouTubeLongAdComponent;