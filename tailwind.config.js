/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a1a1a",
        secondary: "#f5f5f5",
        accent: "#d4a574",
        surface: "#ffffff",
        background: "#fafafa",
        success: "#2d6a4f",
        warning: "#f77f00",
        error: "#c1121f",
        info: "#4a5568"
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}