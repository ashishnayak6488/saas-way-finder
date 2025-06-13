/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: [
  //   './app/**/*.{js,ts,jsx,tsx}', // Updated to include .ts and .tsx
  //   './components/**/*.{js,ts,jsx,tsx}',
  //   './src/**/*.{js,ts,jsx,tsx}',
  // ],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};