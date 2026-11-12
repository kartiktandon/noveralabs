import { clearCookie, json } from '@/lib/site/auth';

export async function POST() {
  return json({ ok: true }, 200, { 'Set-Cookie': clearCookie });
}
