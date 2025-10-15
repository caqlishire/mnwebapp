'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { 
  HomeIcon, 
  UserGroupIcon, 
  HeartIcon,
  TruckIcon,
  AcademicCapIcon,
  ClockIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  StarIcon,
  ChevronRightIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

// Modern components
import GlassmorphicCard from '../../components/modern/GlassmorphicCard';
import NeomorphicButton from '../../components/modern/NeomorphicButton';
import InteractiveMetrics from '../../components/modern/InteractiveMetrics';
import ParallaxSection from '../../components/modern/ParallaxSection';
import MorphingBackground from '../../components/modern/MorphingBackground';
import AIAssistant from '../../components/advanced/AIAssistant';
import VoiceNavigation from '../../components/advanced/VoiceNavigation';

const mainServices = [
  {
    icon: HomeIcon,
    title: '24-Hour Customized Living',
    description: 'Comprehensive residential support in safe, nurturing environments with professional staff available around the clock.',
    longDescription: 'Our 24-hour customized living services provide individuals with disabilities the support they need in a home-like environment. We focus on promoting independence while ensuring safety and security through professional staff supervision.',
    features: [
      'Personal care assistance and daily living support',
      'Medication management and health monitoring', 
      'Safety supervision and emergency response',
      'Life skills training and development',
      'Meal planning and nutritional support',
      'Transportation to appointments and activities'
    ],
    benefits: [
      'Enhanced quality of life and independence',
      'Professional 24/7 support and supervision', 
      'Individualized care plans tailored to needs',
      'Safe and supportive living environment'
    ],
    color: '#2F6DB6',
    stats: { residents: 50, satisfaction: 98, years: 15 }
  },
  {
    icon: UserGroupIcon,
    title: '245D Waiver Services',
    description: 'Personalized community-based services designed to help individuals maintain independence and achieve their goals.',
    longDescription: 'Our 245D waiver services provide comprehensive support for individuals with disabilities to live as independently as possible in their community while receiving the assistance they need.',
    features: [
      'Individual skill development and training',
      'Community integration and social activities',
      'Personal goal planning and achievement',
      'Family support and involvement',
      'Adaptive equipment and technology support',
      'Recreational and leisure activities'
    ],
    benefits: [
      'Increased independence and self-sufficiency',
      'Enhanced community participation',
      'Achievement of personal goals',
      'Stronger family and social connections'
    ],
    color: '#a67c52',
    stats: { programs: 25, goals: 92, integration: 85 }
  },
  {
    icon: HeartIcon,
    title: 'Community Residential Services',
    description: 'Structured home-like environments that promote independence while providing necessary support and supervision.',
    longDescription: 'Our community residential services create supportive environments where individuals can develop life skills, build relationships, and participate actively in their community.',
    features: [
      'Daily living skills training and support',
      'Social and recreational activities',
      'Health and wellness coordination',
      'Educational and vocational support',
      'Crisis intervention and support',
      'Transition planning and services'
    ],
    benefits: [
      'Improved daily living capabilities',
      'Enhanced social connections',
      'Better health and wellness outcomes',
      'Successful community integration'
    ],
    color: '#059669',
    stats: { homes: 8, staff: 40, success: 94 }
  }
];

const additionalServices = [
  {
    icon: TruckIcon,
    title: 'Transportation Services',
    description: 'Safe, reliable transportation to medical appointments, work, and community activities.',
    features: ['Medical appointments', 'Employment transportation', 'Shopping and errands', 'Social activities']
  },
  {
    icon: AcademicCapIcon,
    title: 'Skills Training',
    description: 'Comprehensive life skills training to promote independence and personal growth.',
    features: ['Daily living skills', 'Social skills development', 'Vocational training', 'Technology skills']
  },
  {
    icon: ClockIcon,
    title: 'Respite Services',
    description: 'Temporary care services to provide families with relief and support.',
    features: ['Short-term care', 'Emergency respite', 'Planned breaks', 'Family support']
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Advocacy & Support',
    description: 'Individual advocacy and support to ensure rights and needs are met.',
    features: ['Rights advocacy', 'Service coordination', 'Crisis support', 'Family consultation']
  }
];

const serviceMetrics = [
  { value: 150, suffix: '+', label: 'Individuals Served', color: '#2F6DB6', icon: UserGroupIcon },
  { value: 95, suffix: '%', label: 'Family Satisfaction', color: '#a67c52', icon: StarIcon },
  { value: 24, suffix: '/7', label: 'Support Available', color: '#059669', icon: ClockIcon },
  { value: 15, suffix: '+', label: 'Years Experience', color: '#7c3aed', icon: ShieldCheckIcon }
];

const processSteps = [
  {
    step: '01',
    title: 'Initial Consultation',
    description: 'We begin with a comprehensive assessment to understand individual needs and preferences.',
    icon: ChatBubbleLeftRightIcon
  },
  {
    step: '02', 
    title: 'Service Planning',
    description: 'We develop a personalized service plan that aligns with goals and requirements.',
    icon: AcademicCapIcon
  },
  {
    step: '03',
    title: 'Implementation',
    description: 'Our trained staff begin providing services according to the established plan.',
    icon: CheckCircleIcon
  },
  {
    step: '04',
    title: 'Ongoing Support',
    description: 'We provide continuous monitoring, adjustments, and family communication.',
    icon: HeartIcon
  }
];

export default function Modern2025Services() {
  const [activeService, setActiveService] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 overflow-x-hidden">

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
              Our Services
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Comprehensive, person-centered services designed to support individuals with disabilities 
              in achieving their highest level of independence and quality of life in their community.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <NeomorphicButton
                href="/contact"
                size="xl"
                variant="primary"
                icon={<ChevronRightIcon className="w-6 h-6" />}
                iconPosition="right"
              >
                Get Started Today
              </NeomorphicButton>
              
              <NeomorphicButton
                href="/about"
                size="xl"
                variant="secondary"
              >
                Learn About Us
              </NeomorphicButton>
            </motion.div>

            {/* Service Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              <InteractiveMetrics metrics={serviceMetrics} />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Services Section */}
      <ParallaxSection className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Core Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our three primary service offerings designed to meet diverse needs and promote independence
            </p>
          </motion.div>

          <div className="space-y-20">
            {mainServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="grid lg:grid-cols-2 gap-12 items-center"
              >
                {/* Content */}
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <GlassmorphicCard className="p-8" depth="deep">
                    <div className="flex items-center gap-4 mb-6">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: `${service.color}20` }}
                      >
                        <service.icon 
                          className="w-8 h-8"
                          style={{ color: service.color }}
                        />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {service.title}
                      </h3>
                    </div>

                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {service.longDescription}
                    </p>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Key Features:
                      </h4>
                      {service.features.map((feature, idx) => (
                        <motion.div 
                          key={feature}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 * idx }}
                        >
                          <CheckCircleIcon 
                            className="w-5 h-5 flex-shrink-0 mt-0.5"
                            style={{ color: service.color }}
                          />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    <NeomorphicButton
                      href="/contact"
                      variant="primary"
                      className="w-full"
                      icon={<ChevronRightIcon className="w-5 h-5" />}
                      iconPosition="right"
                    >
                      Learn More
                    </NeomorphicButton>
                  </GlassmorphicCard>
                </div>

                {/* Visual Element */}
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <GlassmorphicCard className="p-8">
                    <div 
                      className="aspect-square rounded-2xl flex flex-col items-center justify-center text-white relative overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${service.color}, ${service.color}80)` }}
                    >
                      {/* Background pattern */}
                      <div className="absolute inset-0 opacity-20">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <defs>
                            <pattern id={`pattern-${index}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                              <circle cx="10" cy="10" r="2" fill="white" opacity="0.3" />
                            </pattern>
                          </defs>
                          <rect width="100" height="100" fill={`url(#pattern-${index})`} />
                        </svg>
                      </div>
                      
                      <service.icon className="w-24 h-24 mb-6 relative z-10" />
                      <h4 className="text-2xl font-bold text-center relative z-10">
                        {service.title}
                      </h4>
                      
                      {/* Service stats */}
                      <div className="mt-8 grid grid-cols-3 gap-4 text-center relative z-10">
                        {Object.entries(service.stats).map(([key, value]) => (
                          <div key={key}>
                            <div className="text-2xl font-bold">{value}+</div>
                            <div className="text-sm opacity-80 capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlassmorphicCard>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Additional Services */}
      <ParallaxSection 
        className="py-32 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900"
        backgroundElement={<MorphingBackground colorScheme="secondary" intensity="subtle" />}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Additional Support Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Comprehensive support services to complement our core offerings
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <GlassmorphicCard className="p-6 h-full text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-blue-500 rounded-full flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Process Section */}
      <ParallaxSection className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our Process
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              A structured approach to delivering personalized care and support
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative"
              >
                <GlassmorphicCard className="p-6 text-center h-full">
                  {/* Step number */}
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                    {step.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </GlassmorphicCard>

                {/* Connecting line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Call to Action */}
      <ParallaxSection 
        className="py-32"
        backgroundElement={<MorphingBackground colorScheme="accent" intensity="medium" />}
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
                Ready to Learn More?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Contact us today to discuss how our services can support you or your loved one 
                on the journey to greater independence and quality of life.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <NeomorphicButton
                  href="/contact"
                  size="lg"
                  variant="primary"
                  icon={<EnvelopeIcon className="w-5 h-5" />}
                >
                  Contact Us
                </NeomorphicButton>
                
                <NeomorphicButton
                  href="tel:9525941288"
                  size="lg"
                  variant="secondary"
                  icon={<PhoneIcon className="w-5 h-5" />}
                >
                  Call 952-594-1288
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