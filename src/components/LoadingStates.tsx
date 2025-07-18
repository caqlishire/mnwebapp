'use client';

import { motion } from 'framer-motion';

// Skeleton Loading Components
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-200 rounded-xlarge p-6 space-y-4">
        <div className="h-4 bg-gray-300 rounded-medium w-3/4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 rounded-small"></div>
          <div className="h-3 bg-gray-300 rounded-small w-5/6"></div>
        </div>
        <div className="h-8 bg-gray-300 rounded-medium w-1/3"></div>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`animate-pulse space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={`h-3 bg-gray-300 rounded-small ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

// Advanced Loading Spinner
export function LoadingSpinner({ size = 'md', color = 'brand' }: { 
  size?: 'sm' | 'md' | 'lg'; 
  color?: 'brand' | 'white' | 'gray' 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    brand: 'border-brand-600',
    white: 'border-white',
    gray: 'border-gray-400'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
}

// Pulsing Dots Loader
export function DotsLoader({ color = 'brand' }: { color?: 'brand' | 'white' | 'gray' }) {
  const colorClasses = {
    brand: 'bg-brand-600',
    white: 'bg-white',
    gray: 'bg-gray-400'
  };

  const dotVariants = {
    initial: { scale: 0.8, opacity: 0.5 },
    animate: { scale: 1.2, opacity: 1 },
  };

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`w-2 h-2 rounded-full ${colorClasses[color]}`}
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
}

// Progress Bar
export function ProgressBar({ 
  progress, 
  className = '',
  color = 'brand',
  showPercent = false 
}: { 
  progress: number; 
  className?: string;
  color?: 'brand' | 'success' | 'warning';
  showPercent?: boolean;
}) {
  const colorClasses = {
    brand: 'bg-brand-600',
    success: 'bg-semantic-success-500',
    warning: 'bg-semantic-warning-500'
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {showPercent && (
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className={`h-full ${colorClasses[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// Breathing Loading Animation
export function BreathingLoader({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        opacity: [0.8, 1, 0.8],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}

// Page Loading Overlay
export function PageLoadingOverlay() {
  return (
    <motion.div
      className="fixed inset-0 bg-surface-backdrop backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-surface-paper rounded-xlarge p-8 shadow-floating border border-gray-200 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-brand-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">MN</span>
          </div>
        </div>
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </motion.div>
  );
}

// Staggered List Loading
export function StaggeredListLoading({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <motion.div
          key={index}
          className="animate-pulse"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-large">
            <div className="w-12 h-12 bg-gray-300 rounded-large"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded-small w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded-small w-1/2"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Image Loading Placeholder
export function ImageLoadingPlaceholder({ 
  aspectRatio = 'aspect-video',
  className = '' 
}: { 
  aspectRatio?: string;
  className?: string;
}) {
  return (
    <div className={`${aspectRatio} bg-gray-200 rounded-large overflow-hidden ${className}`}>
      <motion.div
        className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}