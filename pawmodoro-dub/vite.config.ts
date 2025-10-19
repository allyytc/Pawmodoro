import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()
  ],
  build:{
    rollupOptions:{
      input:{
        main: resolve(__dirname, 'index.html'),
        popup: resolve(__dirname, 'public/popup.html'),
        sidepanel: resolve(__dirname, 'public/sidepanel.html')
      }
    }
  }
})
