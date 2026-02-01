/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'prepare': '#3b82f6',
        'work': '#ef4444',
        'rest': '#22c55e',
      },
    },
  },
  plugins: [],
}
