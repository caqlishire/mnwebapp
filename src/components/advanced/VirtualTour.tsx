'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeIcon,
  XMarkIcon,
  InformationCircleIcon,
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

interface TourStop {
  id: string;
  title: string;
  description: string;
  image: string;
  audio?: string;
  hotspots: Hotspot[];
  duration: number;
}

interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tourStops: TourStop[] = [
  {
    id: 'entrance',
    title: 'Main Entrance & Reception',
    description: 'Welcome to MN Group Home LLC. Our modern reception area provides a warm, welcoming environment for residents, families, and visitors.',
    image: '/pics/IMG_5462.webp',
    duration: 30,
    hotspots: [
      {
        id: 'reception-desk',
        x: 35,
        y: 60,
        title: 'Reception Desk',
        description: '24/7 staffed reception desk for assistance and check-ins',
        icon: InformationCircleIcon
      },
      {
        id: 'waiting-area',
        x: 65,
        y: 45,
        title: 'Family Waiting Area',
        description: 'Comfortable seating area for families and visitors',
        icon: UserGroupIcon
      }
    ]
  },
  {
    id: 'living-room',
    title: 'Community Living Room',
    description: 'Our spacious community living room is designed for social interaction, recreational activities, and relaxation.',
    image: '/pics/IMG_5465.webp',
    duration: 45,
    hotspots: [
      {
        id: 'entertainment-center',
        x: 25,
        y: 30,
        title: 'Entertainment Center',
        description: 'Large screen TV and audio system for group activities',
        icon: PlayIcon
      },
      {
        id: 'seating-area',
        x: 60,
        y: 55,
        title: 'Comfortable Seating',
        description: 'Ergonomic furniture designed for accessibility and comfort',
        icon: HomeIcon
      },
      {
        id: 'activity-space',
        x: 80,
        y: 70,
        title: 'Activity Space',
        description: 'Open area for group activities and social gatherings',
        icon: UserGroupIcon
      }
    ]
  },
  {
    id: 'dining-room',
    title: 'Dining Area',
    description: 'Our dining area promotes social dining experiences and accommodates various dietary needs and preferences.',
    image: '/pics/IMG_5468.webp',
    duration: 35,
    hotspots: [
      {
        id: 'dining-tables',
        x: 50,
        y: 50,
        title: 'Accessible Dining Tables',
        description: 'Height-adjustable tables accommodate wheelchairs and various needs',
        icon: HomeIcon
      },
      {
        id: 'serving-area',
        x: 20,
        y: 35,
        title: 'Serving Station',
        description: 'Professional food service area with safety protocols',
        icon: HeartIcon
      }
    ]
  },
  {
    id: 'bedroom',
    title: 'Private Resident Room',
    description: 'Each resident enjoys a private, personalized room designed for comfort, privacy, and independence.',
    image: '/pics/IMG_5471.webp',
    duration: 40,
    hotspots: [
      {
        id: 'bed-area',
        x: 65,
        y: 60,
        title: 'Accessible Bed',
        description: 'Hospital-grade adjustable bed with safety features',
        icon: HeartIcon
      },
      {
        id: 'personal-space',
        x: 30,
        y: 40,
        title: 'Personal Living Space',
        description: 'Area for personal belongings and activities',
        icon: HomeIcon
      },
      {
        id: 'ensuite',
        x: 85,
        y: 25,
        title: 'Private Bathroom',
        description: 'Fully accessible private bathroom with safety features',
        icon: HomeIcon
      }
    ]
  },
  {
    id: 'therapy-room',
    title: 'Therapy & Activities Room',
    description: 'Dedicated space for therapeutic activities, skills training, and educational programs.',
    image: '/pics/IMG_5476.webp',
    duration: 50,
    hotspots: [
      {
        id: 'therapy-equipment',
        x: 40,
        y: 35,
        title: 'Therapy Equipment',
        description: 'Professional therapy and rehabilitation equipment',
        icon: AcademicCapIcon
      },
      {
        id: 'learning-area',
        x: 70,
        y: 55,
        title: 'Learning Station',
        description: 'Interactive learning and skills development area',
        icon: AcademicCapIcon
      }
    ]
  },
  {
    id: 'kitchen',
    title: 'Accessible Kitchen',
    description: 'Our fully accessible kitchen allows residents to participate in meal preparation and learn independent living skills.',
    image: '/pics/IMG_5473.webp',
    duration: 35,
    hotspots: [
      {
        id: 'adaptive-counters',
        x: 45,
        y: 50,
        title: 'Adaptive Countertops',
        description: 'Height-adjustable countertops for wheelchair accessibility',
        icon: HomeIcon
      },
      {
        id: 'safety-features',
        x: 70,
        y: 30,
        title: 'Safety Features',
        description: 'Auto shut-off appliances and non-slip flooring for safety',
        icon: HeartIcon
      }
    ]
  },
  {
    id: 'outdoor-area',
    title: 'Outdoor Recreation Area',
    description: 'Beautiful outdoor spaces for recreation, gardening, and enjoying fresh air in a safe, accessible environment.',
    image: '/pics/IMG_5479.webp',
    duration: 30,
    hotspots: [
      {
        id: 'garden-area',
        x: 30,
        y: 60,
        title: 'Therapeutic Garden',
        description: 'Raised garden beds for horticultural therapy and recreation',
        icon: HeartIcon
      },
      {
        id: 'seating-area',
        x: 60,
        y: 40,
        title: 'Outdoor Seating',
        description: 'Comfortable seating areas for socializing and relaxation',
        icon: UserGroupIcon
      }
    ]
  }
];

export default function VirtualTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStop, setCurrentStop] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [progress, setProgress] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isPlaying && isOpen) {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= tourStops[currentStop].duration) {
            // Auto-advance to next stop
            if (currentStop < tourStops.length - 1) {
              setCurrentStop(prev => prev + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return tourStops[currentStop].duration;
            }
          }
          return newProgress;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isOpen, currentStop]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const goToNextStop = () => {
    if (currentStop < tourStops.length - 1) {
      setCurrentStop(prev => prev + 1);
      setProgress(0);
    }
  };

  const goToPrevStop = () => {
    if (currentStop > 0) {
      setCurrentStop(prev => prev - 1);
      setProgress(0);
    }
  };

  const closeTour = () => {
    setIsOpen(false);
    setIsPlaying(false);
    setCurrentStop(0);
    setProgress(0);
    setSelectedHotspot(null);
  };

  const currentTourStop = tourStops[currentStop];
  const progressPercentage = (progress / currentTourStop.duration) * 100;

  return (
    <>
      {/* Virtual Tour Launch Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <EyeIcon className="w-5 h-5" />
        Take Virtual Tour
      </motion.button>

      {/* Virtual Tour Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            {/* Tour Image/Viewer */}
            <div className="relative w-full h-full">
              <Image
                src={currentTourStop.image}
                alt={currentTourStop.title}
                fill
                className="object-cover"
                priority
              />

              {/* Hotspots */}
              {currentTourStop.hotspots.map((hotspot) => (
                <motion.button
                  key={hotspot.id}
                  className="absolute w-8 h-8 bg-blue-500 rounded-full shadow-lg border-2 border-white flex items-center justify-center hover:bg-blue-600 transition-colors"
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => setSelectedHotspot(hotspot)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(59, 130, 246, 0.7)',
                      '0 0 0 10px rgba(59, 130, 246, 0)',
                      '0 0 0 0 rgba(59, 130, 246, 0)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  <hotspot.icon className="w-4 h-4 text-white" />
                </motion.button>
              ))}

              {/* Hotspot Info Panel */}
              <AnimatePresence>
                {selectedHotspot && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-20 left-6 bg-white/95 backdrop-blur-md rounded-xl p-4 max-w-xs shadow-xl"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-gray-900">{selectedHotspot.title}</h4>
                      <button
                        onClick={() => setSelectedHotspot(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700">{selectedHotspot.description}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tour Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-white text-sm mb-2">
                  <span>{currentStop + 1} / {tourStops.length}</span>
                  <span>{Math.floor(progress)}s / {currentTourStop.duration}s</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div
                    className="bg-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Tour Info */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-2">
                  {currentTourStop.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {currentTourStop.description}
                </p>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={goToPrevStop}
                    disabled={currentStop === 0}
                    className="p-3 bg-white/20 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors"
                    whileHover={{ scale: currentStop > 0 ? 1.1 : 1 }}
                    whileTap={{ scale: currentStop > 0 ? 0.9 : 1 }}
                  >
                    <ArrowLeftIcon className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    onClick={togglePlay}
                    className="p-4 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isPlaying ? (
                      <PauseIcon className="w-6 h-6" />
                    ) : (
                      <PlayIcon className="w-6 h-6" />
                    )}
                  </motion.button>

                  <motion.button
                    onClick={goToNextStop}
                    disabled={currentStop === tourStops.length - 1}
                    className="p-3 bg-white/20 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors"
                    whileHover={{ scale: currentStop < tourStops.length - 1 ? 1.1 : 1 }}
                    whileTap={{ scale: currentStop < tourStops.length - 1 ? 0.9 : 1 }}
                  >
                    <ArrowRightIcon className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isMuted ? (
                      <SpeakerXMarkIcon className="w-5 h-5" />
                    ) : (
                      <SpeakerWaveIcon className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>

                <motion.button
                  onClick={closeTour}
                  className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XMarkIcon className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Tour Navigation Dots */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2">
              {tourStops.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setCurrentStop(index);
                    setProgress(0);
                  }}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStop ? 'bg-blue-500' : 'bg-white/30'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: selectedHotspot ? 0 : 1 }}
              className="absolute top-20 right-6 bg-black/50 backdrop-blur-md rounded-xl p-4 text-white max-w-xs"
            >
              <div className="flex items-center gap-2 mb-2">
                <InformationCircleIcon className="w-5 h-5 text-blue-400" />
                <h4 className="font-semibold">Tour Instructions</h4>
              </div>
              <p className="text-sm text-gray-300">
                Click the blue hotspots to learn more about specific areas. 
                Use the controls below to navigate through the tour.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}