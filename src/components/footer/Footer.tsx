// src/components/footer/Footer.tsx
import Link from 'next/link';
import { 
  IconTarget, 
  IconMail, 
  IconShield, 
  IconCreditCard,
  IconCurrencyBitcoin,
  IconFileText,
  IconEye,
  IconChevronRight,
  IconHeart} from '@tabler/icons-react';

const currentYear = new Date().getFullYear();

const footerSections = [
  {
    title: 'Platform',
    links: [
      { label: 'Contact', href: '/contact', icon: <IconMail size={16} /> }
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/legal/terms', icon: <IconFileText size={16} /> },
      { label: 'Privacy Policy', href: '/legal/privacy', icon: <IconEye size={16} /> }
    ]
  }
];

const paymentMethods = [
  { name: 'Credit Cards', icon: <IconCreditCard size={20} />, supported: true },
  { name: 'Bitcoin', icon: <IconCurrencyBitcoin size={20} />, supported: true },
  { name: 'Ethereum', icon: '₿', supported: true },
  { name: 'Litecoin', icon: 'Ł', supported: true }
];

const Footer = () => {

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white overflow-hidden">
      {/* 装飾的背景エフェクト */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative">
        {/* メインフッターコンテンツ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* ブランドセクション */}
            <div className="lg:col-span-5 space-y-6">
              {/* ロゴ */}
              <Link href="/" className="group inline-flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl shadow-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <IconTarget size={28} className="text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-md" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    AdFlow Pro
                  </h3>
                  <p className="text-sm text-gray-400">Advertising Platform</p>
                </div>
              </Link>

              {/* 説明 */}
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Next-generation advertising platform designed for 
                <span className="text-blue-400 font-semibold"> premium content creators</span> and 
                <span className="text-cyan-400 font-semibold"> professional advertisers</span>.
              </p>

              {/* 決済方法 */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Accepted Payments
                </h4>
                <div className="flex flex-wrap gap-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.name}
                      className="flex items-center space-x-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200"
                    >
                      <div className="text-gray-300">
                        {typeof method.icon === 'string' ? (
                          <span className="text-lg font-bold">{method.icon}</span>
                        ) : (
                          method.icon
                        )}
                      </div>
                      <span className="text-sm text-gray-300">{method.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ナビゲーションセクション */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {footerSections.map((section, sectionIndex) => (
                  <div key={section.title} className="space-y-4">
                    <h4 className="text-lg font-semibold text-white mb-6">
                      {section.title}
                    </h4>
                    <nav className="space-y-3">
                      {section.links.map((link, linkIndex) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="group flex items-center space-x-3 text-gray-400 hover:text-white transition-all duration-200"
                          style={{ animationDelay: `${(sectionIndex * 100) + (linkIndex * 50)}ms` }}
                        >
                          <div className="flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                            {link.icon}
                          </div>
                          <span className="text-sm group-hover:translate-x-1 transition-transform duration-200">
                            {link.label}
                          </span>
                          <IconChevronRight 
                            size={14} 
                            className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200" 
                          />
                        </Link>
                      ))}
                    </nav>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* セキュリティバッジセクション */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <IconShield size={20} className="text-green-400" />
                  <span className="text-sm text-gray-300">SSL Secured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <IconCreditCard size={20} className="text-purple-400" />
                  <span className="text-sm text-gray-300">PCI DSS</span>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <p className="text-sm text-gray-400">
                  Enterprise-grade security for your peace of mind
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* コピーライトセクション */}
        <div className="border-t border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-400">
                  © {currentYear} AdFlow Pro. All rights reserved.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Made with</span>
                <IconHeart size={16} className="text-red-400 animate-pulse" />
                <span className="text-sm text-gray-400">for creators</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;