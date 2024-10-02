const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--aw-color-primary)',
        secondary: 'var(--aw-color-secondary)',
        accent: 'var(--aw-color-accent)',
      },
      screens: {
        '3xl': '1919px',
        '4xl': '2000px',
      },
      fontFamily: {
        sans: ['var(--aw-font-sans)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--aw-font-serif)', ...defaultTheme.fontFamily.serif],
        heading: ['var(--aw-font-heading)', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        ['shine-infinite']: 'shine-infinite 2s ease-in-out infinite',
      },
      keyframes: {
        ['shine-infinite']: {
          '0%': {
            transform: 'skew(-12deg) translateX(-100%)',
          },
          '100%': {
            transform: 'skew(-12deg) translateX(100%)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: 'class',
};
