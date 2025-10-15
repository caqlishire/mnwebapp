'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  HeartIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

// Modern components
import GlassmorphicCard from '../../components/modern/GlassmorphicCard';
import NeomorphicButton from '../../components/modern/NeomorphicButton';
import ParallaxSection from '../../components/modern/ParallaxSection';
import MorphingBackground from '../../components/modern/MorphingBackground';
import ContactForm from '../../components/modern/ContactForm';
import AIAssistant from '../../components/advanced/AIAssistant';
import VoiceNavigation from '../../components/advanced/VoiceNavigation';
import PredictiveSmartForms from '../../components/advanced/PredictiveSmartForms';

const contactMethods = [
  {
    icon: PhoneIcon,
    title: 'Business Phone',
    value: '952-594-1288',
    href: 'tel:9525941288',
    description: 'Call us directly for immediate assistance',
    availability: '24/7 Emergency Line',
    color: '#2F6DB6'
  },
  {
    icon: PhoneIcon,
    title: 'Home Phone',
    value: '952-594-1288',
    href: 'tel:9525941288',
    description: 'Alternative contact number',
    availability: 'Business Hours',
    color: '#059669'
  },
  {
    icon: EnvelopeIcon,
    title: 'Email',
    value: 'info@mngrouphome.com',
    href: 'mailto:info@mngrouphome.com',
    description: 'Send us a detailed message',
    availability: 'Response within 24 hours',
    color: '#a67c52'
  },
  {
    icon: MapPinIcon,
    title: 'Visit Us',
    value: '123 Healthcare Drive, Richfield, MN 55423',
    href: 'https://maps.google.com?q=123+Healthcare+Drive+Richfield+MN+55423',
    description: 'Schedule an in-person consultation',
    availability: 'Monday-Friday, 8:00 AM - 6:00 PM',
    color: '#059669'
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Live Chat',
    value: 'Online Chat Support',
    href: '#',
    description: 'Get instant answers to your questions',
    availability: 'Monday-Friday, 9:00 AM - 5:00 PM',
    color: '#7c3aed'
  }
];

const officeHours = [
  {
    day: 'Monday - Friday',
    hours: '8:00 AM - 6:00 PM',
    type: 'Administration'
  },
  {
    day: 'Saturday',
    hours: '9:00 AM - 4:00 PM',
    type: 'Limited Services'
  },
  {
    day: 'Sunday',
    hours: '10:00 AM - 2:00 PM',
    type: 'Emergency Only'
  },
  {
    day: 'After Hours',
    hours: '24/7 Emergency Line',
    type: 'Emergency Support'
  }
];

const commonQuestions = [
  {
    question: 'How do I make a referral?',
    answer: 'You can make a referral by calling us, filling out our online form, or visiting our referrals page for detailed instructions.',
    category: 'Referrals'
  },
  {
    question: 'What services do you provide?',
    answer: 'We offer 24-hour customized living, 245D waiver services, community residential services, and various support programs.',
    category: 'Services'
  },
  {
    question: 'Do you accept insurance?',
    answer: 'Yes, we accept Medical Assistance (MA) and work with various insurance providers. Contact us to verify coverage.',
    category: 'Insurance'
  },
  {
    question: 'Can I schedule a tour?',
    answer: 'Absolutely! We encourage tours of our facilities. Please call or email to schedule a convenient time.',
    category: 'Tours'
  }
];

const emergencyInfo = {
  title: 'Emergency Support',
  description: 'We provide 24/7 emergency support for all our residents and their families.',
  phone: '952-594-1288',
  procedures: [
    'Call our main number immediately',
    'Identify yourself and the nature of the emergency',
    'Follow the prompts for emergency assistance',
    'Stay on the line until help arrives or instructions are provided'
  ]
};

const contactInfo = {
  mainPhone: '952-594-1288',
  homePhone: '952-594-1288',
  email: 'info@mngrouphome.com',
  address: '6524 Humboldt Ave S, Richfield, MN 55423'
};

export default function Modern2025Contact() {
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
              Contact Us
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              We're here to help you every step of the way. Reach out to us through any of the 
              convenient methods below, and let's start the conversation about how we can support you.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <NeomorphicButton
                href="tel:9525941288"
                size="lg"
                variant="primary"
                icon={<PhoneIcon className="w-5 h-5" />}
              >
                Call 952-594-1288
              </NeomorphicButton>
              
              <NeomorphicButton
                href="tel:9525941288"
                size="lg"
                variant="secondary"
                icon={<PhoneIcon className="w-5 h-5" />}
              >
                Call 952-594-1288
              </NeomorphicButton>
              
              <NeomorphicButton
                href="mailto:info@mngrouphome.com"
                size="lg"
                variant="secondary"
                icon={<EnvelopeIcon className="w-5 h-5" />}
              >
                Send Email
              </NeomorphicButton>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Methods */}
      <ParallaxSection className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Multiple ways to reach us - choose what works best for you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <GlassmorphicCard className="p-6 h-full text-center">
                  <div 
                    className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                    style={{ backgroundColor: `${method.color}20` }}
                  >
                    <method.icon 
                      className="w-8 h-8"
                      style={{ color: method.color }}
                    />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {method.title}
                  </h3>

                  <motion.a
                    href={method.href}
                    className="text-lg font-semibold mb-3 block hover:opacity-80 transition-opacity"
                    style={{ color: method.color }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {method.value}
                  </motion.a>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {method.description}
                  </p>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <ClockIcon className="w-4 h-4" />
                    {method.availability}
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Contact Form Section */}
      <ParallaxSection 
        className="py-32 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900"
        backgroundElement={<MorphingBackground colorScheme="secondary" intensity="subtle" />}
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <PredictiveSmartForms />
          </motion.div>
        </div>
      </ParallaxSection>

      {/* Office Hours & Location */}
      <ParallaxSection className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Office Hours */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <GlassmorphicCard className="p-8" depth="deep">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <ClockIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Office Hours
                  </h3>
                </div>

                <div className="space-y-4">
                  {officeHours.map((schedule, index) => (
                    <motion.div
                      key={schedule.day}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {schedule.day}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {schedule.type}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {schedule.hours}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassmorphicCard>
            </motion.div>

            {/* Emergency Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <GlassmorphicCard className="p-8 h-full" depth="deep">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {emergencyInfo.title}
                  </h3>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {emergencyInfo.description}
                </p>

                <div className="mb-6">
                  <NeomorphicButton
                    href={`tel:${emergencyInfo.phone.replace(/[^\d]/g, '')}`}
                    variant="primary"
                    size="lg"
                    className="w-full bg-red-600 hover:bg-red-700"
                    icon={<PhoneIcon className="w-5 h-5" />}
                  >
                    Emergency: {emergencyInfo.phone}
                  </NeomorphicButton>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Emergency Procedures:
                  </h4>
                  <ol className="space-y-2">
                    {emergencyInfo.procedures.map((procedure, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">{procedure}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </GlassmorphicCard>
            </motion.div>
          </div>
        </div>
      </ParallaxSection>

      {/* FAQ Section */}
      <ParallaxSection 
        className="py-32 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900"
        backgroundElement={<MorphingBackground colorScheme="accent" intensity="subtle" />}
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Common Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Quick answers to frequently asked questions
            </p>
          </motion.div>

          <div className="space-y-6">
            {commonQuestions.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassmorphicCard className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <QuestionMarkCircleIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {faq.question}
                        </h3>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                          {faq.category}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Don't see your question answered here?
            </p>
            <NeomorphicButton
              href="/contact"
              variant="primary"
              icon={<ChatBubbleLeftRightIcon className="w-5 h-5" />}
            >
              Ask Us Directly
            </NeomorphicButton>
          </motion.div>
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
                We're Here to Help
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Every conversation starts with a simple step. Whether you have questions, 
                need information, or want to begin services, we're ready to assist you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <NeomorphicButton
                  href="tel:9525941288"
                  size="lg"
                  variant="primary"
                  icon={<PhoneIcon className="w-5 h-5" />}
                >
                  Call Now
                </NeomorphicButton>
                
                <NeomorphicButton
                  href="/referrals"
                  size="lg"
                  variant="secondary"
                  icon={<UserGroupIcon className="w-5 h-5" />}
                >
                  Make a Referral
                </NeomorphicButton>
              </div>

              <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                Available 24/7 for emergencies • Response within 24 hours for general inquiries
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