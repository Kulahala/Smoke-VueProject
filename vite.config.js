import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue()],
  server: {
    open: true,
    configureServer(server) {
      // Must run before Vite's built-in middleware so /admin is served
      // as a static HTML page instead of being caught by Vue Router's SPA fallback
      server.middlewares.use((req, res, next) => {
        if (req.url === '/admin' || req.url === '/admin/') {
          req.url = '/admin/index.html';
        }
        next();
      });
    }
  },
  build: {
    emptyOutDir: false
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
