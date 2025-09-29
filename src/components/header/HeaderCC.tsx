'use client'
// src/components/common/header/HeaderCC.tsx
import { useState, useEffect } from 'react';
import { IconMenu2, IconX } from '@tabler/icons-react';
import Logo from './Logo';
import Navigation from './Navigation';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';
import { AuthUser } from '@/lib/types/auth/authTypes';
import useStore from '@/store';

const HeaderCC = ({
  user,
  unreadNotificationCount
 }:{
  user:AuthUser
  unreadNotificationCount:number
 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const {setNotificationCount,notificationCount,updateUser} = useStore();
  
  useEffect(() => {
    //notifiCationCountをstoreにセット
    if(unreadNotificationCount)setNotificationCount(unreadNotificationCount);
    if(user.id)updateUser(user)

    // スクロール検知
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // モバイルメニューが開いている時は背景スクロールを無効化
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
          ${isScrolled 
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
            : 'bg-white/90 backdrop-blur-sm'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo />
            </div>
            {/* Desktop Navigation */}
            <div className="hidden lg:block flex-1 max-w-3xl mx-8">
              <Navigation user={user} />
            </div>

            {/* Desktop User Menu */}
            <div className="hidden lg:flex items-center space-x-4">
              <UserMenu user={user} notificationCount={notificationCount}/>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`
                  relative p-2 rounded-xl transition-all duration-200 ease-in-out
                  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                  ${isMobileMenuOpen ? 'bg-gray-100' : ''}
                `}
                aria-label="Toggle mobile menu"
              >
                <div className="relative w-6 h-6">
                  <IconMenu2 
                    size={24} 
                    className={`
                      absolute inset-0 transition-all duration-200 ease-in-out text-gray-700
                      ${isMobileMenuOpen ? 'opacity-0 rotate-180 scale-75' : 'opacity-100 rotate-0 scale-100'}
                    `}
                  />
                  <IconX 
                    size={24} 
                    className={`
                      absolute inset-0 transition-all duration-200 ease-in-out text-gray-700
                      ${isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-75'}
                    `}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`
            lg:hidden fixed inset-0 top-16 transition-all duration-300 ease-in-out
            ${isMobileMenuOpen 
              ? 'opacity-100 visible' 
              : 'opacity-0 invisible'
            }
          `}
        >
          {/* Backdrop */}
          <div 
            className={`
              absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300
              ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}
            `}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu Content */}
          <div
            className={`
              relative bg-white/95 backdrop-blur-lg border-b border-gray-200/50
              transform transition-transform duration-300 ease-in-out
              ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}
            `}
          >
            <MobileMenu 
              user={user} 
              onClose={() => setIsMobileMenuOpen(false)}
              notificationCount={notificationCount}
            />
          </div>
        </div>
      </header>

      {/* HeaderCC Spacer */}
      <div className="h-20 lg:h-24" />
    </>
  );
};
export default HeaderCC;