import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WealthMapLogo } from './WealthMapLogo';

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number; // in milliseconds
  theme?: 'light' | 'dark';
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  duration = 3000,
  theme = 'dark',
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [dots, setDots] = useState('');

  // Animate trailing dots for the loading text
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Handle completion timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        // Allow exit animation to complete before calling onComplete
        setTimeout(onComplete, 800);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center select-none ${
            theme === 'dark' ? 'bg-[#0b0f19]' : 'bg-slate-50'
          }`}
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.05,
            filter: 'blur(8px)',
            transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] } 
          }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-gradient-radial from-brand-blue/10 via-transparent to-transparent pointer-events-none" />

          {/* Glowing Ring around the Logo */}
          <div className="relative flex items-center justify-center">
            {/* Outer spinning dash ring */}
            <motion.div
              className="absolute w-[200px] h-[200px] border border-dashed rounded-full border-brand-blue/20"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
            />
            {/* Inner pulsing solid ring */}
            <motion.div
              className="absolute w-[160px] h-[160px] border border-brand-green/30 rounded-full"
              animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            />
            
            {/* Centered Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                filter: 'drop-shadow(0px 0px 25px rgba(37, 99, 235, 0.4))',
              }}
              transition={{ 
                duration: 1.2, 
                ease: 'easeOut',
                filter: { duration: 2, repeat: Infinity, repeatType: 'reverse' }
              }}
            >
              <WealthMapLogo
                size={110}
                animateState="loading"
                theme={theme}
              />
            </motion.div>
          </div>

          {/* Loading Text */}
          <div className="mt-12 text-center z-10">
            <motion.h2
              className={`text-lg font-semibold tracking-widest uppercase font-sans ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Wealth<span className="text-brand-green">Map</span>
            </motion.h2>
            
            <motion.p
              className={`mt-3 text-sm font-medium transition-all duration-300 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.6, 1, 0.6],
                textShadow: theme === 'dark' 
                  ? '0 0 8px rgba(96, 165, 250, 0.4)' 
                  : '0 0 8px rgba(37, 99, 235, 0.2)' 
              }}
              transition={{ 
                opacity: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
                delay: 0.8 
              }}
              style={{ width: '280px' }}
            >
              Mapping Your Financial Future{dots}
            </motion.p>
          </div>
          
          {/* Bottom Progress Bar */}
          <div className="absolute bottom-16 w-48 h-[2px] bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-blue to-brand-green"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: duration / 1000, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
