import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Use relative asset paths so the built `dist/` folder works when opened
  // directly via file:// or when deployed into a sub-directory on a static
  // (e.g. PHP-only) host without needing a custom server config.
  base: './',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
});
