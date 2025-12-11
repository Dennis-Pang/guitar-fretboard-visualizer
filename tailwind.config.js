/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'root-note': '#dc2626',
        'scale-note': '#2563eb',
        'fretboard': '#f4e6d4',
        'primary-bg': '#f5f7fb',
        'secondary-bg': '#ffffff',
        'tertiary-bg': '#e2e8f0',
        'text-main': '#0f172a',
        'text-muted': '#64748b',
        'accent': '#2563eb',
        'accent-hover': '#1d4ed8',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
