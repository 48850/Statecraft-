// Shared Claude call for the Statecraft judge, examiner and reviewer.
// (The leading underscore stops Vercel from treating this file as an endpoint.)
// - Forces the reply through a tool with a JSON schema, so the marking always comes back as clean structured data.
// - Retries once on overloads, server errors, timeouts and unusable replies.
// - Tries models in order: Sonnet for sharper marking, then Haiku if Sonnet is missing.
//   Override with the JUDGE_MODELS environment variable, e.g. "claude-haiku-5-5" to cut cost.
const DEFAULT_MODELS = ['claude-sonnet-5-5', 'claude-haiku-5-5', 'claude-haiku-4-5'];
const MODELS = String(process.env.JUDGE_MODELS || '').split(',').map(s => s.trim()).filter(Boolean);
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

async function once(key, model, req, timeout) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeout);
  const body = { model, max_tokens: req.maxTokens, messages: [{ role: 'user', content: req.prompt }] };
  if (req.system) body.system = req.system;
  if (req.schema) {
    body.tools = [{ name: 'submit_marking', description: 'Submit the marking for this answer.', input_schema: req.schema }];
    body.tool_choice = { type: 'tool', name: 'submit_marking' };
  }
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', signal: ctl.signal,
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify(body)
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      return { status: r.status, detail: String((err.error && err.error.message) || '').slice(0, 200) };
    }
    const d = await r.json();
    const tool = (d.content || []).find(c => c.type === 'tool_use' && c.input && typeof c.input === 'object');
    const value = tool ? tool.input : parseJSON((d.content || []).map(c => c.text || '').join(''));
    return value ? { status: 200, value, model } : { status: 200, bad: true, truncated: d.stop_reason === 'max_tokens' };
  } catch (e) {
    return { status: 0, detail: e && e.name === 'AbortError' ? 'timeout' : 'network' };
  } finally { clearTimeout(timer); }
}

// ask(key, {prompt, system?, schema?, maxTokens, timeout?}) resolves {ok: true, value, model} or {ok: false, status, error, detail}.
async function ask(key, req) {
  const models = MODELS.length ? MODELS : DEFAULT_MODELS;
  const timeout = req.timeout || 45000;
  let last = { status: 502, detail: '' };
  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const r = await once(key, model, req, timeout);
      if (r.value) return { ok: true, value: r.value, model: r.model };
      last = r;
      const missingModel = r.status === 404 || (r.status === 400 && /model/i.test(r.detail || ''));
      if (missingModel) break;                                    // try the next model
      const transient = r.bad || r.status === 0 || r.status === 429 || r.status === 529 || r.status >= 500;
      if (!transient) return fail(r);
      if (attempt === 1) break;                                   // second failure: fall through to the next model
      await wait(r.status === 429 || r.status === 529 ? 2000 : 700);
    }
  }
  return fail(last);
}

function fail(r) {
  if (r.bad) return { ok: false, status: 502, error: 'bad_model_json' };
  if (r.status === 429 || r.status === 529) return { ok: false, status: 429, error: 'rate_limited' };
  if (r.status === 401 || r.status === 403) return { ok: false, status: 502, error: 'bad_key' };
  if (r.status === 0) return { ok: false, status: 504, error: 'timeout', detail: r.detail };
  return { ok: false, status: 502, error: 'upstream', detail: r.detail || String(r.status) };
}

// Backwards-compatible helper for plain JSON replies (used by the reviewer).
const askJSON = (key, prompt, maxTokens, timeout) => ask(key, { prompt, maxTokens, timeout });

module.exports = { ask, askJSON, parseJSON };
