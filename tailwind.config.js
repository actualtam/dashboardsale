/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bz: {
          bg: '#151719',
          surface: '#1D2023',
          elevated: '#25292D',
          border: '#353A40',
          divider: '#353A40',
          text: '#F4F4F1',
          secondary: '#B0B5BA',
          muted: '#858C93',
          accent: '#4B91D9',
          accentHover: '#72AFE9',
          accentMuted: 'rgba(75, 145, 217, 0.1)',
          productFrame: '#F5F5F2',
        },
      },
      fontFamily: {
        heading: ["'Plus Jakarta Sans'", '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        sans: ["'Inter'", '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.045em',
        tight: '-0.025em',
        wide: '0.04em',
        widest: '0.12em',
      },
    },
  },
  plugins: [],
};
