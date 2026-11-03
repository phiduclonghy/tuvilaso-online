const ALLOWED_ORIGINS = new Set([
  'https://phiduclonghy.github.io',
  'https://tuvilaso-online.vercel.app',
]);
const encoder = new TextEncoder();

function json(message, status, origin) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': origin,
      'Vary': 'Origin',
      'Cache-Control': 'no-store',
    },
  });
}

function chartSummary(chart) {
  if (!chart || !Array.isArray(chart.palaces)) return null;
  const palaces = chart.palaces.slice(0, 12).map((p) => ({
    name: String(p.name || '').slice(0, 40),
    stars: Array.isArray(p.stars)
      ? p.stars.slice(0, 25).map((s) => ({
          name: String(s.name || '').slice(0, 40),
          type: String(s.type || '').slice(0, 20),
          siHua: String(s.siHua || '').slice(0, 20),
        }))
      : [],
    daXianAge: p.daXianAge,
  }));
  return {
    palaces,
    currentDaXian: chart.daXians?.[chart.currentDaXianIndex] || null,
    wuxingJuName: chart.wuxingJuName || '',
  };
}

export function OPTIONS(request) {
  const origin = request.headers.get('origin');
  if (!ALLOWED_ORIGINS.has(origin)) return json('Nguồn truy cập không hợp lệ.', 403, 'null');
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    },
  });
}

export async function POST(request) {
  const origin = request.headers.get('origin');
  if (!ALLOWED_ORIGINS.has(origin)) return json('Nguồn truy cập không hợp lệ.', 403, 'null');
  if (!process.env.DEEPSEEK_API_KEY) return json('Máy chủ chưa được cấu hình khóa DeepSeek.', 503, origin);

  let body;
  try {
    const raw = await request.text();
    if (raw.length > 100_000) return json('Yêu cầu quá lớn.', 413, origin);
    body = JSON.parse(raw);
  } catch {
    return json('Dữ liệu yêu cầu không hợp lệ.', 400, origin);
  }

  const summary = chartSummary(body.chart);
  const messages = Array.isArray(body.messages)
    ? body.messages.slice(-8).filter((m) => m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string')
        .map((m) => ({ role: m.role, content: m.content.slice(0, 3000) }))
    : [];
  if (!summary || !messages.length || messages.at(-1).role !== 'user') {
    return json('Thiếu lá số hoặc câu hỏi.', 400, origin);
  }

  const system = `Bạn là người giải thích lá số Tử Vi Đẩu Số bằng tiếng Việt rõ ràng, tự nhiên. Dựa vào dữ liệu lá số được cung cấp, phân biệt dữ kiện trên lá số với cách diễn giải truyền thống. Không khẳng định chắc chắn tương lai. Không đưa ra chẩn đoán sức khỏe hoặc lời khuyên đầu tư, pháp lý. Nếu dữ liệu thiếu, nói rõ giới hạn. Trả lời ngắn gọn, có cấu trúc và phù hợp câu hỏi. Dữ liệu lá số (đã bỏ tên và ngày sinh): ${JSON.stringify(summary)}`;

  let upstream;
  try {
    upstream = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        messages: [{ role: 'system', content: system }, ...messages],
        stream: true,
        max_tokens: 1200,
      }),
    });
  } catch {
    return json('Không kết nối được dịch vụ AI.', 502, origin);
  }
  if (!upstream.ok || !upstream.body) {
    return json('Dịch vụ AI đang bận hoặc cấu hình chưa đúng.', 502, origin);
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body.getReader();
      const decoder = new TextDecoder();
      let pending = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          pending += decoder.decode(value, { stream: true });
          const lines = pending.split('\n');
          pending = lines.pop() || '';
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;
            try {
              const delta = JSON.parse(data).choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: { text: delta } })}\n\n`));
            } catch { /* Ignore malformed upstream events. */ }
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Luồng AI bị gián đoạn.' })}\n\n`));
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-store',
      'Access-Control-Allow-Origin': origin,
      'Vary': 'Origin',
    },
  });
}
