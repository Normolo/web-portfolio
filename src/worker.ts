interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Canonical domain is non-www; redirect www to non-www with a permanent 301.
    if (url.hostname.startsWith('www.') && url.hostname.length > 4) {
      url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }

    const response = await env.ASSETS.fetch(request);

    // Ensure HTML responses include charset in the Content-Type header.
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.startsWith('text/html') && !contentType.includes('charset')) {
      const headers = new Headers(response.headers);
      headers.set('Content-Type', 'text/html; charset=utf-8');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return response;
  },
} satisfies ExportedHandler<Env>;
