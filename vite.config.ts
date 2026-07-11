import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Intercepta qualquer chamada para http://localhost:5173/api e manda para o Go
      '/api': {
        target: 'https://app-go-389874839960.us-central1.run.app', // Certifique-se de que seu Go roda nesta porta
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});