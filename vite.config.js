import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://54.153.205.189:3000', 
        secure: false,
        changeOrigin: true,  
      }
    }
  },
  plugins: [react()],
})
