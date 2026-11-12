import { checkLogin, json, sessionCookie } from '@/lib/site/auth';

export async function POST(request: Request) {
  const { username = '', password = '' } = (await request.json().catch(() => ({}))) as Record<string, string>;
  if (!(await checkLogin(String(username), String(password)))) {
    // Slow down password guessing
    await new Promise((r) => setTimeout(r, 800));
    return json({ error: 'Wrong username or password.' }, 401);
  }
  return json({ ok: true }, 200, { 'Set-Cookie': await sessionCookie() });
}
