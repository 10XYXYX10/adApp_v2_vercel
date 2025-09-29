// src/components/header/Logo.tsx
import Link from 'next/link';
import { IconTarget, IconTrendingUp } from '@tabler/icons-react';

const Logo = () => {
  return (
    <Link 
      href="/" 
      className="group flex items-center space-x-3 transition-all duration-300 ease-in-out hover:scale-105"
    >
      {/* アイコン部分 */}
      <div className="relative">
        {/* メインアイコン */}
        <div className="relative w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center">
          <IconTarget 
            size={24} 
            className="text-white transform group-hover:rotate-12 transition-transform duration-300"
          />
          
          {/* グロー効果 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md" />
        </div>
        
        {/* 成長を表すサブアイコン */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-md">
          <IconTrendingUp size={10} className="text-white" />
        </div>
      </div>

      {/* テキスト部分 */}
      <div className="flex flex-col">
        <div className="flex items-baseline space-x-1">
          <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-blue-700 group-hover:to-indigo-700 transition-all duration-300">
            ECH
          </span>
          <span className="text-xs lg:text-sm font-medium text-emerald-600 group-hover:text-emerald-500 transition-colors duration-300">
            AD
          </span>
        </div>
        
        {/* サブタイトル（デスクトップのみ） */}
        <span className="hidden lg:block text-xs font-medium text-gray-500 group-hover:text-gray-400 transition-colors duration-300 tracking-wide">
          Advertising Platform
        </span>
      </div>

      {/* ホバー時の装飾効果 */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110" />
    </Link>
  );
};
export default Logo;