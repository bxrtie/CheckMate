/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        priority: {
          high: {
            DEFAULT: '#ef4444',
            bg: 'rgba(239, 68, 68, 0.08)',
            hover: 'rgba(239, 68, 68, 0.12)'
          },
          medium: {
            DEFAULT: '#f97316',
            bg: 'rgba(249, 115, 22, 0.08)',
            hover: 'rgba(249, 115, 22, 0.12)'
          },
          low: {
            DEFAULT: '#22c55e',
            bg: 'rgba(34, 197, 94, 0.08)',
            hover: 'rgba(34, 197, 94, 0.12)'
          },
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'task': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'task-hover': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'task-active': '0 0 0 3px rgba(59, 130, 246, 0.5)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      }
    },
  },
  plugins: [],
}
