import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-geist-mono)', 'monospace'],
            },
            colors: {
                background: '#09090b', // zinc-950
                foreground: '#fafafa', // zinc-50

                // Brand Colors
                primary: {
                    DEFAULT: '#0ea5e9', // Polymarket Blue
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },

                // Trading Colors
                long: {
                    DEFAULT: '#22c55e', // Binance Green
                    glow: 'rgba(34, 197, 94, 0.4)',
                },
                short: {
                    DEFAULT: '#ef4444', // Binance Red
                    glow: 'rgba(239, 68, 68, 0.4)',
                },

                // UI Grays (Zinc)
                zinc: {
                    950: '#09090b', // Main background
                    900: '#18181b', // Card background
                    800: '#27272a', // Border/Hover
                    500: '#71717a', // Muted text
                    400: '#a1a1aa',
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #0ea5e9 0deg, #a855f7 180deg, #0ea5e9 360deg)',
            },
            animation: {
                'ticker': 'ticker 40s linear infinite',
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                ticker: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            },
        },
    },
    plugins: [],
};
export default config;
