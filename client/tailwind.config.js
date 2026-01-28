/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#0066CC",
                secondary: "#FFFFFF",
                accent: "#66CCFF",
                vizcacha: {
                    dark: "#0f172a",
                    light: "#f8fafc"
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
