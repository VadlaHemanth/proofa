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
          50: '#eef7ff',
          100: '#d9ecff',
          200: '#b0d7ff',
          300: '#7abbff',
          400: '#3d9bff',
          500: '#0f83ff',
          600: '#0071e3',
          700: '#0060c9',
          800: '#0052ab',
          900: '#0a3d7c',
          950: '#062a56',
        },
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0, 0, 0, 0.06)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.65)',
        pop: '0 12px 40px rgba(0, 113, 227, 0.28)',
      },
      borderRadius: {
        '4xl': '28px',
      },
    },
  },
  plugins: [],
}
