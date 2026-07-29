/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Millennium Information Solution Ltd. brand palette
        brand: {
          DEFAULT: '#821616', // primary maroon-red (buttons / CTAs)
          dark: '#5e0f10',    // hover / pressed state
          red: '#D61A2A',     // bright red accent (logo gradient edge)
          orange: '#F05B24',  // orange accent (logo gradient edge)
          ink: '#1E1E1E',     // near-black header / nav
        },
      },
    },
  },
  plugins: [],
}
