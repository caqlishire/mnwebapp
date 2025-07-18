'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BackgroundEffectsProps {
  children: ReactNode;
  variant?: 'gradient' | 'floating' | 'wave' | 'geometric';
  className?: string;
}

export default function BackgroundEffects({ 
  children, 
  variant = 'gradient',
  className = '' 
}: BackgroundEffectsProps) {
  const renderBackground = () => {
    switch (variant) {
      case 'gradient':
        return (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 via-secondary-400/15 to-accent-400/20 animate-gradient-shift"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-gradient-pulse"></div>
          </div>
        );
      
      case 'floating':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute rounded-full bg-gradient-to-r ${
                  i % 3 === 0 ? 'from-primary-300/30 to-primary-500/20' :
                  i % 3 === 1 ? 'from-secondary-300/30 to-secondary-500/20' :
                  'from-accent-300/30 to-accent-500/20'
                }`}
                style={{
                  width: `${80 + i * 20}px`,
                  height: `${80 + i * 20}px`,
                  left: `${10 + i * 15}%`,
                  top: `${5 + i * 10}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  x: [0, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>
        );
      
      case 'wave':
        return (
          <div className="absolute inset-0 overflow-hidden">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1200 800"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(30 64 175 / 0.1)" />
                  <stop offset="50%" stopColor="rgb(5 150 105 / 0.1)" />
                  <stop offset="100%" stopColor="rgb(234 88 12 / 0.1)" />
                </linearGradient>
              </defs>
              <motion.path
                d="M0,300 Q300,200 600,300 T1200,300 L1200,800 L0,800 Z"
                fill="url(#wave-gradient)"
                animate={{
                  d: [
                    "M0,300 Q300,200 600,300 T1200,300 L1200,800 L0,800 Z",
                    "M0,350 Q300,250 600,350 T1200,350 L1200,800 L0,800 Z",
                    "M0,300 Q300,200 600,300 T1200,300 L1200,800 L0,800 Z"
                  ]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </svg>
          </div>
        );
      
      case 'geometric':
        return (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute border ${
                  i % 4 === 0 ? 'border-primary-300/20 bg-primary-100/5' :
                  i % 4 === 1 ? 'border-secondary-300/20 bg-secondary-100/5' :
                  i % 4 === 2 ? 'border-accent-300/20 bg-accent-100/5' :
                  'border-gray-300/20 bg-gray-100/5'
                }`}
                style={{
                  width: `${60 + i * 15}px`,
                  height: `${60 + i * 15}px`,
                  left: `${5 + i * 12}%`,
                  top: `${10 + (i % 3) * 30}%`,
                  borderRadius: i % 2 === 0 ? '50%' : '0',
                  transform: `rotate(${i * 45}deg)`,
                }}
                animate={{
                  rotate: [i * 45, i * 45 + 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 20 + i * 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {renderBackground()}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}