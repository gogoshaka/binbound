/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx, css}', // Note the addition of the `app` directory.
  ],
  theme: {
    
    extend: {
      /*
      colors: {
        'activestone': '#a8a29e',
        'activestone-hover': '#d6d31',
        'bblue': '#0F5997',
        'custom-pink': '#FA6FCC',
      },
      */
    },
  },
  plugins: [function ({ addBase, theme }) {
    addBase({
      ':root': {
        '--color-stone-50': theme('colors.stone.50'),
        '--color-stone-100': theme('colors.stone.100'),
      },
    });
  },],
}

