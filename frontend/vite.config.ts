import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'

export default defineConfig({
  server:{
    proxy:{
      '/shubham':'http://localhost:2000',
    },
  },
  plugins:[react()],
});