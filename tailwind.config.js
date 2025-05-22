/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  plugins: [],
  theme: {
    extend: {
      keyframes: {
        flash: {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: '#d1fae5' }, // light green
        },      
      },
      animation: {
        'flash-once': 'flash 1s ease-in-out',
      },
    },
  },
}
