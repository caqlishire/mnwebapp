import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Advanced Design Token System
        brand: {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2F6DB6', // Primary brand color
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        surface: {
          'paper': '#ffffff',
          'elevated': '#f8fafc',
          'overlay': 'rgba(248, 250, 252, 0.95)',
          'glass': 'rgba(255, 255, 255, 0.8)',
          'backdrop': 'rgba(15, 23, 42, 0.4)',
        },
        semantic: {
          success: {
            50: '#ecfdf5',
            500: '#10b981',
            600: '#059669',
          },
          warning: {
            50: '#fffbeb',
            500: '#f59e0b',
            600: '#d97706',
          },
          error: {
            50: '#fef2f2',
            500: '#ef4444',
            600: '#dc2626',
          },
          info: {
            50: '#eff6ff',
            500: '#3b82f6',
            600: '#2563eb',
          },
        },
        healthcare: {
          trust: '#2F6DB6',      // Trust and reliability
          calm: '#059669',       // Calming and healing
          mint: '#6EE7B7',       // Mint green for freshness
          teal: '#14B8A6',       // Teal for modern healthcare
          blue: '#3B82F6',       // Blue for calm and trust
          softgreen: '#A7F3D0',  // Soft green for comfort
          lavender: '#C4B5FD',   // Gentle purple for care
          professional: '#475569', // Professional and clinical
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2F6DB6', // United Providers blue
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569', // Clean gray accent
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569', // Cool gray
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        glass: {
          light: 'rgba(248, 250, 252, 0.1)',
          medium: 'rgba(71, 85, 105, 0.15)',
          dark: 'rgba(15, 23, 42, 0.85)',
          overlay: 'rgba(15, 23, 42, 0.75)',
        },
        gradient: {
          'primary-light': 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          'primary-medium': 'linear-gradient(135deg, #3b82f6 0%, #2F6DB6 100%)',
          'primary-dark': 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
          'card-light': 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          'card-hover': 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
          'hero-overlay': 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 1.3rem + 1vw, 2rem)',
        'fluid-3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.5rem)',
        'fluid-4xl': 'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)',
        'fluid-5xl': 'clamp(3rem, 2.5rem + 2.5vw, 4rem)',
        'fluid-6xl': 'clamp(3.75rem, 3rem + 3.75vw, 5rem)',
      },
      spacing: {
        // Golden Ratio Based Spacing System
        '18': '4.5rem',
        '88': '22rem', 
        '128': '32rem',
        '144': '36rem',
        // Advanced spacing tokens
        'section-sm': '4rem',    // 64px
        'section-md': '6rem',    // 96px  
        'section-lg': '8rem',    // 128px
        'section-xl': '12rem',   // 192px
        'micro': '0.125rem',     // 2px
        'nano': '0.0625rem',     // 1px
      },
      // Advanced component sizing
      width: {
        'button-sm': '8rem',
        'button-md': '12rem', 
        'button-lg': '16rem',
        'card-sm': '20rem',
        'card-md': '24rem',
        'card-lg': '32rem',
      },
      height: {
        'button-sm': '2.5rem',
        'button-md': '3rem',
        'button-lg': '3.5rem',
        'hero-mobile': '60vh',
        'hero-desktop': '80vh',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'gentle-bounce': 'gentleBounce 2s ease-in-out infinite',
        'float-gentle': 'floatGentle 4s ease-in-out infinite',
        'glass-shimmer': 'glassShimmer 3s ease-in-out infinite',
        'slide-in-up': 'slideInUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        gentleBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-10px) scale(1.02)' },
        },
        glassShimmer: {
          '0%': { opacity: '0.1' },
          '50%': { opacity: '0.3' },
          '100%': { opacity: '0.1' },
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        // Sophisticated shadow system
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 8px -2px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(47, 109, 182, 0.3)',
        'glow-strong': '0 0 40px rgba(47, 109, 182, 0.4)',
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        // Senior designer level shadows
        'card-rest': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)',
        'card-active': '0 5px 15px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
        'floating': '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06)',
        'depth-1': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'depth-2': '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
        'depth-3': '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
        'depth-4': '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
        'depth-5': '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem', 
        '3xl': '1.5rem',
        // Advanced border radius system
        'micro': '0.125rem',     // 2px
        'small': '0.25rem',      // 4px
        'medium': '0.5rem',      // 8px
        'large': '1rem',         // 16px
        'xlarge': '1.5rem',      // 24px
        'pill': '9999px',
        'organic': '30% 70% 70% 30% / 30% 30% 70% 70%',
      },
      // Advanced animation system
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'ease-in-out-back': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      // Layout grid system
      gridTemplateColumns: {
        'bento-sm': 'repeat(2, 1fr)',
        'bento-md': 'repeat(3, 1fr)', 
        'bento-lg': 'repeat(4, 1fr)',
        'asymmetric': '1fr 2fr 1fr',
        'golden': '1fr 1.618fr',
      },
    },
  },
  plugins: [],
}

export default config