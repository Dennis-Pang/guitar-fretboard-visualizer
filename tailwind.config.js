/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'root-note': '#EF4444',      // 红色 - 根音
        'scale-note': '#3B82F6',     // 蓝色 - 音阶音符
        'fretboard': '#3E2723',      // 深棕色 - 指板背景
      }
    },
  },
  plugins: [],
}
