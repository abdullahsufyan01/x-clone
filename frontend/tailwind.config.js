import daisyui from 'daisyui'
import daisyUIThemes from "daisyui/src/theming/themes";
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: [
      "light",
      {
        black: {
          ...daisyUIThemes["black"],
          primary: "rgb(22, 26, 29)",
          secondary: "rgb(102, 7, 8)",
          accent:"rgb(177, 167, 166)",
          neutral:"rgb(245, 243, 244)",
          base:"rgb(255, 255, 255)",
          error:"rgb(229, 56, 59)",
          info:"rgb(211, 211, 211)"
        },
      },
    ],
  },
}