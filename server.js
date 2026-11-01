// Statecraft server for Render: serves the game and the AI judge at /api/judge.
// Start command: node server.js   (the ANTHROPIC_API_KEY environment variable holds the key)
const http = require('http');
const fs = require('fs');
const path = require('path');
const judge = require('./api/judge.js');

const ROOT = __dirname;
const TYPES = { '.html': 'text/html; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };

function wrap(res) {
  res.status = code => { res.statusCode = code; return res; };
  res.json = obj => { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(obj)); return res; };
  return res;
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/judge') {
    let raw = '';
    req.on('data', c => { raw += c; if (raw.length > 20000) req.destroy(); });
    req.on('end', async () => {
      try { req.body = raw ? JSON.parse(raw) : null; } catch (e) { req.body = null; }
      try { await judge(req, wrap(res)); }
      catch (e) { if (!res.headersSent) wrap(res).status(500).json({ error: 'server' }); }
    });
    return;
  }
  let file = path.normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, '');
  if (!file || file.endsWith('/')) file += 'index.html';
  const full = path.join(ROOT, file);
  if (!full.startsWith(ROOT + path.sep) || /(^|[/\\])\./.test(file) || /^(api|server\.js|package\.json)/.test(file)) { res.statusCode = 404; return res.end('Not found'); }
  fs.readFile(full, (err, data) => {
    if (err) { res.statusCode = 404; return res.end('Not found'); }
    res.setHeader('content-type', TYPES[path.extname(full)] || 'application/octet-stream');
    res.end(data);
  });
}).listen(process.env.PORT || 10000, () => console.log('Statecraft running'));
