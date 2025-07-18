'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { 
  CubeIcon,
  EyeIcon,
  CameraIcon,
  GlobeAltIcon,
  PhoneArrowUpRightIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  InformationCircleIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  SparklesIcon,
  ArrowsPointingOutIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon
} from '@heroicons/react/24/outline';

interface ARFeature {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  description: string;
  category: 'room' | 'equipment' | 'safety' | 'amenity';
  color: string;
  details: string[];
}

interface ARScene {
  id: string;
  name: string;
  description: string;
  preview: string;
  features: ARFeature[];
}

const arScenes: ARScene[] = [
  {
    id: 'living_room',
    name: 'Community Living Room',
    description: 'Interactive 3D view of our main community space',
    preview: '/pics/IMG_5465.webp',
    features: [
      {
        id: 'accessible_seating',
        name: 'Accessible Seating Area',
        position: { x: 0.3, y: 0.4, z: 0.5 },
        description: 'Specially designed furniture for comfort and accessibility',
        category: 'amenity',
        color: '#3b82f6',
        details: [
          'Height-adjustable chairs',
          'Support cushions available',
          'Easy transfer design',
          'Non-slip surfaces'
        ]
      },
      {
        id: 'entertainment_center',
        name: 'Entertainment System',
        position: { x: 0.7, y: 0.3, z: 0.6 },
        description: 'Large screen TV and audio system for group activities',
        category: 'equipment',
        color: '#059669',
        details: [
          '65-inch accessible TV',
          'Hearing loop system',
          'Voice control enabled',
          'Multiple input options'
        ]
      },
      {
        id: 'emergency_call',
        name: 'Emergency Call Station',
        position: { x: 0.1, y: 0.2, z: 0.3 },
        description: '24/7 emergency communication system',
        category: 'safety',
        color: '#dc2626',
        details: [
          'Direct staff connection',
          'Visual and audio alerts',
          'Wheelchair accessible',
          'Battery backup system'
        ]
      }
    ]
  },
  {
    id: 'resident_room',
    name: 'Private Resident Room',
    description: 'Personal living space designed for independence',
    preview: '/pics/IMG_5471.webp',
    features: [
      {
        id: 'adjustable_bed',
        name: 'Medical-Grade Bed',
        position: { x: 0.6, y: 0.5, z: 0.4 },
        description: 'Hospital-grade adjustable bed with safety features',
        category: 'equipment',
        color: '#7c3aed',
        details: [
          'Electric height adjustment',
          'Side rail safety system',
          'Pressure relief mattress',
          'Nurse call integration'
        ]
      },
      {
        id: 'personal_bathroom',
        name: 'Accessible Bathroom',
        position: { x: 0.8, y: 0.7, z: 0.2 },
        description: 'Fully accessible private bathroom',
        category: 'room',
        color: '#0891b2',
        details: [
          'Roll-in shower',
          'Grab bars installed',
          'Raised toilet seat',
          'Emergency pull cord'
        ]
      },
      {
        id: 'personal_storage',
        name: 'Personal Storage',
        position: { x: 0.2, y: 0.6, z: 0.8 },
        description: 'Secure storage for personal belongings',
        category: 'amenity',
        color: '#ea580c',
        details: [
          'Lockable wardrobes',
          'Accessible height shelving',
          'Personal safe',
          'Medication storage'
        ]
      }
    ]
  },
  {
    id: 'dining_area',
    name: 'Dining & Kitchen Area',
    description: 'Nutritious meal preparation and social dining space',
    preview: '/pics/IMG_5468.webp',
    features: [
      {
        id: 'adaptive_kitchen',
        name: 'Adaptive Kitchen',
        position: { x: 0.2, y: 0.3, z: 0.7 },
        description: 'Fully accessible kitchen for meal preparation',
        category: 'equipment',
        color: '#059669',
        details: [
          'Adjustable countertops',
          'Accessible appliances',
          'Safety shut-off systems',
          'Non-slip flooring'
        ]
      },
      {
        id: 'dining_tables',
        name: 'Accessible Dining Tables',
        position: { x: 0.6, y: 0.5, z: 0.4 },
        description: 'Height-adjustable tables for wheelchair access',
        category: 'amenity',
        color: '#3b82f6',
        details: [
          'Wheelchair accessible height',
          'Rounded safety edges',
          'Easy-clean surfaces',
          'Stable base design'
        ]
      }
    ]
  }
];

export default function ARFacilityPreview() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedScene, setSelectedScene] = useState<ARScene | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<ARFeature | null>(null);
  const [isARActive, setIsARActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isRotating, setIsRotating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isARActive && canvasRef.current) {
      // Simulate AR rendering
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const renderARScene = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw AR background grid
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.2;
        
        for (let i = 0; i <= canvas.width; i += 40) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }
        
        for (let i = 0; i <= canvas.height; i += 40) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvas.width, i);
          ctx.stroke();
        }
        
        // Draw AR features if scene is selected
        if (selectedScene) {
          selectedScene.features.forEach((feature, index) => {
            const x = feature.position.x * canvas.width;
            const y = feature.position.y * canvas.height;
            const size = 8 + Math.sin(Date.now() * 0.003 + index) * 2;
            
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = feature.color;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add pulsing effect
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(x, y, size * 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Add label
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Inter, sans-serif';
            ctx.fillText(feature.name, x + 15, y + 5);
          });
        }
      };

      const interval = setInterval(renderARScene, 50);
      return () => clearInterval(interval);
    }
  }, [isARActive, selectedScene]);

  useEffect(() => {
    if (isRotating) {
      const interval = setInterval(() => {
        setRotation(prev => ({ x: prev.x, y: prev.y + 1 }));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isRotating]);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission('granted');
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error: any) {
      console.error('Camera permission error:', error);
      setCameraPermission('denied');
      if (error.name === 'NotAllowedError') {
        alert('Camera access denied. Please allow camera access to use AR features.');
      } else if (error.name === 'NotFoundError') {
        alert('No camera found on this device. AR features are not available.');
      } else if (error.name === 'NotReadableError') {
        alert('Camera is already in use by another application.');
      } else {
        alert('Unable to access camera. Please check your device settings.');
      }
    }
  };

  const startARView = async () => {
    if (cameraPermission === 'prompt') {
      await requestCameraPermission();
    }
    if (cameraPermission === 'granted') {
      setIsARActive(true);
    }
  };

  const stopARView = () => {
    setIsARActive(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => {
        track.stop();
        console.log('Camera track stopped:', track.kind);
      });
      videoRef.current.srcObject = null;
    }
    setCameraPermission('prompt'); // Reset permission state
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'room':
        return <CubeIcon className="w-4 h-4" />;
      case 'equipment':
        return <AdjustmentsHorizontalIcon className="w-4 h-4" />;
      case 'safety':
        return <PhoneArrowUpRightIcon className="w-4 h-4" />;
      case 'amenity':
        return <SparklesIcon className="w-4 h-4" />;
      default:
        return <InformationCircleIcon className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* AR Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-36 right-6 z-50 w-14 h-14 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full shadow-xl flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: isOpen 
            ? '0 0 30px rgba(6, 182, 212, 0.5)' 
            : '0 8px 25px rgba(6, 182, 212, 0.3)'
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
              <XMarkIcon className="w-7 h-7 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="ar"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CubeIcon className="w-7 h-7 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* AR Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-4 z-40 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <CubeIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">AR Facility Preview</h3>
                    <p className="text-sm opacity-90">
                      {isARActive ? 'AR Mode Active' : 'Immersive 3D Virtual Tour'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isARActive ? (
                    <motion.button
                      onClick={startARView}
                      className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CameraIcon className="w-4 h-4" />
                      Enable AR
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={stopARView}
                      className="px-4 py-2 bg-red-500/80 rounded-lg hover:bg-red-500 transition-colors flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <XMarkIcon className="w-4 h-4" />
                      Stop AR
                    </motion.button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex h-full">
              {/* Scene Selection Sidebar */}
              <div className="w-80 bg-gray-50/50 dark:bg-gray-900/50 p-4 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Virtual Spaces
                </h4>
                
                <div className="space-y-3">
                  {arScenes.map((scene, index) => (
                    <motion.button
                      key={scene.id}
                      onClick={() => setSelectedScene(scene)}
                      className={`w-full text-left p-4 rounded-xl transition-all ${
                        selectedScene?.id === scene.id
                          ? 'bg-cyan-100 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-700'
                          : 'bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800'
                      } border border-gray-200 dark:border-gray-700`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="aspect-video bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900 dark:to-blue-900 rounded-lg mb-3 flex items-center justify-center">
                        <CubeIcon className="w-8 h-8 text-cyan-600" />
                      </div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                        {scene.name}
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {scene.description}
                      </p>
                      <div className="mt-2 text-xs text-cyan-600 dark:text-cyan-400">
                        {scene.features.length} interactive features
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* AR Controls */}
                {selectedScene && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700"
                  >
                    <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                      View Controls
                    </h5>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-300 mb-1 block">
                          Zoom: {zoom.toFixed(1)}x
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                          >
                            <MagnifyingGlassMinusIcon className="w-4 h-4" />
                          </button>
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-cyan-600 h-2 rounded-full transition-all"
                              style={{ width: `${((zoom - 0.5) / 2.5) * 100}%` }}
                            />
                          </div>
                          <button
                            onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                          >
                            <MagnifyingGlassPlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsRotating(!isRotating)}
                          className={`flex-1 p-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                            isRotating 
                              ? 'bg-cyan-600 text-white' 
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {isRotating ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                          {isRotating ? 'Pause' : 'Rotate'}
                        </button>
                        <button
                          onClick={() => {
                            setRotation({ x: 0, y: 0 });
                            setZoom(1);
                          }}
                          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          <ArrowPathIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Main AR/3D View */}
              <div className="flex-1 relative">
                {selectedScene ? (
                  <div className="h-full relative">
                    {/* AR Canvas/Video */}
                    <div className="absolute inset-0">
                      {isARActive ? (
                        <>
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                          <canvas
                            ref={canvasRef}
                            width={800}
                            height={600}
                            className="absolute inset-0 w-full h-full"
                          />
                        </>
                      ) : (
                        <div 
                          className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden"
                          style={{
                            transform: `scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                            transformOrigin: 'center center'
                          }}
                        >
                          {/* 3D Scene Simulation */}
                          <div className="absolute inset-0 opacity-20">
                            <svg className="w-full h-full" viewBox="0 0 800 600">
                              <defs>
                                <pattern id="grid3d" width="40" height="40" patternUnits="userSpaceOnUse">
                                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                                </pattern>
                              </defs>
                              <rect width="100%" height="100%" fill="url(#grid3d)" />
                              
                              {/* 3D Room outline */}
                              <path
                                d="M 100 150 L 700 150 L 700 450 L 100 450 Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <path
                                d="M 100 150 L 150 100 L 750 100 L 700 150"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <path
                                d="M 700 150 L 750 100 L 750 400 L 700 450"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                            </svg>
                          </div>

                          {/* Interactive Features */}
                          {selectedScene.features.map((feature, index) => (
                            <motion.button
                              key={feature.id}
                              className="absolute w-6 h-6 rounded-full shadow-lg border-2 border-white flex items-center justify-center hover:scale-125 transition-transform"
                              style={{
                                backgroundColor: feature.color,
                                left: `${feature.position.x * 100}%`,
                                top: `${feature.position.y * 100}%`,
                                transform: 'translate(-50%, -50%)'
                              }}
                              onClick={() => setSelectedFeature(feature)}
                              animate={{
                                scale: [1, 1.2, 1],
                                boxShadow: [
                                  `0 0 0 0 ${feature.color}40`,
                                  `0 0 0 15px ${feature.color}00`,
                                  `0 0 0 0 ${feature.color}00`
                                ]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: index * 0.3
                              }}
                            >
                              {getCategoryIcon(feature.category)}
                            </motion.button>
                          ))}

                          {/* Scene Title */}
                          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md rounded-lg p-3">
                            <h3 className="text-white font-bold">{selectedScene.name}</h3>
                            <p className="text-white/80 text-sm">{selectedScene.description}</p>
                          </div>

                          {/* Fullscreen Button */}
                          <button className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-lg text-white hover:bg-black/70 transition-colors">
                            <ArrowsPointingOutIcon className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Feature Details Overlay */}
                    <AnimatePresence>
                      {selectedFeature && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${selectedFeature.color}20` }}
                              >
                                <div style={{ color: selectedFeature.color }}>
                                  {getCategoryIcon(selectedFeature.category)}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">
                                  {selectedFeature.name}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {selectedFeature.description}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedFeature(null)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                            >
                              <XMarkIcon className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {selectedFeature.details.map((detail, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                              >
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedFeature.color }} />
                                {detail}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <EyeIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">Select a Space to Explore</h3>
                      <p>Choose a room from the sidebar to begin your virtual tour</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-cyan-600/90 to-blue-600/90 backdrop-blur-md p-3">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2 text-sm">
                  <InformationCircleIcon className="w-4 h-4" />
                  {isARActive ? 'Use your device camera to place 3D elements in your space' : 'Click hotspots to explore features and amenities'}
                </div>
                <div className="text-xs opacity-75">
                  Powered by Advanced AR Technology
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}