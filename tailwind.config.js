
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './*.{js,ts,jsx,tsx}',
    './index.html',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#0a0a0a',
          lighter: '#1a1a1a',
          card: '#121212',
          muted: 'rgba(10, 10, 10, 0.8)',
        },
        neonRed: {
          DEFAULT: '#ff003c',
          glow: '#ff1e56',
          muted: 'rgba(255, 0, 60, 0.1)',
        },
        offWhite: {
          DEFAULT: '#fdfdfd',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      zIndex: {
        'hud': '40',
        'header': '100',
        'menu': '150',
        'consent': '180',
        'overlay': '200',
        'drawer': '210',
        'preloader': '2000',
      },
      backdropBlur: {
        'xs': '2px',
        '3xl': '40px',
        '4xl': '60px',
      },
      boxShadow: {
        'neon': '0 0 15px -3px rgba(255, 0, 60, 0.4), 0 4px 6px -4px rgba(255, 0, 60, 0.2)',
        'neon-strong': '0 0 25px 0px rgba(255, 0, 60, 0.6)',
        'soft': '0 10px 30px -10px rgba(0,0,0,0.05)',
      },
      keyframes: {
        'scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'loading-shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'width-pulse': {
          '0%, 100%': { width: '2rem' },
          '50%': { width: '4rem' },
        },
        'gradient': {
          '0%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '200% 50%' },
        }
      },
      animation: {
        'scroll': 'scroll 40s linear infinite',
        'shimmer': 'loading-shimmer 1.5s infinite',
        'width-pulse': 'width-pulse 2s ease-in-out infinite',
        'gradient-text': 'gradient 3s linear infinite',
      },
    },
  },
  plugins: [],
};
