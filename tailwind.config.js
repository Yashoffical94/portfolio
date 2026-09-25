/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Primary: Orange (Goku gi)
        orange: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        // Secondary: Navy (deep space / undershirt)
        navy: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d5fe',
          300: '#a4b8fc',
          400: '#7a94f8',
          500: '#5c6ef2',
          600: '#3b4de8',
          700: '#2d3ad4',
          800: '#1e2ba8',
          900: '#131a6e',
          950: '#070b30',
        },
        // Accent: Gold (Ki / energy)
        gold: {
          300: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        // Space backgrounds
        space: {
          900: '#050816',
          800: '#080d1e',
          700: '#0d1435',
          600: '#111b48',
          500: '#1a2566',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(ellipse at 50% 50%, rgba(249,115,22,0.15) 0%, rgba(5,8,22,0) 70%)',
        'orange-glow': 'radial-gradient(circle, rgba(249,115,22,0.3) 0%, transparent 70%)',
        'gold-glow': 'radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)',
      },
      animation: {
        'aura-pulse': 'auraPulse 3s ease-in-out infinite',
        'energy-float': 'energyFloat 4s ease-in-out infinite',
        'ki-glow': 'kiGlow 2s ease-in-out infinite alternate',
        'scan-line': 'scanLine 8s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'particle-drift': 'particleDrift 6s ease-in-out infinite',
      },
      keyframes: {
        auraPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%':       { transform: 'scale(1.15)', opacity: '0.8' },
        },
        energyFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        kiGlow: {
          '0%':   { boxShadow: '0 0 20px rgba(249,115,22,0.4), 0 0 40px rgba(249,115,22,0.1)' },
          '100%': { boxShadow: '0 0 40px rgba(249,115,22,0.7), 0 0 80px rgba(249,115,22,0.2), 0 0 120px rgba(245,158,11,0.1)' },
        },
        scanLine: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        slideInRight: {
          '0%':   { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
        particleDrift: {
          '0%, 100%': { transform: 'translate(0,0)', opacity: '0' },
          '20%':      { opacity: '1' },
          '80%':      { opacity: '1' },
          '50%':      { transform: 'translate(30px,-30px)' },
        },
      },
      boxShadow: {
        'orange-sm':  '0 0 15px rgba(249,115,22,0.3)',
        'orange-md':  '0 0 30px rgba(249,115,22,0.4)',
        'orange-lg':  '0 0 60px rgba(249,115,22,0.5)',
        'gold-sm':    '0 0 15px rgba(245,158,11,0.3)',
        'gold-lg':    '0 0 60px rgba(245,158,11,0.5)',
        'navy-sm':    '0 0 20px rgba(30,43,168,0.4)',
        'glass':      '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        'card':       '0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)',
        'card-hover': '0 16px 48px rgba(249,115,22,0.15), 0 0 0 1px rgba(249,115,22,0.2)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      screens: {
        'xs': '375px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
}
