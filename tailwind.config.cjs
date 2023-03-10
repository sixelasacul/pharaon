const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Mona Sans"'],
        headline: ['"Hubot Sans"']
      }
    }
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.oblique': {
          'font-variation-settings': '"ital" 10'
        },
        '.semi-expanded': {
          'font-stretch': 'semi-expanded'
        }
      })
    })
  ]
}
