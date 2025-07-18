'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  EyeIcon,
  FingerPrintIcon,
  MicrophoneIcon,
  FaceSmileIcon,
  ShieldCheckIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CogIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';

interface BiometricFeature {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  status: 'active' | 'inactive' | 'calibrating';
  accuracy: number;
  color: string;
}

interface AccessibilityProfile {
  id: string;
  name: string;
  features: string[];
  preferences: {
    fontSize: number;
    contrast: 'normal' | 'high' | 'inverted';
    voiceSpeed: number;
    motionSensitivity: number;
  };
}

const biometricFeatures: BiometricFeature[] = [
  {
    id: 'eye_tracking',
    name: 'Eye Tracking Navigation',
    icon: EyeIcon,
    description: 'Navigate using eye movements and blink patterns for hands-free interaction',
    status: 'active',
    accuracy: 94.2,
    color: '#3b82f6'
  },
  {
    id: 'fingerprint',
    name: 'Fingerprint Authentication',
    icon: FingerPrintIcon,
    description: 'Secure biometric authentication for privacy and personalized settings',
    status: 'active',
    accuracy: 99.1,
    color: '#059669'
  },
  {
    id: 'voice_print',
    name: 'Voice Pattern Recognition',
    icon: MicrophoneIcon,
    description: 'Identify users by unique voice patterns for automatic customization',
    status: 'calibrating',
    accuracy: 91.7,
    color: '#dc2626'
  },
  {
    id: 'facial_emotion',
    name: 'Facial Emotion Detection',
    icon: FaceSmileIcon,
    description: 'Detect emotional state to adjust interface tone and recommendations',
    status: 'inactive',
    accuracy: 87.3,
    color: '#7c3aed'
  },
  {
    id: 'gesture_control',
    name: 'Gesture Recognition',
    icon: AdjustmentsHorizontalIcon,
    description: 'Control interface using hand gestures and body movements',
    status: 'active',
    accuracy: 92.8,
    color: '#ea580c'
  }
];

const accessibilityProfiles: AccessibilityProfile[] = [
  {
    id: 'visual_impaired',
    name: 'Visual Assistance',
    features: ['voice_print', 'gesture_control'],
    preferences: {
      fontSize: 18,
      contrast: 'high',
      voiceSpeed: 0.8,
      motionSensitivity: 0.3
    }
  },
  {
    id: 'motor_limited',
    name: 'Motor Assistance',
    features: ['eye_tracking', 'voice_print'],
    preferences: {
      fontSize: 16,
      contrast: 'normal',
      voiceSpeed: 1.0,
      motionSensitivity: 0.7
    }
  },
  {
    id: 'cognitive_support',
    name: 'Cognitive Support',
    features: ['facial_emotion', 'voice_print'],
    preferences: {
      fontSize: 20,
      contrast: 'normal',
      voiceSpeed: 0.6,
      motionSensitivity: 0.2
    }
  }
];

export default function BiometricAccessibility() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<AccessibilityProfile | null>(null);
  const [calibratingFeature, setCalibratingFeature] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<{ [key: string]: 'granted' | 'denied' | 'prompt' }>({});
  const [isScanning, setIsScanning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Simulate permission checks
    const checkPermissions = async () => {
      const permissions = {
        camera: 'prompt',
        microphone: 'prompt',
        sensor: 'granted'
      };
      setPermissionStatus(permissions as any);
    };

    if (isOpen) {
      checkPermissions();
    }
  }, [isOpen]);

  useEffect(() => {
    // Simulate biometric scanning animation
    if (isScanning && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const animateScanner = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw scanning grid
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        
        for (let i = 0; i <= canvas.width; i += 20) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }
        
        for (let i = 0; i <= canvas.height; i += 20) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvas.width, i);
          ctx.stroke();
        }
        
        // Draw scanning line
        const time = Date.now() * 0.003;
        const scanY = (Math.sin(time) + 1) * 0.5 * canvas.height;
        
        ctx.globalAlpha = 0.8;
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(canvas.width, scanY);
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowColor = '#3b82f6';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      };

      const interval = setInterval(animateScanner, 50);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  const requestPermission = async (feature: string) => {
    setCalibratingFeature(feature);
    setIsScanning(true);
    
    // Simulate permission request and calibration
    setTimeout(() => {
      setPermissionStatus(prev => ({
        ...prev,
        [feature]: 'granted'
      }));
      setCalibratingFeature(null);
      setIsScanning(false);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500';
      case 'calibrating':
        return 'text-yellow-500';
      case 'inactive':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'calibrating':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <CogIcon className="w-4 h-4 text-yellow-500" />
          </motion.div>
        );
      case 'inactive':
        return <XMarkIcon className="w-4 h-4 text-gray-400" />;
      default:
        return <XMarkIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <>
      {/* Accessibility Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-50 w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: isOpen 
            ? '0 0 30px rgba(147, 51, 234, 0.5)' 
            : '0 8px 32px rgba(147, 51, 234, 0.3)'
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <XMarkIcon className="w-8 h-8 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="accessibility"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ShieldCheckIcon className="w-8 h-8 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Accessibility Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-24 left-6 z-40 w-96 h-[32rem] bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <ShieldCheckIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Biometric Accessibility</h3>
                  <p className="text-sm opacity-90">Advanced assistance features</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 h-80 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
              {/* Biometric Features */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                  Biometric Features
                </h4>
                <div className="space-y-3">
                  {biometricFeatures.map((feature, index) => (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${feature.color}20` }}
                          >
                            <feature.icon 
                              className="w-4 h-4"
                              style={{ color: feature.color }}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white text-sm">
                              {feature.name}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">
                              Accuracy: {feature.accuracy}%
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(feature.status)}
                          {feature.status === 'inactive' && (
                            <motion.button
                              onClick={() => requestPermission(feature.id)}
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Enable
                            </motion.button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Accessibility Profiles */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                  Quick Profiles
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {accessibilityProfiles.map((profile, index) => (
                    <motion.button
                      key={profile.id}
                      onClick={() => setSelectedProfile(profile)}
                      className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 text-left hover:bg-white/90 dark:hover:bg-gray-800/90 transition-colors border border-gray-200 dark:border-gray-700"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <UserIcon className="w-5 h-5 text-purple-600" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white text-sm">
                            {profile.name}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {profile.features.length} features active
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Scanning Interface */}
              {isScanning && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-700"
                >
                  <div className="text-center mb-3">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 text-sm">
                      Calibrating Biometric Feature
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Please follow the on-screen instructions
                    </p>
                  </div>
                  
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      width={200}
                      height={100}
                      className="w-full h-24 bg-gray-100 dark:bg-gray-800 rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-8 h-8 border-2 border-blue-500 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Settings */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50">
              <div className="grid grid-cols-3 gap-2">
                <motion.button
                  className="flex flex-col items-center gap-1 p-2 bg-white/80 dark:bg-gray-800/80 rounded-lg hover:bg-white/90 dark:hover:bg-gray-800/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SunIcon className="w-4 h-4 text-yellow-600" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">High Contrast</span>
                </motion.button>
                
                <motion.button
                  className="flex flex-col items-center gap-1 p-2 bg-white/80 dark:bg-gray-800/80 rounded-lg hover:bg-white/90 dark:hover:bg-gray-800/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SpeakerWaveIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">Audio Cues</span>
                </motion.button>
                
                <motion.button
                  className="flex flex-col items-center gap-1 p-2 bg-white/80 dark:bg-gray-800/80 rounded-lg hover:bg-white/90 dark:hover:bg-gray-800/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AdjustmentsHorizontalIcon className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-700 dark:text-gray-300">Motion</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Detail Modal */}
      <AnimatePresence>
        {selectedProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedProfile(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {selectedProfile.name}
                </h3>
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Active Features</h4>
                  <div className="space-y-2">
                    {selectedProfile.features.map(featureId => {
                      const feature = biometricFeatures.find(f => f.id === featureId);
                      return feature ? (
                        <div key={featureId} className="flex items-center gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {feature.name}
                          </span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Preferences</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <span className="text-gray-600 dark:text-gray-400">Font Size</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {selectedProfile.preferences.fontSize}px
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <span className="text-gray-600 dark:text-gray-400">Contrast</span>
                      <div className="font-medium text-gray-900 dark:text-white capitalize">
                        {selectedProfile.preferences.contrast}
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <span className="text-gray-600 dark:text-gray-400">Voice Speed</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {selectedProfile.preferences.voiceSpeed}x
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <span className="text-gray-600 dark:text-gray-400">Motion</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {Math.round(selectedProfile.preferences.motionSensitivity * 100)}%
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    // Apply profile settings
                    setSelectedProfile(null);
                  }}
                >
                  Apply Profile
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}