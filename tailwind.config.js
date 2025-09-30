/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2d7a3e",
          light: "#5a9a68",
          dark: "#1f5529"
        },
        accent: {
          DEFAULT: "#f59e0b",
          light: "#fbbf24",
          dark: "#d97706"
        },
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",
        surface: "#ffffff",
        background: "#f8faf9"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};