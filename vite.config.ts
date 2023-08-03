import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    https: {
      key: fs.readFileSync('example.key'),
      cert: fs.readFileSync('example.crt'),
    },
    host: '0.0.0.0'
  },
});
