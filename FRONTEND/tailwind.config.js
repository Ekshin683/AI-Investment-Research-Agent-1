/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary:   "#070d14",
        secondary: "#0d1521",
        card:      "#111827",
        accent:    "#00ff9d",
        danger:    "#ff4757",
        warning:   "#ffd32a",
        info:      "#00b4ff",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};