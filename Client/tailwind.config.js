// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   daisyui: {
//     themes: ["light"],
//   //   // darkTheme: "white", // default theme
//   //   base: true, // true by default, false for no base styles
//   },
//   plugins: [require("daisyui")],

// }

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 1.5s ease-out',
        'fade-in-down': 'fadeInDown 1s ease-out',
        'fade-in-up': 'fadeInUp 1s ease-out',
        'slide-in-right': 'slideInRight 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeInDown: {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: 0, transform: 'translateX(50px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [
    require("daisyui"),
    require('tailwind-scrollbar'),
  ],
}
