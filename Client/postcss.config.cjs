// module.exports = {
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {},
//   },
// }
// postcss.config.cjs
// const tailwindcss = require('@tailwindcss/postcss');

// module.exports = {
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {},
//   },
// };
// postcss.config.cjs
const tailwindcss = require('@tailwindcss/postcss');

module.exports = {
  plugins: [
    tailwindcss,
    require('autoprefixer'),
  ],
};
