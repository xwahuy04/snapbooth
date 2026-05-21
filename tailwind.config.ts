import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['Inter', 'sans-serif'],
      },
      colors: {
        accent: {
          blue: '#2563eb',
          'blue-light': '#3b82f6',
          'blue-dark': '#1d4ed8',
          cyan: '#06b6d4',
          purple: '#7c3aed',
          yellow: '#eab308',
          // Keep legacy colors for theme compatibility
          pink: '#ff2d78',
        },
        bg: {
          primary: '#ffffff',
          secondary: '#f8fafc',
          card: '#ffffff',
          muted: '#f1f5f9',
        },
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'blue': '0 4px 14px -3px rgba(37, 99, 235, 0.4)',
        'blue-lg': '0 8px 25px -5px rgba(37, 99, 235, 0.35)',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
