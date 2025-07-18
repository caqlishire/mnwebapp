'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  backgroundElement?: ReactNode;
}

export default function ParallaxSection({
  children,
  className = '',
  speed = 0.5,
  direction = 'up',
  backgroundElement
}: ParallaxSectionProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const distance = 100 * speed;
  const transform = useTransform(
    scrollYProgress,
    [0, 1],
    direction === 'up' ? [distance, -distance] :
    direction === 'down' ? [-distance, distance] :
    direction === 'left' ? [distance, -distance] :
    direction === 'right' ? [-distance, distance] :
    [distance, -distance]
  );
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Background element with parallax */}
      {backgroundElement && (
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            [direction === 'left' || direction === 'right' ? 'x' : 'y']: transform,
            scale,
            opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3])
          }}
        >
          {backgroundElement}
        </motion.div>
      )}

      {/* Main content */}
      <motion.div
        className="relative z-10"
        style={{
          opacity,
          scale: scale
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}