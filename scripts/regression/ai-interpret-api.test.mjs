import assert from 'node:assert/strict';
import { POST, OPTIONS } from '../../app/api/interpret/route.js';

const origin = 'https://phiduclonghy.github.io';
const preflight = OPTIONS(new Request('https://example.test/api/interpret', {
  method: 'OPTIONS', headers: { origin },
}));
assert.equal(preflight.status, 204);
assert.equal(preflight.headers.get('access-control-allow-origin'), origin);

const denied = await POST(new Request('https://example.test/api/interpret', {
  method: 'POST', headers: { origin: 'https://other.example' },
}));
assert.equal(denied.status, 403);

const savedKey = process.env.DEEPSEEK_API_KEY;
const originalFetch = globalThis.fetch;
process.env.DEEPSEEK_API_KEY = 'test-key';
globalThis.fetch = async (_url, options) => {
  const body = JSON.parse(options.body);
  assert.equal(body.model, 'deepseek-chat');
  assert.match(body.messages[0].content, /tiếng Việt/);
  assert.doesNotMatch(body.messages[0].content, /Nguyễn Văn A|1987/);
  const upstream = 'data: {"choices":[{"delta":{"content":"Xin chào"}}]}\n\ndata: [DONE]\n\n';
  return new Response(new ReadableStream({ start(controller) {
    controller.enqueue(new TextEncoder().encode(upstream));
    controller.close();
  } }), { status: 200 });
};

try {
  const response = await POST(new Request('https://example.test/api/interpret', {
    method: 'POST',
    headers: { origin, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chart: { birthInfo: { name: 'Nguyễn Văn A', year: 1987 }, palaces: [{ name: 'Mệnh', stars: [] }], daXians: [] },
      messages: [{ role: 'user', content: 'Luận giải giúp tôi.' }],
    }),
  }));
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Xin chào/);
} finally {
  globalThis.fetch = originalFetch;
  if (savedKey === undefined) delete process.env.DEEPSEEK_API_KEY;
  else process.env.DEEPSEEK_API_KEY = savedKey;
}

console.log('AI API checks passed');
