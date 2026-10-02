/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Outfit"', 'sans-serif'],
      },
      colors: {
        // Warm-white theme tokens
        ink: '#1F2937',        // deep charcoal — headings & body text
        warm: '#FAF9F6',       // soft off-white — page background
        card: '#FFFFFF',       // container cards
        line: '#E8E5DC',       // soft neutral borders
        seal: '#0F2C59',       // deep navy from the official logo seal (primary accent)
        // Brand palette
        civil: {
          50: '#eef3fb',
          100: '#d6e1f2',
          200: '#adc3e5',
          300: '#7b9bd3',
          400: '#4a72bd',
          500: '#2a4f92',
          600: '#1a3a74',
          700: '#0F2C59',
          800: '#0b2145',
          900: '#061224',
        },
        gold: {
          50: '#fff8e6',
          100: '#ffefc2',
          200: '#ffe18a',
          300: '#ffd154',
          400: '#f5b417',
          500: '#E9A100',
          600: '#c98a00',
          700: '#a36f00',
          800: '#7d5500',
          900: '#5a3d00',
        },
        slate: {
          DEFAULT: '#F8F9FA',
        },
        dark: {
          900: '#061224',
          800: '#0a1a33',
          700: '#0f2444',
          600: '#16305a',
        }
      },
      boxShadow: {
        'gold': '0 10px 30px -10px rgba(233, 161, 0, 0.45)',
        'civil': '0 10px 30px -10px rgba(15, 44, 89, 0.5)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%': { boxShadow: '0 0 12px rgba(15, 44, 89, 0.25)' },
          '100%': { boxShadow: '0 0 22px rgba(15, 44, 89, 0.45)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
