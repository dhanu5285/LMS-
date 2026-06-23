import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Award, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  memberSince: string;
  tier: string;
  authMethod: string;
}

interface ProfileProps {
  theme?: 'light' | 'dark';
}

export const Profile: React.FC<ProfileProps> = ({ theme = 'dark' }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({
    name: user?.name || 'John Doe',
    email: user?.email || 'premium@wealthmap.com',
    memberSince: '2026-06-21',
    tier: 'Premium Elite',
    authMethod: 'Password Credential'
  });

  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [successMsg, setSuccessMsg] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch initial profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        if (response.data) {
          setProfile(response.data);
          setEditName(response.data.name);
          setEditEmail(response.data.email);
        }
      } catch (err) {
        console.warn('Backend server not active. Using session auth state for profile...', err);
        // Defaults loaded from state
      }
    };
    fetchProfile();
  }, [user]);

  // Form validator
  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};

    if (!editName.trim()) {
      newErrors.name = 'Name is required';
    } else if (editName.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!editEmail.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submit (updates profile details mock endpoint)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');

    if (!validateForm()) return;

    setIsUpdating(true);
    try {
      // Dummy endpoint trigger
      await api.post('/profile', { name: editName, email: editEmail });
      setProfile((prev) => ({ ...prev, name: editName, email: editEmail }));
      setSuccessMsg('Account details saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.warn('Backend server not active. Simulating mock update...', err);
      setProfile((prev) => ({ ...prev, name: editName, email: editEmail }));
      setSuccessMsg('Account details saved successfully! (Demo Mock)');
      setTimeout(() => setSuccessMsg(''), 4000);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Left Column: Account details card */}
      <div className="lg:col-span-4 space-y-6">
        <motion.div
          className={`p-6 rounded-2xl border text-center flex flex-col items-center ${
            theme === 'dark' ? 'bg-[#0d1220] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Avatar frame */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-green p-0.5 shadow-lg shadow-brand-blue/15">
            <div className={`w-full h-full rounded-[14px] flex items-center justify-center font-bold text-2xl text-white ${
              theme === 'dark' ? 'bg-slate-950' : 'bg-slate-100 text-slate-800'
            }`}>
              {profile.name.substring(0, 2).toUpperCase()}
            </div>
          </div>

          <h3 className="text-lg font-bold mt-4 font-sans">{profile.name}</h3>
          <p className="text-xs text-slate-500 font-medium">{profile.email}</p>

          <div className={`mt-6 py-1.5 px-3 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${
            theme === 'dark' 
              ? 'bg-brand-blue/10 border-brand-blue/20 text-blue-400' 
              : 'bg-blue-50 border-blue-100 text-brand-blue'
          }`}>
            <Award className="w-3.5 h-3.5" />
            {profile.tier}
          </div>

          {/* Stats blocks */}
          <div className="w-full grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-800/10 text-left">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block">System Authority</span>
              <span className="text-xs font-bold flex items-center gap-1 mt-1">
                <Shield className="w-3.5 h-3.5 text-brand-green" />
                Verified
              </span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block">Registered Date</span>
              <span className="text-xs font-bold flex items-center gap-1 mt-1">
                <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                {profile.memberSince}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Settings and details form */}
      <div className="lg:col-span-8">
        <motion.div
          className={`p-6 rounded-2xl border ${
            theme === 'dark' ? 'bg-[#0d1220] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-bold text-base mb-6">Security & Account Details</h3>

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl border bg-brand-green/10 border-brand-green/30 text-brand-green text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4.5 h-4.5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-500">
                Display Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue/35 transition-all ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-500/35'
                      : theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-brand-blue' : 'bg-slate-50 border-slate-200 focus:border-brand-blue'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-500">
                Primary Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue/35 transition-all ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500/35'
                      : theme === 'dark' ? 'bg-slate-950 border-slate-800 focus:border-brand-blue' : 'bg-slate-50 border-slate-200 focus:border-brand-blue'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-slate-500">
                Credential Authentication Method
              </label>
              <input
                type="text"
                disabled
                value={profile.authMethod}
                className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed`}
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-3 bg-brand-blue hover:bg-blue-600 disabled:bg-slate-700 text-white font-bold rounded-xl transition-all duration-300 transform active:scale-95 shadow-md shadow-brand-blue/10"
            >
              {isUpdating ? 'Saving...' : 'Save Account Settings'}
            </button>
          </form>
        </motion.div>
      </div>

    </div>
  );
};

export default Profile;
