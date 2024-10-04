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
            whiteBg: '#fafaf9',
            blackBg: '#171717',
            textColor: '#737373',
         },
         backgroundImage: {
            'main-gradient': "url('/gradient.jpg')",
         },
         boxShadow: {
            smooth:
               'inset 0px 2px 3px 1.5px rgba(255, 255, 255, 20%), inset 0px -4px 10px 1.5px rgba(0, 0, 0, 60%), 0px 2px 8px 1px rgba(0, 0, 0, 10%)',
            skqueo:
               'inset 0px 3px 1px 0.5px rgba(255, 255, 255, 80%), inset 0px -2px 1px 0.5px rgba(0, 0, 0, 60%), inset 0px 11px 8px -3.5px rgba(255, 255, 255, 60%), inset 0px -6px 8px -3.5px rgba(0, 0, 0, 25%), 0px 2px 9px -1.5px rgba(0, 0, 0, 25%)',
            'skqueo-activated':
               'inset 0px 3px 10px 0.5px rgba(0, 0, 0, 22%), inset 0px 2px 1px 0.5px rgba(0, 0, 0, 60%), inset 0px 6px 14px -1.5px rgba(0, 0, 0, 60%), inset 0px -6px 8px -3.5px rgba(0, 0, 0, 25%), 0px 2px 9px -1.5px rgba(0, 0, 0, 25%)',
            'skqueo-white':
               'inset 0px 3px 1px 0.5px rgba(255, 255, 255, 80%), inset 0px -2px 1px 0.5px rgba(0, 0, 0, 60%), inset 0px 11px 8px -3.5px rgba(255, 255, 255, 60%), inset 0px -6px 8px -3.5px rgba(0, 0, 0, 25%), 0px 1.2px 6px -1.5px rgba(0, 0, 0, 15%)',
            'skqueo-white-activated':
               'inset 0px 5px 10px 0.5px rgba(0, 0, 0, 25%), inset 0px 2px 1px 0.5px rgba(0, 0, 0, 60%), inset 0px 6px 14px -1.5px rgba(0, 0, 0, 60%), inset 0px -6px 8px -3.5px rgba(0, 0, 0, 25%), 0px 1.2px 6px -1.5px rgba(0, 0, 0, 15%)',
            'inner-right': 'inset 2px 0 4px -1px rgba(0, 0, 0, 0.05)',
            'inner-left': 'inset -2px 0 4px -1px rgba(0, 0, 0, 0.05)',
         },
         keyframes: {
            rotation: {
               '0%': { rotate: '0deg' },
               '100%': { rotate: '360deg' },
            },
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
            rotation: 'rotation 15s linear infinite',
            'accordion-down': 'accordion-down 0.2s ease-out',
            'accordion-up': 'accordion-up 0.2s ease-out',
         },
      },
   },
   plugins: [require('tailwindcss-animate'), require('tailwindcss-safe-area')],
}
