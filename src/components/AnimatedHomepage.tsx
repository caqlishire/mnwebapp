'use client';

import Link from 'next/link';
import { CheckCircleIcon, HeartIcon, UserGroupIcon, HomeIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import { BentoCard, BentoGrid } from '@/components/BentoGrid';
import GoogleMapsEmbed from '@/components/GoogleMapsEmbed';
import AdvancedButton from '@/components/AdvancedButton';
import { FeatureOrchestration, ContentOrchestration } from '@/components/OrchestrationWrapper';

const features = [
  {
    name: 'Person-Centered Care',
    description: 'Individualized support plans tailored to each person\'s unique needs, goals, and preferences.',
    icon: HeartIcon,
  },
  {
    name: 'Community Integration',
    description: 'Helping individuals build meaningful connections and participate fully in their communities.',
    icon: UserGroupIcon,
  },
  {
    name: 'Independent Living',
    description: 'Supporting skills development and autonomy to help individuals live as independently as possible.',
    icon: HomeIcon,
  },
  {
    name: 'Quality Assurance',
    description: 'Licensed and certified services that meet all state and federal standards for excellence.',
    icon: CheckCircleIcon,
  },
];

const services = [
  '24/7 Residential Support',
  'Life Skills Training',
  'Community Activities',
  'Medication Management',
  'Transportation Assistance',
  'Personal Care Support',
];

export default function AnimatedHomepage() {
  return (
    <div className="bg-white">
      {/* Hero section with rotating images */}
      <HeroSection />

      {/* Features section with Bento Grid */}
      <div className="py-section-lg bg-gradient-to-br from-surface-paper via-surface-elevated to-surface-paper">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-fluid-4xl font-bold tracking-tight text-gray-900 sm:text-fluid-5xl bg-gradient-to-r from-healthcare-trust to-healthcare-calm bg-clip-text text-transparent">
              Why Choose Our Services?
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-fluid-xl text-gray-600 leading-relaxed">
              We are committed to providing the highest quality care and support to help individuals reach their full potential through personalized, compassionate service.
            </p>
          </motion.div>

          <div className="mt-16">
            <BentoGrid columns={2} className="lg:grid-cols-4">
              {features.map((feature, index) => (
                <BentoCard 
                  key={feature.name}
                  size="medium"
                  variant={index === 0 ? 'featured' : 'default'}
                  delay={index}
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center h-14 w-14 rounded-xlarge bg-gradient-to-br from-healthcare-trust to-healthcare-calm text-white mx-auto shadow-depth-2 group-hover:shadow-glow transition-all duration-500">
                      <feature.icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <h3 className="mt-6 text-fluid-lg font-semibold text-gray-900 group-hover:text-healthcare-trust transition-colors duration-300">
                      {feature.name}
                    </h3>
                    <p className="mt-3 text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </BentoCard>
              ))}
            </BentoGrid>
          </div>
        </div>
      </div>

      {/* Services overview */}
      <div className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-fluid-4xl font-bold tracking-tight text-gray-900 sm:text-fluid-5xl">
                Comprehensive Support Services
              </h2>
              <p className="mt-4 text-fluid-lg text-gray-600">
                Our experienced team provides a full range of residential and community-based services designed to promote independence, dignity, and quality of life.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckCircleIcon className="h-5 w-5 text-secondary-600 mr-3 group-hover:text-secondary-700 transition-colors duration-200" aria-hidden="true" />
                    </motion.div>
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">{service}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8"
              >
                <Link
                  href="/services"
                  className="btn-modern bg-primary-600 text-white px-6 py-3 rounded-md text-base font-medium hover:bg-primary-700 transition-colors duration-200 shadow-lg card-hover"
                >
                  Learn More About Our Services
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-12 lg:mt-0"
            >
              <div className="bg-gradient-to-br from-white to-primary-50/20 rounded-2xl p-8 shadow-2xl border border-primary-100 backdrop-blur-sm hover:shadow-3xl transition-all duration-500">
                <h3 className="text-fluid-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-primary-600 font-medium">Address:</p>
                    <p className="text-gray-900">6524 Humboldt Ave S<br />Richfield, MN 55423</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-primary-600 font-medium">Phone:</p>
                    <a href="tel:9525941288" className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200">
                      952-594-1288
                    </a>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-primary-600 font-medium">Email:</p>
                    <a href="mailto:mngrouphome@gmail.com" className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200">
                      mngrouphome@gmail.com
                    </a>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary-600">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-fluid-4xl font-bold tracking-tight text-white sm:text-fluid-5xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-fluid-xl text-blue-100">
              Contact us today to learn more about our community residential services and how we can support you or your loved one.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/contact"
                  className="btn-modern bg-white text-primary-600 px-8 py-4 rounded-xl text-fluid-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
                >
                  Contact Us Today
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/gallery"
                  className="btn-modern border-2 border-white text-white px-8 py-4 rounded-xl text-fluid-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105"
                >
                  View Our Gallery
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}