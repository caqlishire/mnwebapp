'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { 
  HeartIcon, 
  UserGroupIcon, 
  HomeIcon, 
  ShieldCheckIcon, 
  StarIcon,
  ChevronRightIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

// Modern components
import GlassmorphicCard from './modern/GlassmorphicCard';
import NeomorphicButton from './modern/NeomorphicButton';
import InteractiveMetrics from './modern/InteractiveMetrics';
import ParallaxSection from './modern/ParallaxSection';
import MorphingBackground from './modern/MorphingBackground';
import AIAssistant from './advanced/AIAssistant';
import VoiceNavigation from './advanced/VoiceNavigation';
import VirtualTour from './advanced/VirtualTour';
import DataVisualizationDashboard from './advanced/DataVisualizationDashboard';
import BiometricAccessibility from './advanced/BiometricAccessibility';
import ARFacilityPreview from './advanced/ARFacilityPreview';
import RealTimeCollaboration from './RealTimeCollaboration';

const heroMetrics = [
  { value: 100, suffix: '+', label: 'Residents Served', color: '#2F6DB6', icon: UserGroupIcon },
  { value: 15, suffix: '+', label: 'Years Experience', color: '#a67c52', icon: ClockIcon },
  { value: 24, suffix: '/7', label: 'Support Available', color: '#059669', icon: ShieldCheckIcon },
  { value: 98, suffix: '%', label: 'Satisfaction Rate', color: '#9333ea', icon: StarIcon }
];

const services = [
  {
    icon: HomeIcon,
    title: '24-Hour Customized Living',
    description: 'Comprehensive residential support in safe, nurturing environments with professional staff available around the clock.',
    features: ['Personal Care Assistance', 'Medication Management', 'Safety Monitoring', 'Life Skills Support'],
    color: '#2F6DB6'
  },
  {
    icon: UserGroupIcon,
    title: '245D Waiver Services',
    description: 'Personalized community-based services designed to help individuals maintain independence and achieve their goals.',
    features: ['Skill Development', 'Community Integration', 'Individual Planning', 'Goal Achievement'],
    color: '#a67c52'
  },
  {
    icon: HeartIcon,
    title: 'Community Residential Services',
    description: 'Structured home-like environments that promote independence while providing necessary support and supervision.',
    features: ['Daily Living Support', 'Social Activities', 'Health Coordination', 'Family Involvement'],
    color: '#059669'
  }
];

const testimonials = [
  {
    quote: "MN Group Home LLC has transformed my son's life. The staff is incredibly caring and professional.",
    author: "Sarah Johnson",
    role: "Parent",
    rating: 5,
    image: "/api/placeholder/80/80"
  },
  {
    quote: "The level of care and attention to individual needs is outstanding. Highly recommend their services.",
    author: "Michael Chen",
    role: "Family Member", 
    rating: 5,
    image: "/api/placeholder/80/80"
  },
  {
    quote: "Professional, compassionate, and dedicated to helping residents achieve their full potential.",
    author: "Lisa Rodriguez",
    role: "Social Worker",
    rating: 5,
    image: "/api/placeholder/80/80"
  }
];

const teamMembers = [
  {
    name: "Dr. Patricia Williams",
    role: "Clinical Director",
    image: "/api/placeholder/150/150",
    specialty: "Behavioral Psychology"
  },
  {
    name: "Suhura Abdulahi",
    role: "Program Manager", 
    image: "/api/placeholder/150/150",
    specialty: "Community Services"
  },
  {
    name: "Abshir Ali",
    role: "Care Coordinator",
    image: "/api/placeholder/150/150", 
    specialty: "Community Services"
  }
];

export default function Modern2025Homepage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-x-hidden">

      {/* Hero Section with Advanced Parallax */}
      <motion.section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Morphing Background */}
        <MorphingBackground intensity="medium" colorScheme="primary" />
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Main Hero Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <motion.h1 
              className="text-7xl md:text-8xl lg:text-9xl font-bold mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
            >
              <span className="text-gray-800 dark:text-white">Empowering</span>
              <br />
              <motion.span
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                Independence
              </motion.span>
            </motion.h1>
            
            {/* Description Text */}
            <motion.p 
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              As a premier provider of community residential services, we specialize in delivering comprehensive, 
              evidence-based care solutions that support individuals with disabilities in reaching their highest 
              level of independence. Our personalized approach enhances daily living outcomes, promotes 
              self-sufficiency, and ensures a higher quality of life through compassionate, consistent, 
              and professional support.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <NeomorphicButton
                href="/contact"
                size="xl"
                variant="primary"
                icon={<ChevronRightIcon className="w-6 h-6" />}
                iconPosition="right"
              >
                Start Your Journey
              </NeomorphicButton>
              
              <NeomorphicButton
                href="/services"
                size="xl"
                variant="secondary"
                icon={<PlayIcon className="w-6 h-6" />}
              >
                Explore Services
              </NeomorphicButton>
            </motion.div>
          </motion.div>

          {/* Metrics Row */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto"
          >
            {heroMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="mb-4">
                    <div 
                      className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${metric.color}20` }}
                    >
                      <Icon 
                        className="w-8 h-8"
                        style={{ color: metric.color }}
                      />
                    </div>
                    <motion.div 
                      className="text-4xl md:text-5xl font-bold mb-2"
                      style={{ color: metric.color }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {metric.value}{metric.suffix}
                    </motion.div>
                    <div className="text-gray-600 dark:text-gray-300 font-medium">
                      {metric.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Services Section with 3D Cards */}
      <ParallaxSection className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive support services designed around individual needs and goals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <GlassmorphicCard className="p-8 h-full" hover={true} depth="deep">
                  {/* Service Icon */}
                  <div className="mb-6">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: `${service.color}20` }}
                    >
                      <service.icon 
                        className="w-8 h-8"
                        style={{ color: service.color }}
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {service.title}
                    </h3>
                  </div>

                  {/* Service Description */}
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Service Features */}
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <motion.li 
                        key={feature}
                        className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * idx }}
                      >
                        <CheckCircleIcon 
                          className="w-5 h-5 flex-shrink-0"
                          style={{ color: service.color }}
                        />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  {/* Learn More Button */}
                  <NeomorphicButton
                    href="/services"
                    variant="ghost"
                    className="w-full"
                    icon={<ChevronRightIcon className="w-5 h-5" />}
                    iconPosition="right"
                  >
                    Learn More
                  </NeomorphicButton>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Testimonials Section with Interactive Cards */}
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
              What Families Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real experiences from the families we serve
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <GlassmorphicCard className="p-8 text-center h-full">
                  {/* Stars */}
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        className="w-5 h-5 fill-yellow-400 text-yellow-400" 
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-gray-700 dark:text-gray-300 italic text-lg mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.author}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Team Section */}
      <ParallaxSection className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Expert Care Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Dedicated professionals committed to exceptional care
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <GlassmorphicCard className="p-6 text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {member.specialty}
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
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Contact us today to learn more about our services and how we can support 
                you or your loved one on the journey to independence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <NeomorphicButton
                  href="/contact"
                  size="lg"
                  variant="primary"
                  icon={<ChevronRightIcon className="w-5 h-5" />}
                  iconPosition="right"
                >
                  Schedule Consultation
                </NeomorphicButton>
                
                <NeomorphicButton
                  href="/about"
                  size="lg"
                  variant="secondary"
                >
                  Learn About Us
                </NeomorphicButton>
              </div>
            </motion.div>
          </GlassmorphicCard>
        </div>
      </ParallaxSection>

      {/* Facility Gallery Section */}
      <ParallaxSection className="py-32 bg-gradient-to-r from-gray-50 to-green-50 dark:from-gray-800 dark:to-green-900">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our Facilities
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Take a glimpse inside our modern, accessible facilities designed with care and comfort in mind
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              { image: '/pics/IMG_5462.webp', title: 'Welcoming Entrance', description: 'Modern reception area' },
              { image: '/pics/IMG_5465.webp', title: 'Community Living Room', description: 'Comfortable social spaces' },
              { image: '/pics/IMG_5468.webp', title: 'Dining Area', description: 'Accessible dining facilities' },
              { image: '/pics/IMG_5471.webp', title: 'Private Rooms', description: 'Personal living spaces' },
              { image: '/pics/IMG_5473.webp', title: 'Accessible Kitchen', description: 'Independent living skills' },
              { image: '/pics/IMG_5476.webp', title: 'Activity Rooms', description: 'Therapeutic spaces' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
              >
                <GlassmorphicCard className="overflow-hidden p-0">
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <p className="text-sm opacity-90">{item.description}</p>
                    </div>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <VirtualTour />
          </motion.div>
        </div>
      </ParallaxSection>

      {/* Advanced 2025 Features */}
      <AIAssistant />
      <VoiceNavigation />
      <DataVisualizationDashboard />
      <BiometricAccessibility />
      <ARFacilityPreview />
      <RealTimeCollaboration />
    </div>
  );
}