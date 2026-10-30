import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // host: true antaa selaimelle oikeuden vitelle kontin ulkopuolelta
    host: true,
    port: 5173,
    // watch: { usePolling: true } auttaa tiedostojen muutosten näkymisessä
    watch: { usePolling: true },
    proxy: {
      '/api': process.env.API_PROXY_TARGET || 'http://localhost:3001',
    },
  },
});
