// Sign-in for the content editor (/admin) with a username and password instead of a GitHub account.
// The editor opens this page in a popup. After a correct username and password it hands the editor
// a GitHub token that can write to this repo, so saves still become commits and Vercel rebuilds.
// Vercel environment variables:
//   ADMIN_USERNAME, ADMIN_PASSWORD  the login for /admin
//   GITHUB_TOKEN                    fine-grained token with Contents: read and write on this repo

function page(body: string, status = 200) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Sign in · Novera Labs editor</title>
<style>
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0B1230; color: #fff; font-family: system-ui, sans-serif; }
  form { width: min(320px, calc(100vw - 32px)); display: grid; gap: 12px; }
  h1 { font-size: 20px; font-weight: 500; margin: 0 0 8px; }
  label { display: grid; gap: 6px; font-size: 13px; color: rgba(255,255,255,0.7); }
  input { padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); color: #fff; font-size: 15px; }
  button { margin-top: 8px; padding: 12px; border: 0; border-radius: 8px; background: #FFB321; color: #0B1230; font-size: 15px; font-weight: 600; cursor: pointer; }
  .err { color: #ff8a8a; font-size: 13px; margin: 0; }
</style></head><body>${body}</body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
  );
}

function form(error = '') {
  return page(`<form method="post" action="/api/auth">
  <h1>Novera Labs editor</h1>
  ${error ? `<p class="err">${error}</p>` : ''}
  <label>Username<input name="username" autocomplete="username" required autofocus></label>
  <label>Password<input name="password" type="password" autocomplete="current-password" required></label>
  <button type="submit">Sign in</button>
</form>`);
}

// Hands the token to the editor window that opened this popup (Decap's sign-in handshake)
function success(token: string) {
  const message = JSON.stringify(`authorization:github:success:${JSON.stringify({ token, provider: 'github' })}`);
  return page(`<p>Signed in. You can close this window.</p><script>
(function () {
  function receive(e) {
    if (e.origin !== location.origin) return;
    window.opener.postMessage(${message}, e.origin);
    window.removeEventListener('message', receive);
    window.close();
  }
  window.addEventListener('message', receive);
  window.opener.postMessage('authorizing:github', location.origin);
})();
</script>`);
}

function same(a: string, b: string) {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

export async function GET() {
  return form();
}

export async function POST(request: Request) {
  const { ADMIN_USERNAME, ADMIN_PASSWORD, GITHUB_TOKEN } = process.env;
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !GITHUB_TOKEN) {
    return form('The editor login is not set up yet. Add ADMIN_USERNAME, ADMIN_PASSWORD and GITHUB_TOKEN in Vercel.');
  }
  const data = await request.formData();
  const username = String(data.get('username') || '');
  const password = String(data.get('password') || '');
  const ok = [same(username, ADMIN_USERNAME), same(password, ADMIN_PASSWORD)].every(Boolean);
  if (!ok) {
    // Slow down password guessing
    await new Promise((r) => setTimeout(r, 1000));
    return form('Wrong username or password.');
  }
  return success(GITHUB_TOKEN);
}
