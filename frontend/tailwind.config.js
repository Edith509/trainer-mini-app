/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "#0F172A",
          surface: "#111827",
          text: "#E5E7EB",
          muted: "#9CA3AF",
          primary: "#3B82F6",
          success: "#22C55E",
          danger: "#EF4444",
        }
      }
    },
  },
  plugins: [],
};
