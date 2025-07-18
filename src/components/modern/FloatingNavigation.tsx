'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { HomeIcon, UserGroupIcon, Cog6ToothIcon, PhoneIcon, MapPinIcon, ArrowPathRoundedSquareIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navItems = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/about', label: 'About', icon: UserGroupIcon },
  { href: '/services', label: 'Services', icon: Cog6ToothIcon },
  { href: '/locations', label: 'Locations', icon: MapPinIcon },
  { href: '/referrals', label: 'Referrals', icon: ArrowPathRoundedSquareIcon },
  { href: '/contact', label: 'Contact', icon: PhoneIcon },
];

export default function FloatingNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const navOpacity = useTransform(scrollY, [0, 100], [0.8, 1]);
  const navBlur = useTransform(scrollY, [0, 100], [10, 20]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="fixed top-6 right-6 z-50 lg:hidden bg-white/20 backdrop-blur-md rounded-full p-3 border border-white/30"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          y: isVisible ? 0 : -20 
        }}
        transition={{ duration: 0.3 }}
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 text-gray-800 dark:text-white" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-gray-800 dark:text-white" />
        )}
      </motion.button>

      {/* Desktop Navigation */}
      <motion.nav
        className="fixed top-6 left-1/2 -translate-x-1/2 z-40 hidden lg:block"
        style={{ opacity: navOpacity }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          y: isVisible ? 0 : -20 
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-full p-2 border border-white/20 shadow-xl"
          style={{ backdropFilter: `blur(${navBlur}px)` }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`
                    relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
                    ${isActive 
                      ? 'bg-white/20 text-gray-900 dark:text-white shadow-lg' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  layoutId={isActive ? 'activeTab' : undefined}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                  
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full"
                      layoutId="activeBackground"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </motion.nav>

      {/* Mobile Navigation Menu */}
      <motion.div
        className="fixed inset-0 z-30 lg:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Menu */}
        <motion.div
          className="absolute top-20 right-6 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl min-w-[200px]"
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ 
            opacity: isOpen ? 1 : 0, 
            scale: isOpen ? 1 : 0.9,
            y: isOpen ? 0 : -20
          }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex flex-col gap-2">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ 
                    opacity: isOpen ? 1 : 0, 
                    x: isOpen ? 0 : 20 
                  }}
                  transition={{ 
                    duration: 0.3, 
                    delay: isOpen ? index * 0.1 : 0 
                  }}
                >
                  <Link 
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.div
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                        ${isActive 
                          ? 'bg-white/20 text-gray-900 dark:text-white' 
                          : 'text-gray-600 dark:text-gray-300 hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                        }
                      `}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}