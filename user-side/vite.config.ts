// import type { Config } from 'tailwindcss';

// const config: Config = {
//   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
//   
//   plugins: [],
// };

// export default config;
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  // theme: {
  //       extend: {
  //         colors: {
  //           primary: {
  //             DEFAULT: '#6A0DAD', // Purple for awareness & strength
  //             light: '#800080',
  //           },
  //           secondary: {
  //             DEFAULT: '#2563EB', // Trust & security (blue)
  //             light: '#1E3A8A',
  //           },
  //           accent: {
  //             pink: '#FAD2E1', // Compassion & care
  //             teal: '#20B2AA', // Healing & support
  //           },
  //           neutral: {
  //             light: '#F3F4F6', // Light grey background
  //             dark: '#1F2937', // Dark grey for text
  //           },
  //         },
  //       },
  //     },
})
