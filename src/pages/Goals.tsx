import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Target, DollarSign, Calendar, FileText, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

interface GoalItem {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

interface GoalsProps {
  theme?: 'light' | 'dark';
}

export const Goals: React.FC<GoalsProps> = ({ theme = 'dark' }) => {
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  
  // Validation errors state
  const [errors, setErrors] = useState<{ title?: string; targetAmount?: string; currentAmount?: string; deadline?: string }>({});
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch initial goals on mount
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await api.get('/goals');
        setGoals(response.data || []);
      } catch (err) {
        console.warn('Backend server not active. Loading mock goal data...', err);
        // Fallback mockup
        setGoals([
          { id: '1', title: 'Emergency Fund', targetAmount: 10000, currentAmount: 6000, deadline: '2026-12-31' },
          { id: '2', title: 'Tesla Model Y Downpayment', targetAmount: 15000, currentAmount: 4500, deadline: '2027-06-30' },
          { id: '3', title: 'European Vacation', targetAmount: 5000, currentAmount: 5000, deadline: '2026-09-15' }
        ]);
      }
    };
    fetchGoals();
  }, []);

  // Form validator
  const validateForm = () => {
    const newErrors: { title?: string; targetAmount?: string; currentAmount?: string; deadline?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Goal title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    if (!targetAmount) {
      newErrors.targetAmount = 'Target amount is required';
    } else {
      const parsedTarget = parseFloat(targetAmount);
      if (isNaN(parsedTarget) || parsedTarget <= 0) {
        newErrors.targetAmount = 'Target amount must be a positive number';
      }
    }

    if (currentAmount !== '') {
      const parsedCurrent = parseFloat(currentAmount);
      if (isNaN(parsedCurrent) || parsedCurrent < 0) {
        newErrors.currentAmount = 'Current savings must be a non-negative number';
      } else if (targetAmount !== '') {
        const parsedTarget = parseFloat(targetAmount);
        if (parsedCurrent > parsedTarget) {
          newErrors.currentAmount = 'Current savings cannot exceed the target amount';
        }
      }
    }

    if (!deadline) {
      newErrors.deadline = 'Target date deadline is required';
    } else {
      const selectedDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.deadline = 'Deadline date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    const payload = {
      title: title.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: currentAmount === '' ? 0 : parseFloat(currentAmount),
      deadline
    };

    try {
      const response = await api.post('/goals', payload);
      // Append new item
      const newItem = response.data || { id: Date.now().toString(), ...payload };
      setGoals((prev) => [newItem, ...prev]);
      
      // Reset form fields
      setTitle('');
      setTargetAmount('');
      setCurrentAmount('');
      setDeadline('');
      setSuccessMsg('Goal created successfully!');
      
      // Clear success notification
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.warn('Backend server not active. Simulating mock goal registration...', err);
      // Mock append
      const newItem = { id: Date.now().toString(), ...payload };
      setGoals((prev) => [newItem, ...prev]);
      
      setTitle('');
      setTargetAmount('');
      setCurrentAmount('');
      setDeadline('');
      setSuccessMsg('Goal created successfully! (Demo Mock)');
      
      setTimeout(() => setSuccessMsg(''), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header metrics summary */}
      <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
        theme === 'dark' ? 'bg-[#0d1220] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <h3 className="font-bold text-base">Goal Tracker</h3>
          <p className="text-xs text-slate-500 mt-0.5">Visualize your compounding trajectories towards milestones.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-brand-blue/10 text-brand-blue">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500">Active Pipelines</span>
            <h4 className="text-lg font-extrabold">{goals.length} Target Goals</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Create Goal Form */}
        <div className="lg:col-span-5">
          <motion.div
            className={`p-6 rounded-2xl border ${
              theme === 'dark' ? 'bg-[#0d1220] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="font-bold text-base mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-blue" />
              Create Goal Target
            </h3>

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl border bg-brand-blue/10 border-brand-blue/35 text-brand-blue text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-500">
                  Goal Title
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. Downpayment, Retirement"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue/35 transition-all ${
                      errors.title
                        ? 'border-red-500 focus:ring-red-500/35'
                        : theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-brand-blue' : 'bg-slate-50 border-slate-200 focus:border-brand-blue'
                    }`}
                  />
                </div>
                {errors.title && (
                  <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-500">
                    Target ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="number"
                      placeholder="5000.00"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue/35 transition-all ${
                        errors.targetAmount
                          ? 'border-red-500 focus:ring-red-500/35'
                          : theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-brand-blue' : 'bg-slate-50 border-slate-200 focus:border-brand-blue'
                      }`}
                    />
                  </div>
                  {errors.targetAmount && (
                    <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.targetAmount}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-500">
                    Already Saved ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="number"
                      placeholder="0.00"
                      value={currentAmount}
                      onChange={(e) => setCurrentAmount(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue/35 transition-all ${
                        errors.currentAmount
                          ? 'border-red-500 focus:ring-red-500/35'
                          : theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-brand-blue' : 'bg-slate-50 border-slate-200 focus:border-brand-blue'
                      }`}
                    />
                  </div>
                  {errors.currentAmount && (
                    <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.currentAmount}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-500">
                  Target Deadline Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue/35 transition-all ${
                      errors.deadline
                        ? 'border-red-500 focus:ring-red-500/35'
                        : theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-brand-blue' : 'bg-slate-50 border-slate-200 focus:border-brand-blue'
                    }`}
                  />
                </div>
                {errors.deadline && (
                  <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.deadline}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-brand-blue hover:bg-blue-600 disabled:bg-slate-700 text-white font-bold rounded-xl transition-all duration-300 transform active:scale-95 shadow-md shadow-brand-blue/10"
              >
                {isSubmitting ? 'Creating...' : 'Launch Goal Target'}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Right Column: Goal lists with Progress Bars */}
        <div className="lg:col-span-7">
          <div className={`p-6 rounded-2xl border h-full flex flex-col justify-between ${
            theme === 'dark' ? 'bg-[#0d1220] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="space-y-6">
              <h3 className="font-bold text-base">Savings Roadmap</h3>
              
              <div className="space-y-6">
                {goals.length === 0 ? (
                  <p className="text-center text-xs text-slate-500 py-12">
                    No active financial goals established. Formulate your targets above!
                  </p>
                ) : (
                  goals.map((item) => {
                    const pct = Math.min(100, Math.round((item.currentAmount / item.targetAmount) * 100)) || 0;
                    const isCompleted = pct >= 100;
                    return (
                      <div 
                        key={item.id}
                        className={`p-4 rounded-xl border flex flex-col gap-3 transition-colors ${
                          theme === 'dark' ? 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-900/10' : 'bg-slate-50 border-slate-200 hover:bg-slate-100/50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-bold">{item.title}</h4>
                            <span className="text-[10px] text-slate-500 font-mono">Target: {item.deadline}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isCompleted 
                              ? 'bg-brand-green/10 text-brand-green' 
                              : theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {isCompleted ? 'Achieved! 🏆' : `${pct}% Saved`}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${isCompleted ? 'bg-brand-green' : 'bg-brand-blue'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>

                        <div className="flex justify-between text-[11px] font-mono font-semibold text-slate-500">
                          <span>Saved: ${item.currentAmount.toLocaleString()}</span>
                          <span>Target: ${item.targetAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            
            <p className="text-[10px] text-slate-500 mt-6 pt-4 border-t border-slate-800/10 leading-normal text-left">
              Goal calculators account for compound metrics. Track savings allocations to accelerate target dates automatically.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Goals;
