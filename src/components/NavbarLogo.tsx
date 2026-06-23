import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WealthMapLogo } from './WealthMapLogo';

interface NavbarLogoProps {
  active?: boolean;
  theme?: 'light' | 'dark';
  onClick?: () => void;
}

export const NavbarLogo: React.FC<NavbarLogoProps> = ({
  active = false,
  theme = 'dark',
  onClick,
}) => {
  const [logoState, setLogoState] = useState<'idle' | 'hover' | 'click'>('idle');

  const handleHoverStart = () => {
    setLogoState('hover');
  };

  const handleHoverEnd = () => {
    setLogoState('idle');
  };

  const handleClick = () => {
    setLogoState('click');
    if (onClick) {
      onClick();
    }
    // Automatically revert to hover or idle after click animation completes
    setTimeout(() => {
      setLogoState('hover');
    }, 600);
  };

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        className="flex items-center gap-3 cursor-pointer py-1.5 px-3 rounded-xl transition-all duration-300"
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        onClick={handleClick}
        whileHover={{
          backgroundColor: theme === 'dark' ? 'rgba(37, 99, 235, 0.05)' : 'rgba(37, 99, 235, 0.03)',
        }}
      >
        <WealthMapLogo
          size={42}
          animateState={logoState === 'click' ? 'click' : logoState === 'hover' ? 'hover' : 'idle'}
          theme={theme}
        />
        
        {/* Wordmark typography */}
        <motion.span 
          className="text-2xl font-black tracking-tight font-sans select-none flex items-center"
          variants={{
            idle: { y: 0 },
            hover: { y: -1 }
          }}
          animate={logoState}
        >
          <span className={theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}>
            Wealth
          </span>
          <span className="bg-gradient-to-r from-brand-blue to-brand-green bg-clip-text text-transparent ml-[2px]">
            Map
          </span>
        </motion.span>
      </motion.div>

      {/* Animated active indicator under the logo */}
      {active && (
        <motion.div
          layoutId="activeLogoIndicator"
          className="absolute -bottom-1 left-4 right-4 h-[3px] bg-gradient-to-r from-brand-blue to-brand-green rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </div>
  );
};
