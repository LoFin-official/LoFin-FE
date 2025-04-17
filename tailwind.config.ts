import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
      },
      keyframes: {
        progressWidth: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        'progress-width': 'progressWidth 1s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;