/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#121212',
          dark: '#0A0A0A',
          light: '#1E1E1E'
        },
        card: {
          DEFAULT: 'rgba(30, 30, 30, 0.9)',
          dark: 'rgba(20, 20, 20, 0.9)',
          light: 'rgba(40, 40, 40, 0.9)'
        },
        primary: {
          50: '#F5F5F5',
          100: '#E5E5E5',
          200: '#D4D4D4',
          300: '#BDBDBD',
          400: '#9E9E9E',
          500: '#757575',
          600: '#616161',
          700: '#424242',
          800: '#282828',
          900: '#1A1A1A',
        },
        secondary: {
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',
          800: '#212529',
          900: '#151515',
        },
        success: {
          DEFAULT: '#2E7D32',
          light: 'rgba(46, 125, 50, 0.2)',
        },
        info: {
          DEFAULT: '#0D47A1',
          light: 'rgba(13, 71, 161, 0.2)',
        },
        warning: {
          DEFAULT: '#E65100',
          light: 'rgba(230, 81, 0, 0.2)',
        },
        danger: {
          DEFAULT: '#B71C1C',
          light: 'rgba(183, 28, 28, 0.2)',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(127.09deg, rgba(0, 0, 0, 0.94) 19.41%, rgba(10, 10, 10, 0.49) 76.65%)',
        'primary-gradient': 'linear-gradient(90deg, #424242 0%, #757575 100%)',
        'secondary-gradient': 'linear-gradient(90deg, #343A40 0%, #6C757D 100%)',
        'success-gradient': 'linear-gradient(90deg, #1B5E20 0%, #388E3C 100%)',
        'info-gradient': 'linear-gradient(90deg, #0D47A1 0%, #1976D2 100%)',
        'warning-gradient': 'linear-gradient(90deg, #E65100 0%, #F57C00 100%)',
        'danger-gradient': 'linear-gradient(90deg, #B71C1C 0%, #D32F2F 100%)',
        'dashboard-background': 'radial-gradient(circle at 10% 20%, rgba(25, 25, 25, 1) 0%, rgba(10, 10, 10, 1) 90%)',
      },
      boxShadow: {
        'glass': '0 4px 12px 0 rgba(0, 0, 0, 0.3)',
        'card': '0 7px 23px 0 rgba(0, 0, 0, 0.4)',
        'button': '0 4px 10px 0 rgba(0, 0, 0, 0.25)',
        'glow': '0 0 15px 0 rgba(150, 150, 150, 0.2)',
      },
    },
  },
  plugins: [],
} 