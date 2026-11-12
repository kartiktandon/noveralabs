import { isSignedIn, json } from '@/lib/site/auth';
import { getContent, saveContent, storageReady, templates, type Content } from '@/lib/site/store';

export async function GET(request: Request) {
  if (!(await isSignedIn(request))) return json({ error: 'Please sign in.' }, 401);
  try {
    const content = await getContent();
    return json({ ...content, storage: storageReady(), templates });
  } catch (e) {
    return json({ error: (e as Error).message }, 502);
  }
}

export async function PUT(request: Request) {
  if (!(await isSignedIn(request))) return json({ error: 'Please sign in again.' }, 401);
  if (!storageReady()) {
    return json({ error: 'Saving is not switched on yet. Connect a Blob store to this project in Vercel (Storage tab), then redeploy.' }, 503);
  }
  const body = (await request.json().catch(() => null)) as Content | null;
  if (!body || !Array.isArray(body.cases) || !Array.isArray(body.more)) return json({ error: 'Nothing to save.' }, 400);
  const slugs = body.cases.map((c) => String(c.slug || ''));
  const dupe = slugs.find((s, i) => slugs.indexOf(s) !== i);
  if (dupe) return json({ error: `Two case studies use the page address "${dupe}". Change one of them.` }, 400);
  try {
    return json({ ...(await saveContent(body)), saved: true });
  } catch (e) {
    return json({ error: (e as Error).message }, 502);
  }
}
