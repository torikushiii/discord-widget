// @ts-check
import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), cloudflare()],
  adapter: cloudflare(),
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        ...(import.meta.env.PROD ? {
          "react-dom/server": "react-dom/server.edge",
        } : {})
      },
    },
  },
});