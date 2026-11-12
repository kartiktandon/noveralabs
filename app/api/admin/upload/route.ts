import { isSignedIn, json } from '@/lib/site/auth';
import { checkStorage, saveFile } from '@/lib/site/store';

// Images and PDFs from the admin panel. Vercel caps a request at 4.5 MB.
const MAX = 4.5 * 1024 * 1024;
const TYPES = /^(image\/(png|jpe?g|webp|gif|svg\+xml|avif)|application\/pdf)$/;

export async function POST(request: Request) {
  if (!(await isSignedIn(request))) return json({ error: 'Please sign in again.' }, 401);
  const problem = await checkStorage();
  if (problem) {
    return json({ error: problem === 'not-set-up' ? 'Uploads are not switched on yet. Add the MySQL settings in Vercel first.' : `Can't reach the database: ${problem}` }, 503);
  }
  const type = request.headers.get('content-type') || '';
  if (!TYPES.test(type)) return json({ error: 'Upload an image (PNG, JPG, WebP, GIF, SVG) or a PDF.' }, 415);
  const body = await request.arrayBuffer();
  if (body.byteLength > MAX) return json({ error: 'That file is over 4.5 MB. Please compress it and try again.' }, 413);
  const name =
    (request.headers.get('x-filename') || 'file')
      .toLowerCase()
      .replace(/[^a-z0-9.-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(-80) || 'file';
  try {
    return json(await saveFile(name, type, body));
  } catch (e) {
    return json({ error: (e as Error).message }, 502);
  }
}
