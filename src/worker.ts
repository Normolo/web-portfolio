interface Env {
  HF_KEY: string;
  ASSETS: Fetcher;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_PROMPT =
  "You are a helpful assistant on Benjamin Borg's personal portfolio website. " +
  'Benjamin is a Mathematics and Computer Science student working part-time in ' +
  'cybersecurity, with an interest in quantum computer security. ' +
  'Answer questions about the portfolio, his background, skills, or any topic ' +
  'helpfully and concisely. Keep replies focused and under 150 words unless more detail is asked for.';

const HF_MODEL = 'HuggingFaceH4/zephyr-7b-beta';
const HF_API_URL = 'https://api-inference.huggingface.co/v1/chat/completions';
const MAX_HISTORY = 10;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleChat(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = (await request.json()) as { messages?: ChatMessage[] };
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const userMessages = body.messages;
  if (!Array.isArray(userMessages) || userMessages.length === 0) {
    return jsonResponse({ error: 'messages array is required' }, 400);
  }

  // Validate each message
  for (const msg of userMessages) {
    if (
      typeof msg !== 'object' ||
      !['user', 'assistant'].includes(msg.role) ||
      typeof msg.content !== 'string' ||
      msg.content.trim().length === 0
    ) {
      return jsonResponse({ error: 'Invalid message format' }, 400);
    }
  }

  // Limit history to last MAX_HISTORY messages to control token usage
  const trimmed = userMessages.slice(-MAX_HISTORY);

  const payload = {
    model: HF_MODEL,
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...trimmed],
    max_tokens: 512,
    temperature: 0.7,
  };

  let hfRes: Response;
  try {
    hfRes = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.HF_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return jsonResponse({ error: 'Failed to reach HF API' }, 502);
  }

  const responseText = await hfRes.text();
  return new Response(responseText, {
    status: hfRes.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/chat') {
      return handleChat(request, env);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
