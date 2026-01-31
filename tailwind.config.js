/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'prepare': '#22c55e',
        'work': '#ef4444',
      },
    },
  },
  plugins: [],
}
