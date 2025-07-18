'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';

interface OrchestrationWrapperProps {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
  variant?: 'fade' | 'slide' | 'scale' | 'morph' | 'reveal';
}

const containerVariants = {
  fade: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  },
  slide: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  },
  scale: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  },
  morph: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.4,
      }
    }
  },
  reveal: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      }
    }
  }
};

const itemVariants = {
  fade: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  },
  slide: {
    hidden: { opacity: 0, x: -30, y: 10 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  },
  morph: {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      rotate: -5,
      filter: 'blur(10px)'
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1,
        ease: [0.68, -0.55, 0.265, 1.55]
      }
    }
  },
  reveal: {
    hidden: { 
      opacity: 0,
      clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)'
    },
    visible: {
      opacity: 1,
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }
};

export default function OrchestrationWrapper({
  children,
  className = '',
  staggerChildren = 0.1,
  delayChildren = 0.2,
  variant = 'fade'
}: OrchestrationWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Custom container variants with props
  const customContainerVariants = {
    ...containerVariants[variant],
    visible: {
      ...containerVariants[variant].visible,
      transition: {
        staggerChildren,
        delayChildren,
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={className}
          variants={customContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {Array.isArray(children) 
            ? children.map((child, index) => (
                <motion.div key={index} variants={itemVariants[variant]}>
                  {child}
                </motion.div>
              ))
            : <motion.div variants={itemVariants[variant]}>{children}</motion.div>
          }
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Specialized orchestration components
export function HeroOrchestration({ children }: { children: ReactNode }) {
  return (
    <OrchestrationWrapper 
      variant="morph" 
      staggerChildren={0.2} 
      delayChildren={0.3}
      className="space-y-6"
    >
      {children}
    </OrchestrationWrapper>
  );
}

export function FeatureOrchestration({ children }: { children: ReactNode }) {
  return (
    <OrchestrationWrapper 
      variant="scale" 
      staggerChildren={0.15} 
      delayChildren={0.1}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {children}
    </OrchestrationWrapper>
  );
}

export function ContentOrchestration({ children }: { children: ReactNode }) {
  return (
    <OrchestrationWrapper 
      variant="slide" 
      staggerChildren={0.1} 
      delayChildren={0.2}
      className="space-y-8"
    >
      {children}
    </OrchestrationWrapper>
  );
}

export function RevealOrchestration({ children }: { children: ReactNode }) {
  return (
    <OrchestrationWrapper 
      variant="reveal" 
      staggerChildren={0.08} 
      delayChildren={0.1}
    >
      {children}
    </OrchestrationWrapper>
  );
}