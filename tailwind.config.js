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
            whiteBg: 'rgba(250, 250, 249, 0.6)',
            selectedBg: 'rgba(132, 204, 22, 0.3)',
            blackBg: '#171717',
            textColor: '#737373',
         },
         backgroundImage: {
            'main-gradient': "url('/gradient.jpg')",
         },
         boxShadow: {
            smooth:
               'inset 0px 2px 3px 1.5px rgba(255, 255, 255, 20%), inset 0px -4px 10px 1.5px rgba(0, 0, 0, 60%), 0px 2px 8px 1px rgba(0, 0, 0, 10%)',
            skeuo: 'inset 0px 1px 1px 0.5px rgba(255, 255, 255, 70%), inset 0px -2px 1px 0.5px rgba(0, 0, 0, 60%), inset 0px 9px 8px -3.5px rgba(255, 255, 255, 50%), inset 0px -6px 8px -3.5px rgba(0, 0, 0, 25%)',
            'skeuo-active':
               'inset 0px 3px 10px 0.5px rgba(0, 0, 0, 22%), inset 0px 2px 1px 0.5px rgba(0, 0, 0, 60%), inset 0px 6px 14px -1.5px rgba(0, 0, 0, 60%), inset 0px -6px 8px -3.5px rgba(0, 0, 0, 25%)',
            'skeuo-white':
               'inset 0px 3px 1px 0.5px rgba(255, 255, 255, 80%), inset 0px -1.5px 3px 0.5px rgba(0, 0, 0, 5%), inset 0px 11px 8px -3.5px rgba(255, 255, 255, 60%), inset 0px -6px 8px -3.5px rgba(0, 0, 0, 5%)',
            'skeuo-white-active':
               'inset 0px 5px 10px 0.5px rgba(0, 0, 0, 5%), inset 0px 2px 1px 0.5px rgba(0, 0, 0, 10%), inset 0px 6px 14px -1.5px rgba(0, 0, 0, 10%), inset 0px -6px 8px -3.5px rgba(0, 0, 0, 10%)',
         },
         transitionTimingFunction: {
            gentle: 'cubic-bezier(0.47, 0, 0.23, 1.38)',
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
