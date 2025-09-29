// src/app/(main)/layout.tsx
import Footer from '@/components/footer/Footer';
import HeaderSC from '@/components/header/HeaderSC';
import HeaderSkeleton from '@/components/header/HeaderSkeleton';
import { ReactNode, Suspense } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ヘッダー */}
      <Suspense fallback={<HeaderSkeleton/>}>
        <HeaderSC />
      </Suspense>
      
      {/* メインコンテンツ */}
      <main className="flex-1">
        {children}
      </main>

      {/* フッター */}
      <Footer />
    </div>
  );
}