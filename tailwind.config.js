/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'palblack': {  DEFAULT: '#0E0E0F',  50: '#C4C4C8',  100: '#BABABE',  200: '#A4A4AB',  300: '#8F8F97',  400: '#7A7A83',  500: '#67676E',  600: '#535359',  700: '#3F3F44',  800: '#2C2C2F',  900: '#18181A',  950: '#0E0E0F'},
        'palblue': {  DEFAULT: '#5765F2',  50: '#FFFFFF',  100: '#EEF0FE',  200: '#C9CDFB',  300: '#A3AAF8',  400: '#7D88F5',  500: '#5765F2',  600: '#2335EE',  700: '#1020C9',  800: '#0C1895',  900: '#081061',  950: '#050B47'},
      }
    },
  },
  plugins: [],
}
