import { createServer } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { resolve, relative, extname, isAbsolute } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.md': 'text/plain; charset=utf-8', '.csv': 'text/csv; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff': 'font/woff', '.woff2': 'font/woff2' };
const isInside = (root, path) => { const rel = relative(root, path); return !isAbsolute(rel) && rel !== '..' && !rel.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`); };

export async function createPacketServer(directory = fileURLToPath(new URL('.', import.meta.url))) {
  const root = await realpath(directory);
  const sums = await readFile(resolve(root, 'SHA256SUMS'), 'utf8');
  const allowed = new Set(['SHA256SUMS']);
  for (const line of sums.trim().split('\n')) {
    const match = /^([a-f0-9]{64})  ([a-zA-Z0-9_./-]+)$/.exec(line);
    if (!match || match[2].split('/').some(part => !part || part === '.' || part === '..')) throw new Error('Invalid packet checksum list');
    allowed.add(match[2]);
  }
  return createServer(async (req, res) => {
    const finish = (status, body = '') => { res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(req.method === 'HEAD' ? '' : body); };
    if (!['GET', 'HEAD'].includes(req.method)) { finish(405, 'Use GET or HEAD'); return; }
    let path;
    try {
      const raw = req.url.split('?')[0];
      // Reject encoded separators before decoding, and reject remaining percent signs
      // so double-encoded traversal cannot acquire meaning in another parser.
      if (!raw.startsWith('/') || /%(?:2f|5c)/i.test(raw)) throw new Error('Invalid path');
      path = decodeURIComponent(raw);
      if (/[\\%:\x00-\x1f\x7f]/.test(path) || path.split('/').some(part => part === '.' || part === '..')) throw new Error('Invalid path');
      path = path.slice(1);
      if (!path || path.endsWith('/')) path += 'index.html';
    } catch { finish(400, 'Invalid path'); return; }
    if (!allowed.has(path)) { finish(404, 'Not found'); return; }
    try {
      const file = await realpath(resolve(root, path));
      if (!isInside(root, file)) { finish(404, 'Not found'); return; }
      const bytes = await readFile(file);
      res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Length': bytes.length });
      res.end(req.method === 'HEAD' ? undefined : bytes);
    } catch { finish(404, 'Not found'); }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (!process.version.startsWith('v24.')) throw new Error('Use Node 24');
  const port = Number(process.argv[2] ?? 5194);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Port must be 1–65535');
  const server = await createPacketServer();
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Review packet: http://127.0.0.1:${port}/ (Ctrl+C to stop)`));
}
