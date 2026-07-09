import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'payuo_logo.png'],
      manifest: {
        name: 'PayuO Kasir Digital',
        short_name: 'PayuO',
        description: 'Aplikasi kasir digital canggih untuk UKM.',
        theme_color: '#0D9488',
        background_color: '#F8FAFC',
        display: 'standalone',
        icons: [
          {
            src: '/payuo_logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/payuo_logo.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/payuo_logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
