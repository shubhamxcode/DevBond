import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'

export default defineConfig({
  server:{
    proxy:{
      '/api': 'https://backend-8lt3.onrender.com',
    },
  },
  plugins:[react()],
});
