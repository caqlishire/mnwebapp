'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'wide' | 'tall';
  variant?: 'default' | 'featured' | 'accent' | 'minimal';
  delay?: number;
}

interface BentoGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

const sizeVariants = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-1 row-span-2 md:col-span-2 md:row-span-1',
  large: 'col-span-2 row-span-2',
  wide: 'col-span-2 row-span-1',
  tall: 'col-span-1 row-span-2',
};

const cardVariants = {
  default: 'bg-surface-elevated border border-gray-200 shadow-card-rest hover:shadow-card-hover',
  featured: 'bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-200 shadow-depth-2 hover:shadow-depth-3',
  accent: 'bg-gradient-to-br from-healthcare-calm/10 to-healthcare-trust/10 border border-healthcare-trust/20 shadow-card-rest hover:shadow-card-hover',
  minimal: 'bg-surface-paper border border-gray-100 shadow-soft hover:shadow-medium',
};

const cardMotion = {
  hidden: { 
    opacity: 0, 
    y: 20, 
    scale: 0.95,
    filter: 'blur(10px)'
  },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      delay: delay * 0.1
    }
  }),
  hover: {
    y: -4,
    scale: 1.04,
    rotateY: 8,
    transition: {
      duration: 0.3
    }
  },
  tap: {
    scale: 0.97
  }
};

export function BentoCard({ 
  children, 
  className = '', 
  size = 'medium', 
  variant = 'default',
  delay = 0 
}: BentoCardProps) {
  return (
    <motion.div
      className={`
        glass-card card-hover shadow-xl
        ${sizeVariants[size]}
        ${cardVariants[variant]}
        rounded-xlarge p-6 md:p-8
        transition-all duration-300 ease-smooth
        hover:border-opacity-80
        group cursor-pointer
        relative overflow-hidden
        ${className}
      `}
      variants={cardMotion}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      whileTap="tap"
      viewport={{ once: true, margin: "-50px" }}
      custom={delay}
      tabIndex={0}
      aria-label="Modern glassmorphic card"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-healthcare-trust via-transparent to-healthcare-calm animate-gradient-shift" />
      </div>
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-brand-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}

export function BentoGrid({ children, columns = 3, className = '' }: BentoGridProps) {
  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`
      grid ${gridClass[columns]} 
      gap-6 md:gap-8 
      auto-rows-fr
      ${className}
    `}>
      {children}
    </div>
  );
}

// Pre-built Bento layouts for healthcare
export function HealthcareBentoLayout({ 
  heroCard, 
  featureCards, 
  statsCard, 
  testimonialCard,
  contactCard 
}: {
  heroCard: ReactNode;
  featureCards: ReactNode[];
  statsCard: ReactNode;
  testimonialCard: ReactNode;
  contactCard: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 auto-rows-fr">
      {/* Hero card - spans full width on mobile, 2/3 on desktop */}
      <BentoCard size="large" variant="featured" className="md:col-span-4" delay={0}>
        {heroCard}
      </BentoCard>
      
      {/* Stats card - right column */}
      <BentoCard size="tall" variant="accent" className="md:col-span-2 md:row-span-2" delay={1}>
        {statsCard}
      </BentoCard>
      
      {/* Feature cards - grid below hero */}
      {featureCards.map((card, index) => (
        <BentoCard 
          key={index}
          size="medium" 
          variant="default" 
          className="md:col-span-2" 
          delay={index + 2}
        >
          {card}
        </BentoCard>
      ))}
      
      {/* Testimonial - wide card */}
      <BentoCard size="wide" variant="minimal" className="md:col-span-4" delay={5}>
        {testimonialCard}
      </BentoCard>
      
      {/* Contact card */}
      <BentoCard size="medium" variant="featured" className="md:col-span-2" delay={6}>
        {contactCard}
      </BentoCard>
    </div>
  );
}