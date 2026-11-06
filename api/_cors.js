// Origin gate + CORS for the AI endpoints (the leading underscore keeps Vercel from routing this file).
// Same-origin requests (page served by this server) always pass. The GitHub Pages site is allowed too,
// so https://48850.github.io/Statecraft-/ can use the AI judge hosted on Render.
// Extra origins can be added with the ALLOWED_ORIGINS environment variable (comma-separated).
const ALLOWED = ['https://48850.github.io'];

module.exports = function gate(req, res) {
  const origin = req.headers.origin || '', host = req.headers.host || '';
  const extra = String(process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const same = !origin || origin.replace(/^https?:\/\//, '') === host;
  const ok = same || ALLOWED.includes(origin) || extra.includes(origin);
  if (origin && ok) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
  if (req.method === 'OPTIONS') { res.statusCode = ok ? 204 : 403; res.end(); return false; }
  if (!ok) { res.status(403).json({ error: 'origin' }); return false; }
  return true;
};
