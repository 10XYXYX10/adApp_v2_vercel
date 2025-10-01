import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "@/components/head/GoogleAnalytics";
import { Suspense } from "react";

const title = 'ECH AD - 100円から即配信｜アダルト広告対応！Youtube動画も審査なしで宣伝可能！'
const description = `ECH ADは成人向けコンテンツを含む広告配信に特化したプラットフォーム。大手では取り扱い困難な広告も100円から配信可能です。YouTube宣伝は審査不要で即配信、4種類の広告形式から選択でき、クレジットカード・仮想通貨両対応。リアルタイム統計で効果を即座に確認。低コスト・高速配信で広告効果を最大化します。`
const appUrl = process.env.NEXT_PUBLIC_APP_URL as string;
const mediaPathPrefix = process.env.NEXT_PUBLIC_MEDIA_PATH as string;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'ECH AD',
    '広告配信',
    'アダルト広告',
    'YouTube宣伝',
    '100円',
    '仮想通貨決済',
    'リアルタイム分析',
    'BTC',
    'ETH',
    'LTC',
    'クレジットカード決済',
    '審査なし',
    '即配信'
  ],
  authors: [{ name: 'ECH AD' }],
  creator: 'ECH AD',
  publisher: 'ECH AD',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(appUrl),
  alternates: {
    canonical: appUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'ECH AD',
    title,
    description,
    url: appUrl,
    images: [
      {
        url: `${mediaPathPrefix}/images/banner_v2.png`,
        width: 1200,
        height: 630,
        alt: 'ECH AD - 100円から始める広告配信プラットフォーム',
        type: 'image/png',
      },
    ],
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ECHAD_X',
    creator: '@ECHAD_X',
    title,
    description,
    images: [
      {
        url: `${mediaPathPrefix}/images/banner_v2.png`,
        width: 1200,
        height: 630,
        alt: 'ECH AD - 100円から始める広告配信プラットフォーム',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/images/icon.png', sizes: '48x48', type: 'image/png' },
    ],
    shortcut: '/images/icon.png',
    apple: [
      { url: '/images/icon.png', sizes: '48x48', type: 'image/png' },
    ],
  },
  verification: {
    // Google Search Console用 - 後で設定
    // google: 'your-google-verification-code',
    // Bing Webmaster用 - 後で設定  
    // other: {
    //   'msvalidate.01': 'your-bing-verification-code',
    // },
  },
  category: 'business',
  classification: 'Advertising Platform',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#0f172a',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* 追加のカスタムメタタグ */}
        <meta name="format-detection" content="telephone=no,address=no,email=no" />
        <meta name="apple-mobile-web-app-title" content="ECH AD" />
        <meta name="application-name" content="ECH AD" />
        <link rel="shortcut icon" href="/images/icon.png" />
        <link rel="icon" href="/images/icon.png" />
        <link rel="apple-touch-icon" href="/images/icon.png" />
        
        {/* セキュリティ関連 */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      </head>
      <body>
        <Suspense fallback={null}>
          <GoogleAnalytics/>
        </Suspense>
        {children}
      </body>
    </html>
  );
}
