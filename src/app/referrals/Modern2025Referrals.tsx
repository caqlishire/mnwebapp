'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { 
  UserPlusIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ArrowRightIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  HeartIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// Modern components
import GlassmorphicCard from '../../components/modern/GlassmorphicCard';
import NeomorphicButton from '../../components/modern/NeomorphicButton';
import ParallaxSection from '../../components/modern/ParallaxSection';
import MorphingBackground from '../../components/modern/MorphingBackground';
import AIAssistant from '../../components/advanced/AIAssistant';
import VoiceNavigation from '../../components/advanced/VoiceNavigation';

const referralProcess = [
  {
    step: '01',
    title: 'Initial Contact',
    description: 'Reach out to us via phone, email, or our online referral form to begin the process.',
    timeline: '1 day',
    details: [
      'Complete referral intake form',
      'Provide basic individual information',
      'Describe current needs and situation',
      'Submit required documentation'
    ],
    icon: UserPlusIcon,
    color: '#2F6DB6'
  },
  {
    step: '02',
    title: 'Assessment & Evaluation',
    description: 'Our team conducts a comprehensive assessment to understand individual needs and preferences.',
    timeline: '3-5 days',
    details: [
      'Review medical and social history',
      'Conduct in-person or virtual assessment',
      'Evaluate support requirements',
      'Determine service eligibility'
    ],
    icon: ClipboardDocumentListIcon,
    color: '#a67c52'
  },
  {
    step: '03',
    title: 'Service Planning',
    description: 'Develop a personalized service plan that aligns with individual goals and needs.',
    timeline: '5-7 days',
    details: [
      'Create individualized service plan',
      'Coordinate with healthcare providers',
      'Arrange funding and approvals',
      'Schedule service implementation'
    ],
    icon: DocumentTextIcon,
    color: '#059669'
  },
  {
    step: '04',
    title: 'Implementation',
    description: 'Begin providing services according to the approved plan with ongoing monitoring.',
    timeline: 'Ongoing',
    details: [
      'Start service delivery',
      'Regular progress monitoring',
      'Adjust plans as needed',
      'Maintain family communication'
    ],
    icon: CheckCircleIcon,
    color: '#7c3aed'
  }
];

const referralSources = [
  {
    title: 'Healthcare Professionals',
    description: 'Doctors, nurses, social workers, and other medical professionals',
    icon: HeartIcon,
    examples: [
      'Primary care physicians',
      'Specialists and therapists',
      'Hospital discharge planners',
      'Mental health professionals'
    ]
  },
  {
    title: 'Educational Institutions',
    description: 'Schools, colleges, and educational support services',
    icon: AcademicCapIcon,
    examples: [
      'Special education coordinators',
      'School social workers',
      'Transition planning teams',
      'College disability services'
    ]
  },
  {
    title: 'Family & Friends',
    description: 'Family members, friends, and personal networks',
    icon: UserGroupIcon,
    examples: [
      'Parents and guardians',
      'Extended family members',
      'Personal advocates',
      'Community members'
    ]
  },
  {
    title: 'Government Agencies',
    description: 'State and county agencies and departments',
    icon: ShieldCheckIcon,
    examples: [
      'Department of Human Services',
      'County case managers',
      'Vocational rehabilitation',
      'Adult protection services'
    ]
  }
];

const requiredDocuments = [
  {
    category: 'Personal Information',
    documents: [
      'Photo identification (driver\'s license, state ID)',
      'Social Security card or documentation',
      'Birth certificate',
      'Emergency contact information'
    ],
    urgency: 'Required'
  },
  {
    category: 'Medical Documentation',
    documents: [
      'Current medical assessments',
      'Medication list and prescriptions',
      'Diagnostic reports and evaluations',
      'Healthcare provider contact information'
    ],
    urgency: 'Required'
  },
  {
    category: 'Financial Information',
    documents: [
      'Medical Assistance (MA) card',
      'Insurance information',
      'Income verification',
      'Bank statements (if applicable)'
    ],
    urgency: 'Required'
  },
  {
    category: 'Support Documentation',
    documents: [
      'Previous service plans',
      'Educational records (IEP/504 plans)',
      'Behavioral support plans',
      'Housing information'
    ],
    urgency: 'Helpful'
  }
];

const eligibilityCriteria = [
  {
    title: 'Age Requirements',
    description: 'Services available for individuals 18 years and older',
    icon: CalendarDaysIcon
  },
  {
    title: 'Disability Qualification',
    description: 'Must have a qualifying disability as defined by state guidelines',
    icon: ClipboardDocumentListIcon
  },
  {
    title: 'Medical Assistance',
    description: 'Must be eligible for Medical Assistance or have alternative funding',
    icon: ShieldCheckIcon
  },
  {
    title: 'Service Need',
    description: 'Demonstrated need for residential or community support services',
    icon: HeartIcon
  }
];

export default function Modern2025Referrals() {
  const [activeStep, setActiveStep] = useState(0);
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
              Referrals
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Making referrals simple and streamlined. Our comprehensive process ensures 
              individuals receive the right support services tailored to their unique needs.
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
                icon={<UserPlusIcon className="w-6 h-6" />}
              >
                Make a Referral
              </NeomorphicButton>
              
              <NeomorphicButton
                href="tel:9525941288"
                size="xl"
                variant="secondary"
                icon={<PhoneIcon className="w-6 h-6" />}
              >
                Call 952-594-1288
              </NeomorphicButton>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Referral Process */}
      <ParallaxSection className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Our Process
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A structured, transparent approach to ensuring the best outcomes for every individual
            </p>
          </motion.div>

          <div className="relative">
            {/* Process Flow Line */}
            <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500"></div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {referralProcess.map((process, index) => (
                <motion.div
                  key={process.step}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Step indicator */}
                  <div className="flex justify-center mb-6">
                    <motion.div
                      className="relative w-16 h-16 rounded-full flex items-center justify-center z-10"
                      style={{ backgroundColor: process.color }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setActiveStep(index)}
                    >
                      <process.icon className="w-8 h-8 text-white" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xs font-bold" style={{ color: process.color }}>
                          {process.step}
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  <GlassmorphicCard 
                    className={`p-6 transition-all duration-300 ${
                      activeStep === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                    hover={true}
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {process.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {process.description}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      <ClockIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">
                        Timeline: {process.timeline}
                      </span>
                    </div>

                    {/* Expandable details */}
                    <motion.div
                      initial={false}
                      animate={{ height: activeStep === index ? 'auto' : 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                          Key Activities:
                        </h4>
                        <ul className="space-y-2">
                          {process.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-xs text-gray-600 dark:text-gray-300">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </GlassmorphicCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* Referral Sources */}
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
              Who Can Make Referrals
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We accept referrals from various sources to ensure individuals can access our services
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {referralSources.map((source, index) => (
              <motion.div
                key={source.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <GlassmorphicCard className="p-6 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <source.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {source.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {source.description}
                  </p>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                      Examples include:
                    </h4>
                    <ul className="space-y-2">
                      {source.examples.map((example, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ArrowRightIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Required Documents */}
      <ParallaxSection className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Required Documentation
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Help streamline the referral process by having these documents ready
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {requiredDocuments.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassmorphicCard className="p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {category.category}
                    </h3>
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${category.urgency === 'Required' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }
                    `}>
                      {category.urgency}
                    </span>
                  </div>

                  <ul className="space-y-3">
                    {category.documents.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <DocumentTextIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassmorphicCard className="p-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <InformationCircleIcon className="w-6 h-6 text-blue-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Important Note
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Don't worry if you don't have all documents immediately. Our team will work 
                with you to gather necessary information throughout the process. Missing 
                documents won't prevent us from starting your referral.
              </p>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </ParallaxSection>

      {/* Eligibility Criteria */}
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
              Eligibility Criteria
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Basic requirements for accessing our services
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eligibilityCriteria.map((criteria, index) => (
              <motion.div
                key={criteria.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -3 }}
              >
                <GlassmorphicCard className="p-6 text-center h-full">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <criteria.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    {criteria.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {criteria.description}
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
                Ready to Make a Referral?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Our team is here to guide you through every step of the referral process. 
                Contact us today to get started.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <NeomorphicButton
                  href="/contact"
                  size="lg"
                  variant="primary"
                  icon={<ChevronRightIcon className="w-5 h-5" />}
                  iconPosition="right"
                >
                  Start Referral Process
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

              <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                Questions? Our referral coordinators are available Monday-Friday, 8:00 AM - 6:00 PM
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