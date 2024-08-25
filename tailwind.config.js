/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {},
    colors: {
      'text': '#defcf0',
      'background': '#01130d',
      'light-background': '#091A15',
      'primary': '#7ff5ca',
      'secondary': '#0c8c9d',
      'accent': '#41c2f1',
    },
  },
  plugins: [
    require('flowbite/plugin')({
      charts: true,
    }),
  ],
}