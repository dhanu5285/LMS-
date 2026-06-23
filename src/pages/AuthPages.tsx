import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WealthMapLogo } from '../components/WealthMapLogo';
import { Mail, Lock, User, ArrowLeft, ShieldAlert } from 'lucide-react';

interface AuthPagesProps {
  initialMode?: 'login' | 'register';
  onNavigate: (page: 'landing' | 'login' | 'register' | 'dashboard') => void;
  theme?: 'light' | 'dark';
}

export const AuthPages: React.FC<AuthPagesProps> = ({
  initialMode = 'login',
  onNavigate,
  theme = 'dark',
}) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful login/register by routing to Dashboard
    onNavigate('dashboard');
  };

  return (
    <div className="relative min-h-[calc(100vh-76px)] flex items-center justify-center p-4">
      {/* Background glow flares */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-brand-green/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Back button */}
      <button
        onClick={() => onNavigate('landing')}
        className={`absolute top-6 left-6 md:left-12 flex items-center gap-2 text-sm font-semibold transition-colors duration-200 ${
          theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      {/* Main card */}
      <motion.div
        className={`w-full max-w-md p-8 rounded-3xl border z-10 ${
          theme === 'dark'
            ? 'bg-slate-900/60 border-slate-800 shadow-2xl backdrop-blur-lg'
            : 'bg-white border-slate-100 shadow-xl'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Animated header section */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
          >
            <WealthMapLogo size={68} theme={theme} animateState="idle" />
          </motion.div>
          <h2 className={`text-2xl font-bold mt-4 font-sans ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className={`text-xs mt-1 text-center max-w-[280px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            {isLogin 
              ? 'Enter your credentials to access your financial roadmap.' 
              : 'Start mapping your financial goals in under two minutes.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                key="name-field"
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 text-sm font-sans rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue/35 transition-all ${
                      theme === 'dark'
                        ? 'bg-slate-950 border-slate-800 focus:border-brand-blue text-white'
                        : 'bg-slate-50 border-slate-200 focus:border-brand-blue text-slate-900'
                    }`}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 text-sm font-sans rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue/35 transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-950 border-slate-800 focus:border-brand-blue text-white'
                    : 'bg-slate-50 border-slate-200 focus:border-brand-blue text-slate-900'
                }`}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className={`block text-xs font-semibold uppercase tracking-wider ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Password
              </label>
              {isLogin && (
                <a href="#forgot" className="text-xs text-brand-blue hover:underline">
                  Forgot?
                </a>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 text-sm font-sans rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue/35 transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-950 border-slate-800 focus:border-brand-blue text-white'
                    : 'bg-slate-50 border-slate-200 focus:border-brand-blue text-slate-900'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 transform active:scale-95 shadow-md shadow-brand-blue/10"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Form Footer */}
        <div className="mt-6 pt-6 border-t border-slate-800/20 text-center">
          <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-brand-blue font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>

        {/* Demo Alert Badge */}
        <div className={`mt-6 p-3 rounded-xl border flex items-start gap-2.5 ${
          theme === 'dark'
            ? 'bg-slate-950/60 border-slate-800 text-slate-400'
            : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          <ShieldAlert className="w-4.5 h-4.5 text-brand-green flex-shrink-0 mt-0.5" />
          <p className="text-[10px] leading-normal text-left">
            <strong>Demo Mode:</strong> Any input is accepted. Submitting the form will log you in and take you directly to the Premium Dashboard.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
