import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { securityHeaders, willPageHeaders } from './security.mjs';
const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json; charset=utf-8'
};
http.createServer(async (req, res) => {
  const headers = { ...securityHeaders };
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { ...headers, Allow: 'GET, HEAD' }).end('Method not allowed');
      return;
    }
    const raw = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = resolve(root, '.' + (raw === '/' ? '/index.html' : raw));
    if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403, headers).end('Forbidden'); return; }
    if (!(await stat(file)).isFile()) { res.writeHead(404, headers).end('Not found'); return; }
    if (raw === '/will-drafting.html') Object.assign(headers, willPageHeaders);
    const data = await readFile(file);
    res.writeHead(200, { ...headers, 'content-type': types[extname(file)] || 'application/octet-stream' });
    if (req.method === 'HEAD') res.end();
    else res.end(data);
  } catch { res.writeHead(404, headers).end('Not found'); }
}).listen(port, '0.0.0.0', () => console.log(`Preview: http://127.0.0.1:${port}`));
