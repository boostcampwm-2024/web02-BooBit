/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        'display-bold-32': ['2rem', { lineHeight: 'auto', fontWeight: '700' }], // 24px Bold
        'display-bold-24': ['1.5rem', { lineHeight: 'auto', fontWeight: '700' }], // 24px Bold
        'display-bold-20': ['1.25em', { lineHeight: 'auto', fontWeight: '700' }], // 20px Bold
        'display-bold-16': ['1rem', { lineHeight: 'auto', fontWeight: '700' }], // 16px Bold
        'display-bold-14': ['0.875rem', { lineHeight: 'auto', fontWeight: '700' }], // 14px Bold
        'display-bold-12': ['0.75rem', { lineHeight: 'auto', fontWeight: '700' }], // 12px Bold
        'available-medium-16': ['1rem', { lineHeight: '22px', fontWeight: '500' }], // 16px Medium
        'available-medium-14': ['0.875rem', { lineHeight: 'auto', fontWeight: '500' }], // 14px Medium
        'available-medium-12': ['0.75rem', { lineHeight: 'auto', fontWeight: '500' }], // 12px Medium
        'available-medium-10': ['0.625rem', { lineHeight: 'auto', fontWeight: '500' }], // 10px Medium
        'hover-medium-16': [
          '1rem',
          {
            lineHeight: '22px',
            fontWeight: '500',
            textDecoration: 'underline',
          },
        ], // 16px Medium
        'hover-medium-14': [
          '0.875rem',
          {
            lineHeight: 'auto',
            fontWeight: '500',
            textDecoration: 'underline',
          },
        ], // 14px Medium
      },
      colors: {
        primary: '#5A4F9C',
        accent: '#63D1FF',
        'surface-default': '#1E1E2F',
        'surface-hover-light': '#2B2B3D',
        'surface-alt': '#5A90E8',
        'background-default': '#121212',
        'text-light': '#E0E0E0',
        'text-dark': '#A0A0A0',
        positive: '#00E676',
        negative: '#FF5252',
        'border-default': '#33334D',
        'border-alt': '#4D4D66',
      },
    },
  },
  plugins: [],
};
