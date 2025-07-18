'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

// Spatial Computing Interfaces
interface SpatialCoordinate {
  x: number;
  y: number;
  z: number;
  w?: number; // 4th dimension for hyperspatial computing
}

interface HolographicLayer {
  id: string;
  depth: number;
  content: React.ReactNode;
  opacity: number;
  interferencePattern: InterferencePattern;
  coherenceLevel: number;
  spatialBounds: SpatialBounds;
  quantumEntanglement: boolean;
}

interface InterferencePattern {
  frequency: number;
  amplitude: number;
  phase: number;
  wavelength: number;
  diffraction: number;
}

interface SpatialBounds {
  min: SpatialCoordinate;
  max: SpatialCoordinate;
  curvature: number; // Space-time curvature factor
}

interface HolographicProjection {
  layers: HolographicLayer[];
  viewingAngle: SpatialCoordinate;
  lightSource: SpatialCoordinate;
  resolution: number;
  coherenceBeam: boolean;
  dimensionalStability: number;
}

interface SpatialGesture {
  type: 'point' | 'grab' | 'pinch' | 'wave' | 'trace' | 'quantum_entangle';
  position: SpatialCoordinate;
  velocity: SpatialCoordinate;
  confidence: number;
  timestamp: number;
  biometricSignature: string;
}

interface HyperspatialField {
  curvature: number[][];
  gravity: number;
  timeDistortion: number;
  quantumFluctuation: number;
  dimensionalStability: number;
  consciousness: number;
}

// Advanced Spatial Computing Engine
class SpatialComputingEngine {
  private spatialResolution = 1000;
  private currentProjection: HolographicProjection;
  private spatialTracking: Map<string, SpatialCoordinate> = new Map();
  private gestureHistory: SpatialGesture[] = [];
  private hyperspatialField: HyperspatialField;
  private dimensionalLayers: number = 7;
  private consciousnessField: number[][][] = [];

  constructor() {
    this.currentProjection = this.initializeProjection();
    this.hyperspatialField = this.initializeHyperspatialField();
    this.initializeConsciousnessField();
  }

  private initializeProjection(): HolographicProjection {
    return {
      layers: [],
      viewingAngle: { x: 0, y: 0, z: 1 },
      lightSource: { x: 0, y: 0, z: 10 },
      resolution: this.spatialResolution,
      coherenceBeam: true,
      dimensionalStability: 0.98
    };
  }

  private initializeHyperspatialField(): HyperspatialField {
    return {
      curvature: Array(50).fill(null).map(() => Array(50).fill(0)),
      gravity: 0.1,
      timeDistortion: 1.0,
      quantumFluctuation: 0.05,
      dimensionalStability: 0.95,
      consciousness: 0.3
    };
  }

  private initializeConsciousnessField() {
    // Initialize 3D consciousness field
    this.consciousnessField = Array(20).fill(null).map(() =>
      Array(20).fill(null).map(() =>
        Array(20).fill(null).map(() => Math.random() * 0.3)
      )
    );
  }

  // Create holographic interference patterns
  generateInterferencePattern(x: number, y: number, z: number, time: number): number {
    const wave1 = Math.sin(x * 0.1 + time * 0.01) * Math.cos(y * 0.1);
    const wave2 = Math.sin(y * 0.15 + time * 0.015) * Math.cos(z * 0.1);
    const wave3 = Math.sin(z * 0.08 + time * 0.008) * Math.cos(x * 0.12);
    
    // Quantum interference with consciousness field
    const consciousness = this.getConsciousnessAt(x, y, z);
    const quantumInterference = Math.sin(time * 0.1 + consciousness * 10) * 0.3;
    
    return (wave1 + wave2 + wave3 + quantumInterference) / 4;
  }

  private getConsciousnessAt(x: number, y: number, z: number): number {
    const fx = Math.floor(Math.abs(x) % 20);
    const fy = Math.floor(Math.abs(y) % 20);
    const fz = Math.floor(Math.abs(z) % 20);
    
    return this.consciousnessField[fx]?.[fy]?.[fz] || 0;
  }

  // Spatial gesture recognition with quantum consciousness
  recognizeGesture(positions: SpatialCoordinate[], velocities: SpatialCoordinate[]): SpatialGesture | null {
    if (positions.length < 3) return null;

    const latestPos = positions[positions.length - 1];
    const latestVel = velocities[velocities.length - 1];
    
    // Calculate gesture patterns
    const totalDistance = this.calculateTrajectoryDistance(positions);
    const averageVelocity = this.calculateAverageVelocity(velocities);
    const gestureComplexity = this.calculateGestureComplexity(positions);
    
    // Quantum entanglement detection
    const quantumEntanglement = this.detectQuantumEntanglement(positions);
    
    let gestureType: SpatialGesture['type'] = 'point';
    let confidence = 0.5;

    // Advanced gesture classification
    if (quantumEntanglement > 0.8) {
      gestureType = 'quantum_entangle';
      confidence = quantumEntanglement;
    } else if (totalDistance < 50 && averageVelocity > 100) {
      gestureType = 'grab';
      confidence = 0.8;
    } else if (gestureComplexity > 0.7 && totalDistance > 200) {
      gestureType = 'trace';
      confidence = gestureComplexity;
    } else if (this.isPinchGesture(positions)) {
      gestureType = 'pinch';
      confidence = 0.9;
    } else if (this.isWaveGesture(positions)) {
      gestureType = 'wave';
      confidence = 0.7;
    }

    return {
      type: gestureType,
      position: latestPos,
      velocity: latestVel,
      confidence,
      timestamp: Date.now(),
      biometricSignature: this.generateBiometricSignature(positions)
    };
  }

  private calculateTrajectoryDistance(positions: SpatialCoordinate[]): number {
    let distance = 0;
    for (let i = 1; i < positions.length; i++) {
      const dx = positions[i].x - positions[i-1].x;
      const dy = positions[i].y - positions[i-1].y;
      const dz = positions[i].z - positions[i-1].z;
      distance += Math.sqrt(dx*dx + dy*dy + dz*dz);
    }
    return distance;
  }

  private calculateAverageVelocity(velocities: SpatialCoordinate[]): number {
    const totalVel = velocities.reduce((sum, vel) => 
      sum + Math.sqrt(vel.x*vel.x + vel.y*vel.y + vel.z*vel.z), 0
    );
    return totalVel / velocities.length;
  }

  private calculateGestureComplexity(positions: SpatialCoordinate[]): number {
    if (positions.length < 3) return 0;
    
    let totalAngleChange = 0;
    for (let i = 2; i < positions.length; i++) {
      const v1 = {
        x: positions[i-1].x - positions[i-2].x,
        y: positions[i-1].y - positions[i-2].y,
        z: positions[i-1].z - positions[i-2].z
      };
      const v2 = {
        x: positions[i].x - positions[i-1].x,
        y: positions[i].y - positions[i-1].y,
        z: positions[i].z - positions[i-1].z
      };
      
      const dot = v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
      const mag1 = Math.sqrt(v1.x*v1.x + v1.y*v1.y + v1.z*v1.z);
      const mag2 = Math.sqrt(v2.x*v2.x + v2.y*v2.y + v2.z*v2.z);
      
      if (mag1 > 0 && mag2 > 0) {
        const angle = Math.acos(Math.max(-1, Math.min(1, dot / (mag1 * mag2))));
        totalAngleChange += angle;
      }
    }
    
    return Math.min(1, totalAngleChange / (Math.PI * positions.length));
  }

  private detectQuantumEntanglement(positions: SpatialCoordinate[]): number {
    // Detect quantum-like correlations in position data
    if (positions.length < 5) return 0;
    
    let entanglementScore = 0;
    const recent = positions.slice(-5);
    
    // Look for non-local correlations
    for (let i = 0; i < recent.length - 1; i++) {
      for (let j = i + 1; j < recent.length; j++) {
        const distance = Math.sqrt(
          Math.pow(recent[i].x - recent[j].x, 2) +
          Math.pow(recent[i].y - recent[j].y, 2) +
          Math.pow(recent[i].z - recent[j].z, 2)
        );
        
        // Quantum correlation decreases with distance, but not linearly
        const correlation = Math.exp(-distance / 100) * Math.sin(distance * 0.1);
        entanglementScore += Math.abs(correlation);
      }
    }
    
    return Math.min(1, entanglementScore / 10);
  }

  private isPinchGesture(positions: SpatialCoordinate[]): boolean {
    if (positions.length < 10) return false;
    
    const start = positions.slice(0, 5);
    const end = positions.slice(-5);
    
    const startSpread = this.calculateSpread(start);
    const endSpread = this.calculateSpread(end);
    
    return startSpread > endSpread * 2;
  }

  private isWaveGesture(positions: SpatialCoordinate[]): boolean {
    if (positions.length < 15) return false;
    
    let peaks = 0;
    for (let i = 1; i < positions.length - 1; i++) {
      if (positions[i].y > positions[i-1].y && positions[i].y > positions[i+1].y) {
        peaks++;
      }
    }
    
    return peaks >= 2;
  }

  private calculateSpread(positions: SpatialCoordinate[]): number {
    if (positions.length === 0) return 0;
    
    const center = positions.reduce((sum, pos) => ({
      x: sum.x + pos.x,
      y: sum.y + pos.y,
      z: sum.z + pos.z
    }), { x: 0, y: 0, z: 0 });
    
    center.x /= positions.length;
    center.y /= positions.length;
    center.z /= positions.length;
    
    const distances = positions.map(pos => Math.sqrt(
      Math.pow(pos.x - center.x, 2) +
      Math.pow(pos.y - center.y, 2) +
      Math.pow(pos.z - center.z, 2)
    ));
    
    return Math.max(...distances);
  }

  private generateBiometricSignature(positions: SpatialCoordinate[]): string {
    // Generate unique biometric signature from gesture pattern
    const features = [
      this.calculateTrajectoryDistance(positions),
      this.calculateGestureComplexity(positions),
      positions.length,
      Date.now() % 1000
    ];
    
    return features.map(f => f.toString(36)).join('-');
  }

  // Update hyperspatial field based on user interactions
  updateHyperspatialField(gesture: SpatialGesture) {
    const { position, velocity, confidence } = gesture;
    const influence = confidence * 0.1;
    
    // Update space-time curvature
    const gx = Math.floor(Math.abs(position.x) % 50);
    const gy = Math.floor(Math.abs(position.y) % 50);
    
    this.hyperspatialField.curvature[gx][gy] += influence * 0.5;
    this.hyperspatialField.gravity += influence * 0.01;
    
    // Quantum consciousness evolution
    this.evolveConsciousnessField(position, influence);
    
    // Time distortion effects
    const speed = Math.sqrt(velocity.x*velocity.x + velocity.y*velocity.y + velocity.z*velocity.z);
    this.hyperspatialField.timeDistortion = 1.0 + speed * 0.0001;
  }

  private evolveConsciousnessField(position: SpatialCoordinate, influence: number) {
    const range = 3;
    const fx = Math.floor(Math.abs(position.x / 10) % 20);
    const fy = Math.floor(Math.abs(position.y / 10) % 20);
    const fz = Math.floor(Math.abs(position.z / 10) % 20);
    
    for (let dx = -range; dx <= range; dx++) {
      for (let dy = -range; dy <= range; dy++) {
        for (let dz = -range; dz <= range; dz++) {
          const x = (fx + dx + 20) % 20;
          const y = (fy + dy + 20) % 20;
          const z = (fz + dz + 20) % 20;
          
          const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
          const falloff = Math.exp(-distance / 2);
          
          this.consciousnessField[x][y][z] = Math.min(1, 
            this.consciousnessField[x][y][z] + influence * falloff * 0.1
          );
        }
      }
    }
  }

  createHolographicLayer(content: React.ReactNode, depth: number): HolographicLayer {
    return {
      id: `holo-${Math.random().toString(36).substr(2, 9)}`,
      depth,
      content,
      opacity: 1 - Math.abs(depth) * 0.1,
      interferencePattern: {
        frequency: 0.1 + Math.abs(depth) * 0.05,
        amplitude: 1 - Math.abs(depth) * 0.1,
        phase: depth * Math.PI / 4,
        wavelength: 50 + Math.abs(depth) * 10,
        diffraction: Math.abs(depth) * 0.1
      },
      coherenceLevel: 0.9 - Math.abs(depth) * 0.05,
      spatialBounds: {
        min: { x: -500, y: -500, z: depth - 50 },
        max: { x: 500, y: 500, z: depth + 50 },
        curvature: this.hyperspatialField.curvature[0][0] || 0
      },
      quantumEntanglement: Math.random() > 0.7
    };
  }

  getProjection(): HolographicProjection {
    return this.currentProjection;
  }

  addLayer(layer: HolographicLayer) {
    this.currentProjection.layers.push(layer);
    this.currentProjection.layers.sort((a, b) => a.depth - b.depth);
  }

  removeLayer(layerId: string) {
    this.currentProjection.layers = this.currentProjection.layers.filter(
      layer => layer.id !== layerId
    );
  }

  getHyperspatialField(): HyperspatialField {
    return this.hyperspatialField;
  }
}

// 3D Holographic Layer Component
function HolographicLayerRenderer({ 
  layer, 
  viewAngle, 
  time 
}: { 
  layer: HolographicLayer; 
  viewAngle: SpatialCoordinate;
  time: number;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  
  // Calculate holographic interference
  const interference = useMemo(() => {
    const pattern = layer.interferencePattern;
    return Math.sin(time * pattern.frequency + pattern.phase) * pattern.amplitude;
  }, [layer.interferencePattern, time]);

  // Calculate depth perception
  const depthTransform = useMemo(() => {
    const perspective = 1000;
    const scale = perspective / (perspective + layer.depth);
    const rotateX = viewAngle.x * layer.depth * 0.01;
    const rotateY = viewAngle.y * layer.depth * 0.01;
    
    return {
      transform: `
        perspective(${perspective}px) 
        translateZ(${layer.depth}px) 
        scale(${scale}) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg)
      `,
      opacity: layer.opacity * (0.3 + Math.abs(interference) * 0.7),
      filter: `
        blur(${Math.abs(layer.depth) * 0.02}px) 
        hue-rotate(${layer.depth * 2}deg) 
        brightness(${1 - Math.abs(layer.depth) * 0.001})
      `
    };
  }, [layer.depth, layer.opacity, viewAngle, interference]);

  return (
    <motion.div
      ref={layerRef}
      className="absolute inset-0 pointer-events-none"
      style={depthTransform}
      animate={{
        scale: [1, 1.01, 1],
        opacity: [depthTransform.opacity, depthTransform.opacity * 1.1, depthTransform.opacity],
      }}
      transition={{
        duration: 2 + Math.abs(layer.depth) * 0.1,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Quantum entanglement indicators */}
      {layer.quantumEntanglement && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              'radial-gradient(circle, rgba(138, 43, 226, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle, rgba(138, 43, 226, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle, rgba(138, 43, 226, 0.1) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
      
      {/* Holographic interference pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `
            repeating-linear-gradient(
              ${layer.interferencePattern.phase}deg,
              transparent,
              transparent ${layer.interferencePattern.wavelength}px,
              rgba(255,255,255,${layer.interferencePattern.diffraction}) ${layer.interferencePattern.wavelength + 1}px,
              rgba(255,255,255,${layer.interferencePattern.diffraction}) ${layer.interferencePattern.wavelength + 2}px
            )
          `
        }}
      />
      
      {/* Layer content */}
      <div className="relative z-10">
        {layer.content}
      </div>
    </motion.div>
  );
}

// Spatial Gesture Tracker
function SpatialGestureTracker({ 
  onGesture 
}: { 
  onGesture: (gesture: SpatialGesture) => void;
}) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentPositions, setCurrentPositions] = useState<SpatialCoordinate[]>([]);
  const [currentVelocities, setCurrentVelocities] = useState<SpatialCoordinate[]>([]);
  const trackingRef = useRef<HTMLDivElement>(null);
  const lastPosition = useRef<SpatialCoordinate>({ x: 0, y: 0, z: 0 });
  const lastTimestamp = useRef<number>(Date.now());

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isTracking || !trackingRef.current) return;

    const rect = trackingRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const z = 0; // Simulated depth
    
    const now = Date.now();
    const dt = now - lastTimestamp.current;
    
    if (dt > 0) {
      const velocity = {
        x: (x - lastPosition.current.x) / dt * 1000,
        y: (y - lastPosition.current.y) / dt * 1000,
        z: (z - lastPosition.current.z) / dt * 1000
      };
      
      setCurrentPositions(prev => [...prev.slice(-19), { x, y, z }]);
      setCurrentVelocities(prev => [...prev.slice(-19), velocity]);
      
      lastPosition.current = { x, y, z };
      lastTimestamp.current = now;
    }
  }, [isTracking]);

  const startTracking = () => {
    setIsTracking(true);
    setCurrentPositions([]);
    setCurrentVelocities([]);
  };

  const stopTracking = () => {
    setIsTracking(false);
    
    // Process final gesture
    if (currentPositions.length > 0) {
      const spatialEngine = new SpatialComputingEngine();
      const gesture = spatialEngine.recognizeGesture(currentPositions, currentVelocities);
      if (gesture) {
        onGesture(gesture);
      }
    }
  };

  return (
    <div
      ref={trackingRef}
      className="absolute inset-0 z-50"
      onMouseMove={handleMouseMove}
      onMouseDown={startTracking}
      onMouseUp={stopTracking}
      onMouseLeave={stopTracking}
    >
      {isTracking && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: lastPosition.current.x - 10,
            top: lastPosition.current.y - 10,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <div className="w-5 h-5 rounded-full bg-blue-400 opacity-60" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-blue-300"
            animate={{
              scale: [1, 2, 1],
              opacity: [1, 0, 1],
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>
      )}
      
      {/* Gesture trail */}
      {currentPositions.map((pos, index) => (
        <motion.div
          key={index}
          className="absolute w-2 h-2 rounded-full bg-purple-400 pointer-events-none"
          style={{
            left: pos.x - 1,
            top: pos.y - 1,
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 2 }}
        />
      ))}
    </div>
  );
}

// Main Holographic Interface Component
export default function HolographicInterface() {
  const [spatialEngine] = useState(() => new SpatialComputingEngine());
  const [currentGesture, setCurrentGesture] = useState<SpatialGesture | null>(null);
  const [viewAngle, setViewAngle] = useState<SpatialCoordinate>({ x: 0, y: 0, z: 0 });
  const [time, setTime] = useState(0);
  const [holographicLayers, setHolographicLayers] = useState<HolographicLayer[]>([]);
  const [dimensionalStability, setDimensionalStability] = useState(0.95);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Calculate view angle from mouse position
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => prev + 1);
    }, 50);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Initialize holographic layers
    const initialLayers = [
      spatialEngine.createHolographicLayer(
        <div className="text-2xl font-bold text-blue-300 text-center">Healthcare Data Layer</div>, 
        -200
      ),
      spatialEngine.createHolographicLayer(
        <div className="text-lg text-green-300 text-center">Patient Information</div>, 
        -100
      ),
      spatialEngine.createHolographicLayer(
        <div className="text-base text-purple-300 text-center">Biometric Monitoring</div>, 
        0
      ),
      spatialEngine.createHolographicLayer(
        <div className="text-sm text-pink-300 text-center">AI Diagnostics</div>, 
        100
      ),
      spatialEngine.createHolographicLayer(
        <div className="text-xs text-yellow-300 text-center">Quantum Analysis</div>, 
        200
      ),
    ];

    setHolographicLayers(initialLayers);
  }, [spatialEngine]);

  const handleGesture = useCallback((gesture: SpatialGesture) => {
    setCurrentGesture(gesture);
    spatialEngine.updateHyperspatialField(gesture);
    
    // Update dimensional stability based on gesture
    setDimensionalStability(prev => 
      Math.min(1, Math.max(0.7, prev + (gesture.confidence - 0.5) * 0.1))
    );

    // React to specific gestures
    switch (gesture.type) {
      case 'quantum_entangle':
        // Create quantum entangled layer
        const entangledLayer = spatialEngine.createHolographicLayer(
          <div className="text-center text-purple-400 animate-pulse">
            ⚛️ Quantum Entangled State
          </div>,
          gesture.position.z
        );
        entangledLayer.quantumEntanglement = true;
        setHolographicLayers(prev => [...prev, entangledLayer]);
        break;
        
      case 'grab':
        // Manipulate nearest layer
        console.log('Spatial grab detected');
        break;
        
      case 'wave':
        // Disperse consciousness field
        console.log('Consciousness wave detected');
        break;
    }

    // Clear gesture after processing
    setTimeout(() => setCurrentGesture(null), 2000);
  }, [spatialEngine]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    mouseX.set(x);
    mouseY.set(y);
    
    setViewAngle({ x: y * 0.01, y: x * 0.01, z: 0 });
  }, [mouseX, mouseY]);

  const hyperspatialField = spatialEngine.getHyperspatialField();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 relative overflow-hidden">
      <motion.div
        className="relative w-full h-screen"
        onMouseMove={handleMouseMove}
        style={{
          perspective: 2000,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Spatial Gesture Tracker */}
        <SpatialGestureTracker onGesture={handleGesture} />

        {/* Header */}
        <div className="absolute top-8 left-8 right-8 z-40">
          <motion.h1
            className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent text-center"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            Spatial Computing Holographic Interface
          </motion.h1>
          <p className="text-center text-gray-300 text-xl mt-4">
            Experience healthcare data in multidimensional holographic space
          </p>
        </div>

        {/* Hyperspatial Field Visualization */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, 
              rgba(138, 43, 226, ${hyperspatialField.consciousness * 0.3}) 0%, 
              transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Main Holographic Container */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            rotateX,
            rotateY,
          }}
        >
          {/* Holographic Layers */}
          <AnimatePresence>
            {holographicLayers.map((layer, index) => (
              <HolographicLayerRenderer
                key={layer.id}
                layer={layer}
                viewAngle={viewAngle}
                time={time}
              />
            ))}
          </AnimatePresence>

          {/* Central Holographic Projector */}
          <motion.div
            className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-20"
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 360],
              boxShadow: [
                '0 0 20px rgba(0, 255, 255, 0.3)',
                '0 0 40px rgba(0, 255, 255, 0.6)',
                '0 0 20px rgba(0, 255, 255, 0.3)',
              ],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Spatial Information Panel */}
        <motion.div
          className="absolute bottom-8 left-8 bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h3 className="text-lg font-bold text-cyan-300 mb-4">Spatial Analytics</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">View Angle:</span>
              <span className="text-white">
                ({viewAngle.x.toFixed(2)}, {viewAngle.y.toFixed(2)})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Dimensional Stability:</span>
              <span className="text-green-300">{(dimensionalStability * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Consciousness Field:</span>
              <span className="text-purple-300">{(hyperspatialField.consciousness * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Time Distortion:</span>
              <span className="text-yellow-300">{hyperspatialField.timeDistortion.toFixed(3)}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Active Layers:</span>
              <span className="text-blue-300">{holographicLayers.length}</span>
            </div>
          </div>
        </motion.div>

        {/* Gesture Recognition Status */}
        {currentGesture && (
          <motion.div
            className="absolute top-1/2 right-8 bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-purple-500/50"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <h4 className="text-purple-300 font-bold mb-2">Gesture Detected</h4>
            <div className="text-sm space-y-1">
              <div>Type: <span className="text-white capitalize">{currentGesture.type.replace('_', ' ')}</span></div>
              <div>Confidence: <span className="text-green-300">{(currentGesture.confidence * 100).toFixed(0)}%</span></div>
              <div>Position: <span className="text-cyan-300">
                ({currentGesture.position.x.toFixed(0)}, {currentGesture.position.y.toFixed(0)})
              </span></div>
            </div>
          </motion.div>
        )}

        {/* Quantum Field Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-cyan-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Instructions */}
        <motion.div
          className="absolute bottom-8 right-8 bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-gray-500/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div className="text-xs text-gray-400 space-y-1">
            <div>• Move mouse to change view angle</div>
            <div>• Click and drag to create spatial gestures</div>
            <div>• Complex gestures enable quantum entanglement</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}