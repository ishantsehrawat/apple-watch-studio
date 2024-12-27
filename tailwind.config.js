/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        hide: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        homeWatch: {
          "0%": { transform: "scale(1)", top: "80%" },
          "100%": { transform: "scale(1.5)", top: "50%" },
        },
        animation: {
          hide: "hide 0.5s ease-out forwards",
          homeWatch: "homeWatch 1s ease-out forwards",
        },
      },
      colors: {
        appleBlue: "#0071E3",
        appleGrey: "#E8E8ED",
        fontGrey: "#6E6E73",
        fontBlue: "#06c",
      },
      fontSize: {
        "6.5xl": "4rem",
      },
      screens: {
        xs: "380px",
      },
    },
  },
  plugins: [],
};
