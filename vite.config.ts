import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { handleInquirySubmission } from './src/server/inquiryHandler';
import { handleImageUpload } from './src/server/uploadHandler';

import fs from 'fs';

function inquiryApiPlugin(): Plugin {
  return {
    name: 'inquiry-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/inquiries') {
          handleInquirySubmission(req, res);
          return;
        }
        if (req.url === '/api/upload') {
          handleImageUpload(req, res);
          return;
        }
        if (req.url?.startsWith('/uploads/')) {
          const cleanUrl = req.url.split('?')[0];
          const filePath = path.join(path.resolve(__dirname, 'public'), cleanUrl);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const mimeMap: Record<string, string> = {
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.png': 'image/png',
              '.webp': 'image/webp',
              '.gif': 'image/gif',
              '.svg': 'image/svg+xml',
            };
            res.statusCode = 200;
            res.setHeader('Content-Type', mimeMap[ext] || 'application/octet-stream');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        }
        if (req.url === '/api/health') {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'ok', brand: 'Velquarath Stoneworks' }));
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), inquiryApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
