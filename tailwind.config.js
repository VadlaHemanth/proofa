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
          50: '#eef8ff',
          100: '#d9f0ff',
          200: '#bce4ff',
          300: '#8ed2ff',
          400: '#57b7ff',
          500: '#2b97ff',
          600: '#0f75f5',
          700: '#075de0',
          800: '#0c4bb6',
          900: '#10418f',
          950: '#0a275c',
        },
      },
    },
  },
  plugins: [],
}
