import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { app } from './server/app.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'api-server-middleware',
      configureServer(server) {
        // Montar la API de Express directamente dentro del servidor de desarrollo de Vite
        server.middlewares.use(app);
      },
    },
  ],
})
