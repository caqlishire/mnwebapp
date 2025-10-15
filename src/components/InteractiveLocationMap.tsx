'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  MapPinIcon, 
  PhoneIcon, 
  HomeIcon,
  UserGroupIcon,
  ChevronDownIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Location {
  id: number;
  name: string;
  type: string;
  address: string;
  phone?: string;
  capacity?: string;
  features: string[];
  specialties: string[];
  color: string;
  coordinates: { lat: number; lng: number };
}

interface InteractiveLocationMapProps {
  locations: Location[];
  className?: string;
}

export default function InteractiveLocationMap({ locations, className = '' }: InteractiveLocationMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showAllLocations, setShowAllLocations] = useState(false);

  const mainLocation = {
    name: "MN Group Home LLC Headquarters",
    address: "6524 Humboldt Ave S, Richfield, MN 55423",
    phone: "952-594-1288",
    homePhone: "952-594-1288",
    email: "info@mngrouphome.com",
    coordinates: { lat: 44.8833, lng: -93.2833 }
  };

  const allLocations = [
    {
      id: 0,
      name: mainLocation.name,
      type: 'Headquarters',
      address: mainLocation.address,
      phone: mainLocation.phone,
      capacity: 'Administrative',
      features: ['Administrative Offices', 'Client Meeting Rooms', 'Training Facilities', 'Emergency Response Center'],
      specialties: ['Administration', 'Training', 'Emergency Support'],
      color: '#2F6DB6',
      coordinates: mainLocation.coordinates
    }
  ];

  const encodedAddress = encodeURIComponent(mainLocation.address);
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'demo'}&q=${encodedAddress}&maptype=roadmap&zoom=13`;

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

        {/* Interactive Map */}
        <div className="relative h-96 md:h-[500px] bg-gray-100 dark:bg-gray-900">
          {/* Loading placeholder */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="text-center">
              <MapPinIcon className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <p className="text-blue-700 dark:text-blue-300 font-medium">Loading interactive map...</p>
            </div>
          </div>
          
          {/* Google Maps Embed */}
          <iframe
            src={mapSrc}
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="MN Group Home LLC Locations"
          />
          
          {/* Main Location Marker */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute pointer-events-auto"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
              whileHover={{ scale: 1.2 }}
              onClick={() => setSelectedLocation(allLocations[0])}
            >
              <div 
                className="w-10 h-10 rounded-full shadow-lg border-2 border-white cursor-pointer flex items-center justify-center"
                style={{ backgroundColor: allLocations[0].color }}
              >
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span className="text-xs font-medium bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-md">
                  Headquarters
                </span>
              </div>
            </motion.div>
          </div>

          {/* Main Location Info Overlay */}
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
                    {mainLocation.name}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    {mainLocation.address}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <a 
                      href={`tel:${mainLocation.phone.replace(/\D/g, '')}`}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <PhoneIcon className="h-3 w-3" />
                      Call
                    </a>
                    
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
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

        {/* Location Details */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Contact Info */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-blue-600" />
                Main Location
              </h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-300">{mainLocation.address}</p>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 text-blue-600" />
                  <a href={`tel:${mainLocation.phone.replace(/\D/g, '')}`} className="text-blue-600 hover:text-blue-700">
                    {mainLocation.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <HomeIcon className="w-4 h-4 text-green-600" />
                  <a href={`tel:${mainLocation.homePhone.replace(/\D/g, '')}`} className="text-green-600 hover:text-green-700">
                    {mainLocation.homePhone}
                  </a>
                </div>
              </div>
            </div>

            {/* Service Areas */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5 text-purple-600" />
                Service Areas
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">Richfield (Primary)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">Bloomington</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">Minneapolis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">Surrounding Areas</span>
                </div>
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
                  className="flex items-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                  Get Directions
                </a>
                <a
                  href={`tel:${mainLocation.phone.replace(/\D/g, '')}`}
                  className="flex items-center gap-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <PhoneIcon className="w-4 h-4" />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>


        {/* Selected Location Details Modal */}
        <AnimatePresence>
          {selectedLocation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelectedLocation(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: selectedLocation.color }}
                    />
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {selectedLocation.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {selectedLocation.type}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Address</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedLocation.address}</p>
                  </div>

                  {selectedLocation.capacity && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Capacity</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{selectedLocation.capacity}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Features</h4>
                    <div className="space-y-1">
                      {selectedLocation.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLocation.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}