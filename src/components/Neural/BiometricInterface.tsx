'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

// Biometric data interfaces
interface BiometricData {
  heartRate: number;
  stressLevel: number;
  emotionalState: EmotionalState;
  eyeTracking: EyeData;
  facialExpression: FacialExpression;
  voiceAnalysis: VoiceData;
  brainwavePattern: BrainwaveData;
}

interface EmotionalState {
  primary: 'calm' | 'anxious' | 'focused' | 'excited' | 'tired' | 'confused';
  intensity: number; // 0-1
  confidence: number; // 0-1
  secondary: string[];
}

interface EyeData {
  x: number;
  y: number;
  pupilDilation: number;
  blinkRate: number;
  gazeDuration: number;
  attention: number; // 0-1
}

interface FacialExpression {
  happiness: number;
  sadness: number;
  anger: number;
  fear: number;
  surprise: number;
  disgust: number;
  neutral: number;
  engagement: number;
}

interface VoiceData {
  pitch: number;
  tone: string;
  stress: number;
  emotion: string;
  confidence: number;
}

interface BrainwaveData {
  alpha: number; // 8-12 Hz - relaxed awareness
  beta: number;  // 13-30 Hz - active thinking
  theta: number; // 4-7 Hz - deep meditation
  delta: number; // 0.5-3 Hz - deep sleep
  gamma: number; // 30-100 Hz - cognitive functions
}

// Advanced emotion recognition simulation
class EmotionRecognitionEngine {
  private emotionHistory: EmotionalState[] = [];
  private cameraRef: React.RefObject<HTMLVideoElement>;
  private isAnalyzing = false;

  constructor(cameraRef: React.RefObject<HTMLVideoElement>) {
    this.cameraRef = cameraRef;
  }

  // Simulate advanced facial expression analysis
  async analyzeFrame(): Promise<FacialExpression> {
    if (!this.cameraRef.current) {
      return this.getDefaultExpression();
    }

    // Simulate advanced computer vision analysis
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate realistic facial expression data
        const baseValues = this.generateBaseEmotions();
        const engagement = this.calculateEngagement(baseValues);
        
        resolve({
          ...baseValues,
          engagement
        });
      }, 50);
    });
  }

  private generateBaseEmotions(): Omit<FacialExpression, 'engagement'> {
    // Simulate realistic emotion recognition with some noise
    const time = Date.now() / 1000;
    const noise = () => (Math.random() - 0.5) * 0.1;
    
    return {
      happiness: Math.max(0, Math.min(1, 0.6 + Math.sin(time * 0.1) * 0.2 + noise())),
      sadness: Math.max(0, Math.min(1, 0.1 + Math.sin(time * 0.05) * 0.1 + noise())),
      anger: Math.max(0, Math.min(1, 0.05 + noise())),
      fear: Math.max(0, Math.min(1, 0.08 + noise())),
      surprise: Math.max(0, Math.min(1, 0.12 + Math.sin(time * 0.3) * 0.08 + noise())),
      disgust: Math.max(0, Math.min(1, 0.03 + noise())),
      neutral: Math.max(0, Math.min(1, 0.3 + Math.sin(time * 0.02) * 0.1 + noise()))
    };
  }

  private calculateEngagement(emotions: Omit<FacialExpression, 'engagement'>): number {
    // Calculate engagement based on emotional indicators
    const positiveEngagement = emotions.happiness + emotions.surprise;
    const negativeDisengagement = emotions.sadness + emotions.anger + emotions.disgust;
    const neutralBase = emotions.neutral * 0.5;
    
    return Math.max(0, Math.min(1, positiveEngagement - negativeDisengagement + neutralBase));
  }

  private getDefaultExpression(): FacialExpression {
    return {
      happiness: 0.5,
      sadness: 0.1,
      anger: 0.05,
      fear: 0.05,
      surprise: 0.1,
      disgust: 0.02,
      neutral: 0.3,
      engagement: 0.5
    };
  }

  // Determine primary emotional state from facial expressions
  determineEmotionalState(expression: FacialExpression): EmotionalState {
    const emotions = [
      { name: 'calm', value: expression.neutral + (1 - expression.fear - expression.anger) },
      { name: 'anxious', value: expression.fear + expression.sadness },
      { name: 'focused', value: expression.engagement * (1 - expression.sadness) },
      { name: 'excited', value: expression.happiness + expression.surprise },
      { name: 'tired', value: expression.sadness + (1 - expression.engagement) },
      { name: 'confused', value: expression.surprise + expression.fear * 0.5 }
    ];

    emotions.sort((a, b) => b.value - a.value);
    const primary = emotions[0].name as EmotionalState['primary'];
    const intensity = Math.min(1, emotions[0].value);
    const confidence = intensity > 0.3 ? 0.8 : 0.4;

    return {
      primary,
      intensity,
      confidence,
      secondary: emotions.slice(1, 3).map(e => e.name)
    };
  }

  startAnalysis(): void {
    this.isAnalyzing = true;
  }

  stopAnalysis(): void {
    this.isAnalyzing = false;
  }

  getEmotionHistory(): EmotionalState[] {
    return this.emotionHistory.slice(-20); // Last 20 measurements
  }
}

// Biometric simulation engine
class BiometricSimulator {
  private baseHeartRate = 70;
  private emotionalState: EmotionalState = {
    primary: 'calm',
    intensity: 0.5,
    confidence: 0.8,
    secondary: ['focused']
  };

  generateBiometricData(mouseX: number, mouseY: number, facialExpression: FacialExpression): BiometricData {
    const time = Date.now() / 1000;
    
    // Simulate heart rate based on emotional state and activity
    const emotionalInfluence = this.getEmotionalInfluence();
    const activityInfluence = Math.abs(mouseX - 0.5) + Math.abs(mouseY - 0.5);
    const heartRate = this.baseHeartRate + emotionalInfluence * 20 + activityInfluence * 15 + Math.sin(time) * 5;

    // Calculate stress level
    const stressLevel = Math.max(0, Math.min(1, 
      (heartRate - this.baseHeartRate) / 40 + 
      facialExpression.fear * 0.3 + 
      facialExpression.anger * 0.4
    ));

    // Generate eye tracking data
    const eyeTracking: EyeData = {
      x: mouseX,
      y: mouseY,
      pupilDilation: 0.5 + stressLevel * 0.3 + emotionalInfluence * 0.2,
      blinkRate: 15 + stressLevel * 10 + Math.sin(time * 2) * 3,
      gazeDuration: 2.5 + Math.random() * 3,
      attention: facialExpression.engagement
    };

    // Generate brainwave patterns
    const brainwaveData: BrainwaveData = {
      alpha: 0.3 + (1 - stressLevel) * 0.4 + Math.sin(time * 0.1) * 0.1,
      beta: 0.4 + facialExpression.engagement * 0.3 + Math.sin(time * 0.2) * 0.1,
      theta: 0.2 + (1 - facialExpression.engagement) * 0.2,
      delta: 0.1 + Math.sin(time * 0.05) * 0.05,
      gamma: facialExpression.engagement * 0.3 + Math.sin(time * 0.3) * 0.1
    };

    // Generate voice analysis (simulated)
    const voiceData: VoiceData = {
      pitch: 150 + stressLevel * 50 + emotionalInfluence * 30,
      tone: this.emotionalState.primary,
      stress: stressLevel,
      emotion: this.emotionalState.primary,
      confidence: this.emotionalState.confidence
    };

    return {
      heartRate: Math.round(heartRate),
      stressLevel,
      emotionalState: this.emotionalState,
      eyeTracking,
      facialExpression,
      voiceAnalysis: voiceData,
      brainwavePattern: brainwaveData
    };
  }

  private getEmotionalInfluence(): number {
    const stressors = {
      anxious: 0.8,
      excited: 0.6,
      focused: 0.2,
      tired: -0.3,
      calm: -0.2,
      confused: 0.4
    };
    return stressors[this.emotionalState.primary] || 0;
  }

  updateEmotionalState(newState: EmotionalState): void {
    this.emotionalState = newState;
  }
}

// Neural interface adaptive UI component
function AdaptiveUIElement({ 
  children, 
  biometricData, 
  adaptationType = 'all' 
}: { 
  children: React.ReactNode;
  biometricData: BiometricData;
  adaptationType?: 'color' | 'size' | 'animation' | 'all';
}) {
  const controls = useAnimation();

  useEffect(() => {
    const { emotionalState, stressLevel, heartRate } = biometricData;
    
    // Adapt colors based on emotional state
    const getAdaptiveColors = () => {
      switch (emotionalState.primary) {
        case 'calm':
          return {
            background: 'linear-gradient(135deg, #10b981, #059669)',
            border: '#059669',
            text: '#ffffff'
          };
        case 'anxious':
          return {
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            border: '#d97706',
            text: '#ffffff'
          };
        case 'focused':
          return {
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            border: '#2563eb',
            text: '#ffffff'
          };
        case 'excited':
          return {
            background: 'linear-gradient(135deg, #ec4899, #be185d)',
            border: '#be185d',
            text: '#ffffff'
          };
        case 'tired':
          return {
            background: 'linear-gradient(135deg, #6b7280, #4b5563)',
            border: '#4b5563',
            text: '#ffffff'
          };
        default:
          return {
            background: 'linear-gradient(135deg, #2F6DB6, #1e40af)',
            border: '#1e40af',
            text: '#ffffff'
          };
      }
    };

    // Adapt animation speed based on stress and heart rate
    const getAnimationSpeed = () => {
      const baseSpeed = 1;
      const stressMultiplier = 1 + stressLevel * 2;
      const heartRateMultiplier = 1 + (heartRate - 70) / 100;
      return baseSpeed * stressMultiplier * heartRateMultiplier;
    };

    // Adapt size based on attention and engagement
    const getAdaptiveScale = () => {
      const baseScale = 1;
      const attentionScale = 0.9 + biometricData.eyeTracking.attention * 0.2;
      const engagementScale = 0.95 + biometricData.facialExpression.engagement * 0.1;
      return baseScale * attentionScale * engagementScale;
    };

    const colors = getAdaptiveColors();
    const animationSpeed = getAnimationSpeed();
    const scale = getAdaptiveScale();

    controls.start({
      background: adaptationType === 'all' || adaptationType === 'color' ? colors.background : undefined,
      borderColor: adaptationType === 'all' || adaptationType === 'color' ? colors.border : undefined,
      scale: adaptationType === 'all' || adaptationType === 'size' ? scale : 1,
      transition: {
        duration: 0.5 / animationSpeed,
        ease: 'easeOut'
      }
    });

  }, [biometricData, adaptationType, controls]);

  return (
    <motion.div
      animate={controls}
      className="rounded-xl p-4 border-2 transition-all duration-500"
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  );
}

// Brainwave visualization component
function BrainwaveVisualizer({ brainwaveData }: { brainwaveData: BrainwaveData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw brainwave patterns
    const waves = [
      { name: 'Delta', value: brainwaveData.delta, color: '#8b5cf6', frequency: 1 },
      { name: 'Theta', value: brainwaveData.theta, color: '#06b6d4', frequency: 2 },
      { name: 'Alpha', value: brainwaveData.alpha, color: '#10b981', frequency: 3 },
      { name: 'Beta', value: brainwaveData.beta, color: '#f59e0b', frequency: 4 },
      { name: 'Gamma', value: brainwaveData.gamma, color: '#ef4444', frequency: 5 }
    ];

    const time = Date.now() / 1000;

    waves.forEach((wave, index) => {
      ctx.strokeStyle = wave.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();

      const yOffset = (height / waves.length) * index + (height / waves.length) / 2;
      
      for (let x = 0; x < width; x++) {
        const frequency = wave.frequency * wave.value;
        const amplitude = wave.value * 30;
        const y = yOffset + Math.sin((x / 20 + time * frequency)) * amplitude;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
    });

    ctx.globalAlpha = 1;

  }, [brainwaveData]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        className="w-full h-32 bg-black rounded-lg border border-gray-700"
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-white text-xs opacity-50">Neural Activity Pattern</div>
      </div>
    </div>
  );
}

// Main Biometric Interface Component
export default function BiometricInterface() {
  const [biometricData, setBiometricData] = useState<BiometricData | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [emotionEngine] = useState(() => new EmotionRecognitionEngine(useRef<HTMLVideoElement>(null)));
  const [biometricSim] = useState(() => new BiometricSimulator());
  const videoRef = useRef<HTMLVideoElement>(null);
  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Track mouse movement for eye tracking simulation
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    setMousePosition({ x, y });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Start biometric monitoring
  const startMonitoring = async () => {
    setIsMonitoring(true);
    emotionEngine.startAnalysis();

    // Start webcam (simulated - in real implementation this would access the camera)
    try {
      if (videoRef.current) {
        // In a real implementation, this would start the camera
        // const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.log('Camera access not available - using simulation');
    }

    // Start monitoring loop
    monitoringIntervalRef.current = setInterval(async () => {
      const facialExpression = await emotionEngine.analyzeFrame();
      const emotionalState = emotionEngine.determineEmotionalState(facialExpression);
      biometricSim.updateEmotionalState(emotionalState);
      
      const data = biometricSim.generateBiometricData(
        mousePosition.x,
        mousePosition.y,
        facialExpression
      );
      
      setBiometricData(data);
    }, 100); // 10 FPS monitoring
  };

  // Stop biometric monitoring
  const stopMonitoring = () => {
    setIsMonitoring(false);
    emotionEngine.stopAnalysis();
    
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  if (!biometricData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl font-bold text-white mb-8">Neural Biometric Interface</h1>
          <motion.button
            onClick={startMonitoring}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Biometric Monitoring
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            Neural Biometric Healthcare Interface
          </motion.h1>
          <p className="text-gray-300 text-xl">
            Real-time biometric adaptation for enhanced healthcare experiences
          </p>
        </div>

        {/* Real-time Biometric Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Heart Rate Monitor */}
          <AdaptiveUIElement biometricData={biometricData} adaptationType="color">
            <div className="text-center">
              <motion.div
                className="text-3xl font-bold text-white mb-2"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 60 / biometricData.heartRate,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                {biometricData.heartRate}
              </motion.div>
              <div className="text-white/70 text-sm">BPM</div>
              <div className="text-white/50 text-xs mt-1">Heart Rate</div>
            </div>
          </AdaptiveUIElement>

          {/* Stress Level */}
          <AdaptiveUIElement biometricData={biometricData} adaptationType="animation">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-white/30"
                  animate={{
                    rotate: 360
                  }}
                  transition={{
                    duration: 2 - biometricData.stressLevel,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
                <div className="absolute inset-2 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {Math.round(biometricData.stressLevel * 100)}%
                  </span>
                </div>
              </div>
              <div className="text-white/50 text-xs">Stress Level</div>
            </div>
          </AdaptiveUIElement>

          {/* Emotional State */}
          <AdaptiveUIElement biometricData={biometricData} adaptationType="all">
            <div className="text-center">
              <motion.div
                className="text-2xl mb-2"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                {getEmotionEmoji(biometricData.emotionalState.primary)}
              </motion.div>
              <div className="text-white font-semibold capitalize">
                {biometricData.emotionalState.primary}
              </div>
              <div className="text-white/70 text-xs">
                {Math.round(biometricData.emotionalState.intensity * 100)}% intensity
              </div>
            </div>
          </AdaptiveUIElement>

          {/* Attention Level */}
          <AdaptiveUIElement biometricData={biometricData} adaptationType="size">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                  animate={{
                    scale: [1, 1 + biometricData.eyeTracking.attention * 0.3, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
                <div className="absolute inset-2 rounded-full bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {Math.round(biometricData.eyeTracking.attention * 100)}%
                  </span>
                </div>
              </div>
              <div className="text-white/50 text-xs">Attention</div>
            </div>
          </AdaptiveUIElement>
        </div>

        {/* Brainwave Visualization */}
        <motion.div
          className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Neural Activity Patterns</h3>
          <BrainwaveVisualizer brainwaveData={biometricData.brainwavePattern} />
          
          <div className="grid grid-cols-5 gap-4 mt-4">
            {Object.entries(biometricData.brainwavePattern).map(([wave, value]) => (
              <div key={wave} className="text-center">
                <motion.div
                  className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${value * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
                <div className="text-white text-xs capitalize">{wave}</div>
                <div className="text-white/70 text-xs">{(value * 100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Adaptive Healthcare Interface */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Care Plan Adaptation */}
          <AdaptiveUIElement biometricData={biometricData}>
            <h4 className="text-xl font-bold text-white mb-4">Adaptive Care Plan</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-white">
                <span>Medication Reminder</span>
                <motion.div
                  className="w-3 h-3 rounded-full bg-green-400"
                  animate={{
                    opacity: [1, 0.3, 1],
                  }}
                  transition={{
                    duration: 2 - biometricData.emotionalState.intensity,
                    repeat: Infinity
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-white">
                <span>Therapy Session</span>
                <span className="text-sm opacity-70">
                  {biometricData.emotionalState.primary === 'anxious' ? 'High Priority' : 'Scheduled'}
                </span>
              </div>
              <div className="flex items-center justify-between text-white">
                <span>Activity Level</span>
                <span className="text-sm opacity-70">
                  {biometricData.stressLevel > 0.7 ? 'Reduce' : 'Normal'}
                </span>
              </div>
            </div>
          </AdaptiveUIElement>

          {/* Interface Controls */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <h4 className="text-xl font-bold text-white mb-4">Neural Controls</h4>
            <div className="space-y-4">
              <motion.button
                onClick={stopMonitoring}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Stop Monitoring
              </motion.button>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/10 rounded-lg">
                  <div className="text-white font-bold">
                    {Math.round(biometricData.eyeTracking.pupilDilation * 100)}%
                  </div>
                  <div className="text-white/70 text-xs">Pupil Dilation</div>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-lg">
                  <div className="text-white font-bold">
                    {Math.round(biometricData.eyeTracking.blinkRate)}
                  </div>
                  <div className="text-white/70 text-xs">Blinks/min</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hidden camera element for future implementation */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="hidden"
        />
      </motion.div>
    </div>
  );
}

// Helper function to get emotion emoji
function getEmotionEmoji(emotion: string): string {
  const emojis = {
    calm: '😌',
    anxious: '😰',
    focused: '🎯',
    excited: '🤩',
    tired: '😴',
    confused: '🤔'
  };
  return emojis[emotion as keyof typeof emojis] || '😐';
}