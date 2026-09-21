import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ink: {
          50: '#eef0fb',
          100: '#d9dcf2',
          200: '#aeb3de',
          300: '#7f85bf',
          400: '#4d5290',
          500: '#2b2f5e',
          600: '#1b1e42',
          700: '#12142f',
          800: '#0b0c20',
          900: '#07070f',
          950: '#040409',
        },
        primary: {
          50: '#f3f1ff',
          100: '#e9e4ff',
          200: '#d5cbff',
          300: '#b6a4ff',
          400: '#9575ff',
          500: '#8b5cf6',
          600: '#7439ec',
          700: '#6427d8',
          800: '#5320b3',
          900: '#451c8f',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        electric: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        ember: {
          50: '#fffaeb',
          100: '#fef0c7',
          200: '#fedf89',
          300: '#fec84b',
          400: '#fdb022',
          500: '#f5b942',
          600: '#dc9a1f',
          700: '#b57516',
          800: '#925a18',
          900: '#784a18',
        },
      },
      fontFamily: {
        'display': ['var(--font-display)', 'Sora', 'system-ui', 'sans-serif'],
        'body': ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'gradient': 'gradient 15s ease infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(135deg, #8b5cf6 0%, #6427d8 100%)',
        'electric-gradient': 'linear-gradient(135deg, #451c8f 0%, #8b5cf6 35%, #22d3ee 70%, #f5b942 100%)',
        'aurora': 'linear-gradient(45deg, #8b5cf6, #06b6d4, #d946ef, #f5b942)',
        'noise': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 92, 246, 0.35)',
        'glow-lg': '0 0 40px rgba(139, 92, 246, 0.45)',
        'electric': '0 0 30px rgba(34, 211, 238, 0.45)',
        'ember': '0 0 30px rgba(245, 185, 66, 0.4)',
        'neon': '0 0 5px theme(colors.electric.400), 0 0 20px theme(colors.electric.400), 0 0 35px theme(colors.electric.400)',
        'glass': '0 8px 32px 0 rgba(4, 4, 12, 0.55)',
      },
    },
  },
  plugins: [],
} satisfies Config;
