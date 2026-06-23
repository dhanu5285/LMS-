import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavbarLogo } from '../components/NavbarLogo';
import { WealthMapLogo } from '../components/WealthMapLogo';
import { 
  Compass, Wallet, PieChart, 
  Settings, LogOut, Bell, 
  MapPin, Award, CheckCircle2
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: 'landing' | 'login' | 'register' | 'dashboard') => void;
  theme?: 'light' | 'dark';
  setTheme?: (theme: 'light' | 'dark') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  theme = 'dark',
  setTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'allocations' | 'settings'>('overview');
  const [simulationStep, setSimulationStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // Triggering the chart simulation route
  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(0);
    const interval = setInterval(() => {
      setSimulationStep((prev) => {
        if (prev >= 4) {
          clearInterval(interval);
          setIsSimulating(false);
          return 4;
        }
        return prev + 1;
      });
    }, 800);
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: <Wallet className="w-5 h-5" /> },
    { id: 'map', label: 'Financial Map Plan', icon: <Compass className="w-5 h-5" /> },
    { id: 'allocations', label: 'AI Asset Allocator', icon: <PieChart className="w-5 h-5" /> },
    { id: 'settings', label: 'System Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const statCards = [
    { title: 'Total Net Worth', value: '$642,850.00', change: '+12.4%', up: true, subtitle: 'Updated 2 mins ago' },
    { title: 'AI Guided Yield', value: '14.2% APY', change: '+3.1%', up: true, subtitle: 'Outperforming SPY' },
    { title: 'Goal Projection', value: '$1,500,000', change: '82% Pace', up: true, subtitle: 'Target Date: June 2035' }
  ];

  return (
    <div className={`flex min-h-screen font-sans ${theme === 'dark' ? 'bg-[#0b0f19] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* 1. Dashboard Sidebar containing the logo */}
      <aside className={`hidden md:flex flex-col justify-between w-64 p-6 border-r shrink-0 ${
        theme === 'dark' ? 'bg-[#0d1220] border-slate-800/80' : 'bg-white border-slate-200'
      }`}>
        <div className="space-y-8">
          {/* Logo container */}
          <div className="flex justify-start">
            <NavbarLogo active={false} theme={theme} onClick={() => onNavigate('landing')} />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'
                    : theme === 'dark'
                      ? 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4 pt-6 border-t border-slate-800/10">
          <div className={`p-4 rounded-xl border flex items-center gap-3 ${
            theme === 'dark' ? 'bg-slate-950/40 border-slate-800/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-blue to-brand-green flex items-center justify-center font-bold text-white text-sm">
                JD
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-brand-green border-2 border-slate-950 rounded-full"></span>
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold truncate">John Doe</h4>
              <p className="text-[10px] text-slate-500 truncate">Premium Member</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('landing')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-red-950/20' : 'text-slate-600 hover:text-slate-900 hover:bg-red-50'
            }`}
          >
            <LogOut className="w-5 h-5 text-red-500" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header bar */}
        <header className={`flex items-center justify-between px-6 py-4 border-b ${
          theme === 'dark' ? 'bg-[#0d1220]/60 border-slate-800/80 backdrop-blur' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3 md:hidden">
            {/* Mobile Logo integration */}
            <NavbarLogo active={false} theme={theme} onClick={() => onNavigate('landing')} />
          </div>
          
          <h2 className="hidden md:block text-lg font-bold tracking-tight font-sans capitalize">
            {activeTab === 'overview' ? 'Financial Hub' : activeTab === 'map' ? 'Asset Navigator' : activeTab === 'allocations' ? 'AI Optimization' : 'Settings'}
          </h2>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            {setTheme && (
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
            )}

            <button className={`relative p-2.5 rounded-xl border transition-all ${
              theme === 'dark' ? 'border-slate-800 hover:bg-slate-900 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}>
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-blue rounded-full"></span>
            </button>

            <div className="w-9 h-9 rounded-full bg-slate-800 md:hidden flex items-center justify-center text-xs font-bold text-white">
              JD
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="p-6 max-w-7xl mx-auto w-full space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Stat Cards Grid */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((c, i) => (
                  <div
                    key={i}
                    className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-md ${
                      theme === 'dark' ? 'bg-[#0d1220] border-slate-800/80 hover:border-slate-800' : 'bg-white border-slate-200 hover:border-slate-300/60'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">{c.title}</span>
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                        c.up ? 'bg-brand-green/10 text-brand-green' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {c.change}
                      </span>
                    </div>
                    <h3 className="text-2xl font-extrabold mt-2 font-sans">{c.value}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">{c.subtitle}</p>
                  </div>
                ))}
              </section>

              {/* Simulation Interactive Card */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Simulated Wealth Map Path Card */}
                <div className={`lg:col-span-8 p-6 rounded-2xl border flex flex-col justify-between ${
                  theme === 'dark' ? 'bg-[#0d1220] border-slate-800/80' : 'bg-white border-slate-200'
                }`}>
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-base font-sans">Active Financial Map Trajectory</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Algorithm mapping simulations for retirement milestone endpoints.</p>
                      </div>
                      <button
                        onClick={startSimulation}
                        disabled={isSimulating}
                        className="px-4 py-2 text-xs font-semibold bg-brand-blue hover:bg-blue-600 text-white rounded-xl shadow transition-colors duration-200"
                      >
                        {isSimulating ? 'Simulating...' : 'Run Simulation'}
                      </button>
                    </div>

                    {/* Trajectory Simulation Sandbox */}
                    <div className={`relative h-64 mt-6 rounded-xl border overflow-hidden flex items-center justify-center ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-900' : 'bg-slate-50 border-slate-200'
                    }`}>
                      {/* Grid background */}
                      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                        {Array.from({ length: 36 }).map((_, i) => (
                          <div key={i} className="border border-slate-400" />
                        ))}
                      </div>

                      {/* Main Simulation SVG Canvas */}
                      <svg className="w-full h-full p-6 overflow-visible" viewBox="0 0 500 200">
                        {/* Simulation Pathway line */}
                        <motion.path
                          d="M 20 160 Q 120 150 200 110 T 380 60 T 450 20"
                          fill="none"
                          stroke={theme === 'dark' ? 'rgba(37, 99, 235, 0.15)' : 'rgba(37, 99, 235, 0.08)'}
                          strokeWidth="2.5"
                          strokeDasharray="4 4"
                        />
                        
                        {/* Active Progress Trajectory Line */}
                        <AnimatePresence>
                          <motion.path
                            d="M 20 160 Q 120 150 200 110 T 380 60 T 450 20"
                            fill="none"
                            stroke="url(#simPathGrad)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: simulationStep === 0 ? 0.2 : simulationStep === 1 ? 0.45 : simulationStep === 2 ? 0.7 : simulationStep === 3 ? 0.95 : 1 }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                          />
                        </AnimatePresence>

                        <defs>
                          <linearGradient id="simPathGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#2563EB" />
                            <stop offset="50%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#10B981" />
                          </linearGradient>
                        </defs>

                        {/* Milestones Map Pins */}
                        {[
                          { cx: 20, cy: 160, label: 'Base', val: '$0k', active: simulationStep >= 0 },
                          { cx: 130, cy: 145, label: 'Emergency', val: '$20k', active: simulationStep >= 1 },
                          { cx: 242, cy: 96, label: 'Growth Plan', val: '$250k', active: simulationStep >= 2 },
                          { cx: 380, cy: 60, label: 'Coast FIRE', val: '$800k', active: simulationStep >= 3 },
                          { cx: 450, cy: 20, label: 'Financial Freedom', val: '$1.5M', active: simulationStep >= 4 }
                        ].map((node, i) => (
                          <g key={i} className="cursor-pointer">
                            <motion.circle
                              cx={node.cx}
                              cy={node.cy}
                              r={node.active ? 7 : 5}
                              fill={node.active ? '#10B981' : theme === 'dark' ? '#334155' : '#CBD5E1'}
                              stroke={theme === 'dark' ? '#0f172a' : '#ffffff'}
                              strokeWidth="2"
                              animate={{ scale: node.active ? [1, 1.2, 1] : 1 }}
                              transition={{ repeat: node.active ? 1 : 0, duration: 0.4 }}
                            />
                            <text
                              x={node.cx}
                              y={node.cy - 12}
                              textAnchor="middle"
                              className={`text-[8px] font-bold ${node.active ? 'fill-slate-400' : 'fill-slate-500'}`}
                            >
                              {node.label} ({node.val})
                            </text>
                          </g>
                        ))}
                      </svg>

                      {/* Map Indicator overlay */}
                      <div className="absolute top-4 left-4 flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-brand-green font-mono">
                        <MapPin className="w-3.5 h-3.5" />
                        MAP ENGAGED: TARGET RETIREMENT RETRIEVED
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 pt-4 border-t border-slate-800/10">
                    <p className="text-xs text-slate-500">WealthMap AI is routing portfolio balances across tax-deferred buckets.</p>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse mt-1"></div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-brand-green">Auto-allocator active</span>
                    </div>
                  </div>
                </div>

                {/* Growth Checklist Card */}
                <div className={`lg:col-span-4 p-6 rounded-2xl border flex flex-col justify-between ${
                  theme === 'dark' ? 'bg-[#0d1220] border-slate-800/80' : 'bg-white border-slate-200'
                }`}>
                  <div>
                    <h3 className="font-bold text-base font-sans">Mapping Checklist</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Tasks completed on your roadmap.</p>

                    <ul className="space-y-4 mt-6">
                      {[
                        { title: 'Connect Checking Accounts', done: true },
                        { title: 'Define Retirement Goals', done: true },
                        { title: 'Audit Mutual Fund Fees', done: true },
                        { title: 'Enable Auto AI Optimizations', done: false },
                        { title: 'Create Real-estate Vault', done: false }
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${
                            item.done ? 'text-brand-green' : 'text-slate-600'
                          }`} />
                          <span className={`text-xs font-medium ${
                            item.done ? 'line-through text-slate-500' : theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                          }`}>{item.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`mt-6 p-4 rounded-xl border text-left ${
                    theme === 'dark' ? 'bg-slate-950/60 border-slate-800/60' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2 text-brand-green">
                      <Award className="w-4 h-4" />
                      <span className="text-xs font-bold">Progress Boosted</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                      You are in the top 8% of wealth savers in your age brackets. Keep compiling!
                    </p>
                  </div>
                </div>
              </section>

              {/* Dynamic asset sectors */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AI allocation recommendation */}
                <div className={`p-6 rounded-2xl border ${
                  theme === 'dark' ? 'bg-[#0d1220] border-slate-800/80' : 'bg-white border-slate-200'
                }`}>
                  <h3 className="font-bold text-base font-sans">Optimized Allocations</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Algorithmic risk weights computed daily.</p>
                  
                  <div className="space-y-3 mt-6">
                    {[
                      { name: 'Equity ETFs', pct: 60, col: 'bg-brand-blue' },
                      { name: 'Real Estate Vaults', pct: 20, col: 'bg-indigo-500' },
                      { name: 'Tokenized Treasury Notes', pct: 15, col: 'bg-brand-green' },
                      { name: 'Alternative Macro Pools', pct: 5, col: 'bg-amber-500' }
                    ].map((asset, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span>{asset.name}</span>
                          <span>{asset.pct}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${asset.col}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${asset.pct}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WealthMap Logo detailed showcase card */}
                <div className={`p-6 rounded-2xl border flex flex-col justify-between ${
                  theme === 'dark' ? 'bg-[#0d1220] border-slate-800/80' : 'bg-white border-slate-200'
                }`}>
                  <div>
                    <h3 className="font-bold text-base font-sans">Branding Showcase</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Custom vector architecture inside the logo components.</p>
                    
                    <div className="flex items-center gap-6 mt-6">
                      <div className={`p-4 rounded-2xl border ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-900' : 'bg-slate-100 border-slate-200'
                      }`}>
                        <WealthMapLogo size={80} theme={theme} animateState="idle" />
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold">Geometric Visual Anatomy:</h4>
                        <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4 text-left">
                          <li><strong>Map Pin Silhouette</strong> represents structural guidance.</li>
                          <li><strong>AI Circuit Nodes</strong> illustrate intelligent networks.</li>
                          <li><strong>Green Line Chart</strong> signals financial growth pathways.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => onNavigate('landing')}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold hover:bg-slate-800/20 transition-all ${
                        theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      View Landing Page
                    </button>
                    <button
                      onClick={() => onNavigate('login')}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold hover:bg-slate-800/20 transition-all ${
                        theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      View Login/Register
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === 'map' && (
            <div className={`p-10 rounded-2xl border text-center ${
              theme === 'dark' ? 'bg-[#0d1220] border-slate-800/80' : 'bg-white border-slate-200'
            }`}>
              <Compass className="w-12 h-12 text-brand-blue mx-auto mb-4" />
              <h3 className="text-lg font-bold">Interactive Pathway Modeler</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                Model specific asset targets by layering inflation overlays, real estate leverage scenarios, and tax wrappers.
              </p>
              <button 
                onClick={startSimulation}
                className="mt-6 px-6 py-3 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow"
              >
                Launch Model Workspace
              </button>
            </div>
          )}

          {activeTab === 'allocations' && (
            <div className={`p-10 rounded-2xl border text-center ${
              theme === 'dark' ? 'bg-[#0d1220] border-slate-800/80' : 'bg-white border-slate-200'
            }`}>
              <PieChart className="w-12 h-12 text-brand-green mx-auto mb-4" />
              <h3 className="text-lg font-bold">AI Allocation Rebalancer</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                Scan transaction history for hidden mutual fund expense ratios and optimize capital splits instantly.
              </p>
              <button className="mt-6 px-6 py-3 bg-brand-green hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow">
                Optimize Portfolio splits
              </button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className={`p-8 rounded-2xl border ${
              theme === 'dark' ? 'bg-[#0d1220] border-slate-800/80' : 'bg-white border-slate-200'
            }`}>
              <h3 className="text-lg font-bold mb-6">System Configurations</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-800/10">
                  <div>
                    <h4 className="text-sm font-bold">Application Theme</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Toggle between dark interface modes and light paper styling.</p>
                  </div>
                  {setTheme && (
                    <button
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl border ${
                        theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      Theme: {theme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
                    </button>
                  )}
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-slate-800/10">
                  <div>
                    <h4 className="text-sm font-bold">Realtime Notifications</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Receive browser alerts during AI portfolio rebalance suggestions.</p>
                  </div>
                  <div className="w-11 h-6 bg-brand-green rounded-full relative p-0.5 cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 shadow"></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-bold text-red-500">Reset Account Vault</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Irreversibly wipe all connected banks, assets, and mapping pipelines.</p>
                  </div>
                  <button className="px-4 py-2 border border-red-500/30 hover:bg-red-500/10 text-red-500 rounded-xl text-xs font-bold transition-all">
                    Reset Vault
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
