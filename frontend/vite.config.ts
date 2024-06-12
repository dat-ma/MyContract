import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { localhost } from 'wagmi/chains'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
   port: 3001
  }
})
