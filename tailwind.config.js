/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#ff4500',          // Reddit Orange
        'primary-hover': '#ff5722',
        background: '#0b1416',       // Dark mode
        surface: '#1a1a1b',
        'surface-hover': '#272729',
        text: '#d7dadc',
        'text-secondary': '#818384',
        border: '#343536',
        success: '#46d160',
        error: '#ea0027',
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
        md: '0 4px 6px rgba(0, 0, 0, 0.16)',
        lg: '0 10px 20px rgba(0, 0, 0, 0.24)',
      },
    },
  },
  plugins: [],
};
