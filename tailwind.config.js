/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      colors: {
        // Windows Blue accent — Fluent Design v1
        primary: {
          50:  '#EBF3FB',
          100: '#C3DCF5',
          200: '#90BFE8',
          300: '#60CDFF',
          400: '#4DB0E5',
          500: '#1697D5',
          600: '#0078D4',   // canonical Windows Blue
          700: '#106EBE',   // hover
          800: '#005A9E',   // pressed
          900: '#004578',
        },
        // WinUI Dark neutral surfaces
        surface: {
          50:  '#FAFAFA',
          100: '#F5F5F5',
          200: '#DFDFDF',
          300: '#ABABAB',
          400: '#868686',
          500: '#6E6E6E',
          600: '#4A4A4A',
          700: '#3C3C3C',   // hover / layer-alt
          800: '#2C2C2C',   // card / elevated panel
          900: '#202020',   // main app background
        },
      },
      fontFamily: {
        sans: [
          'Segoe UI Variable',
          'Segoe UI',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      borderRadius: {
        sm:  '4px',
        DEFAULT: '4px',
        md:  '6px',
        lg:  '8px',
        xl:  '8px',
        '2xl': '8px',
        full: '9999px',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        fluent: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
