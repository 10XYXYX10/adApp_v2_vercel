'use client'
// src/components/header/UserMenu.tsx
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  IconBell, 
  IconUser, 
  IconChevronDown,
  IconCoins,
  IconHeadphones,
  IconShield,
  IconCrown
} from '@tabler/icons-react';
import { AuthUser, UserType } from '@/lib/types/auth/authTypes';
import SignOut from '@/components/auth/SignOut';

const UserMenu = ({
  user,
  notificationCount,
 }:{
  user:AuthUser
  notificationCount: number
 }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 外部クリックでドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  if (user.id===0) {
    return (
      <div className="flex items-center space-x-3">
        <Link
            href="/auth/advertiser"
            className="rounded-full p-2 hover:opacity-75 inline-block my-1 bg-gray-400"
        >
            <IconUser/>
        </Link>

        <Link
          href="/auth/advertiser"
          className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Get Started
        </Link>
      </div>
    );
  }

  const userInitials = user.name.slice(0, 2).toUpperCase();
  return (
    <div className="flex items-center space-x-4">

      <SignOut userType={user.userType as UserType}/>

      {/* 通知ベル */}
      <Link
        href={`/${user.userType}/${user.id}/notifications`}
        className="group relative p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 ease-in-out"
      >
        <IconBell 
          size={20} 
          className="text-gray-600 group-hover:text-gray-800 transition-colors duration-200" 
        />
        
        {/* 未読通知バッジ */}
        {notificationCount > 0 && (
          <div className="absolute -top-1 -right-1 min-w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
            {notificationCount > 99 ? '99+' : notificationCount}
          </div>
        )}
        
        {/* ホバー時のグロー効果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-indigo-400/0 group-hover:from-blue-400/20 group-hover:to-indigo-400/20 rounded-xl transition-all duration-200" />
      </Link>

      {/* ユーザーメニュードロップダウン */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`
            group flex items-center space-x-3 px-3 py-2 rounded-xl
            transition-all duration-200 ease-in-out
            ${isDropdownOpen 
              ? 'bg-gray-100 ring-2 ring-blue-100' 
              : 'hover:bg-gray-50'
            }
          `}
        >
          {/* ユーザーアバター */}
          <div className="relative">
            <Link 
                href={`/${user.userType}/${user.id}`}
                className={`
                    w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-white
                    ${user.userType === 'admin' 
                    ? 'bg-gradient-to-br from-purple-600 to-indigo-700' 
                    : 'bg-gradient-to-br from-blue-600 to-cyan-600'
                    }
                    shadow-md group-hover:shadow-lg transition-all duration-200
                `}
            >
              {userInitials}
            </Link>
            
            {/* ユーザータイプバッジ */}
            <div className={`
              absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center
              ${user.userType === 'admin' 
                ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                : 'bg-gradient-to-br from-emerald-500 to-green-500'
              }
              shadow-sm
            `}>
              {user.userType === 'admin' ? <IconCrown size={10} /> : <IconShield size={10} />}
            </div>
          </div>

          {/* ユーザー名 */}
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-gray-900 truncate max-w-24">
              {user.name}
            </span>
            <span className={`
              text-xs font-medium capitalize
              ${user.userType === 'admin' ? 'text-purple-600' : 'text-blue-600'}
            `}>
              {user.userType}
            </span>
          </div>

          {/* ドロップダウン矢印 */}
          <IconChevronDown 
            size={16} 
            className={`
              text-gray-500 transition-transform duration-200
              ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}
            `}
          />
        </button>

        {/* ドロップダウンメニュー */}
        <div
          className={`
            absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200/60
            backdrop-blur-sm transition-all duration-200 ease-in-out origin-top-right z-50
            ${isDropdownOpen 
              ? 'opacity-100 visible scale-100 translate-y-0' 
              : 'opacity-0 invisible scale-95 -translate-y-2'
            }
          `}
        >
          <div className="p-2">
            {/* ユーザー情報ヘッダー */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold
                  ${user.userType === 'admin' 
                    ? 'bg-gradient-to-br from-purple-600 to-indigo-700' 
                    : 'bg-gradient-to-br from-blue-600 to-cyan-600'
                  }
                `}>
                  {userInitials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className={`
                    text-xs font-medium capitalize
                    ${user.userType === 'admin' ? 'text-purple-600' : 'text-blue-600'}
                  `}>
                    {user.userType} Account
                  </p>
                </div>
              </div>
            </div>

            {/* メニューアイテム */}
            <div className="py-2 space-y-1">
              <Link
                href={`/${user.userType}/${user.id}/profile`}
                className="flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors duration-150 group"
                onClick={() => setIsDropdownOpen(false)}
              >
                <IconUser size={18} className="text-gray-500 group-hover:text-gray-700" />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">Profile Settings</span>
              </Link>

              {user.userType === 'advertiser' && (
                <Link
                  href={`/${user.userType}/${user.id}/point`}
                  className="flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors duration-150 group"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <IconCoins size={18} className="text-gray-500 group-hover:text-gray-700" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">Points & Billing</span>
                </Link>
              )}

              <Link
                href={`/${user.userType}/${user.id}/support`}
                className="flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors duration-150 group"
                onClick={() => setIsDropdownOpen(false)}
              >
                <IconHeadphones size={18} className="text-gray-500 group-hover:text-gray-700" />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">Support</span>
              </Link>

              <div className="border-t border-gray-100 my-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;