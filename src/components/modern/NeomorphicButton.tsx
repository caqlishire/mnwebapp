'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';

interface NeomorphicButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export default function NeomorphicButton({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left'
}: NeomorphicButtonProps) {
  const variants = {
    primary: `
      bg-gradient-to-br from-[#2F6DB6] to-[#1e4a8c] 
      text-white shadow-lg
      shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.1)]
      hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-2px_4px_rgba(0,0,0,0.1)]
      active:shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)]
    `,
    secondary: `
      bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800
      text-gray-800 dark:text-gray-200
      shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.1)]
      dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.3)]
      hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.1)]
      active:shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)]
    `,
    ghost: `
      bg-transparent border-2 border-current
      hover:bg-current hover:text-white
      transition-all duration-200
    `
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl',
    xl: 'px-10 py-5 text-xl rounded-2xl'
  };

  const buttonClasses = `
    relative overflow-hidden font-semibold transition-all duration-200
    transform-gpu will-change-transform
    ${variants[variant]}
    ${sizes[size]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;

  const ButtonContent = () => (
    <>
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full transition-transform duration-700 group-hover:translate-x-full" />
      
      {/* Content */}
      <span className="relative flex items-center justify-center gap-2">
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </span>
    </>
  );

  const MotionButton = motion.button;
  const MotionLink = motion(Link);

  const motionProps = {
    whileHover: disabled ? {} : { scale: 1.02, y: -1 },
    whileTap: disabled ? {} : { scale: 0.98 },
    transition: { duration: 0.1 },
    className: `${buttonClasses} group`
  };

  if (href && !disabled) {
    return (
      <MotionLink href={href} {...motionProps}>
        <ButtonContent />
      </MotionLink>
    );
  }

  return (
    <MotionButton
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...motionProps}
    >
      <ButtonContent />
    </MotionButton>
  );
}