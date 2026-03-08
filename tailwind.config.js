/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          400: '#4ECDC4',
          500: '#3DBDB4',
        },
        coral: {
          400: '#FF6B6B',
          500: '#FF5252',
        },
        amber: {
          300: '#FFD93D',
        },
        cream: '#FFF8E7',
      },
      fontFamily: {
        display: ['Fredoka', 'cursive'],
        body: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
