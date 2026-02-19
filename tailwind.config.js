/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable dark mode using class strategy
  theme: {
    extend: {
      colors: {
        primary: {
          dark: "#1a1a2e",
          light: "#f8f9fa",
        },
        secondary: {
          dark: "#1e1e1e",
          light: "#ffffff",
        },
        accent: {
          dark: "#2d2d2d",
          light: "#e9ecef",
        },
        text: {
          primary: {
            dark: "#f5f5f5",
            light: "#212529",
          },
          secondary: {
            dark: "#b0b0b0",
            light: "#6c757d",
          },
        },
        border: {
          dark: "#333333",
          light: "#dee2e6",
        },
        card: {
          dark: "#242424",
          light: "#ffffff",
        },
        success: "#4caf50",
        warning: "#ff9800",
        danger: "#f44336",
        info: "#2196f3",
      },
    },
  },
  plugins: [],
};