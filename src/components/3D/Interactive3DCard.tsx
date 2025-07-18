'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import WebGLCanvas from './WebGLCanvas';

interface Interactive3DCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glowEffect?: boolean;
  perspective?: number;
  rotationRange?: number;
  scaleOnHover?: number;
  webglBackground?: boolean;
  colorScheme?: 'healthcare' | 'trust' | 'calm';
}

export default function Interactive3DCard({
  children,
  className = '',
  intensity = 1,
  glowEffect = true,
  perspective = 1000,
  rotationRange = 15,
  scaleOnHover = 1.05,
  webglBackground = false,
  colorScheme = 'healthcare'
}: Interactive3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [bounds, setBounds] = useState<DOMRect | null>(null);

  // Motion values for smooth animations
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring animations for smoother movement
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [rotationRange, -rotationRange]), {
    stiffness: 150,
    damping: 30,
    mass: 0.1
  });
  
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-rotationRange, rotationRange]), {
    stiffness: 150,
    damping: 30,
    mass: 0.1
  });

  const scale = useSpring(1, {
    stiffness: 300,
    damping: 30
  });

  // Advanced glow effect
  const glowIntensity = useSpring(0, {
    stiffness: 200,
    damping: 25
  });

  // 3D depth layers
  const layer1Z = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);
  const layer2Z = useTransform(mouseY, [-0.5, 0.5], [-10, 10]);
  const layer3Z = useTransform(mouseX, [-0.5, 0.5], [10, -10]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const updateBounds = () => {
      setBounds(card.getBoundingClientRect());
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    window.addEventListener('scroll', updateBounds);

    return () => {
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('scroll', updateBounds);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!bounds) return;

    const x = (e.clientX - bounds.left) / bounds.width - 0.5;
    const y = (e.clientY - bounds.top) / bounds.height - 0.5;

    mouseX.set(x * intensity);
    mouseY.set(y * intensity);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(scaleOnHover);
    glowIntensity.set(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
    glowIntensity.set(0);
  };

  // Complex CSS for 3D effects
  const cardStyle = {
    perspective: `${perspective}px`,
    transformStyle: 'preserve-3d' as const,
  };


  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* WebGL Background Layer */}
      {webglBackground && (
        <motion.div
          className="absolute inset-0 -z-10"
          style={{
            rotateX,
            rotateY,
            scale: 0.98,
            z: layer1Z,
          }}
        >
          <WebGLCanvas
            width={bounds?.width || 400}
            height={bounds?.height || 300}
            colorScheme={colorScheme}
            interactive={isHovered}
            className="w-full h-full opacity-30"
          />
        </motion.div>
      )}

      {/* Main Card Container */}
      <motion.div
        className="relative"
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d' as const,
        }}
      >
        {/* Glow Effect */}
        {glowEffect && (
          <motion.div
            className="absolute -inset-1 rounded-xlarge opacity-0 blur-xl"
            style={{
              background: `linear-gradient(135deg, 
                ${colorScheme === 'healthcare' ? '#2F6DB6' : 
                  colorScheme === 'trust' ? '#3b82f6' : '#10b981'}40,
                ${colorScheme === 'healthcare' ? '#059669' : 
                  colorScheme === 'trust' ? '#1e40af' : '#047857'}40)`,
              opacity: glowIntensity,
              scale: 1.05,
            }}
          />
        )}

        {/* Background Layer with Depth */}
        <motion.div
          className="absolute inset-0 rounded-xlarge bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-depth-2"
          style={{
            z: layer1Z,
            rotateX: 0.3,
            rotateY: 0.3,
          }}
        />

        {/* Middle Layer */}
        <motion.div
          className="absolute inset-2 rounded-large bg-gradient-to-br from-gray-50 to-white shadow-depth-1 opacity-80"
          style={{
            z: layer2Z,
            rotateX: 0.6,
            rotateY: 0.6,
          }}
        />

        {/* Content Layer */}
        <motion.div
          className="relative z-10 p-6 md:p-8 rounded-xlarge bg-white/90 backdrop-blur-sm border border-white/20 shadow-depth-3"
          style={{
            z: layer3Z,
            transformStyle: 'preserve-3d' as const,
          }}
        >
          {/* Interactive Highlight */}
          <motion.div
            className="absolute inset-0 rounded-xlarge bg-gradient-to-br from-transparent via-white/20 to-transparent opacity-0"
            style={{
              opacity: 0.3,
              background: `linear-gradient(135deg, 
                transparent 0%, 
                ${colorScheme === 'healthcare' ? '#2F6DB6' : 
                  colorScheme === 'trust' ? '#3b82f6' : '#10b981'}20 50%, 
                transparent 100%)`,
            }}
          />

          {/* Floating Elements */}
          <motion.div
            className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 opacity-60"
            style={{
              z: 50,
              rotateX: useTransform(rotateX, r => -r * 2),
              rotateY: useTransform(rotateY, r => -r * 2),
              scale: useTransform(glowIntensity, [0, 1], [1, 1.5]),
            }}
          />

          <motion.div
            className="absolute bottom-4 left-4 w-1 h-1 rounded-full bg-gradient-to-r from-green-400 to-green-600 opacity-40"
            style={{
              z: 40,
              rotateX: useTransform(rotateX, r => r * 1.5),
              rotateY: useTransform(rotateY, r => r * 1.5),
              scale: useTransform(glowIntensity, [0, 1], [1, 2]),
            }}
          />

          {/* Content with depth */}
          <div className="relative z-20">
            {children}
          </div>

          {/* Interactive ripple effect */}
          <motion.div
            className="absolute inset-0 rounded-xlarge pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${mouseX.get() * 50 + 50}% ${mouseY.get() * 50 + 50}%, 
                ${colorScheme === 'healthcare' ? '#2F6DB6' : 
                  colorScheme === 'trust' ? '#3b82f6' : '#10b981'}15 0%, 
                transparent 50%)`,
              opacity: glowIntensity,
            }}
          />
        </motion.div>

        {/* Edge highlight */}
        <motion.div
          className="absolute inset-0 rounded-xlarge border border-white/30 pointer-events-none"
          style={{
            opacity: glowIntensity,
            borderColor: useTransform(glowIntensity, [0, 1], ['transparent', 'rgba(255,255,255,0.5)']),
          }}
        />
      </motion.div>

      {/* Reflection effect */}
      <motion.div
        className="absolute -bottom-2 left-0 right-0 h-8 opacity-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)',
          transform: 'perspective(100px) rotateX(45deg) scaleY(0.3)',
          transformOrigin: 'bottom',
          filter: 'blur(2px)',
          opacity: useTransform(scale, [1, scaleOnHover], [0.2, 0.4]),
        }}
      />

      {/* Ambient particles */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xlarge">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-blue-400 opacity-60"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                scale: 0,
              }}
              animate={{
                y: [null, '-20px'],
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}