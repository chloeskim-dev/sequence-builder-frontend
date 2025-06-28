/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    {
      pattern:
        /^text-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-800$/,
    },
  ],
  plugins: [],
  theme: {
    extend: {
      keyframes: {
        flash: {
          "0%, 100%": { backgroundColor: "transparent" },
          "50%": { backgroundColor: "#d1fae5" }, // light green
        },
      },
      animation: {
        "flash-once": "flash 1s ease-in-out",
      },
    },
  },
};
