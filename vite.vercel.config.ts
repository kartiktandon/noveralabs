import tailwindcss from '@tailwindcss/postcss';
import { nitro } from 'nitro/vite';
import path from 'node:path';
import vinext from 'vinext';
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  resolve: {
    alias: {
      tailwindcss: path.resolve('node_modules/tailwindcss/index.css'),
      'tw-animate-css': path.resolve(
        'node_modules/tw-animate-css/dist/tw-animate.css',
      ),
      'shadcn/tailwind.css': path.resolve(
        'node_modules/shadcn/dist/tailwind.css',
      ),
    },
  },
  plugins: [vinext(), nitro()],
});
