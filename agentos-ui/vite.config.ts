import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:8765'
    }
  },
  build: {
    modulePreload: false
  },
  preview: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
})