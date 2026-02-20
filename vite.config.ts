import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    rollupOptions: {
      output: {
        // Deliberatly not add has to asset names so that the downloadable pdf will have a clean name.
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
})
