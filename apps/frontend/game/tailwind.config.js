import { nextui } from '@nextui-org/theme';
import { join } from 'path';
import colors from 'tailwindcss/colors';

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
  plugins: [nextui()],
};
