// Shared Claude call for the Statecraft judge and reviewer.
// (The leading underscore stops Vercel from treating this file as an endpoint.)
// Makes the AI marking steady: retries once on overloads, server errors, timeouts
// and replies that are not valid JSON, and falls back to an older model if the newest one is missing.
const MODELS = ['claude-haiku-5-5', 'claude-haiku-4-5'];
const TIMEOUT_MS = 25000;
const wait = ms => new Promise(r => setTimeout(r, ms));

function parseJSON(text) {
  const t = String(text || '').trim();
  try { return JSON.parse(t); } catch (e) {}
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) { try { return JSON.parse(fence[1]); } catch (e) {} }
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch (e) {} }
  return null;
}

async function once(key, model, prompt, maxTokens) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', signal: ctl.signal,
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] })
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      return { status: r.status, detail: String((err.error && err.error.message) || '').slice(0, 200) };
    }
    const d = await r.json();
    const text = (d.content || []).map(c => c.text || '').join('');
    const value = parseJSON(text);
    return value ? { status: 200, value } : { status: 200, bad: true, truncated: d.stop_reason === 'max_tokens' };
  } catch (e) {
    return { status: 0, detail: e && e.name === 'AbortError' ? 'timeout' : 'network' };
  } finally { clearTimeout(timer); }
}

// Resolves {ok: true, value} or {ok: false, status, error, detail}.
async function askJSON(key, prompt, maxTokens) {
  let last = { status: 502, detail: '' };
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const r = await once(key, model, prompt, maxTokens);
      if (r.value) return { ok: true, value: r.value };
      last = r;
      const missingModel = r.status === 404 || (r.status === 400 && /model/i.test(r.detail || ''));
      if (missingModel) break;                                   // try the next model
      const transient = r.bad || r.status === 0 || r.status === 429 || r.status === 529 || r.status >= 500;
      if (!transient || attempt === 1) return fail(r);
      await wait(r.status === 429 || r.status === 529 ? 2000 : 700);
    }
  }
  return fail(last);
}

function fail(r) {
  if (r.bad) return { ok: false, status: 502, error: 'bad_model_json' };
  if (r.status === 429 || r.status === 529) return { ok: false, status: 429, error: 'rate_limited' };
  if (r.status === 401 || r.status === 403) return { ok: false, status: 502, error: 'bad_key' };
  return { ok: false, status: 502, error: 'upstream', detail: r.detail || String(r.status) };
}

module.exports = { askJSON, parseJSON };
