import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue()],
  publicDir: path.resolve(__dirname, '../public'),
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@root': path.resolve(__dirname, '..'),
      '@react': path.resolve(__dirname, './src/generated/react'),
      '@react-shims': path.resolve(__dirname, './src/react-shims'),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, '..')],
    },
  },
})
