'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  MapPinIcon, 
  PhoneIcon, 
  HomeIcon,
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

interface GoogleMapsInteractiveProps {
  address?: string;
  className?: string;
}

export default function GoogleMapsInteractive({ 
  address = "6524 Humboldt Ave S, Richfield, MN 55423",
  className = ""
}: GoogleMapsInteractiveProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  const businessInfo = {
    name: "MN Group Home LLC",
    address: "6524 Humboldt Ave S, Richfield, MN 55423",
    phone: "952-594-1288",
    homePhone: "952-594-1288",
    email: "info@mngrouphome.com",
    hours: "24/7 Support Available"
  };

  const encodedAddress = encodeURIComponent(address);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    setHasApiKey(apiKey !== undefined && apiKey !== 'your_google_maps_api_key_here' && apiKey !== 'demo');
  }, [apiKey]);

  const mapSrc = hasApiKey 
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}&maptype=roadmap&zoom=15`
    : `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2823.6739166962623!2d-93.28626368472282!3d44.88332957909885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87f628a9c9b8c4c7%3A0x8b4c9b5c8a7d6e5f!2s6524%20Humboldt%20Ave%20S%2C%20Richfield%2C%20MN%2055423!5e0!3m2!1sen!2sus!4v1640995200000!5m2!1sen!2sus`;

  return (
    <div className={`${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
        
        {/* Map Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Our Location</h3>
            <p className="text-blue-100">
              Headquarters in Richfield, MN
            </p>
          </div>
        </div>

        {/* API Key Warning */}
        {!hasApiKey && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-700 p-4"
          >
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Google Maps API Key Required
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Using fallback embed map. For full functionality, add your Google Maps API key to .env.local
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Interactive Map */}
        <div className="relative h-96 md:h-[500px] bg-gray-100 dark:bg-gray-900">
          {/* Loading placeholder */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="text-center">
              <MapPinIcon className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <p className="text-blue-700 dark:text-blue-300 font-medium">Loading map...</p>
            </div>
          </div>
          
          {/* Google Maps Embed */}
          <iframe
            src={mapSrc}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="MN Group Home LLC Location"
            onLoad={() => setMapLoaded(true)}
          />
          
          {/* Custom Location Info Overlay */}
          <motion.div 
            className="absolute top-4 left-4 right-4 md:right-auto md:w-80"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/20">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <MapPinIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                    {businessInfo.name}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    {businessInfo.address}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <a 
                      href={`tel:${businessInfo.phone.replace(/\D/g, '')}`}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <PhoneIcon className="h-3 w-3" />
                      Call Business
                    </a>
                    
                    <a 
                      href={`tel:${businessInfo.homePhone.replace(/\D/g, '')}`}
                      className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 transition-colors"
                    >
                      <HomeIcon className="h-3 w-3" />
                      Call Home
                    </a>
                    
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                      Directions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Business Information Panel */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-blue-600" />
                Contact Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">Address</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {businessInfo.address}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <PhoneIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">Business Phone</p>
                    <a 
                      href={`tel:${businessInfo.phone.replace(/\D/g, '')}`}
                      className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {businessInfo.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <HomeIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">Home Phone</p>
                    <a 
                      href={`tel:${businessInfo.homePhone.replace(/\D/g, '')}`}
                      className="text-sm text-green-600 hover:text-green-700 transition-colors"
                    >
                      {businessInfo.homePhone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <EnvelopeIcon className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">Email</p>
                    <a 
                      href={`mailto:${businessInfo.email}`}
                      className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      {businessInfo.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Available */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                Services Available
              </h4>
              <div className="space-y-2">
                {[
                  '24-Hour Customized Living',
                  '245D Waiver Services',
                  'Community Residential Services',
                  'Emergency Support',
                  'Consultation Services'
                ].map((service, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 dark:text-white">Quick Actions</h4>
              <div className="space-y-3">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm w-full"
                >
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                  Get Directions
                </a>
                
                <a
                  href={`tel:${businessInfo.phone.replace(/\D/g, '')}`}
                  className="flex items-center gap-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm w-full"
                >
                  <PhoneIcon className="w-4 h-4" />
                  Call Business
                </a>
                
                <a
                  href={`tel:${businessInfo.homePhone.replace(/\D/g, '')}`}
                  className="flex items-center gap-2 p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm w-full"
                >
                  <HomeIcon className="w-4 h-4" />
                  Call Home
                </a>
                
                <a
                  href={`mailto:${businessInfo.email}`}
                  className="flex items-center gap-2 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm w-full"
                >
                  <EnvelopeIcon className="w-4 h-4" />
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* API Status */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {hasApiKey ? (
                <>
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-700 dark:text-green-300">
                    Google Maps API Connected
                  </span>
                </>
              ) : (
                <>
                  <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-yellow-700 dark:text-yellow-300">
                    Using fallback map embed
                  </span>
                </>
              )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Richfield, MN 55423
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}