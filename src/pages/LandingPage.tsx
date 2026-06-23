import React from 'react';
import { motion } from 'framer-motion';
import { WealthMapLogo } from '../components/WealthMapLogo';
import { ArrowRight, Shield, Zap, TrendingUp, Compass } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: 'landing' | 'login' | 'register' | 'dashboard') => void;
  theme?: 'light' | 'dark';
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  theme = 'dark',
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  const featureList = [
    {
      icon: <Compass className="w-6 h-6 text-brand-blue" />,
      title: "Precision Mapping",
      desc: "Chart a personalized visual trajectory to reach your specific long-term net worth milestones."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-brand-green" />,
      title: "AI Growth Engine",
      desc: "Smart algorithmic rebalancing suggestions optimized to yield optimal compounding benefits."
    },
    {
      icon: <Shield className="w-6 h-6 text-brand-blue" />,
      title: "Fintech Security",
      desc: "Bank-grade multi-layer encryption ensures your financial roadmap is fully secure."
    },
    {
      icon: <Zap className="w-6 h-6 text-brand-green" />,
      title: "Real-time Sync",
      desc: "Synchronize liquid assets, properties, and debts into a single, cohesive wealth dashboard."
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-76px)] flex flex-col justify-between overflow-hidden px-4 md:px-8">
      {/* Ambient backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-brand-green/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <motion.div 
        className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12 md:py-20 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Column: Typography & Actions */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
          <motion.div 
            variants={itemVariants}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border ${
              theme === 'dark' 
                ? 'bg-brand-blue/10 border-brand-blue/20 text-blue-400' 
                : 'bg-blue-50 border-blue-100 text-brand-blue'
            }`}
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
            </span>
            Introducing WealthMap AI
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className={`text-4xl sm:text-5xl md:text-6xl font-extrabold font-sans tracking-tight leading-[1.1] ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            Navigate Your Journey to <span className="text-gradient">Financial Freedom</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className={`text-lg max-w-xl ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            The premium intelligence platform that maps your net worth, simulates growth paths, and leverages machine learning to direct you towards financial independence.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button
              onClick={() => onNavigate('register')}
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/35 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-8 py-4 font-semibold rounded-2xl border transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 ${
                theme === 'dark'
                  ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Explore Live Demo
            </button>
          </motion.div>
        </div>

        {/* Right Column: Visual Interactive Logo Showcase */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-5 flex flex-col items-center justify-center relative"
        >
          {/* Visual card backing the logo */}
          <div className={`relative p-10 md:p-14 rounded-[32px] border flex flex-col items-center ${
            theme === 'dark'
              ? 'bg-slate-900/40 border-slate-800/80 shadow-2xl backdrop-blur-md'
              : 'bg-white border-slate-100 shadow-xl'
          }`}>
            {/* Glowing accents */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

            {/* Interactive Logo */}
            <WealthMapLogo
              size={180}
              animateState="idle"
              theme={theme}
              className="z-10 transition-transform duration-300"
            />
            
            <div className="mt-8 text-center pointer-events-none z-10">
              <span className={`text-xs font-semibold tracking-widest uppercase ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>Interactive Branding Model</span>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                Hover to glow • Click to animate line growth
              </p>
            </div>
          </div>

          {/* Decorative Float Cards */}
          <motion.div
            className={`absolute -top-6 -right-6 p-4 rounded-2xl border flex items-center gap-3 shadow-lg backdrop-blur-md ${
              theme === 'dark' ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'
            }`}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            <div className="p-2 rounded-xl bg-brand-green/10 text-brand-green">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-slate-500">Compound Value</p>
              <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>+28.4% YoY</p>
            </div>
          </motion.div>

          <motion.div
            className={`absolute -bottom-6 -left-6 p-4 rounded-2xl border flex items-center gap-3 shadow-lg backdrop-blur-md ${
              theme === 'dark' ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'
            }`}
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
          >
            <div className="p-2 rounded-xl bg-brand-blue/10 text-brand-blue">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-slate-500">Destination</p>
              <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>$1.5M Plan</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Feature Grid */}
      <div className={`w-full py-16 border-t ${
        theme === 'dark' ? 'border-slate-900 bg-[#0d1220]/40' : 'border-slate-100 bg-slate-50/50'
      }`}>
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureList.map((f, i) => (
            <motion.div
              key={i}
              className={`p-6 rounded-2xl border text-left flex flex-col justify-between h-48 transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700/60 hover:bg-slate-900/60'
                  : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/20 shadow-sm'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
            >
              <div className={`p-3 rounded-xl w-fit ${
                theme === 'dark' ? 'bg-slate-800/80' : 'bg-slate-100'
              }`}>
                {f.icon}
              </div>
              <div>
                <h3 className={`font-bold font-sans text-base ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  {f.title}
                </h3>
                <p className={`text-xs mt-1 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
