/* global process */
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';

export default defineConfig({
  site: 'https://echoe.co',
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    react(),
    sitemap(),
    robotsTxt({
      policy: [{ userAgent: '*', allow: '/' }],
      sitemap: 'https://echoe.co/sitemap-index.xml',
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    define: {
      'import.meta.env.PUBLIC_POSTHOG_KEY': JSON.stringify(process.env.PUBLIC_POSTHOG_KEY || ''),
      'import.meta.env.PUBLIC_POSTHOG_HOST': JSON.stringify(process.env.PUBLIC_POSTHOG_HOST || ''),
    },
    ssr: {
      external: ['node:buffer'],
    },
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled
      alias: import.meta.env.PROD && {
        'react-dom/server': 'react-dom/server.edge',
      },
    },
  },
});
