// Step 2 of GitHub sign-in for the content editor: swap GitHub's code for a token
// and hand it to the editor window that opened this popup.
function reply(status: 'success' | 'error', content: object) {
  const message = JSON.stringify(`authorization:github:${status}:${JSON.stringify(content)}`);
  const html = `<!doctype html><html><body><script>
(function () {
  function receive(e) {
    window.opener.postMessage(${message}, e.origin);
    window.removeEventListener('message', receive);
  }
  window.addEventListener('message', receive);
  window.opener.postMessage('authorizing:github', '*');
})();
</script></body></html>`;
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Set-Cookie': 'cms_oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookie = request.headers.get('cookie') || '';
  const saved = /(?:^|;\s*)cms_oauth_state=([^;]+)/.exec(cookie)?.[1];
  if (!code || !state || state !== saved) return reply('error', { message: 'Sign-in expired. Please try again.' });

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/api/callback`,
    }),
  });
  const data = (await res.json()) as { access_token?: string; error_description?: string };
  if (!data.access_token) return reply('error', { message: data.error_description || 'GitHub sign-in failed.' });
  return reply('success', { token: data.access_token, provider: 'github' });
}
