import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 5174, // Use port 5174 to avoid conflicts with other projects
    strictPort: true, // Do not auto-switch if the port is occupied
  },
})

