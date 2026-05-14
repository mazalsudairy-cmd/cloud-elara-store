import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(projectRoot, 'src').replace(/\\/g, '/');

// Match only `@/…` (jsconfig paths). A bare `'@': src` breaks scoped packages like `@tanstack/*`.
const atSlash = /^@\//;

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  appType: 'spa',
  plugins: [react()],
  resolve: {
    alias: [{ find: atSlash, replacement: `${srcDir}/` }],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
});
