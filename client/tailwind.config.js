/** @type {import('tailwindcss').Config} */
import flowbite from 'flowbite/plugin';
import tailwindScrollbar from 'tailwind-scrollbar';

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
       'edu': ['"Edu NSW ACT Cursive"', 'cursive', 'sans-serif'],
        
        'playwrite': ['"Playwrite DE SAS"', 'cursive', 'sans-serif'],
        
        'updock': ['Updock', 'cursive', 'sans-serif'],
        
        'bitcount': ['"Bitcount Grid Single Ink"', 'monospace', 'sans-serif'],
      },
    },
  },
  plugins: [flowbite, tailwindScrollbar],
};