module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'darcula-blue': '#62E2F8',
        'darcula-pink': '#FA5EB2',
        'darcula-purple': '#BF9FF7',
        'darcula-green': '#86F78B',
      },
      margin: {
        'cursor': '-0.37rem;'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
