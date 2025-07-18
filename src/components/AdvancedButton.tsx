'use client';

import { motion, easeInOut } from 'framer-motion';
import { ReactNode } from 'react';
import Link from 'next/link';

const MotionLink = motion(Link);

interface AdvancedButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
  ariaLabel?: string;
}

const buttonVariants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-card-rest hover:shadow-card-hover',
  secondary: 'bg-surface-elevated text-brand-600 border-2 border-brand-200 hover:border-brand-300 hover:bg-brand-50',
  ghost: 'text-brand-600 hover:bg-brand-50 hover:text-brand-700',
  danger: 'bg-semantic-error-500 text-white hover:bg-semantic-error-600 shadow-card-rest hover:shadow-card-hover',
};

const sizeVariants = {
  sm: 'h-button-sm px-4 text-sm',
  md: 'h-button-md px-6 text-base',
  lg: 'h-button-lg px-8 text-lg',
};

const buttonMotion = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -1,
    transition: { 
      duration: 0.2,
      ease: easeInOut
    }
  },
  tap: { 
    scale: 0.98, 
    y: 0,
    transition: { 
      duration: 0.1,
      ease: easeInOut
    }
  }
};

export default function AdvancedButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  href,
  className = '',
  ariaLabel,
}: AdvancedButtonProps) {
  const baseClasses = `
    relative inline-flex items-center justify-center
    font-semibold rounded-large
    transition-all duration-300 ease-smooth
    focus:outline-none focus:ring-3 focus:ring-brand-600/30
    disabled:opacity-50 disabled:cursor-not-allowed
    overflow-hidden group
    ${buttonVariants[variant]}
    ${sizeVariants[size]}
    ${className}
  `;

  const content = (
    <>
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* Loading spinner */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
      
      {/* Content */}
      <div className={`flex items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
        {icon && iconPosition === 'left' && (
          <motion.div
            className="flex-shrink-0"
            variants={{
              rest: { rotate: 0 },
              hover: { rotate: variant === 'primary' ? 5 : 0 }
            }}
          >
            {icon}
          </motion.div>
        )}
        
        <span className="relative">
          {children}
        </span>
        
        {icon && iconPosition === 'right' && (
          <motion.div
            className="flex-shrink-0"
            variants={{
              rest: { x: 0 },
              hover: { x: 2 }
            }}
          >
            {icon}
          </motion.div>
        )}
      </div>
    </>
  );

  const isInternal = href && href.startsWith('/');
  if (href && isInternal) {
    return (
      <MotionLink
        href={href}
        className={baseClasses}
        onClick={onClick}
        aria-label={ariaLabel}
        variants={buttonMotion}
        initial="rest"
        whileHover={!disabled ? "hover" : "rest"}
        whileTap={!disabled ? "tap" : "rest"}
      >
        {content}
      </MotionLink>
    );
  }

  const Component = href ? motion.a : motion.button;
  return (
    <Component
      className={baseClasses}
      onClick={onClick}
      href={href}
      disabled={disabled}
      aria-label={ariaLabel}
      variants={buttonMotion}
      initial="rest"
      whileHover={!disabled ? "hover" : "rest"}
      whileTap={!disabled ? "tap" : "rest"}
    >
      {content}
    </Component>
  );
}