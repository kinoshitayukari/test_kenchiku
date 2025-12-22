import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Instagram, Facebook, Twitter, MapPin, UserCog } from 'lucide-react';
import { NAV_ITEMS, GOOGLE_FORM_URL } from '../constants';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide header/footer on admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');
  if (isAdminRoute && location.pathname !== '/admin/login') {
     return <>{children}</>;
  }

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      // If we are already on home page, just scroll
      if (location.pathname === '/' || location.pathname === '') {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // If on blog page, navigate to home then scroll
        navigate('/');
        // Use a timeout to allow navigation to happen before scrolling
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      navigate(href);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#fdfbf7]/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('/')}>
            <span className="text-2xl font-bold text-brand-orange font-serif tracking-wider">ともあき建築工房</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="text-sm font-medium text-gray-600 hover:text-brand-orange transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => navigate('/admin/login')}
              className="text-sm font-medium text-gray-400 hover:text-gray-600 flex items-center gap-1 ml-4"
            >
              <UserCog size={16} />
              管理画面
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-[#fdfbf7] border-b border-gray-100 p-4 flex flex-col gap-4 shadow-lg">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="text-left py-2 px-4 hover:bg-orange-50 text-gray-700 font-medium rounded-lg"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                navigate('/admin/login');
                setIsMobileMenuOpen(false);
              }}
              className="text-left py-2 px-4 hover:bg-orange-50 text-gray-400 font-medium rounded-lg flex items-center gap-2"
            >
              <UserCog size={16} />
              管理画面
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark text-white pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-xl font-bold text-brand-orange mb-6 font-serif">ともあき建築工房</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                神戸三田エリアに根ざし、30年以上にわたってお客様の住まいづくりをサポートしています。
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-brand-orange hover:border-brand-orange transition-colors">
                  <Facebook size={14} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-brand-orange hover:border-brand-orange transition-colors">
                  <Instagram size={14} />
                </a>
                <a href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-brand-orange hover:border-brand-orange transition-colors">
                  <Twitter size={14} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6">サービス</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer">キッチン</li>
                <li className="hover:text-white cursor-pointer">浴室</li>
                <li className="hover:text-white cursor-pointer">外壁</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">会社情報</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="hover:text-white cursor-pointer">会社概要</li>
                <li className="hover:text-white cursor-pointer">アクセス</li>
                <li className="hover:text-white cursor-pointer">採用情報</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">お問い合わせ</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <a
                    href={GOOGLE_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    無料見積もりフォーム
                  </a>
                </li>
                <li className="hover:text-white cursor-pointer">電話相談</li>
                <li className="hover:text-white cursor-pointer">来店予約</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p>© 2025 ともあき建築工房. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Powered by Readdy</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;