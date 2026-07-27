import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        projects: resolve(__dirname, 'projects.html'),
        arcade: resolve(__dirname, 'arcade.html'),
        world: resolve(__dirname, 'world.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
})
