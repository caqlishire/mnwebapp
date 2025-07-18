'use client';

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface Metric {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  color?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface InteractiveMetricsProps {
  metrics: Metric[];
  className?: string;
}

function AnimatedCounter({ 
  value, 
  suffix = '', 
  prefix = '',
  color = '#2F6DB6' 
}: { 
  value: number; 
  suffix?: string; 
  prefix?: string;
  color?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 20,
    stiffness: 100
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    return springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(latest)}${suffix}`;
      }
    });
  }, [springValue, prefix, suffix]);

  return (
    <motion.span
      ref={ref}
      className="text-4xl md:text-5xl font-bold tabular-nums"
      style={{ color }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {prefix}0{suffix}
    </motion.span>
  );
}

export default function InteractiveMetrics({ metrics, className = '' }: InteractiveMetricsProps) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 ${className}`}>
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.6, 
            delay: index * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94] 
          }}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
          className="relative group"
        >
          {/* Background glow effect */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
            style={{ 
              backgroundColor: metric.color || '#2F6DB6',
              filter: 'blur(20px)'
            }}
          />
          
          {/* Card content */}
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 shadow-xl">
            {/* Icon */}
            {metric.icon && (
              <div className="flex justify-center mb-4">
                <div 
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${metric.color || '#2F6DB6'}20` }}
                >
                  <metric.icon 
                    className="w-8 h-8"
                    style={{ color: metric.color || '#2F6DB6' }}
                  />
                </div>
              </div>
            )}
            
            {/* Animated number */}
            <div className="text-center">
              <AnimatedCounter
                value={metric.value}
                suffix={metric.suffix}
                prefix={metric.prefix}
                color={metric.color}
              />
              
              {/* Label */}
              <motion.p
                className="text-gray-600 dark:text-gray-400 font-medium mt-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                {metric.label}
              </motion.p>
            </div>

            {/* Floating particles effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full opacity-40"
                  style={{ backgroundColor: metric.color || '#2F6DB6' }}
                  animate={{
                    x: [0, 20, 0],
                    y: [0, -30, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  style={{
                    left: `${20 + i * 30}%`,
                    top: '70%'
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}