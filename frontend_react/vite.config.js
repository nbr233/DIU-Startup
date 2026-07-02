import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://diu-startup-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/media': {
        target: 'https://diu-startup-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'wss://diu-startup-backend.onrender.com',
        ws: true,
        changeOrigin: true,
      }
    }
  }
})
