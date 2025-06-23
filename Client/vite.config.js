import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ No need for Tailwind here
export default defineConfig({
  plugins: [react()],
})
