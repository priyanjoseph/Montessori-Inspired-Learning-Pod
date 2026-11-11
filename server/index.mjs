import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { loadLocalEnv } from './env.mjs';
import { getDb } from './db.mjs';
import { handleApiRequest } from './router.mjs';

loadLocalEnv();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
};

export async function createAppServer({ distDir = path.join(process.cwd(), 'dist') } = {}) {
  const db = await getDb();

  const server = http.createServer(async (req, res) => {
    const reqUrl = req.url || '/';
    if (reqUrl === '/api' || reqUrl.startsWith('/api/')) {
      return await handleApiRequest(req, res, db);
    }

    // Serve built SPA static assets when present
    if (!fs.existsSync(distDir)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Frontend build not found. Run `npm run build` or start `npm run dev`.');
      return;
    }

    const pathname = new URL(reqUrl, 'http://localhost').pathname;
    const safeRel = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
    let filePath = path.join(distDir, safeRel === '/' ? 'index.html' : safeRel);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distDir, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });

  return { server, db };
}

const isMainModule =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));

if (isMainModule) {
  const port = Number(process.env.PORT || '4174');
  const { server } = await createAppServer();
  server.listen(port, () => {
    console.log(`Montessori Learning Pod server running on http://localhost:${port}`);
  });
}

