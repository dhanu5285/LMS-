import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NavbarLogo } from './NavbarLogo';
import { 
  Wallet, Compass, PieChart, Settings, LogOut, Bell,
  User, MessageSquare, PlusCircle, MinusCircle, Target
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  theme,
  setTheme,
}) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard Overview', icon: <Wallet className="w-5 h-5" /> },
    { path: '/income', label: 'Income Registry', icon: <PlusCircle className="w-5 h-5 text-brand-green" /> },
    { path: '/expenses', label: 'Expenses Registry', icon: <MinusCircle className="w-5 h-5 text-red-500" /> },
    { path: '/goals', label: 'Financial Goals', icon: <Target className="w-5 h-5 text-brand-blue" /> },
    { path: '/chatbot', label: 'AI Chatbot Assistant', icon: <MessageSquare className="w-5 h-5 text-indigo-400" /> },
    { path: '/profile', label: 'Profile Settings', icon: <User className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`flex min-h-screen font-sans ${
      theme === 'dark' ? 'bg-[#0b0f19] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Sidebar - Desktop Layout */}
      <aside className={`hidden md:flex flex-col justify-between w-64 p-6 border-r shrink-0 ${
        theme === 'dark' ? 'bg-[#0d1220] border-slate-800/80' : 'bg-white border-slate-200'
      }`}>
        <div className="space-y-8">
          {/* Logo container */}
          <div className="flex justify-start">
            <NavbarLogo active={false} theme={theme} onClick={() => navigate('/')} />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'
                      : theme === 'dark'
                        ? 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4 pt-6 border-t border-slate-800/10">
          <div className={`p-4 rounded-xl border flex items-center gap-3 ${
            theme === 'dark' ? 'bg-slate-950/40 border-slate-800/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-blue to-brand-green flex items-center justify-center font-bold text-white text-sm">
                {user?.name?.substring(0, 2).toUpperCase() || 'JD'}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-brand-green border-2 border-slate-950 rounded-full"></span>
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold truncate">{user?.name || 'John Doe'}</h4>
              <p className="text-[10px] text-slate-500 truncate">{user?.email || 'premium@wealthmap.com'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-red-950/20' : 'text-slate-600 hover:text-slate-900 hover:bg-red-50'
            }`}
          >
            <LogOut className="w-5 h-5 text-red-500" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header bar */}
        <header className={`flex items-center justify-between px-6 py-4 border-b ${
          theme === 'dark' ? 'bg-[#0d1220]/60 border-slate-800/80 backdrop-blur' : 'bg-white border-slate-200'
        }`}>
          {/* Mobile navigation logo */}
          <div className="flex items-center gap-3 md:hidden">
            <NavbarLogo active={false} theme={theme} onClick={() => navigate('/')} />
          </div>
          
          <h2 className="hidden md:block text-lg font-bold tracking-tight font-sans capitalize">
            {navItems.find(item => item.path === location.pathname)?.label || 'Financial Platform'}
          </h2>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-xl border transition-colors ${
                theme === 'dark' 
                  ? 'border-slate-800 hover:bg-slate-900 text-slate-300' 
                  : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>

            <button className={`relative p-2.5 rounded-xl border transition-all ${
              theme === 'dark' ? 'border-slate-800 hover:bg-slate-900 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}>
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-blue rounded-full"></span>
            </button>

            <div className="w-9 h-9 rounded-full bg-slate-800 md:hidden flex items-center justify-center text-xs font-bold text-white">
              {user?.name?.substring(0, 2).toUpperCase() || 'JD'}
            </div>
          </div>
        </header>

        {/* Mobile quick navigations sub-header */}
        <nav className="flex md:hidden border-b border-slate-800/10 p-2 overflow-x-auto gap-2 scrollbar-none shrink-0 bg-slate-900/10">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-brand-blue text-white'
                    : 'text-slate-400 hover:text-white bg-slate-900/10'
                }`}
              >
                {item.icon}
                {item.label.replace('AI ', '').replace('Financial ', '').replace('Settings', '').replace('Registry', '').trim()}
              </button>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-red-500 bg-red-950/10 shrink-0"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </nav>

        {/* Content body */}
        <main className="p-6 max-w-7xl mx-auto w-full space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
