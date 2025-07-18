'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface MorphingBackgroundProps {
  className?: string;
  colorScheme?: 'primary' | 'secondary' | 'accent';
  intensity?: 'subtle' | 'medium' | 'intense';
}

export default function MorphingBackground({ 
  className = '',
  colorScheme = 'primary',
  intensity = 'medium'
}: MorphingBackgroundProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const colorSchemes = {
    primary: {
      from: 'from-blue-400/20',
      via: 'via-purple-500/15',
      to: 'to-teal-400/20'
    },
    secondary: {
      from: 'from-orange-400/20',
      via: 'via-red-500/15', 
      to: 'to-pink-400/20'
    },
    accent: {
      from: 'from-emerald-400/20',
      via: 'via-blue-500/15',
      to: 'to-violet-400/20'
    }
  };

  const intensitySettings = {
    subtle: { scale: [1, 1.1, 1], duration: 20 },
    medium: { scale: [1, 1.3, 1], duration: 15 },
    intense: { scale: [1, 1.5, 1], duration: 10 }
  };

  const colors = colorSchemes[colorScheme];
  const settings = intensitySettings[intensity];

  if (!mounted) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Primary morphing blob */}
      <motion.div
        className={`absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br ${colors.from} ${colors.to} blur-3xl opacity-60`}
        animate={{
          scale: settings.scale,
          x: [0, 100, 0],
          y: [0, 50, 0],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: settings.duration,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Secondary morphing blob */}
      <motion.div
        className={`absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-tl ${colors.via} ${colors.to} blur-3xl opacity-50`}
        animate={{
          scale: [1, 1.2, 0.8, 1],
          x: [0, -80, 0],
          y: [0, -60, 0],
          rotate: [360, 180, 0]
        }}
        transition={{
          duration: settings.duration + 5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Tertiary accent blob */}
      <motion.div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r ${colors.from} ${colors.via} blur-2xl opacity-30`}
        animate={{
          scale: [0.8, 1.4, 0.8],
          rotate: [0, -180, -360]
        }}
        transition={{
          duration: settings.duration + 10,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/30 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5
          }}
        />
      ))}

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10 dark:via-black/5 dark:to-black/10" />
    </div>
  );
}