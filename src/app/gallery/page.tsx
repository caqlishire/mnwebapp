import type { Metadata } from 'next';
import AnimatedGallery from '@/components/AnimatedGallery';
import AnimatedBlob from '../../components/AnimatedBlob';

export const metadata: Metadata = {
  title: 'Photo Gallery | MN Group Home LLC | Richfield, MN',
  description: 'View photos of our MN Group Home LLC facility in Richfield, Minnesota. See our comfortable living spaces, community areas, and welcoming environment.',
};

export default function Gallery() {
  return (
    <div className="relative bg-gradient-to-br from-[#f8f6ef] to-[#ede7db] dark:from-[#18181b] dark:to-[#23232a] min-h-screen overflow-x-hidden flex items-center justify-center py-16">
      {/* Animated SVG Blobs */}
      <AnimatedBlob className="absolute top-0 left-0 w-96 h-96 opacity-30 -z-10" variant="floating">{null}</AnimatedBlob>
      <AnimatedBlob className="absolute bottom-0 right-0 w-96 h-96 opacity-20 -z-10" variant="floating">{null}</AnimatedBlob>
      <div className="w-full max-w-5xl bg-white/70 dark:bg-black/40 backdrop-blur-lg rounded-3xl shadow-xl p-8">
        <AnimatedGallery />
      </div>
    </div>
  );
}