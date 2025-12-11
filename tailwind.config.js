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
        'root-note': 'var(--color-root-note)',
        'scale-note': 'var(--color-scale-note)',
        'fretboard': 'var(--color-fretboard)',
        'primary-bg': 'var(--color-primary-bg)',
        'secondary-bg': 'var(--color-secondary-bg)',
        'tertiary-bg': 'var(--color-tertiary-bg)',
        'text-main': 'var(--color-text-main)',
        'text-muted': 'var(--color-text-muted)',
        'accent': 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',

        // Aliases for backward compatibility or explicit usage if any remaining
        'dark-primary-bg': 'var(--color-primary-bg)',
        'dark-secondary-bg': 'var(--color-secondary-bg)',
        'dark-tertiary-bg': 'var(--color-tertiary-bg)',
        'dark-text-main': 'var(--color-text-main)',
        'dark-text-muted': 'var(--color-text-muted)',
        'dark-accent': 'var(--color-accent)',
        'dark-root-note': 'var(--color-root-note)',
        'dark-scale-note': 'var(--color-scale-note)',

        // Toggle Component
        'toggle-track': 'var(--color-toggle-track)',
        'toggle-btn-active': 'var(--color-toggle-btn-active)',
        'toggle-text-active': 'var(--color-toggle-text-active)',
        'toggle-text-inactive': 'var(--color-toggle-text-inactive)',
        'toggle-text-hover': 'var(--color-toggle-text-hover)',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
