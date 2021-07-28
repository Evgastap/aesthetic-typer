module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'darcula-blue': '#62E2F8',
        'darcula-pink': '#FA5EB2'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
