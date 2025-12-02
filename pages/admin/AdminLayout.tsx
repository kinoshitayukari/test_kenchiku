import React, { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, MessageSquare, LogOut, ExternalLink } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold">管理画面</h1>
          <p className="text-xs text-gray-400 mt-1">ともあき建築工房</p>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          <NavLink 
            to="/admin/blog" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${isActive ? 'bg-brand-orange text-white' : 'text-gray-300 hover:bg-gray-700'}`
            }
          >
            <FileText size={18} />
            ブログ記事管理
          </NavLink>
          <NavLink 
            to="/admin/inquiries" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-colors ${isActive ? 'bg-brand-orange text-white' : 'text-gray-300 hover:bg-gray-700'}`
            }
          >
            <MessageSquare size={18} />
            お問い合わせ一覧
          </NavLink>
          
          <div className="pt-8 mt-8 border-t border-gray-700">
            <a href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white transition-colors">
              <ExternalLink size={18} />
              サイトを表示
            </a>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-left text-sm text-gray-400 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            ログアウト
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;