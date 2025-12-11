/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
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

        // Dark mode colors
        'dark-primary-bg': '#0f172a',
        'dark-secondary-bg': '#1e293b',
        'dark-tertiary-bg': '#334155',
        'dark-text-main': '#f1f5f9',
        'dark-text-muted': '#94a3b8',
        'dark-accent': '#3b82f6',
        'dark-accent-hover': '#2563eb',
        'dark-fretboard': '#2d1f15',
        'dark-root-note': '#ef4444',
        'dark-scale-note': '#60a5fa',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
