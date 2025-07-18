'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ClockIcon,
  HomeIcon,
  TruckIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  ChevronRightIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

// Modern components
import GlassmorphicCard from '../../components/modern/GlassmorphicCard';
import NeomorphicButton from '../../components/modern/NeomorphicButton';
import ParallaxSection from '../../components/modern/ParallaxSection';
import MorphingBackground from '../../components/modern/MorphingBackground';
import GoogleMapsInteractive from '../../components/GoogleMapsInteractive';
import AIAssistant from '../../components/advanced/AIAssistant';
import VoiceNavigation from '../../components/advanced/VoiceNavigation';

const mainLocation = {
  name: 'MN Group Home LLC Headquarters',
  address: '6524 Humboldt Ave S, Richfield, MN 55423',
  phone: '(952) 594-1288',
  email: 'info@mngrouphome.com',
  hours: {
    weekdays: '8:00 AM - 6:00 PM',
    weekends: '9:00 AM - 4:00 PM',
    emergency: '24/7 Emergency Support'
  },
  coordinates: { lat: 44.8833, lng: -93.2833 },
  features: [
    'Administrative Offices',
    'Client Meeting Rooms',
    'Training Facilities',
    'Emergency Response Center'
  ],
  amenities: [
    'Wheelchair Accessible',
    'Free Parking',
    'Public Transportation',
    'Family Waiting Area'
  ]
};

const serviceLocations = [
  {
    id: 1,
    name: 'Richfield Residential Home',
    type: '24-Hour Care Facility',
    address: '456 Residential Way, Richfield, MN 55423',
    capacity: '6 residents',
    features: ['24/7 Staff Support', 'Private Rooms', 'Community Areas', 'Accessible Design'],
    specialties: ['Intellectual Disabilities', 'Physical Disabilities', 'Autism Support'],
    color: '#2F6DB6'
  },
  {
    id: 2,
    name: 'Community Living Center',
    type: '245D Waiver Services',
    address: '789 Independence Ave, Richfield, MN 55423',
    capacity: '12 participants',
    features: ['Skills Training', 'Community Integration', 'Day Programs', 'Transportation'],
    specialties: ['Life Skills Training', 'Vocational Support', 'Social Integration'],
    color: '#a67c52'
  },
  {
    id: 3,
    name: 'Supported Living Apartments',
    type: 'Independent Living Support',
    address: '321 Freedom Street, Richfield, MN 55423',
    capacity: '8 apartments',
    features: ['Private Apartments', 'On-Call Support', 'Community Kitchen', 'Laundry Facilities'],
    specialties: ['Independent Living', 'Transitional Support', 'Skill Building'],
    color: '#059669'
  }
];

const serviceAreas = [
  {
    city: 'Richfield',
    population: '35,000+',
    facilities: 3,
    description: 'Primary service area with full range of residential and support services',
    coverage: 'Complete coverage'
  },
  {
    city: 'Bloomington',
    population: '85,000+',
    facilities: 2,
    description: 'Extended services including day programs and community support',
    coverage: 'Partial coverage'
  },
  {
    city: 'Edina',
    population: '50,000+',
    facilities: 1,
    description: 'Specialized services and consultation support available',
    coverage: 'Limited coverage'
  },
  {
    city: 'Minneapolis',
    population: '425,000+',
    facilities: 1,
    description: 'Outreach services and referral coordination',
    coverage: 'Referral services'
  }
];

const transportationInfo = {
  publicTransit: [
    'Metro Transit Bus Routes 5, 20, 21',
    'Light Rail Blue Line - MOA Station',
    'Accessible transit options available'
  ],
  parking: [
    'Free on-site parking',
    'Accessible parking spaces',
    'Visitor parking available',
    '24/7 security lighting'
  ],
  accessibility: [
    'Wheelchair accessible entrances',
    'Elevator access to all floors',
    'Accessible restrooms',
    'Audio-visual assistance available'
  ]
};

export default function Modern2025Locations() {
  const [selectedLocation, setSelectedLocation] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900 overflow-x-hidden">

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
              className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-8"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 8, repeat: Infinity }}
            >
              Our Locations
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Serving the Richfield community and surrounding areas with comprehensive 
              residential services and support programs designed to promote independence.
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
                icon={<MapPinIcon className="w-6 h-6" />}
              >
                Visit Us Today
              </NeomorphicButton>
              
              <NeomorphicButton
                href="tel:9525941288"
                size="xl"
                variant="secondary"
                icon={<PhoneIcon className="w-6 h-6" />}
              >
                Call (952) 594-1288
              </NeomorphicButton>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Location Section */}
      <ParallaxSection className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Main Office
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our central hub for administration, consultation, and coordination of all services
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Location Details */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <GlassmorphicCard className="p-8" depth="deep">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center">
                    <BuildingOfficeIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {mainLocation.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Central Administration
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Address</p>
                      <p className="text-gray-600 dark:text-gray-300">{mainLocation.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <PhoneIcon className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Phone</p>
                      <a 
                        href={`tel:${mainLocation.phone}`}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {mainLocation.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <EnvelopeIcon className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email</p>
                      <a 
                        href={`mailto:${mainLocation.email}`}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {mainLocation.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-blue-600" />
                    Hours of Operation
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Monday - Friday</span>
                      <span className="font-medium text-gray-900 dark:text-white">{mainLocation.hours.weekdays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Weekends</span>
                      <span className="font-medium text-gray-900 dark:text-white">{mainLocation.hours.weekends}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-red-600 dark:text-red-400 font-medium">Emergency</span>
                      <span className="font-bold text-red-600 dark:text-red-400">{mainLocation.hours.emergency}</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Facility Features
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {mainLocation.features.map((feature, index) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>

            {/* Interactive Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <GlassmorphicCard className="p-8 h-full">
                <div className="mb-6">
                  <GoogleMapsInteractive 
                    address={mainLocation.address}
                    className="w-full"
                  />
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Accessibility & Amenities
                  </h4>
                  <div className="space-y-3">
                    {mainLocation.amenities.map((amenity, index) => (
                      <div key={amenity} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>
          </div>
        </div>
      </ParallaxSection>

      {/* Service Locations */}
      <ParallaxSection 
        className="py-32 bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900"
        backgroundElement={<MorphingBackground colorScheme="secondary" intensity="subtle" />}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Service Locations
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Multiple facilities throughout the area providing specialized care and support services
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceLocations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <GlassmorphicCard className="p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${location.color}20` }}
                    >
                      <HomeIcon 
                        className="w-6 h-6"
                        style={{ color: location.color }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {location.name}
                      </h3>
                      <p 
                        className="text-sm font-medium"
                        style={{ color: location.color }}
                      >
                        {location.type}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                      {location.address}
                    </p>
                    <p className="text-gray-800 dark:text-gray-200 font-medium text-sm">
                      Capacity: {location.capacity}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                      Features
                    </h4>
                    <div className="space-y-1">
                      {location.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full flex-shrink-0"></div>
                          <span className="text-xs text-gray-600 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {location.specialties.map((specialty, idx) => (
                        <span 
                          key={idx}
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <NeomorphicButton
                    href="/contact"
                    variant="ghost"
                    className="w-full"
                    icon={<ChevronRightIcon className="w-4 h-4" />}
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

      {/* Service Areas */}
      <ParallaxSection className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Service Areas
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Communities we serve throughout the greater Minneapolis area
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceAreas.map((area, index) => (
              <motion.div
                key={area.city}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -3 }}
              >
                <GlassmorphicCard className="p-6 text-center h-full">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <GlobeAltIcon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {area.city}
                  </h3>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <p className="mb-1">Population: {area.population}</p>
                    <p>Facilities: {area.facilities}</p>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {area.description}
                  </p>

                  <span className={`
                    inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                    ${area.coverage === 'Complete coverage' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : area.coverage === 'Partial coverage'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }
                  `}>
                    {area.coverage}
                  </span>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Transportation & Accessibility */}
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
              Getting Here
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Easy access with multiple transportation options and full accessibility
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Public Transit */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <GlassmorphicCard className="p-6 h-full">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4 flex items-center justify-center">
                  <TruckIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Public Transportation
                </h3>
                <ul className="space-y-2">
                  {transportationInfo.publicTransit.map((info, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{info}</span>
                    </li>
                  ))}
                </ul>
              </GlassmorphicCard>
            </motion.div>

            {/* Parking */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <GlassmorphicCard className="p-6 h-full">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl mb-4 flex items-center justify-center">
                  <HomeIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Parking
                </h3>
                <ul className="space-y-2">
                  {transportationInfo.parking.map((info, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{info}</span>
                    </li>
                  ))}
                </ul>
              </GlassmorphicCard>
            </motion.div>

            {/* Accessibility */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <GlassmorphicCard className="p-6 h-full">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mb-4 flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Accessibility
                </h3>
                <ul className="space-y-2">
                  {transportationInfo.accessibility.map((info, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{info}</span>
                    </li>
                  ))}
                </ul>
              </GlassmorphicCard>
            </motion.div>
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
                Visit Us Today
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Schedule a tour of our facilities or stop by for a consultation. 
                We're here to answer your questions and show you how we can help.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <NeomorphicButton
                  href="/contact"
                  size="lg"
                  variant="primary"
                  icon={<EnvelopeIcon className="w-5 h-5" />}
                >
                  Schedule Tour
                </NeomorphicButton>
                
                <NeomorphicButton
                  href="tel:9525941288"
                  size="lg"
                  variant="secondary"
                  icon={<PhoneIcon className="w-5 h-5" />}
                >
                  Call Now
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