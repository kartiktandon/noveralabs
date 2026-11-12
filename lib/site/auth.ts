// Login for the admin panel (/admin): one username and password, kept here only as SHA-256 hashes.
// To change them, set ADMIN_USERNAME and ADMIN_PASSWORD in Vercel (those win over the hashes below).
// A successful login sets a signed cookie that lasts 7 days.

const USER_HASH = '33c459469494f2612fd775cd04398547ebcef5d41ed9af3c1271c7adfc4acdc0';
const PASS_HASH = 'c0b30e67c8f18045a68479735c0ff3d48008e1cabe22787b19941a17ebbe700c';
const COOKIE = 'nl_admin';
const MAX_AGE = 60 * 60 * 24 * 7;

const enc = new TextEncoder();
const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const sha256 = async (s: string) => hex(await crypto.subtle.digest('SHA-256', enc.encode(s)));

function same(a: string, b: string) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

export async function checkLogin(username: string, password: string) {
  const userHash = process.env.ADMIN_USERNAME ? await sha256(process.env.ADMIN_USERNAME) : USER_HASH;
  const passHash = process.env.ADMIN_PASSWORD ? await sha256(process.env.ADMIN_PASSWORD) : PASS_HASH;
  const [u, p] = await Promise.all([sha256(username.trim()), sha256(password)]);
  return [same(u, userHash), same(p, passHash)].every(Boolean);
}

// Sessions are signed with a server-only secret: the storage token when it exists
async function key() {
  const secret = process.env.ADMIN_SECRET || process.env.BLOB_READ_WRITE_TOKEN || PASS_HASH + (process.env.ADMIN_PASSWORD || '');
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}

async function sign(value: string) {
  return hex(await crypto.subtle.sign('HMAC', await key(), enc.encode(value)));
}

export async function sessionCookie() {
  const expires = String(Date.now() + MAX_AGE * 1000);
  return `${COOKIE}=${expires}.${await sign(expires)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`;
}

export const clearCookie = `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export async function isSignedIn(request: Request) {
  const raw = new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`).exec(request.headers.get('cookie') || '')?.[1];
  if (!raw) return false;
  const [expires, sig] = raw.split('.');
  if (!expires || !sig || Number(expires) < Date.now()) return false;
  return same(sig, await sign(expires));
}

export function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  });
}
