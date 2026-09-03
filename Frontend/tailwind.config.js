/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.7s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      // add the color style for about component here
      colors: {
      brand: {
        orange: '#D9631A',
        'orange-light': '#E8A876',
        'orange-bg': '#FCE6D4',
        brown: '#2B1B12',
        'brown-soft': '#5A4636',
        'brown-muted': '#6B5645',
        cream: '#FBF3EC',
      },
    }
    },
  },
  plugins: [],
};


