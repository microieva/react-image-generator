import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    define: {
      'process.env': env
    },
    server: {
      port: 3000,
      open: false,
      host: true
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@/utils': resolve(__dirname, 'src/utils'),
        '@/hooks': resolve(__dirname, 'src/hooks'),
        '@/types': resolve(__dirname, 'src/types')
      }
    }
  }
})
