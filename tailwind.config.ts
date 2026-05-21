import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        accent: {
          pink:   '#ff2d78',
          cyan:   '#00e5ff',
          purple: '#9b59ff',
          yellow: '#ffe600',
        },
        bg: {
          primary:   '#0a0a0f',
          secondary: '#111118',
          card:      '#16161f',
        },
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
