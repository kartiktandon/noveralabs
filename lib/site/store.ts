// Where the admin panel saves content and uploads: Vercel Blob.
// Connect a Blob store to the Vercel project once (Storage → Create → Blob → Connect); Vercel then
// adds BLOB_READ_WRITE_TOKEN by itself. Until then the pages show lib/site/defaults.json.
// Talks to the Blob REST API directly so the site needs no extra package.
import defaults from './defaults.json';
import { normalize } from './render.mjs';

export type Content = { cases: Record<string, any>[]; more: Record<string, any>[] };
type Blob = { url: string; pathname: string; uploadedAt: string };

const API = process.env.VERCEL_BLOB_API_URL || 'https://blob.vercel-storage.com';
const CONTENT = 'site/content.json';

export const templates = defaults.templates;
export const storageReady = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

function headers(extra: Record<string, string> = {}) {
  return { authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`, 'x-api-version': '7', ...extra };
}

async function fail(res: Response, what: string): Promise<never> {
  const body = await res.text().catch(() => '');
  throw new Error(`${what} failed (${res.status}): ${body.slice(0, 300)}`);
}

async function list(prefix: string): Promise<Blob[]> {
  const res = await fetch(`${API}?prefix=${encodeURIComponent(prefix)}&limit=1000`, { headers: headers(), cache: 'no-store' });
  if (!res.ok) await fail(res, 'Reading storage');
  return ((await res.json()) as { blobs: Blob[] }).blobs || [];
}

export async function put(pathname: string, body: BodyInit, contentType: string) {
  const res = await fetch(`${API}/?pathname=${encodeURIComponent(pathname)}`, {
    method: 'PUT',
    body,
    headers: headers({
      'x-content-type': contentType,
      'x-add-random-suffix': '0',
      'x-allow-overwrite': '1',
      'x-cache-control-max-age': '60',
      'x-vercel-blob-access': 'public',
    }),
  });
  if (!res.ok) await fail(res, 'Saving to storage');
  return (await res.json()) as Blob;
}

const fallback = (): Content => normalize({ cases: defaults.cases, more: defaults.more });

// What the site shows: the last save from /admin, or the starting content
export async function getContent(): Promise<Content & { saved: boolean }> {
  if (!storageReady()) return { ...fallback(), saved: false };
  const blob = (await list(CONTENT)).find((b) => b.pathname === CONTENT);
  if (!blob) return { ...fallback(), saved: false };
  // The query string skips the storage CDN's cache, so a save shows at once
  const res = await fetch(`${blob.url}?v=${Date.parse(blob.uploadedAt) || Date.now()}`, { cache: 'no-store' });
  if (!res.ok) await fail(res, 'Reading content');
  return { ...normalize(await res.json()), saved: true };
}

export async function saveContent(content: Content) {
  const clean = normalize(content);
  const body = JSON.stringify(clean, null, 2);
  // Keep every version, so an old one can be restored if something is deleted by mistake
  await put(`site/history/${new Date().toISOString().replace(/[:.]/g, '-')}.json`, body, 'application/json');
  await put(CONTENT, body, 'application/json');
  return clean;
}
