/** @type {import('tailwindcss').Config} */
module.exports = {
   darkMode: ['class'],
   content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}', './app/**/*.{js,jsx}', './src/**/*.{js,jsx}'],
   prefix: '',
   theme: {
      container: {
         center: true,
         padding: '2rem',
         screens: {
            '2xl': '1400px',
         },
      },
      extend: {
         colors: {
            primary: '#FF6363',
            secondary: {
               100: '#E2E2D5',
               200: '#888883',
            },
         },
         boxShadow: {
            'inner-right': 'inset 2px 0 4px -1px rgba(0, 0, 0, 0.05)',
            'inner-left': 'inset -2px 0 4px -1px rgba(0, 0, 0, 0.05)',
         },
         keyframes: {
            'accordion-down': {
               from: { height: '0' },
               to: { height: 'var(--radix-accordion-content-height)' },
            },
            'accordion-up': {
               from: { height: 'var(--radix-accordion-content-height)' },
               to: { height: '0' },
            },
         },
         animation: {
            'accordion-down': 'accordion-down 0.2s ease-out',
            'accordion-up': 'accordion-up 0.2s ease-out',
         },
      },
   },
   plugins: [require('tailwindcss-animate')],
}
