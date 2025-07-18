"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircleIcon, HeartIcon, UserGroupIcon, HomeIcon, MapPinIcon, PhoneIcon, StarIcon, ShieldCheckIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import WebGLCanvas from './3D/WebGLCanvas';
import AdvancedButton from './AdvancedButton';
import AnimatedGallery from './AnimatedGallery';

// Animated SVG Blob for backgrounds
interface AnimatedBlobProps {
  className?: string;
  color1: string;
  color2: string;
  duration?: number;
  [key: string]: any;
}
function LocalAnimatedBlob({ className, color1, color2, duration = 12, ...props }: AnimatedBlobProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <motion.path
        initial={{
          d: 'M300,60Q370,120,400,200Q430,280,370,350Q310,420,220,400Q130,380,120,290Q110,200,200,120Q290,40,300,60Z',
        }}
        animate={{
          d: [
            'M300,60Q370,120,400,200Q430,280,370,350Q310,420,220,400Q130,380,120,290Q110,200,200,120Q290,40,300,60Z',
            'M320,80Q400,140,420,220Q440,300,370,370Q300,440,210,410Q120,380,130,290Q140,200,210,120Q280,40,320,80Z',
            'M300,60Q370,120,400,200Q430,280,370,350Q310,420,220,400Q130,380,120,290Q110,200,200,120Q290,40,300,60Z',
          ],
        }}
        transition={{ repeat: Infinity, duration, ease: 'easeInOut' }}
        fill={`url(#blob-gradient)`}
      />
      <defs>
        <linearGradient id="blob-gradient" x1="0" y1="0" x2="600" y2="600" gradientUnits="userSpaceOnUse">
          <stop stopColor={color1} />
          <stop offset="1" stopColor={color2} />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Animated Sparkles/Particles
function Sparkles({ className = '', color = '#fff', count = 18 }) {
  const [sparkles, setSparkles] = useState<{cx: number, cy: number, r: number}[]>([]);

  useEffect(() => {
    // Only run on client
    const generated = Array.from({ length: count }, () => ({
      cx: Math.random() * 600,
      cy: Math.random() * 600,
      r: Math.random() * 2 + 1,
    }));
    setSparkles(generated);
  }, [count]);

  if (sparkles.length === 0) return null; // Avoid SSR mismatch

  return (
    <svg className={className} width="100%" height="100%" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      {sparkles.map((s, i) => (
        <motion.circle
          key={i}
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          fill={color}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: Math.random() * 2 + 2, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}
    </svg>
  );
}

// Animated Progress Ring for stats
function ProgressRing({ value, color, size = 64, stroke = 6 }: { value: number; color: string; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value, 0), 100);
  const offset = circumference - (progress / 100) * circumference;
  return (
    <svg width={size} height={size} className="mb-2">
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="#ede7db" strokeWidth={stroke} fill="none" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        strokeLinecap="round"
      />
    </svg>
  );
}

const features = [
  { icon: CheckCircleIcon, label: 'Person-Centered Care', tooltip: 'Individualized support for every resident.' },
  { icon: UserGroupIcon, label: 'Community Integration', tooltip: 'Active participation in community life.' },
  { icon: HeartIcon, label: '24/7 Professional Staff', tooltip: 'Round-the-clock support and care.' },
  { icon: ShieldCheckIcon, label: 'Licensed by MN DHS', tooltip: 'Fully licensed and certified.' },
];

const stats = [
  { label: 'Years of Experience', value: 15, suffix: '+' },
  { label: 'Satisfied Families', value: 200, suffix: '+' },
  { label: 'Community Partners', value: 50, suffix: '+' },
  { label: 'Success Rate', value: 98, suffix: '%' },
];

const testimonials = [
  {
    name: 'J. Anderson',
    role: 'Family Member',
    avatar: '/pics/IMG_5489.webp',
    text: 'The staff at MN Group Home LLC truly care about their residents. My family member has found a real sense of belonging and support here.',
    rating: 5,
  },
  {
    name: 'S. Patel',
    role: 'Resident',
    avatar: '/pics/IMG_5488.webp',
    text: 'I feel safe and valued every day. The activities and support have helped me grow more independent.',
    rating: 5,
  },
  {
    name: 'M. Lee',
    role: 'Family Member',
    avatar: '/pics/IMG_5487.webp',
    text: 'The home is always clean, welcoming, and the staff are attentive to every need.',
    rating: 4,
  },
];

const staff = [
  {
    name: 'Emily Johnson',
    role: 'Director',
    bio: 'Over 15 years of experience in residential care. Passionate about empowering residents.',
    photo: '/pics/IMG_5486.webp',
  },
  {
    name: 'Carlos Martinez',
    role: 'Lead Caregiver',
    bio: 'Dedicated to providing compassionate, individualized support.',
    photo: '/pics/IMG_5485.webp',
  },
  {
    name: 'Sarah Kim',
    role: 'Activities Coordinator',
    bio: 'Creates engaging programs for all residents.',
    photo: '/pics/IMG_5484.webp',
  },
];

const trustBadges = [
  { icon: ShieldCheckIcon, label: 'Licensed by MN DHS' },
  { icon: CheckCircleIcon, label: 'ADA Accessible' },
  { icon: StarIcon, label: '5-Star Family Reviews' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  // Animate the counter up to the value
  useState(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    let current = start;
    const increment = end / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  });
  return <span className="text-3xl font-bold text-[#a67c52]">{count}{suffix}</span>;
}

export default function EnhancedHomepage() {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [dark, setDark] = useState(false);
  const nextTestimonial = () => setTestimonialIdx((i) => (i + 1) % testimonials.length);
  const prevTestimonial = () => setTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <div className={dark ? 'dark bg-[#23211c] text-white min-h-screen pb-16' : 'bg-gradient-to-br from-[#f8f6ef] via-[#ede7db] to-[#f8f6ef] min-h-screen pb-16 text-[#171717]'}>
      {/* Hero Section with WebGL Background, Animated Blobs, Sparkles, and Logo Watermark */}
      <div className="relative w-full h-[520px] flex items-center justify-center overflow-hidden rounded-b-3xl shadow-xl mb-12 animate-fade-in">
        <WebGLCanvas className="absolute inset-0 w-full h-full z-0" colorScheme="trust" />
        {/* Animated SVG Blobs */}
        <LocalAnimatedBlob className="absolute -top-32 -left-32 w-[500px] h-[500px] opacity-40 z-0 mix-blend-multiply" color1="#a67c52" color2="#2F6DB6" duration={16} />
        <LocalAnimatedBlob className="absolute -bottom-32 -right-32 w-[400px] h-[400px] opacity-30 z-0 mix-blend-multiply" color1="#059669" color2="#6b5c3e" duration={18} />
        <LocalAnimatedBlob className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-10 z-0" color1="#f8f6ef" color2="#a67c52" duration={24} />
        {/* Sparkles/Particles */}
        <Sparkles className="absolute inset-0 w-full h-full z-0 pointer-events-none" color="#fff" count={24} />
        {/* Logo Watermark (if available) */}
        <Image src="/logo.png" alt="Logo Watermark" width={320} height={320} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 z-0 pointer-events-none select-none" />
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#2F6DB6] via-[#a67c52] to-[#059669] bg-clip-text text-transparent mb-6 drop-shadow-lg">Connecting Communities & Quality Care</h1>
          <p className="text-xl md:text-2xl mb-8 font-medium drop-shadow text-[#171717] dark:text-[#f8f6ef]">At MN Group Home LLC, we are committed to making a positive difference in the lives of our residents. We provide community-based services that ensure our residents live comfortably and independently every day.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AdvancedButton size="lg" variant="primary" href="/contact" className="border-2 border-transparent bg-gradient-to-r from-[#a67c52] to-[#2F6DB6] hover:from-[#2F6DB6] hover:to-[#a67c52] transition-all duration-300 shadow-lg">Start Today</AdvancedButton>
            <AdvancedButton size="lg" variant="secondary" href="/about" className="border-2 border-[#a67c52] bg-white/80 text-[#a67c52] hover:bg-[#a67c52] hover:text-white transition-all duration-300 shadow-lg">Learn More</AdvancedButton>
          </div>
        </motion.div>
        {/* Animated Feature Badges */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 flex flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 bg-white/40 dark:bg-[#23211c]/60 backdrop-blur-md rounded-full shadow-lg z-20 border border-white/30">
          {features.map((feature, idx) => (
            <motion.span key={idx} whileHover={{ scale: 1.08 }} className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-[#23211c]/80 text-[#2F6DB6] dark:text-[#e6e0d0] rounded-full shadow text-sm font-medium relative group cursor-pointer border border-white/40 transition-all">
              <feature.icon className="h-5 w-5" /> {feature.label}
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-black/80 text-white text-xs rounded px-2 py-1 pointer-events-none transition-opacity">{feature.tooltip}</span>
            </motion.span>
          ))}
          <button onClick={() => setDark((d) => !d)} className="ml-2 bg-[#a67c52] text-white p-2 rounded-full shadow hover:bg-[#6b5c3e] transition border border-white/40" aria-label="Toggle dark mode">{dark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}</button>
        </div>
      </div>

      {/* Gallery Section - 3D/Parallax with Animated Background */}
      <section className="relative max-w-7xl mx-auto px-4 py-16 animate-fade-in overflow-hidden">
        <LocalAnimatedBlob className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] opacity-20 z-0" color1="#a67c52" color2="#ede7db" duration={22} />
        <AnimatedGallery />
      </section>

      {/* Impact/Stats Section with Animated Blobs and Progress Rings */}
      <section className="relative py-12 px-4 max-w-5xl mx-auto animate-fade-in overflow-hidden">
        <LocalAnimatedBlob className="absolute -bottom-24 right-0 w-[400px] h-[400px] opacity-10 z-0" color1="#2F6DB6" color2="#059669" duration={20} />
        <h2 className="text-2xl md:text-3xl font-bold text-[#6b5c3e] mb-8 text-center">Our Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10">
          {stats.map((stat, idx) => (
            <div key={stat.label} className="flex flex-col items-center">
              <ProgressRing value={stat.value > 100 ? 100 : stat.value} color={['#a67c52', '#2F6DB6', '#059669', '#6b5c3e'][idx % 4]} />
              <span className="text-3xl font-bold text-[#a67c52]">{stat.value}{stat.suffix}</span>
              <div className="text-[#7c6a4d]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial Carousel - 3D Card Flip with Shifting Gradient */}
      <div className="w-full max-w-2xl mx-auto rounded-2xl shadow p-8 flex flex-col items-center border border-[#e6e0d0] mb-12 animate-fade-in relative"
        style={{ background: `linear-gradient(135deg, ${['#f8f6ef', '#a67c52', '#2F6DB6'][testimonialIdx % 3]}, ${['#ede7db', '#059669', '#6b5c3e'][testimonialIdx % 3]})` }}>
        <button onClick={prevTestimonial} className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#a67c52]/80 text-white rounded-full p-2 shadow hover:bg-[#8c6842] transition">&#8592;</button>
        <button onClick={nextTestimonial} className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#a67c52]/80 text-white rounded-full p-2 shadow hover:bg-[#8c6842] transition">&#8594;</button>
        <AnimatePresence initial={false}>
          <motion.div
            key={testimonialIdx}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="flex flex-col items-center"
            style={{ perspective: 1000 }}
          >
            <Image src={testimonials[testimonialIdx].avatar} alt={testimonials[testimonialIdx].name} width={64} height={64} className="rounded-full mb-2 object-cover" />
            <blockquote className="italic text-[#7c6a4d] dark:text-[#e6e0d0] text-lg mb-2 relative">
              <span className="text-3xl text-[#a67c52] absolute -left-6 -top-2">“</span>
              {testimonials[testimonialIdx].text}
              <span className="text-3xl text-[#a67c52] absolute -right-6 -bottom-2">”</span>
            </blockquote>
            <div className="flex gap-1 mb-1">
              {[...Array(testimonials[testimonialIdx].rating)].map((_, i) => (
                <StarIcon key={i} className="h-5 w-5 text-[#a67c52]" />
              ))}
            </div>
            <div className="font-semibold text-[#6b5c3e] dark:text-[#e6e0d0]">— {testimonials[testimonialIdx].name}, {testimonials[testimonialIdx].role}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Staff & Trust Section - Horizontal Scroll with Animated Borders */}
      <div className="w-full max-w-5xl mx-auto mb-16 animate-fade-in">
        <h2 className="text-2xl font-bold text-[#6b5c3e] dark:text-[#e6e0d0] mb-6 text-center">Meet Our Team</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
          {staff.map((member, idx) => (
            <motion.div key={idx} whileHover={{ scale: 1.05 }} className="min-w-[220px] bg-white/90 dark:bg-[#23211c]/80 rounded-xl shadow-lg p-6 flex flex-col items-center border-2 border-transparent hover:border-[#a67c52] cursor-pointer transition snap-center">
              <Image src={member.photo} alt={member.name} width={80} height={80} className="rounded-full mb-3 object-cover" />
              <div className="font-bold text-[#6b5c3e] dark:text-[#e6e0d0] mb-1">{member.name}</div>
              <div className="text-xs text-[#a67c52] mb-2">{member.role}</div>
              <p className="text-sm text-[#7c6a4d] dark:text-[#e6e0d0] text-center">{member.bio}</p>
            </motion.div>
          ))}
        </div>
        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 animate-fade-in">
          {trustBadges.map((badge, idx) => (
            <motion.div key={idx} whileHover={{ scale: 1.08 }} className="flex items-center gap-2 bg-[#ede7db] dark:bg-[#23211c]/80 text-[#6b5c3e] dark:text-[#e6e0d0] px-6 py-3 rounded-full shadow text-base font-semibold border border-[#e6e0d0]">
              <badge.icon className="h-6 w-6" /> {badge.label}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sticky CTA Banner with Animated Gradient */}
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="sticky bottom-0 z-50 w-full bg-gradient-to-r from-[#a67c52] via-[#2F6DB6] to-[#6b5c3e] text-white py-8 px-4 flex flex-col md:flex-row items-center justify-between shadow-2xl rounded-t-2xl animate-fade-in border-t-4 border-[#f8f6ef]">
        <div className="text-xl font-bold mb-4 md:mb-0">Ready to experience the difference?</div>
        <AdvancedButton size="lg" variant="primary" href="/contact" className="!bg-white !text-[#a67c52] hover:!bg-[#f8f6ef] border-2 border-[#a67c52] shadow-lg">Request a Tour</AdvancedButton>
      </motion.div>
    </div>
  );
}