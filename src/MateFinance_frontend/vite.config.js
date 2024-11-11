import react from '@vitejs/plugin-react-swc';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import environment from 'vite-plugin-environment';
// import reactDefault from '@vitejs/plugin-react';



dotenv.config({ path: '../../.env' });

export default defineConfig({
  build: {
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  server: {
    
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4943',
        changeOrigin: true,
      },
    },
    port: 3030,
  },
  preview: {
    port: 3030,
  },
  plugins: [
    react(),
    // reactDefault(),
    checker({
      overlay: {
        initialIsOpen: false,
      },
    }),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
      {
        find: 'declarations',
        replacement: fileURLToPath(
          new URL('../declarations', import.meta.url)
        ),
      },
    ],
  },
});
