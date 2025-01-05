/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // This is needed for dynamic class allocation (ref: purging)
  safelist: [
    "bg-secondary",
    "bg-green",
    "bg-red",
  ],
  theme: {
    colors: {
      primary: "#0A2647",
      secondary: "#2C74B3",
      tertiary: "#DDDDDD",
      white: "#FFFFFF",
      gray: "#333333",
      red: "#BB0000",
      green: "#00BB00",
    },
    fontFamily: {
      sans: ["Verdana", "Geneva", "Tahoma", "sans"],
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
    // safelist: [
    //   {
    //     pattern:
    //     /(bg|text|border)-(primary|secondary|tertiary|green|black|gray|red|white)/,
    //   },
    // ],
  },
  plugins: [],
}