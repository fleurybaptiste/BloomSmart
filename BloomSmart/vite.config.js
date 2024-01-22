import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@images': path.resolve(path.dirname(new URL(import.meta.url).pathname), './src/images'),
    },
  },
    server: {
    host: true
  }
});
