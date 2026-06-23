import { useState, useEffect } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { NavbarLogo } from './components/NavbarLogo';
import { LandingPage } from './pages/LandingPage';
import { AuthPages } from './pages/AuthPages';
import { Dashboard } from './pages/Dashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, ArrowUpRight } from 'lucide-react';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'register' | 'dashboard'>('landing');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Sync theme with HTML document class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#0b0f19';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f8fafc';
    }
  }, [theme]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const navigateTo = (page: 'landing' | 'login' | 'register' | 'dashboard') => {
    setCurrentPage(page);
  };

  const isDashboard = currentPage === 'dashboard';

  return (
    <>
      {/* 1. Fullscreen entry loading animation */}
      <LoadingScreen 
        theme={theme} 
        duration={3500} 
        onComplete={handleLoadingComplete} 
      />

      {!isLoading && (
        <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
          theme === 'dark' ? 'bg-[#0b0f19] text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}>
          
          {/* 2. Top Navigation Bar (Hidden when inside Dashboard) */}
          {!isDashboard && (
            <motion.nav 
              className={`sticky top-0 z-40 border-b backdrop-blur-md px-6 py-4 flex items-center justify-between transition-colors ${
                theme === 'dark' ? 'bg-[#0b0f19]/80 border-slate-800/80' : 'bg-white/80 border-slate-200'
              }`}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                {/* Brand Logo Wrapper */}
                <NavbarLogo 
                  active={currentPage === 'landing'} 
                  theme={theme} 
                  onClick={() => navigateTo('landing')} 
                />

                {/* Desktop Menu links */}
                <div className="hidden md:flex items-center gap-8">
                  {['Features', 'Security', 'Pricing', 'Company'].map((nav, idx) => (
                    <a 
                      key={idx}
                      href={`#${nav.toLowerCase()}`}
                      className={`text-sm font-semibold transition-colors duration-200 ${
                        theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {nav}
                    </a>
                  ))}
                </div>

                {/* Right side controls */}
                <div className="flex items-center gap-4">
                  {/* Theme Switcher Toggle */}
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className={`p-2 rounded-xl border transition-colors ${
                      theme === 'dark' 
                        ? 'border-slate-800 hover:bg-slate-900 text-slate-300' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                    aria-label="Toggle Theme"
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => navigateTo('login')}
                    className={`hidden sm:block text-sm font-semibold transition-colors ${
                      theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    Sign In
                  </button>

                  <button
                    onClick={() => navigateTo('register')}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-brand-blue hover:bg-blue-600 text-white rounded-xl shadow shadow-brand-blue/20 hover:shadow-brand-blue/35 transition-all"
                  >
                    Join WealthMap
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.nav>
          )}

          {/* 3. Screen Router viewport */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              {currentPage === 'landing' && (
                <motion.div
                  key="landing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <LandingPage onNavigate={navigateTo} theme={theme} />
                </motion.div>
              )}

              {(currentPage === 'login' || currentPage === 'register') && (
                <motion.div
                  key="auth"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AuthPages initialMode={currentPage} onNavigate={navigateTo} theme={theme} />
                </motion.div>
              )}

              {currentPage === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Dashboard onNavigate={navigateTo} theme={theme} setTheme={setTheme} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* 4. Footer section (Hidden when inside Dashboard) */}
          {!isDashboard && (
            <footer className={`py-8 px-6 text-center border-t text-xs ${
              theme === 'dark' ? 'bg-[#0d1220] border-slate-900 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                <p>© {new Date().getFullYear()} WealthMap Inc. All rights reserved.</p>
                <div className="flex gap-6">
                  <a href="#privacy" className="hover:underline">Privacy Policy</a>
                  <a href="#terms" className="hover:underline">Terms of Service</a>
                  <a href="#security" className="hover:underline">Security Architecture</a>
                </div>
              </div>
            </footer>
          )}
        </div>
      )}
    </>
  );
}

export default App;
