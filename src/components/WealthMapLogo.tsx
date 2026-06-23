import React from 'react';
import { motion, useAnimation, type Variants } from 'framer-motion';

interface WealthMapLogoProps {
  size?: number;
  animated?: boolean;
  animateState?: 'idle' | 'hover' | 'click' | 'loading';
  theme?: 'light' | 'dark';
  className?: string;
  onClick?: () => void;
}

export const WealthMapLogo: React.FC<WealthMapLogoProps> = ({
  size = 64,
  animateState = 'idle',
  theme = 'dark',
  className = '',
  onClick,
}) => {
  const rippleControls = useAnimation();
  const burstControls = useAnimation();

  // Color constants based on branding
  const primaryBlue = '#2563EB';
  const successGreen = '#10B981';

  // Handle click animations
  const handleClick = async () => {
    if (onClick) onClick();

    // Trigger ripple and burst animation
    await Promise.all([
      rippleControls.start({
        r: 45,
        opacity: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
      }),
      burstControls.start({
        opacity: [0, 0.8, 0],
        scale: [0.8, 1.2, 1],
        transition: { duration: 0.5 },
      })
    ]);

    // Reset ripple
    rippleControls.set({ r: 5, opacity: 0.6 });
  };

  // SVG Pin Path
  const pinPath = "M 50 6 C 27.5 6 10 23.5 10 46 C 10 70 50 92 50 92 C 50 92 90 70 90 46 C 90 23.5 72.5 6 50 6 Z";
  
  // Inner Pin Path for clipping/masking (scaled down slightly around the center)
  const innerPinPath = "M 50 12 C 31.8 12 17 26.8 17 45 C 17 64 50 82 50 82 C 50 82 83 64 83 45 C 83 26.8 68.2 12 50 12 Z";

  // Financial Growth Path (starts bottom-left, rises top-right)
  const chartPath = "M 32 66 C 39 60 45 61 52 48 C 59 35 64 30 70 24";
  
  // Closed path for the chart gradient fill under the line
  const chartAreaPath = "M 32 66 C 39 60 45 61 52 48 C 59 35 64 30 70 24 L 70 80 L 32 80 Z";

  // Framer Motion variants
  const pinVariants: Variants = {
    idle: {
      scale: 1,
      filter: 'drop-shadow(0px 4px 10px rgba(37, 99, 235, 0.15))',
    },
    hover: {
      scale: 1.05,
      filter: 'drop-shadow(0px 8px 20px rgba(37, 99, 235, 0.45)) drop-shadow(0px 4px 15px rgba(16, 185, 129, 0.3))',
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    click: {
      scale: 0.95,
      filter: 'drop-shadow(0px 0px 30px rgba(37, 99, 235, 0.8))',
      transition: { duration: 0.1 },
    },
    loading: {
      scale: [1, 1.02, 1],
      filter: 'drop-shadow(0px 4px 12px rgba(37, 99, 235, 0.3))',
      transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
    }
  };

  const chartLineVariants: Variants = {
    idle: { pathLength: 1, opacity: 1 },
    hover: { 
      pathLength: 1, 
      opacity: 1,
      stroke: successGreen,
      filter: 'url(#glow-green-strong)',
      transition: { duration: 0.3 }
    },
    click: {
      pathLength: [0, 1],
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeInOut' }
    },
    loading: {
      pathLength: [0, 1],
      opacity: [0.5, 1, 0.5],
      transition: { 
        pathLength: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
        opacity: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
      }
    }
  };

  const chartAreaVariants: Variants = {
    idle: { opacity: 0.15 },
    hover: { opacity: 0.35, transition: { duration: 0.3 } },
    click: { opacity: [0, 0.25], transition: { duration: 0.8 } },
    loading: { 
      opacity: [0.1, 0.25, 0.1], 
      transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' } 
    }
  };

  const circuitVariants: Variants = {
    idle: { opacity: 0.3 },
    hover: { 
      opacity: 0.7, 
      stroke: '#60A5FA', 
      transition: { duration: 0.3 } 
    },
    click: {
      opacity: [0.3, 1, 0.3],
      transition: { duration: 0.5 }
    },
    loading: {
      opacity: [0.2, 0.6, 0.2],
      transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
    }
  };

  const currentVariant = animateState;

  return (
    <div 
      className={`relative inline-block select-none cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      onClick={handleClick}
    >
      <motion.svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
        variants={pinVariants}
        animate={currentVariant}
        initial="idle"
        whileHover="hover"
        whileTap="click"
      >
        <defs>
          {/* Main Pin Outer Gradient */}
          <linearGradient id="pinOutlineGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={primaryBlue} />
            <stop offset="60%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor={successGreen} />
          </linearGradient>

          {/* Inner Glassmorphism Fill Gradient */}
          <linearGradient id="pinGlassFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme === 'dark' ? '#1E293B' : '#FFFFFF'} stopOpacity="0.85" />
            <stop offset="100%" stopColor={theme === 'dark' ? '#0F172A' : '#F1F5F9'} stopOpacity="0.95" />
          </linearGradient>

          {/* Chart Fill Gradient */}
          <linearGradient id="chartFillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={successGreen} stopOpacity="0.8" />
            <stop offset="100%" stopColor={successGreen} stopOpacity="0" />
          </linearGradient>

          {/* Circuit Lines Gradient */}
          <linearGradient id="circuitGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="glow-green-strong" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <filter id="glow-blue-subtle" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip path for chart fill inside the pin */}
          <clipPath id="innerPinClip">
            <path d={innerPinPath} />
          </clipPath>
        </defs>

        {/* 1. Glassmorphic Pin Background */}
        <path
          d={pinPath}
          fill="url(#pinGlassFill)"
          stroke="url(#pinOutlineGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Clip-contained layers (AI Circuit and Chart Background) */}
        <g clipPath="url(#innerPinClip)">
          {/* 2. AI Circuit Grid Background */}
          <g stroke="url(#circuitGrad)" strokeWidth="1.2" strokeLinecap="round" fill="none">
            {/* Center processor hub */}
            <motion.circle 
              cx="50" 
              cy="45" 
              r="4.5" 
              fill={theme === 'dark' ? '#1E3A8A' : '#DBEAFE'}
              stroke={primaryBlue}
              strokeWidth="1.5"
              variants={circuitVariants}
            />
            {/* Circuit paths */}
            <motion.path d="M 50 40.5 L 50 24" variants={circuitVariants} />
            <motion.path d="M 46.5 42 L 32 30 L 22 30" variants={circuitVariants} />
            <motion.path d="M 53.5 42 L 68 30 L 78 30" variants={circuitVariants} />
            <motion.path d="M 46.5 47 L 34 57 L 24 57" variants={circuitVariants} strokeDasharray="3, 3" />
            <motion.path d="M 53.5 47 L 66 57 L 76 57" variants={circuitVariants} />
            
            {/* Small nodes at ends of circuits */}
            <motion.circle cx="50" cy="24" r="2" fill={primaryBlue} variants={circuitVariants} />
            <motion.circle cx="22" cy="30" r="1.5" fill="#60A5FA" variants={circuitVariants} />
            <motion.circle cx="78" cy="30" r="1.5" fill="#60A5FA" variants={circuitVariants} />
            <motion.circle cx="24" cy="57" r="1.5" fill={successGreen} variants={circuitVariants} />
            <motion.circle cx="76" cy="57" r="1.5" fill="#60A5FA" variants={circuitVariants} />
          </g>

          {/* 3. Financial Area Fill (Clips to lower-bounds of the chart path) */}
          <motion.path
            d={chartAreaPath}
            fill="url(#chartFillGrad)"
            variants={chartAreaVariants}
            initial="idle"
            animate={currentVariant}
          />
        </g>

        {/* 4. Financial Growth Chart Line (Floats on top of outer border slightly or fits inside) */}
        <motion.path
          d={chartPath}
          stroke={successGreen}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow-blue-subtle)"
          variants={chartLineVariants}
          initial="idle"
          animate={currentVariant}
        />

        {/* Highlight points on the chart line */}
        <motion.circle
          cx="70"
          cy="24"
          r="3"
          fill="#FFFFFF"
          stroke={successGreen}
          strokeWidth="1.5"
          variants={{
            idle: { scale: 1 },
            hover: { scale: 1.3, filter: 'url(#glow-green-strong)' },
            click: { scale: 1 },
            loading: { scale: [1, 1.3, 1], transition: { repeat: Infinity, duration: 1.5 } }
          }}
        />

        {/* Click ripple circle */}
        <motion.circle
          cx="50"
          cy="45"
          r="5"
          stroke={successGreen}
          strokeWidth="2.5"
          fill="none"
          opacity="0"
          animate={rippleControls}
        />

        {/* Click burst flare overlay */}
        <motion.circle
          cx="50"
          cy="45"
          r="30"
          fill="url(#chartFillGrad)"
          opacity="0"
          className="pointer-events-none"
          animate={burstControls}
        />
      </motion.svg>
    </div>
  );
};
