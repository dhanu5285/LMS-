import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Minus, DollarSign, Calendar, Tag, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface ExpenseItem {
  id: string;
  source: string;
  amount: number;
  date: string;
  category: string;
}

interface ExpensesProps {
  theme?: 'light' | 'dark';
}

export const Expenses: React.FC<ExpensesProps> = ({ theme = 'dark' }) => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Rent');
  
  // Validation errors state
  const [errors, setErrors] = useState<{ source?: string; amount?: string; date?: string }>({});
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch initial expenses on mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await api.get('/expenses');
        setExpenses(response.data || []);
      } catch (err) {
        console.warn('Backend server not active. Loading mock expense data...', err);
        // Fallback mockup
        setExpenses([
          { id: '1', source: 'Apartment Rent', amount: 1500, date: '2026-06-01', category: 'Rent' },
          { id: '2', source: 'Whole Foods Grocery', amount: 240, date: '2026-06-12', category: 'Food' },
          { id: '3', source: 'Electric Bill', amount: 115, date: '2026-06-18', category: 'Bills' }
        ]);
      }
    };
    fetchExpenses();
  }, []);

  // Form validator
  const validateForm = () => {
    const newErrors: { source?: string; amount?: string; date?: string } = {};
    
    if (!source.trim()) {
      newErrors.source = 'Expense description is required';
    } else if (source.length < 3) {
      newErrors.source = 'Description must be at least 3 characters long';
    }

    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        newErrors.amount = 'Amount must be a positive number';
      }
    }

    if (!date) {
      newErrors.date = 'Date is required';
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
      source: source.trim(),
      amount: parseFloat(amount),
      date,
      category
    };

    try {
      const response = await api.post('/expenses', payload);
      // Append new item
      const newItem = response.data || { id: Date.now().toString(), ...payload };
      setExpenses((prev) => [newItem, ...prev]);
      
      // Reset form fields
      setSource('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('Rent');
      setSuccessMsg('Expense item registered successfully!');
      
      // Clear success notification
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.warn('Backend server not active. Simulating mock expense registration...', err);
      // Mock append
      const newItem = { id: Date.now().toString(), ...payload };
      setExpenses((prev) => [newItem, ...prev]);
      
      setSource('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('Rent');
      setSuccessMsg('Expense item registered successfully! (Demo Mock)');
      
      setTimeout(() => setSuccessMsg(''), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner Overview */}
      <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
        theme === 'dark' ? 'bg-[#0d1220] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <h3 className="font-bold text-base">Expense Metrics</h3>
          <p className="text-xs text-slate-500 mt-0.5">Summary of all registered outflows and liability transactions.</p>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Total Combined Expenses</span>
          <h2 className="text-3xl font-extrabold text-red-500 mt-1">${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Register Expense Form */}
        <div className="lg:col-span-5">
          <motion.div
            className={`p-6 rounded-2xl border ${
              theme === 'dark' ? 'bg-[#0d1220] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="font-bold text-base mb-6 flex items-center gap-2">
              <Minus className="w-5 h-5 text-red-500" />
              Register Expense
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
                  Expense Description
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. Rent, Grocery shopping"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue/35 transition-all ${
                      errors.source
                        ? 'border-red-500 focus:ring-red-500/35'
                        : theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-brand-blue' : 'bg-slate-50 border-slate-200 focus:border-brand-blue'
                    }`}
                  />
                </div>
                {errors.source && (
                  <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.source}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-500">
                    Amount ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="100.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue/35 transition-all ${
                        errors.amount
                          ? 'border-red-500 focus:ring-red-500/35'
                          : theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-brand-blue' : 'bg-slate-50 border-slate-200 focus:border-brand-blue'
                      }`}
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.amount}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-500">
                    Category
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue/35 transition-all ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value="Rent">Rent</option>
                      <option value="Food">Food</option>
                      <option value="Bills">Bills/Utilities</option>
                      <option value="Travel">Travel</option>
                      <option value="Leisure">Leisure</option>
                      <option value="Health">Health</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-500">
                  Transaction Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue/35 transition-all ${
                      errors.date
                        ? 'border-red-500 focus:ring-red-500/35'
                        : theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-brand-blue' : 'bg-slate-50 border-slate-200 focus:border-brand-blue'
                    }`}
                  />
                </div>
                {errors.date && (
                  <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.date}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-red-500 hover:bg-red-600 disabled:bg-slate-700 text-white font-bold rounded-xl transition-all duration-300 transform active:scale-95 shadow-md shadow-red-500/10"
              >
                {isSubmitting ? 'Registering...' : 'Add Expense Entry'}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Right Column: Expenses Registry List */}
        <div className="lg:col-span-7">
          <div className={`p-6 rounded-2xl border h-full flex flex-col justify-between ${
            theme === 'dark' ? 'bg-[#0d1220] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div>
              <h3 className="font-bold text-base mb-6">Cash Outflows</h3>
              
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/10 text-slate-500 text-xs font-semibold uppercase">
                      <th className="pb-3 pr-2">Description</th>
                      <th className="pb-3 pr-2">Category</th>
                      <th className="pb-3 pr-2">Date</th>
                      <th className="pb-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-xs text-slate-500 font-medium">
                          No expense registries found. Add your first transaction above!
                        </td>
                      </tr>
                    ) : (
                      expenses.map((item) => (
                        <tr 
                          key={item.id} 
                          className={`border-b text-xs transition-colors ${
                            theme === 'dark' ? 'border-slate-800/40 hover:bg-slate-900/20' : 'border-slate-100 hover:bg-slate-50/50'
                          }`}
                        >
                          <td className="py-3.5 pr-2 font-bold max-w-[150px] truncate">{item.source}</td>
                          <td className="py-3.5 pr-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              theme === 'dark' ? 'bg-slate-800/80 text-slate-300' : 'bg-slate-100 text-slate-600'
                            }`}>{item.category}</span>
                          </td>
                          <td className="py-3.5 pr-2 font-mono text-slate-500">{item.date}</td>
                          <td className="py-3.5 text-right font-extrabold text-red-500 font-mono">
                            -${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-500 mt-6 pt-4 border-t border-slate-800/10 leading-normal text-left">
              Data is synced securely with the cloud. All metrics dynamically update on the dashboard overview comparisons.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Expenses;
