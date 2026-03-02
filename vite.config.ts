import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // Import 'path' module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'), // Map @src to the src directory
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    }
  }
})