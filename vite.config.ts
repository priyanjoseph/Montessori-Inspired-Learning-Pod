import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { loadLocalEnv } from './server/env.mjs';
import { getDb } from './server/db.mjs';
import { handleApiRequest } from './server/router.mjs';

loadLocalEnv();

function montessoriApiPlugin() {
  let dbPromise = null;
  const attachMiddleware = (middlewares) => {
    middlewares.use(async (req, res, next) => {
      if (!req.url || (req.url !== '/api' && !req.url.startsWith('/api/'))) {
        return next();
      }
      try {
        if (!dbPromise) dbPromise = getDb();
        const db = await dbPromise;
        await handleApiRequest(req, res, db);
      } catch (err) {
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: 'Server error handling API request.' }));
        }
        next(err);
      }
    });
  };

  return {
    name: 'montessori-api-middleware',
    configureServer(server) {
      attachMiddleware(server.middlewares);
    },
    configurePreviewServer(server) {
      attachMiddleware(server.middlewares);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), montessoriApiPlugin()],
});

