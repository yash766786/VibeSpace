// import { defineConfig } from 'vite'
// import tailwindcss from '@tailwindcss/vite';
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ No need for Tailwind here
export default defineConfig({
  plugins: [react()],
})
