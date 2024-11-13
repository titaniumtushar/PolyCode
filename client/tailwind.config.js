/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{tsx,ts,js,jsx}"],
    theme: {
        extend: {
            colors: {
                bg: "var(--bg-color)",
                text: "var(--text-color)",
                text_2: "var(--text-2-color)",
                borders: "var(--borders-color)",
                code: "var(--code-color)",
            },
            keyframes: {
                pulse: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.2)' },
                },
                rotate: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                move: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(20px)' },
                },
            },
            animation: {
                'pulse-rotate': 'pulse 8s infinite ease-in-out, rotate 15s infinite linear',
                'pulse-move': 'pulse 10s infinite ease-in-out, move 12s infinite alternate',
            },
        },
    },
    plugins: [],
};
