/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sonar: {
          primary: '#4b9fd5',
          secondary: '#236a97',
          dark: '#262626',
          sidebar: '#2d3436',
          bg: '#f3f3f8',
          card: '#ffffff',
          border: '#e6e6e6',
          green: '#00c853',
          red: '#d32f2f',
          orange: '#ff9800',
          yellow: '#ffc107',
          blue: '#1976d2',
        },
        rating: {
          A: '#00c853',
          B: '#7cb342',
          C: '#ff9800',
          D: '#ff5722',
          E: '#d32f2f',
        },
        severity: {
          blocker: '#d32f2f',
          critical: '#d32f2f',
          major: '#ff9800',
          minor: '#4caf50',
          info: '#2196f3',
        },
      },
    },
  },
  plugins: [],
};
