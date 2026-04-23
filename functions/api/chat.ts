interface Env {
  HF_KEY: string;
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
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
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
    console.error('HF API fetch failed:', err);
    return jsonResponse({ error: 'Unable to connect to AI service' }, 502);
  }

  const responseText = await hfRes.text();
  return new Response(responseText, {
    status: hfRes.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
