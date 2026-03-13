import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 引入插件

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 啟用插件
  ],
  // 加入這一行，確保在 GitHub Pages 上路徑正確
  base: '/jp_quiz_app/',
})