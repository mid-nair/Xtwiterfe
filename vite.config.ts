import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: {
    port: 5173,
    // Proxy API calls to the Express backend so no CORS setup is needed in dev.
    proxy: { '/api': { target: 'http://localhost:4000', changeOrigin: true } },
  },
});
