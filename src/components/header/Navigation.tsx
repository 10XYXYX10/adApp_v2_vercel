// src/components/header/Navigation.tsx
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
} from '@tabler/icons-react';
import { AuthUser } from '@/lib/types/auth/authTypes';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  isNew?: boolean;
  isBeta?: boolean;
}

const Navigation = ({
  user
 }:{
  user:AuthUser
 }) => {
  const pathname = usePathname();

  // 管理者用ナビゲーション
  const adminNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: `/admin/${user.id}`,
      icon: <IconDashboard size={18} />,
      description: '総合管理画面'
    },
    {
      id: 'review',
      label: 'Ad Review',
      href: `/admin/${user.id}/review`,
      icon: <IconClipboardCheck size={18} />,
      description: '広告審査',
      isNew: true
    },
    {
      id: 'user',
      label: 'Users',
      href: `/admin/${user.id}/user`,
      icon: <IconUsers size={18} />,
      description: 'ユーザー管理'
    },
    // {
    //   id: 'analytics',
    //   label: 'Analytics',
    //   href: `/admin/${user.id}/analytics`,
    //   icon: <IconChartBar size={18} />,
    //   description: '売上分析'
    // },
    {
      id: 'support',
      label: 'Support',
      href: `/admin/${user.id}/support`,
      icon: <IconHeadphones size={18} />,
      description: 'サポート管理'
    },
    {
      id: 'notification',
      label: 'Notification',
      href: `/admin/${user.id}/notification`,
      icon: <IconBell size={18} />,
      description: 'システム通知'
    }
  ];

  // 広告主用ナビゲーション
  const advertiserNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: `/advertiser/${user.id}`,
      icon: <IconDashboard size={18} />,
      description: 'ダッシュボード'
    },
    {
      id: 'ad',
      label: 'Ad',
      href: `/advertiser/${user.id}/ad`,
      icon: <IconAd size={18} />,
      description: '広告管理'
    },
    {
      id: 'points',
      label: 'Points',
      href: `/advertiser/${user.id}/point`,
      icon: <IconCoins size={18} />,
      description: 'ポイント管理',
      isBeta: true
    },
    {
      id: 'profile',
      label: 'Profile',
      href: `/advertiser/${user.id}/profile`,
      icon: <IconUser size={18} />,
      description: 'プロフィール'
    },
    {
      id: 'support',
      label: 'Support',
      href: `/advertiser/${user.id}/support`,
      icon: <IconHeadphones size={18} />,
      description: 'サポート'
    }
  ];

  const navItems = user.userType === 'admin' ? adminNavItems : advertiserNavItems;

  const isActive = (href: string) => {
    if (href === `/admin/${user.id}` || href === `/advertiser/${user.id}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex items-center justify-center">
      <div className="flex items-center space-x-1 bg-gray-50/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-200/60 shadow-sm">
        {navItems.map((item) => {
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className="group relative"
            >
              {/* メインボタン */}
              <div
                className={`
                  relative flex items-center space-x-2 px-4 py-2.5 rounded-xl
                  transition-all duration-200 ease-in-out
                  ${active 
                    ? 'bg-white text-blue-700 shadow-md ring-1 ring-blue-100' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                  }
                `}
              >
                {/* アイコン */}
                <div
                  className={`
                    transition-all duration-200 ease-in-out
                    ${active 
                      ? 'text-blue-600 scale-110' 
                      : 'text-gray-500 group-hover:text-gray-700 group-hover:scale-105'
                    }
                  `}
                >
                  {item.icon}
                </div>

                {/* ラベル */}
                <span
                  className={`
                    font-medium text-sm whitespace-nowrap transition-all duration-200
                    ${active 
                      ? 'text-blue-700' 
                      : 'text-gray-600 group-hover:text-gray-900'
                    }
                  `}
                >
                  {item.label}
                </span>

                {/* NEW/BETA バッジ */}
                {(item.isNew || item.isBeta) && (
                  <span
                    className={`
                      absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-bold rounded-full
                      ${item.isNew 
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' 
                        : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                      }
                      shadow-sm transform scale-75 group-hover:scale-90 transition-transform duration-200
                    `}
                  >
                    {item.isNew ? 'NEW' : 'BETA'}
                  </span>
                )}

                {/* アクティブインジケーター */}
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 rounded-xl" />
                )}
              </div>

              {/* ツールチップ */}
              <div
                className={`
                  absolute top-full left-1/2 transform -translate-x-1/2 mt-2
                  px-3 py-2 bg-gray-900 text-white text-xs rounded-lg
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible
                  transition-all duration-200 ease-in-out delay-500
                  whitespace-nowrap z-50
                `}
              >
                {item.description}
                
                {/* ツールチップの矢印 */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900" />
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
export default Navigation;