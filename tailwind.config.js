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
    plugins: [require("@tailwindcss/line-clamp")],
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

            colors: {
                gb: {
                    bg: "#1e1e1e",
                    fg: "#ebdbb2",
                    red: "#fb4934",
                    green: "#b8bb26",
                    yellow: "#fabd2f",
                    blue: "#83a598",
                    purple: "#d3869b",
                    aqua: "#8ec07c",
                    orange: "#fe8019",
                    gray: "#3c3836",
                    comment: "#928374",
                },
                mt: {
                    bg: "#222526",
                    fg: "#d4be98",
                    cyan: "#89b482",
                    black: "#665c54",
                    gray: "#504945",
                    magenta: "#d3869b",
                    pink: "#ea6962",
                    red: "#ea6962",
                    green: "#a9b665",
                    yellow: "#d8a657",
                    blue: "#7daea3",
                    orange: "#e78a4e",
                    black4: "#928374",
                },
            },
        },
    },
};
