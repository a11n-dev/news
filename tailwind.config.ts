/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Plus Jakarta Sans", "sans-serif"],
    },
    screens: {
      sm: "540px",
      md: "720px",
      lg: "960px",
      xl: "1140px",
      "2xl": "1440px",
    },
    container: {
      center: true,
      screens: {
        sm: "540px",
        md: "720px",
        lg: "960px",
        xl: "1140px",
        "2xl": "1440px",
      },
      padding: "1rem",
    },
  },
  plugins: [],
};
