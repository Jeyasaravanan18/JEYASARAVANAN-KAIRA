import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--color-ink)',
        paper: 'var(--color-paper)',
        gray: {
          50: 'var(--color-gray-50)',
          200: 'var(--color-gray-200)',
          400: 'var(--color-gray-400)',
          600: 'var(--color-gray-600)',
          900: 'var(--color-gray-900)',
        },
        error: 'var(--color-error)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        overlay: '0 24px 80px rgb(0 0 0 / 0.16)',
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '4px',
      },
      maxWidth: {
        content: '1360px',
      },
    },
  },
  plugins: [],
} satisfies Config;
