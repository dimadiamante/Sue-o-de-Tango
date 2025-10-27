import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ВАЖНО: имя репозитория чувствительно к регистру в base
export default defineConfig({
  plugins: [react()],
  base: '/',
})
