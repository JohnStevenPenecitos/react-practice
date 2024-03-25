import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy: {
      '/api': {
        target:'http://localhost:3000',
        // target:'http://192.168.100.63:5173',

        // target:'https://react-practice-zeta-rust.vercel.app',
        secure: false,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      // "@": path.resolve(__dirname, "./src"),
    },
  },
})
