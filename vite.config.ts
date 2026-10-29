import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // claude-rn-test 웹뷰 화면의 기본 주소(localhost:3000)에 맞춘다
    port: 3000,
    strictPort: true,
    // Wi-Fi로 연결한 기기에서 PC IP로 접속할 수 있게 연다
    host: true,
  },
});
