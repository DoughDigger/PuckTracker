/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f97316',
          light: '#fdba74',
          dark: '#ea580c',
        },
        secondary: {
          DEFAULT: '#64748b',
          light: '#94a3b8',
          dark: '#475569',
        },
        background: {
          DEFAULT: '#f8fafc',
          dark: '#f1f5f9',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#f8fafc',
        },
      },
    },
  },
  plugins: [],
}

module.exports = {
  theme: {
    extend: {
      flexDirection: {
        'horizontal': 'row',
      },
    },
  },
};
