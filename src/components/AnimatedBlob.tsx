'use client';
import React from 'react';
import { motion } from 'framer-motion';

// AnimatedBlob: A floating SVG blob with animation props
type AnimatedBlobProps = React.PropsWithChildren<{
  className?: string;
  variant?: 'floating' | string;
}>;

const AnimatedBlob = ({ className = '', variant = 'floating', children }: AnimatedBlobProps) => {
  // You can add more variants or props as needed
  return (
    <motion.svg
      className={className}
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
      initial={variant === 'floating' ? { y: 30, opacity: 0.7 } : { opacity: 0.7 }}
      animate={variant === 'floating' ? { y: [30, -30, 30], opacity: 1 } : { opacity: 1 }}
      transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      style={{ filter: 'blur(0px)' }}
    >
      <defs>
        <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0c3fc" />
          <stop offset="100%" stopColor="#8ec5fc" />
        </linearGradient>
      </defs>
      <path
        fill="url(#blobGradient)"
        d="M421.5,320Q410,390,340,410Q270,430,210,390Q150,350,160,280Q170,210,230,170Q290,130,350,170Q410,210,421.5,280Q433,350,421.5,320Z"
      />
      {children}
    </motion.svg>
  );
};

export default AnimatedBlob; 