/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Deep forest green - crafted, trustworthy
        forest: {
          50: '#f0f7f4',
          100: '#dcebe3',
          200: '#b8d6c6',
          300: '#8ab9a2',
          400: '#5d9a7d',
          500: '#3a7d5f',
          600: '#2c644c',
          700: '#254f3e',
          800: '#1f3f32',
          900: '#1a3429',
        },
        // Accent: Warm copper - human, handcrafted
        copper: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        },
        // Neutral: Warm off-white - not clinical white
        cream: {
          50: '#fefdfb',
          100: '#fcf9f4',
          200: '#f8f3eb',
          300: '#f3ebe0',
          400: '#e8ddd0',
          500: '#d4c4b0',
        },
        // Text: Deep charcoal - readable, not pure black
        ink: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#1d1d1d',
        }
      },
      fontFamily: {
        // Serif for headlines - feels crafted, not AI-smooth
        display: ['Georgia', 'Times New Roman', 'serif'],
        // Clean sans for body - but not Inter/Roboto (too AI)
        body: ['Charter', 'Source Serif Pro', 'Georgia', 'serif'],
        // Monospace for data - honest, technical
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        // Size scale that feels intentional
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.5rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-md': ['2.5rem', { lineHeight: '1.2' }],
        'display-sm': ['1.75rem', { lineHeight: '1.3' }],
      },
      boxShadow: {
        // Soft shadows - not harsh AI drop shadows
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'soft': '0.5rem',
        'softer': '0.75rem',
      }
    },
  },
  plugins: [],
}
