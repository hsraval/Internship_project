/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
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
        // ─── New Brand Palette ───────────────────────────────
        brand: {
          50:  '#eef5fa',
          100: '#d7e9f2',   // soft background
          200: '#b0d3e6',
          300: '#80b3ba',   // soft accent blue
          400: '#5a95a3',
          500: '#3a7a8e',
          600: '#16537e',   // primary dark blue
          700: '#124470',
          800: '#0e3560',
          900: '#0a2650',
          950: '#061a38',
        },
        // ─── Legacy ink tokens (kept for backward compat) ────
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
        'card': '0 1px 3px rgba(22,83,126,0.08), 0 8px 32px rgba(22,83,126,0.06)',
        'card-hover': '0 4px 12px rgba(22,83,126,0.14), 0 16px 48px rgba(22,83,126,0.10)',
        'inset-top': 'inset 0 2px 4px rgba(22,83,126,0.06)',
        'brand-glow': '0 0 0 3px rgba(128,179,186,0.35)',
      },
    },
  },
  plugins: [],
}
