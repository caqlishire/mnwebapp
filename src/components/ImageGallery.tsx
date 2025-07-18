'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom, Thumbs, FreeMode } from 'swiper/modules';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

interface ImageGalleryProps {
  images: string[];
  className?: string;
  showThumbnails?: boolean;
  autoplay?: boolean;
}

export default function ImageGallery({ 
  images, 
  className = '', 
  showThumbnails = true,
  autoplay = false 
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const openLightbox = (image: string) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className={`relative ${className}`}>
        {/* Main Gallery */}
        <Swiper
          modules={[Navigation, Pagination, Zoom, Thumbs, FreeMode]}
          spaceBetween={10}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          zoom={true}
          thumbs={showThumbnails ? { swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null } : undefined}
          autoplay={autoplay ? {
            delay: 5000,
            disableOnInteraction: false,
          } : false}
          className="main-gallery rounded-lg overflow-hidden shadow-lg"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="relative">
              <div className="swiper-zoom-container">
                <div 
                  className="relative aspect-video w-full cursor-zoom-in group"
                  onClick={() => openLightbox(image)}
                >
                  <Image
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-80 rounded-full p-2">
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          
          {/* Custom Navigation */}
          <div className="swiper-button-prev !w-12 !h-12 !bg-white !bg-opacity-80 !rounded-full !shadow-lg after:!content-none flex items-center justify-center !text-gray-800 hover:!bg-opacity-100 transition-all duration-200">
            <ChevronLeftIcon className="w-6 h-6" />
          </div>
          <div className="swiper-button-next !w-12 !h-12 !bg-white !bg-opacity-80 !rounded-full !shadow-lg after:!content-none flex items-center justify-center !text-gray-800 hover:!bg-opacity-100 transition-all duration-200">
            <ChevronRightIcon className="w-6 h-6" />
          </div>
        </Swiper>

        {/* Thumbnails */}
        {showThumbnails && (
          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[FreeMode, Navigation, Thumbs]}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            className="thumbs-gallery mt-4"
            breakpoints={{
              640: {
                slidesPerView: 6,
              },
              768: {
                slidesPerView: 8,
              },
              1024: {
                slidesPerView: 10,
              },
            }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index} className="relative">
                <div className="relative aspect-video w-full cursor-pointer group">
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover rounded-md transition-all duration-200 group-hover:scale-105"
                    sizes="(max-width: 768px) 25vw, (max-width: 1200px) 12.5vw, 10vw"
                  />
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-600 rounded-md transition-all duration-200"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative max-w-7xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
                aria-label="Close lightbox"
              >
                <XMarkIcon className="w-8 h-8" />
              </button>
              
              <div className="relative">
                <Image
                  src={selectedImage}
                  alt="Enlarged gallery image"
                  width={1200}
                  height={800}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .main-gallery .swiper-pagination-bullet {
          @apply bg-white bg-opacity-50;
        }
        .main-gallery .swiper-pagination-bullet-active {
          @apply bg-primary-600;
        }
        .thumbs-gallery .swiper-slide-thumb-active img {
          @apply border-2 border-primary-600;
        }
      `}</style>
    </>
  );
}