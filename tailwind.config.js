/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#438eb9',
        secondary: '#5bc0de'
      }
    }
  },
  plugins: [
    require('flowbite/plugin')
  ]
}