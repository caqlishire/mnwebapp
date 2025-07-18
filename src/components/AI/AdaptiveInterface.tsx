'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// AI-powered user behavior tracking and adaptation
interface UserBehavior {
  scrollSpeed: number;
  clickPatterns: string[];
  timeOnPage: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  preferredInteractionType: 'hover' | 'click' | 'touch';
  attentionSpan: 'short' | 'medium' | 'long';
  contentPreference: 'visual' | 'textual' | 'interactive';
  accessibilityNeeds: string[];
}

interface AdaptiveSettings {
  animationIntensity: 'minimal' | 'standard' | 'enhanced';
  contentDensity: 'compact' | 'comfortable' | 'spacious';
  navigationStyle: 'simple' | 'advanced' | 'expert';
  colorMode: 'light' | 'dark' | 'auto' | 'high-contrast';
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  motionSensitivity: 'reduced' | 'standard' | 'enhanced';
}

interface AdaptiveContextType {
  behavior: UserBehavior;
  settings: AdaptiveSettings;
  updateBehavior: (updates: Partial<UserBehavior>) => void;
  updateSettings: (updates: Partial<AdaptiveSettings>) => void;
  getAdaptiveClasses: () => string;
  isLoading: boolean;
}

const defaultBehavior: UserBehavior = {
  scrollSpeed: 1,
  clickPatterns: [],
  timeOnPage: 0,
  deviceType: 'desktop',
  preferredInteractionType: 'hover',
  attentionSpan: 'medium',
  contentPreference: 'visual',
  accessibilityNeeds: [],
};

const defaultSettings: AdaptiveSettings = {
  animationIntensity: 'standard',
  contentDensity: 'comfortable',
  navigationStyle: 'simple',
  colorMode: 'auto',
  fontSize: 'medium',
  motionSensitivity: 'standard',
};

const AdaptiveContext = createContext<AdaptiveContextType | null>(null);

// AI behavior analysis algorithms
class AIBehaviorAnalyzer {
  private static instance: AIBehaviorAnalyzer;
  private behaviorData: UserBehavior = { ...defaultBehavior };
  private sessionStart = Date.now();
  private interactions: Array<{type: string; timestamp: number; element: string}> = [];

  static getInstance(): AIBehaviorAnalyzer {
    if (!AIBehaviorAnalyzer.instance) {
      AIBehaviorAnalyzer.instance = new AIBehaviorAnalyzer();
    }
    return AIBehaviorAnalyzer.instance;
  }

  trackInteraction(type: string, element: string) {
    this.interactions.push({
      type,
      timestamp: Date.now(),
      element
    });
    this.analyzePatterns();
  }

  private analyzePatterns() {
    const now = Date.now();
    const recentInteractions = this.interactions.filter(
      i => now - i.timestamp < 30000 // Last 30 seconds
    );

    // Analyze click patterns
    const clickTypes = recentInteractions.map(i => i.type);
    this.behaviorData.clickPatterns = [...new Set(clickTypes)];

    // Determine preferred interaction type
    const hoverCount = recentInteractions.filter(i => i.type === 'hover').length;
    const clickCount = recentInteractions.filter(i => i.type === 'click').length;
    const touchCount = recentInteractions.filter(i => i.type === 'touch').length;

    if (touchCount > clickCount && touchCount > hoverCount) {
      this.behaviorData.preferredInteractionType = 'touch';
    } else if (hoverCount > clickCount) {
      this.behaviorData.preferredInteractionType = 'hover';
    } else {
      this.behaviorData.preferredInteractionType = 'click';
    }

    // Calculate attention span based on interaction frequency
    const interactionRate = recentInteractions.length / 30; // per second
    if (interactionRate > 0.5) {
      this.behaviorData.attentionSpan = 'short';
    } else if (interactionRate > 0.2) {
      this.behaviorData.attentionSpan = 'medium';
    } else {
      this.behaviorData.attentionSpan = 'long';
    }

    // Update time on page
    this.behaviorData.timeOnPage = now - this.sessionStart;
  }

  getBehavior(): UserBehavior {
    return { ...this.behaviorData };
  }

  // AI-powered adaptive settings calculation
  calculateOptimalSettings(behavior: UserBehavior): AdaptiveSettings {
    const settings: AdaptiveSettings = { ...defaultSettings };

    // Adapt animation intensity based on attention span and device
    if (behavior.attentionSpan === 'short' || behavior.deviceType === 'mobile') {
      settings.animationIntensity = 'minimal';
    } else if (behavior.attentionSpan === 'long' && behavior.preferredInteractionType === 'hover') {
      settings.animationIntensity = 'enhanced';
    }

    // Adapt content density based on device and time spent
    if (behavior.deviceType === 'mobile') {
      settings.contentDensity = 'compact';
    } else if (behavior.timeOnPage > 60000) { // 1 minute
      settings.contentDensity = 'spacious';
    }

    // Adapt navigation style based on interaction patterns
    if (behavior.clickPatterns.length > 5) {
      settings.navigationStyle = 'expert';
    } else if (behavior.clickPatterns.length > 2) {
      settings.navigationStyle = 'advanced';
    }

    // Auto-detect accessibility needs
    if (behavior.scrollSpeed > 2) {
      settings.motionSensitivity = 'reduced';
    }

    return settings;
  }
}

// Adaptive Interface Provider
export function AdaptiveInterfaceProvider({ children }: { children: ReactNode }) {
  const [behavior, setBehavior] = useState<UserBehavior>(defaultBehavior);
  const [settings, setSettings] = useState<AdaptiveSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const analyzer = AIBehaviorAnalyzer.getInstance();

  useEffect(() => {
    // Initialize behavior tracking
    const updateBehavior = () => {
      const currentBehavior = analyzer.getBehavior();
      setBehavior(currentBehavior);
      
      // AI calculates optimal settings
      const optimalSettings = analyzer.calculateOptimalSettings(currentBehavior);
      setSettings(optimalSettings);
    };

    // Detect device type
    const detectDevice = () => {
      const width = window.innerWidth;
      let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      
      if (width < 768) deviceType = 'mobile';
      else if (width < 1024) deviceType = 'tablet';
      
      analyzer.trackInteraction('device_detection', deviceType);
      updateBehavior();
    };

    // Track scroll behavior
    let lastScrollY = 0;
    let scrollTimes: number[] = [];
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const now = Date.now();
      scrollTimes.push(now);
      
      // Keep only recent scroll events
      scrollTimes = scrollTimes.filter(time => now - time < 1000);
      
      const scrollSpeed = scrollTimes.length / 1000; // scrolls per second
      analyzer.getBehavior().scrollSpeed = scrollSpeed;
      
      lastScrollY = currentScrollY;
      analyzer.trackInteraction('scroll', 'page');
    };

    // Track clicks and hovers
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const elementType = target.tagName.toLowerCase();
      analyzer.trackInteraction('click', elementType);
      updateBehavior();
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, [role="button"]')) {
        analyzer.trackInteraction('hover', target.tagName.toLowerCase());
        updateBehavior();
      }
    };

    // Track touch events
    const handleTouch = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      analyzer.trackInteraction('touch', target.tagName.toLowerCase());
      updateBehavior();
    };

    // Initialize tracking
    detectDevice();
    updateBehavior();
    setIsLoading(false);

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', detectDevice);
    document.addEventListener('click', handleClick);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('touchstart', handleTouch, { passive: true });

    // Update behavior periodically
    const behaviorInterval = setInterval(updateBehavior, 5000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', detectDevice);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('touchstart', handleTouch);
      clearInterval(behaviorInterval);
    };
  }, []);

  const updateBehavior = (updates: Partial<UserBehavior>) => {
    setBehavior(prev => ({ ...prev, ...updates }));
  };

  const updateSettings = (updates: Partial<AdaptiveSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const getAdaptiveClasses = (): string => {
    const classes = [
      `animation-${settings.animationIntensity}`,
      `density-${settings.contentDensity}`,
      `nav-${settings.navigationStyle}`,
      `color-${settings.colorMode}`,
      `font-${settings.fontSize}`,
      `motion-${settings.motionSensitivity}`,
      `device-${behavior.deviceType}`,
      `attention-${behavior.attentionSpan}`,
      `interaction-${behavior.preferredInteractionType}`,
    ];
    
    return classes.join(' ');
  };

  return (
    <AdaptiveContext.Provider value={{
      behavior,
      settings,
      updateBehavior,
      updateSettings,
      getAdaptiveClasses,
      isLoading
    }}>
      <div className={getAdaptiveClasses()}>
        {children}
      </div>
    </AdaptiveContext.Provider>
  );
}

// Adaptive Component Wrapper
export function AdaptiveComponent({ 
  children, 
  className = '',
  adaptiveVariants = {}
}: { 
  children: ReactNode;
  className?: string;
  adaptiveVariants?: Record<string, any>;
}) {
  const context = useContext(AdaptiveContext);
  
  if (!context) {
    throw new Error('AdaptiveComponent must be used within AdaptiveInterfaceProvider');
  }

  const { settings, behavior, isLoading } = context;

  // AI-powered adaptive styling
  const getAdaptiveStyle = () => {
    const baseStyle: React.CSSProperties = {};
    
    // Adapt based on content density
    if (settings.contentDensity === 'compact') {
      baseStyle.padding = '0.5rem';
      baseStyle.margin = '0.25rem';
    } else if (settings.contentDensity === 'spacious') {
      baseStyle.padding = '2rem';
      baseStyle.margin = '1rem';
    }
    
    // Adapt based on font size
    if (settings.fontSize === 'large') {
      baseStyle.fontSize = '1.125rem';
    } else if (settings.fontSize === 'extra-large') {
      baseStyle.fontSize = '1.25rem';
    }
    
    return baseStyle;
  };

  // Adaptive animation variants
  const getAnimationVariants = () => {
    const intensity = settings.animationIntensity;
    const motionSensitivity = settings.motionSensitivity;
    
    if (motionSensitivity === 'reduced' || intensity === 'minimal') {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.1 }
      };
    }
    
    if (intensity === 'enhanced') {
      return {
        initial: { opacity: 0, y: 30, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { 
          duration: 0.8, 
          type: "spring",
          stiffness: 100,
          damping: 15
        }
      };
    }
    
    return {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 }
    };
  };

  if (isLoading) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      style={getAdaptiveStyle()}
      {...getAnimationVariants()}
      {...adaptiveVariants}
    >
      {children}
    </motion.div>
  );
}

// Hook for accessing adaptive context
export function useAdaptiveInterface() {
  const context = useContext(AdaptiveContext);
  if (!context) {
    throw new Error('useAdaptiveInterface must be used within AdaptiveInterfaceProvider');
  }
  return context;
}

// Adaptive Settings Panel
export function AdaptiveSettingsPanel() {
  const { settings, updateSettings, behavior } = useAdaptiveInterface();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        className="fixed bottom-4 right-4 w-12 h-12 bg-brand-600 text-white rounded-full shadow-floating hover:shadow-glow transition-all duration-300 z-50"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Adaptive Settings"
      >
        <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="fixed bottom-20 right-4 w-80 bg-surface-elevated rounded-xlarge p-6 shadow-floating border border-gray-200"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4 text-gray-900">
                AI Adaptive Settings
              </h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Animation Intensity
                  </label>
                  <select
                    value={settings.animationIntensity}
                    onChange={(e) => updateSettings({ 
                      animationIntensity: e.target.value as any 
                    })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="minimal">Minimal</option>
                    <option value="standard">Standard</option>
                    <option value="enhanced">Enhanced</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Content Density
                  </label>
                  <select
                    value={settings.contentDensity}
                    onChange={(e) => updateSettings({ 
                      contentDensity: e.target.value as any 
                    })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="compact">Compact</option>
                    <option value="comfortable">Comfortable</option>
                    <option value="spacious">Spacious</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Font Size
                  </label>
                  <select
                    value={settings.fontSize}
                    onChange={(e) => updateSettings({ 
                      fontSize: e.target.value as any 
                    })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="extra-large">Extra Large</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-2">AI Analysis</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p>Device: {behavior.deviceType}</p>
                    <p>Interaction: {behavior.preferredInteractionType}</p>
                    <p>Attention: {behavior.attentionSpan}</p>
                    <p>Time: {Math.round(behavior.timeOnPage / 1000)}s</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}