/** @type {import('tailwindcss').Config} */
module.exports = {
  // أخبر Tailwind: فتّش في هذه الملفات عن الكلاسات
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold:  "#C9A84C",
        "gold-light": "#F0D080",
        "gold-dark":  "#8B6914",
        dark:  "#080808",
      },
      fontFamily: {
        cairo:   ["Cairo",   "sans-serif"],
        tajawal: ["Tajawal", "sans-serif"],
      },
    },
  },
  plugins: [],
}
