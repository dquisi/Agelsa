
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    hmr: {
      host: 'localhost'
    },
    allowedHosts: 'all'
  },
  preview: {
    host: '0.0.0.0',
    port: 5000
  }
})
