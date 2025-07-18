'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { 
  HeartIcon, 
  UserGroupIcon, 
  ShieldCheckIcon, 
  CheckCircleIcon,
  LightBulbIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  TrophyIcon,
  SparklesIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Modern components
import GlassmorphicCard from '../../components/modern/GlassmorphicCard';
import NeomorphicButton from '../../components/modern/NeomorphicButton';
import ParallaxSection from '../../components/modern/ParallaxSection';
import MorphingBackground from '../../components/modern/MorphingBackground';
import AIAssistant from '../../components/advanced/AIAssistant';
import VoiceNavigation from '../../components/advanced/VoiceNavigation';

const coreValues = [
  {
    icon: HeartIcon,
    title: 'Dignity & Respect',
    description: 'We treat every individual with dignity, respect, and honor their unique worth and contributions.',
    color: '#e11d48',
    stats: { value: 100, suffix: '%', label: 'Respectful Care' }
  },
  {
    icon: UserGroupIcon,
    title: 'Person-Centered Care',
    description: 'Our services are tailored to each individual\'s unique needs, preferences, and goals.',
    color: '#2563eb',
    stats: { value: 95, suffix: '%', label: 'Individualized Plans' }
  },
  {
    icon: ShieldCheckIcon,
    title: 'Quality & Safety',
    description: 'We maintain the highest standards of care with comprehensive safety protocols and quality assurance.',
    color: '#059669',
    stats: { value: 24, suffix: '/7', label: 'Safety Monitoring' }
  },
  {
    icon: LightBulbIcon,
    title: 'Innovation',
    description: 'We embrace new approaches and technologies to continuously improve our services.',
    color: '#7c3aed',
    stats: { value: 15, suffix: '+', label: 'Years Innovation' }
  }
];

const achievements = [
  {
    icon: TrophyIcon,
    title: 'Licensed & Certified',
    description: 'Fully licensed by the state of Minnesota with all required certifications',
    color: '#f59e0b'
  },
  {
    icon: AcademicCapIcon,
    title: 'Trained Professionals',
    description: 'Our staff receives continuous training in best practices and new methodologies',
    color: '#8b5cf6'
  },
  {
    icon: GlobeAltIcon,
    title: 'Community Focused',
    description: 'Deep roots in the Richfield community with strong local partnerships',
    color: '#06b6d4'
  },
  {
    icon: SparklesIcon,
    title: 'Evidence-Based',
    description: 'All our approaches are grounded in research and proven methodologies',
    color: '#84cc16'
  }
];

const timeline = [
  {
    year: '2008',
    title: 'Founded',
    description: 'MN Group Home LLC was established with a vision to provide exceptional community residential services.'
  },
  {
    year: '2012',
    title: 'Expanded Services',
    description: 'Added 245D waiver services and expanded our capacity to serve more individuals.'
  },
  {
    year: '2016',
    title: 'Quality Recognition',
    description: 'Received state recognition for excellence in person-centered care and community integration.'
  },
  {
    year: '2020',
    title: 'Technology Integration',
    description: 'Implemented advanced care management systems and enhanced safety protocols.'
  },
  {
    year: '2024',
    title: 'Future Forward',
    description: 'Continuing to innovate and expand our services to meet evolving community needs.'
  }
];

export default function Modern2025About() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 overflow-x-hidden">

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y: heroY }}
      >
        <MorphingBackground intensity="medium" colorScheme="primary" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent mb-8"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              Our Story
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              For over 15 years, MN Group Home LLC has been a trusted partner in providing 
              exceptional community residential services that empower individuals with disabilities 
              to live independently and achieve their personal goals.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <NeomorphicButton
                href="/contact"
                size="xl"
                variant="primary"
              >
                Get Started Today
              </NeomorphicButton>
              
              <NeomorphicButton
                href="/services"
                size="xl"
                variant="secondary"
              >
                Our Services
              </NeomorphicButton>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission Section with Parallax */}
      <ParallaxSection className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <GlassmorphicCard className="p-8" depth="deep">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  To provide compassionate, individualized community residential services that support 
                  people with disabilities in achieving their highest level of independence, dignity, 
                  and quality of life within their community.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                  We believe that every person deserves the opportunity to live in a supportive 
                  environment where they can grow, learn, and thrive while maintaining their 
                  personal autonomy and making their own choices.
                </p>
                
                <div className="space-y-4">
                  {[
                    '24/7 professional support and care',
                    'Individualized service planning',
                    'Community integration and inclusion',
                    'Skill development and independence training',
                    'Family involvement and support'
                  ].map((item, index) => (
                    <motion.div
                      key={item}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </GlassmorphicCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <GlassmorphicCard className="p-8">
                <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center">
                  <motion.div
                    className="text-white text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <HeartIcon className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-xl font-semibold">Compassionate Care</p>
                  </motion.div>
                </div>
              </GlassmorphicCard>
            </motion.div>
          </div>
        </div>
      </ParallaxSection>

      {/* Core Values with Interactive Cards */}
      <ParallaxSection 
        className="py-32 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900"
        backgroundElement={<MorphingBackground colorScheme="secondary" intensity="subtle" />}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              These values guide everything we do and shape how we interact with the individuals we serve
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <GlassmorphicCard className="p-6 h-full text-center" hover={true}>
                  {/* Icon with glow effect */}
                  <div className="relative mb-6">
                    <motion.div
                      className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center relative z-10"
                      style={{ backgroundColor: `${value.color}20` }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <value.icon 
                        className="w-8 h-8"
                        style={{ color: value.color }}
                      />
                    </motion.div>
                    
                    {/* Glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                      style={{ backgroundColor: value.color }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {value.description}
                  </p>

                  {/* Interactive stat */}
                  <motion.div
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div 
                      className="text-3xl font-bold mb-1"
                      style={{ color: value.color }}
                    >
                      {value.stats.value}{value.stats.suffix}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {value.stats.label}
                    </div>
                  </motion.div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Timeline Section */}
      <ParallaxSection className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              A timeline of growth, innovation, and commitment to excellence
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg z-10"></div>

                  {/* Content */}
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'} ml-16 md:ml-0`}>
                    <GlassmorphicCard className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {item.year}
                        </span>
                        <ClockIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {item.description}
                      </p>
                    </GlassmorphicCard>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* Achievements Section */}
      <ParallaxSection 
        className="py-32 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900"
        backgroundElement={<MorphingBackground colorScheme="accent" intensity="subtle" />}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our Achievements
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Recognition and certifications that demonstrate our commitment to excellence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <GlassmorphicCard className="p-6 text-center h-full">
                  <div 
                    className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: `${achievement.color}20` }}
                  >
                    <achievement.icon 
                      className="w-6 h-6"
                      style={{ color: achievement.color }}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {achievement.description}
                  </p>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Call to Action */}
      <ParallaxSection 
        className="py-32"
        backgroundElement={<MorphingBackground colorScheme="primary" intensity="medium" />}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <GlassmorphicCard className="p-12" depth="deep">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Join Our Community
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Experience the difference that personalized, compassionate care can make. 
                Contact us to learn more about our services and how we can support your journey.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <NeomorphicButton
                  href="/contact"
                  size="lg"
                  variant="primary"
                >
                  Contact Us Today
                </NeomorphicButton>
                
                <NeomorphicButton
                  href="/services"
                  size="lg"
                  variant="secondary"
                >
                  View Our Services
                </NeomorphicButton>
              </div>
            </motion.div>
          </GlassmorphicCard>
        </div>
      </ParallaxSection>

      {/* Advanced 2025 Features */}
      <AIAssistant />
      <VoiceNavigation />
    </div>
  );
}