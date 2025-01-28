/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // This is needed for dynamic class allocation (ref: purging)
  safelist: [
    "bg-indigo-500",
    "bg-green-500",
    "bg-red-700",
  ],
  theme: {
    fontFamily: {
      primary: ["Montserrat", "sans"],
      secondary: ["Agbalumo", "sans"],
    },
    fontSize: {
      'xs': '0.6rem',
      'sm': '0.8rem',
      'base': '1rem',
      'xl': '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
    },
    boxShadow: {
      "none": "none",
      "sm": "0px 0px 0.2rem rgba(0, 0, 0, 0.2)",
      "md": "0px 0px 0.3rem rgba(0, 0, 0, 0.2)",
      "lg": "0px 0px 0.4rem rgba(0, 0, 0, 0.2)",
    },
    // safelist: [
    //   {
    //     pattern:
    //     /(bg|text|border)-(primary|secondary|tertiary|green|black|gray|red|white)/,
    //   },
    // ],
  },
  plugins: [],
}