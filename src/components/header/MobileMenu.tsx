'use client'
// src/components/header/MovileMenu.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  IconDashboard, 
  IconAd, 
  IconUsers, 
  IconChartBar, 
  IconClipboardCheck,
  IconHeadphones,
  IconBell,
  IconCoins,
  IconUser,
  IconChevronRight,
  IconCrown,
  IconShield,
  IconSparkles
} from '@tabler/icons-react';
import { AuthUser } from '@/lib/types/auth/authTypes';

interface MobileMenuProps {
  user: {
    id: number;
    name: string;
    userType: 'admin' | 'advertiser';
  } | null;
  userType: 'admin' | 'advertiser';
  userId: number;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  isNew?: boolean;
  isBeta?: boolean;
  category: 'main' | 'secondary';
}

const MobileMenu = ({
  user,
  onClose,
  notificationCount,
 }:{
  user:AuthUser
  onClose: () => void
  notificationCount: number
 }) => {
  const pathname = usePathname();

  // 管理者用ナビゲーション
  const adminNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: `/admin/${user.id}`,
      icon: <IconDashboard size={20} />,
      description: '総合管理画面',
      category: 'main'
    },
    {
      id: 'review',
      label: 'Ad Review',
      href: `/admin/${user.id}/review`,
      icon: <IconClipboardCheck size={20} />,
      description: '広告審査管理',
      category: 'main',
      isNew: true
    },
    {
      id: 'users',
      label: 'User Management',
      href: `/admin/${user.id}/users`,
      icon: <IconUsers size={20} />,
      description: 'ユーザー管理',
      category: 'main'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      href: `/admin/${user.id}/payment`,
      icon: <IconChartBar size={20} />,
      description: '売上・統計分析',
      category: 'main'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      href: `/admin/${user.id}/notifications`,
      icon: <IconBell size={20} />,
      description: 'システム通知管理',
      category: 'secondary'
    },
    {
      id: 'support',
      label: 'Support',
      href: `/admin/${user.id}/support`,
      icon: <IconHeadphones size={20} />,
      description: 'サポート管理',
      category: 'secondary'
    }
  ];

  // 広告主用ナビゲーション
  const advertiserNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: `/advertiser/${user.id}`,
      icon: <IconDashboard size={20} />,
      description: 'ダッシュボード',
      category: 'main'
    },
    {
      id: 'ad',
      label: 'Ad Management',
      href: `/advertiser/${user.id}/ad`,
      icon: <IconAd size={20} />,
      description: '広告作成・管理',
      category: 'main'
    },
    {
      id: 'points',
      label: 'Points & Billing',
      href: `/advertiser/${user.id}/point`,
      icon: <IconCoins size={20} />,
      description: 'ポイント購入・管理',
      category: 'main',
      isBeta: true
    },
    {
      id: 'notifications',
      label: 'Notifications',
      href: `/advertiser/${user.id}/notifications`,
      icon: <IconBell size={20} />,
      description: '通知確認',
      category: 'secondary'
    },
    {
      id: 'profile',
      label: 'Profile',
      href: `/advertiser/${user.id}/profile`,
      icon: <IconUser size={20} />,
      description: 'プロフィール設定',
      category: 'secondary'
    },
    {
      id: 'support',
      label: 'Support',
      href: `/advertiser/${user.id}/support`,
      icon: <IconHeadphones size={20} />,
      description: 'サポート・お問い合わせ',
      category: 'secondary'
    }
  ];

  const navItems = user.userType === 'admin' ? adminNavItems : advertiserNavItems;
  const mainItems = navItems.filter(item => item.category === 'main');
  const secondaryItems = navItems.filter(item => item.category === 'secondary');

  const isActive = (href: string) => {
    if (href === `/admin/${user.id}` || href === `/advertiser/${user.id}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };


  if (!user) {
    return (
      <div className="p-6 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to ECH AD</h3>
          <p className="text-sm text-gray-600 mb-6">Sign in to access your advertising dashboard</p>
          
          <div className="space-y-3">
            <Link
              href="/auth/advertiser"
              onClick={onClose}
              className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
            >
              Sign In / Get Started
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userInitials = user.name.slice(0, 2).toUpperCase();

  return (
    <div className="max-h-screen overflow-y-auto">
      {/* ユーザーヘッダー */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          {/* ユーザーアバター */}
          <div className="relative">
            <div className={`
              w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg
              ${user.userType === 'admin' 
                ? 'bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 shadow-purple-500/25' 
                : 'bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 shadow-blue-500/25'
              }
              shadow-xl
            `}>
              {userInitials}
            </div>
            
            {/* ユーザータイプバッジ */}
            <div className={`
              absolute -bottom-1 -right-1 w-6 h-6 rounded-xl flex items-center justify-center shadow-lg
              ${user.userType === 'admin' 
                ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                : 'bg-gradient-to-br from-emerald-500 to-green-500'
              }
            `}>
              {user.userType === 'admin' ? <IconCrown size={14} color="white" /> : <IconShield size={14} color="white" />}
            </div>
          </div>

          {/* ユーザー情報 */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
            <p className={`
              text-sm font-medium capitalize flex items-center space-x-1
              ${user.userType === 'admin' ? 'text-purple-600' : 'text-blue-600'}
            `}>
              <span>{user.userType} Account</span>
              <IconSparkles size={14} className="opacity-60" />
            </p>
          </div>
        </div>
      </div>

      {/* メインナビゲーション */}
      <div className="p-4">
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
            Main Menu
          </h4>
          <div className="space-y-1">
            {mainItems.map((item, index) => {
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    group relative flex items-center space-x-4 px-4 py-4 rounded-2xl
                    transition-all duration-200 ease-in-out
                    ${active 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100' 
                      : 'hover:bg-gray-50'
                    }
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* アイコン */}
                  <div
                    className={`
                      flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                      transition-all duration-200 ease-in-out
                      ${active 
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-800'
                      }
                    `}
                  >
                    {item.icon}
                  </div>

                  {/* コンテンツ */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h5 className={`
                        font-medium text-sm truncate
                        ${active ? 'text-blue-700' : 'text-gray-900 group-hover:text-gray-800'}
                      `}>
                        {item.label}
                      </h5>
                      
                      {/* バッジ */}
                      {(item.isNew || item.isBeta) && (
                        <span className={`
                          px-2 py-0.5 text-xs font-bold rounded-full
                          ${item.isNew 
                            ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' 
                            : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                          }
                          shadow-sm
                        `}>
                          {item.isNew ? 'NEW' : 'BETA'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {item.description}
                    </p>
                  </div>

                  {/* 矢印 */}
                  <IconChevronRight 
                    size={16} 
                    className={`
                      flex-shrink-0 transition-all duration-200
                      ${active 
                        ? 'text-blue-600 transform translate-x-1' 
                        : 'text-gray-400 group-hover:text-gray-600 group-hover:transform group-hover:translate-x-0.5'
                      }
                    `}
                  />

                  {/* アクティブインジケーター */}
                  {active && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* セカンダリナビゲーション */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
            Settings & Support
          </h4>
          <div className="space-y-1">
            {secondaryItems.map((item, index) => {
              const active = isActive(item.href);
              const showNotificationBadge = item.id === 'notifications' && notificationCount > 0;
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    group flex items-center space-x-3 px-4 py-3 rounded-xl
                    transition-all duration-200 ease-in-out
                    ${active 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }
                  `}
                  style={{ animationDelay: `${(mainItems.length + index) * 50}ms` }}
                >
                  <div className="relative">
                    {item.icon}
                    {showNotificationBadge && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                  {showNotificationBadge && (
                    <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                      {notificationCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MobileMenu;