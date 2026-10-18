/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          ivory: '#FAF7F2',
          card: '#FFFFFF',
          charcoal: '#22201E',
          muted: '#686461',
          border: '#E8E4DD',
          terracotta: '#C85A32',
          'terracotta-hover': '#B04B25',
          sage: '#6D8B74',
          'sage-light': '#EBF1ED',
          sand: '#F2ECE4'
        }
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
