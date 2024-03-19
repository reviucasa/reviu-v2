import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#E7EDEB",
          200: "#B8C9C3",
          300: "#719286",
          500: "#124A36",
          900: "#134033",
        },
        secondary: { 200: "#F5F2FE", 300: "#E2D9FD", 500: "#9E80F7" },
        terciary: "#E7EDEB",
        obscure: "#161925",
        lime: "#D1F780",
      },
      fontFamily: {
        secondary: ["PPEditorialNew"],
      },
      boxShadow: {
        trans: "0px 0px 0px 8px rgba(18,74,54,0.15)",
      },
      screens: {
        xs: { max: "350px" },
      },
      keyframes: {
        slideIn: {
          "0%, 100%": {
            opacity: "0",
            transform: "translateX(50px)",
          },
          "50%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        slideOut: {
          "0%": {
            opacity: "1",
            transform: "translateX(0)",
          },
          "100%": {
            opacity: "0",
            transform: "translateX(-50px)",
          },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        slideIn: "slideIn 0.5s ease-in-out",
        slideOut: "slideOut 0.5s ease-in-out",
        wiggle: "wiggle 1s ease-in-out ",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};
export default config;
