import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
      '/appointments': 'http://localhost:3000',
      '/departments': 'http://localhost:3000',
      '/doctors': 'http://localhost:3000',
    },
  },
})
