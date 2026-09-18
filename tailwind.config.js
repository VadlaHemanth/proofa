/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef1ff',
          100: '#e1e5fd',
          200: '#c9cffb',
          300: '#a5aef8',
          400: '#7f83f3',
          500: '#6157f0',
          600: '#5147e5',
          700: '#4438ca',
          800: '#393099',
          900: '#332e6e',
          950: '#1e1b3f',
        },
        mint: {
          50: '#ecfdf4',
          100: '#d0fae1',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        lilac: {
          100: '#f1eafe',
          300: '#c4a8fa',
          500: '#a855f7',
        },
      },
      fontFamily: {
        display: ['Sora', 'Inter', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(46, 32, 120, 0.08)',
        glass: '0 8px 32px rgba(46, 32, 120, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
        pop: '0 12px 34px rgba(81, 71, 229, 0.38), 0 2px 8px rgba(81, 71, 229, 0.22)',
        mintpop: '0 12px 30px rgba(34, 197, 94, 0.32)',
      },
      borderRadius: {
        '4xl': '28px',
      },
    },
  },
  plugins: [],
}
