/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        hero: "url('@/assets/images/login-bg.jpg')",
      },
      colors: {
        primary: '#FCB404',
        'background-layout': '#F0F1F7',
        secondary:'#a3aed1',
        'blue-dark':'#111C43',
        'blue-hover':'#1D284D',
        'blue-light':'#536485',
        'default-text':'#333335'
      },
    },
  },
  plugins: [],
}

