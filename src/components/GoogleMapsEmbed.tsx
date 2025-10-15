'use client';

import { motion } from 'framer-motion';
import { MapPinIcon, PhoneIcon, ClockIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface GoogleMapsEmbedProps {
  address?: string;
  className?: string;
  showInfo?: boolean;
}

export default function GoogleMapsEmbed({ 
  address = "6524 Humboldt Ave S, Richfield, MN 55423",
  className = "",
  showInfo = true 
}: GoogleMapsEmbedProps) {
  const encodedAddress = encodeURIComponent(address);
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'demo'}&q=${encodedAddress}&maptype=roadmap&zoom=15`;

  const businessInfo = {
    name: "MN Group Home LLC",
    address: "6524 Humboldt Ave S, Richfield, MN 55423",
    phone: "952-594-1288",
    homePhone: "952-594-1288",
    hours: "24/7 Support Available",
    email: "info@mngrouphome.com"
  };

  const containerMotion = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <motion.div 
      className={`relative ${className}`}
      variants={containerMotion}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="bg-surface-elevated rounded-xlarge overflow-hidden shadow-depth-2 border border-gray-200">
        {/* Map Container */}
        <div className="relative h-96 md:h-[500px] bg-gray-100">
          {/* Loading placeholder */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100">
            <div className="text-center">
              <MapPinIcon className="h-12 w-12 text-brand-600 mx-auto mb-2" />
              <p className="text-brand-700 font-medium">Loading map...</p>
            </div>
          </div>
          
          {/* Google Maps Embed */}
          <iframe
            src={mapSrc}
            className="absolute inset-0 w-full h-full border-0 rounded-t-xlarge"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="MN Group Home LLC Location"
          />
          
          {/* Custom overlay with business info */}
          {showInfo && (
            <motion.div 
              className="absolute top-4 left-4 right-4 md:right-auto md:w-80"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="bg-surface-overlay backdrop-blur-md rounded-large p-4 shadow-floating border border-white/20">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-brand-600 rounded-large flex items-center justify-center shadow-depth-2">
                      <MapPinIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {businessInfo.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {businessInfo.address}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <a 
                        href={`tel:${businessInfo.phone.replace(/\D/g, '')}`}
                        className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 transition-colors"
                      >
                        <PhoneIcon className="h-3 w-3" />
                        Call
                      </a>
                      
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 transition-colors"
                      >
                        <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                        Directions
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Business Information Panel */}
        {showInfo && (
          <div className="p-6 bg-surface-paper">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Address */}
              <motion.div 
                className="flex items-start gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <MapPinIcon className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">Location</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {businessInfo.address}
                  </p>
                </div>
              </motion.div>
              
              {/* Phone */}
              <motion.div 
                className="flex items-start gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <PhoneIcon className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">Phone</h4>
                  <a 
                    href={`tel:${businessInfo.phone.replace(/\D/g, '')}`}
                    className="text-sm text-brand-600 hover:text-brand-700 transition-colors"
                  >
                    {businessInfo.phone}
                  </a>
                </div>
              </motion.div>
              
              {/* Hours */}
              <motion.div 
                className="flex items-start gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.4 }}
              >
                <ClockIcon className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">Availability</h4>
                  <p className="text-sm text-gray-600">
                    {businessInfo.hours}
                  </p>
                </div>
              </motion.div>
            </div>
            
            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.4 }}
            >
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-brand-600 text-white text-center py-3 px-4 rounded-large font-medium hover:bg-brand-700 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                Get Directions
              </a>
              
              <a
                href={`tel:${businessInfo.phone.replace(/\D/g, '')}`}
                className="flex-1 bg-surface-elevated text-brand-600 text-center py-3 px-4 rounded-large font-medium hover:bg-brand-50 transition-colors duration-200 border border-brand-200 flex items-center justify-center gap-2"
              >
                <PhoneIcon className="h-4 w-4" />
                Call Now
              </a>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}