import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const geminiKey = env.GEMINI_API_KEY || env.REACT_APP_GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || ''

  return {
    plugins: [react()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(geminiKey),
      'process.env.REACT_APP_GEMINI_API_KEY': JSON.stringify(geminiKey),
      'process.env': {
        GEMINI_API_KEY: geminiKey,
        REACT_APP_GEMINI_API_KEY: geminiKey,
      },
    },
    server: {
      port: 3000,
      open: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  }
})

