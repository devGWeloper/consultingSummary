import { Link, useLocation } from 'react-router-dom';
import { FileText, Upload, BarChart3, Home } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: '홈' },
    { path: '/papers', icon: FileText, label: '리포트' },
    { path: '/upload', icon: Upload, label: '업로드' },
    { path: '/stats', icon: BarChart3, label: '통계' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-t-0 border-x-0 rounded-none">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 
                          flex items-center justify-center shadow-lg shadow-primary-500/30
                          group-hover:shadow-xl group-hover:shadow-primary-500/40 transition-all">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white font-display">
                White Paper Summary
              </h1>
              <p className="text-xs text-slate-500">컨설팅 리포트 요약</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

