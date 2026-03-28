/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // habilita dark mode con la clase "dark"
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF",
        secondary: "#F59E0B",
      },
    },
  },
  plugins: [],
};
