import path from 'path'
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), process.env.NODE_ENV === 'development' && basicSsl()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
