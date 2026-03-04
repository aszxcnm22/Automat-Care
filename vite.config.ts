import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

// ES module ไม่มี __dirname → สร้างเอง
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  // ใช้ตอน dev (npm run dev)
  server: {
    port: 5173,
    open: true,
    allowedHosts: [
      'automat-care.onrender.com',
    ],
  },

  // ใช้ตอน production บน Render (vite preview)
  preview: {
    port: 4173,
    allowedHosts: [
      'automat-care.onrender.com',
    ],
  },
})