'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  blur?: 'light' | 'medium' | 'heavy';
  gradient?: boolean;
  depth?: 'shallow' | 'medium' | 'deep';
}

export default function GlassmorphicCard({
  children,
  className = '',
  hover = true,
  blur = 'medium',
  gradient = true,
  depth = 'medium'
}: GlassmorphicCardProps) {
  const blurIntensity = {
    light: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    heavy: 'backdrop-blur-xl'
  };

  const depthShadows = {
    shallow: 'shadow-lg',
    medium: 'shadow-xl shadow-black/10',
    deep: 'shadow-2xl shadow-black/20'
  };

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/10 dark:bg-white/5
        ${blurIntensity[blur]}
        ${depthShadows[depth]}
        border border-white/20 dark:border-white/10
        ${gradient ? 'bg-gradient-to-br from-white/20 to-white/5 dark:from-white/10 dark:to-white/2' : ''}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hover ? {
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2, ease: 'easeOut' }
      } : {}}
    >
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}