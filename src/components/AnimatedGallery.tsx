'use client';

import { motion } from 'framer-motion';
import ImageGallery from '@/components/ImageGallery';
import BackgroundEffects from '@/components/BackgroundEffects';

// All available images from the pics folder
const galleryImages = [
  '/pics/IMG_5462.webp',
  '/pics/IMG_5463.webp',
  '/pics/IMG_5464.webp',
  '/pics/IMG_5465.webp',
  '/pics/IMG_5466.webp',
  '/pics/IMG_5467.webp',
  '/pics/IMG_5468.webp',
  '/pics/IMG_5469.webp',
  '/pics/IMG_5470.webp',
  '/pics/IMG_5471.webp',
  '/pics/IMG_5472.webp',
  '/pics/IMG_5473.webp',
  '/pics/IMG_5474.webp',
  '/pics/IMG_5475.webp',
  '/pics/IMG_5476.webp',
  '/pics/IMG_5477.webp',
  '/pics/IMG_5478.webp',
  '/pics/IMG_5479.webp',
  '/pics/IMG_5480.webp',
  '/pics/IMG_5481.webp',
  '/pics/IMG_5486.webp',
  '/pics/IMG_5487.webp',
  '/pics/IMG_5488.webp',
  '/pics/IMG_5489.webp',
];

const facilityFeatures = [
  {
    title: 'Comfortable Living Spaces',
    description: 'Our facility features comfortable, home-like living spaces designed to promote independence and dignity.',
  },
  {
    title: 'Community Areas',
    description: 'Spacious common areas where residents can socialize, participate in activities, and build relationships.',
  },
  {
    title: 'Accessible Design',
    description: 'All areas are designed with accessibility in mind, ensuring everyone can navigate comfortably and safely.',
  },
  {
    title: 'Outdoor Spaces',
    description: 'Beautiful outdoor areas provide opportunities for recreation, relaxation, and connecting with nature.',
  },
];

export default function AnimatedGallery() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <BackgroundEffects variant="gradient" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Photo Gallery
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600">
              Take a virtual tour of our MN Group Home LLC facility in Richfield, Minnesota. 
              See our comfortable living spaces, community areas, and welcoming environment.
            </p>
          </motion.div>
        </div>
      </BackgroundEffects>

      {/* Main Gallery */}
      <div className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ImageGallery
              images={galleryImages}
              showThumbnails={true}
              autoplay={false}
              className="mb-16"
            />
          </motion.div>

          {/* Facility Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-24"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Our Facility Features
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
                Every aspect of our facility is designed with our residents&apos; comfort, safety, and independence in mind.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {facilityFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 card-hover"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Virtual Tour CTA */}
      <BackgroundEffects variant="geometric" className="bg-primary-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Schedule a Personal Tour
            </h2>
            <p className="mt-4 text-xl text-primary-100">
              We&apos;d love to show you around our facility in person. Contact us to schedule a tour and see 
              firsthand how we can support you or your loved one.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/contact"
                className="btn-modern bg-white text-primary-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-50 transition-colors duration-200 shadow-lg"
              >
                Schedule a Tour
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="tel:9525941288"
                className="btn-modern glass-effect border-2 border-white/30 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-white/10 transition-colors duration-200"
              >
                Call (952) 594-1288
              </motion.a>
            </div>
          </motion.div>
        </div>
      </BackgroundEffects>
    </div>
  );
}