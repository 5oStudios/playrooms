import { nextui } from '@nextui-org/theme';
import { join } from 'path';
import colors from 'tailwindcss/colors';

const svgToDataUri = require('mini-svg-data-uri');

const {
  default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',

    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',

    join(__dirname, './pages/**/*.{js,ts,jsx,tsx}'),
    join(__dirname, './src/**/*.{js,ts,jsx,tsx}'),
    join(
      __dirname,
      '../../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    ),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: colors.neutral[100],
          dark: colors.neutral[700],
          50: colors.neutral[50],
          100: colors.neutral[100],
          200: colors.neutral[200],
          300: colors.neutral[300],
          400: colors.neutral[400],
          500: colors.neutral[500],
          600: colors.neutral[600],
          700: colors.neutral[700],
          800: colors.neutral[800],
          900: colors.neutral[900],
        },
        secondary: {
          DEFAULT: colors.blue[500],
          dark: colors.blue[700],
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui(),
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'bg-grid': (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
            )}")`,
          }),
          'bg-grid-small': (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
            )}")`,
          }),
          'bg-dot': (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`,
            )}")`,
          }),
        },
        {
          values: flattenColorPalette(theme('backgroundColor')),
          type: 'color',
        },
      );
    },
  ],
};
