/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f5f3ef',
          100: '#e8e3d8',
          200: '#d1c9b5',
          300: '#b5a98e',
          400: '#9a8a6a',
          500: '#7d6e52',
          600: '#645741',
          700: '#4d4131',
          800: '#362d22',
          900: '#1e1912',
          950: '#110e09',
        },
        gold: {
          400: '#d4a843',
          500: '#c49a2e',
          600: '#a07e20',
        },
        cream: '#faf7f2',
        parchment: '#f0ebe0',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(30,25,18,0.08), 0 8px 32px rgba(30,25,18,0.06)',
        'card-hover': '0 4px 12px rgba(30,25,18,0.12), 0 16px 48px rgba(30,25,18,0.10)',
        'inset-top': 'inset 0 2px 4px rgba(30,25,18,0.06)',
      },
    },
  },
  plugins: [],
}
