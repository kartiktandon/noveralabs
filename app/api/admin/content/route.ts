import { isSignedIn, json } from '@/lib/site/auth';
import { checkStorage, getContent, saveContent, templates, type Content } from '@/lib/site/store';
import defaults from '@/lib/site/defaults.json';
import { normalize } from '@/lib/site/render.mjs';
import { withHomeFields } from '@/lib/site/pages';

export async function GET(request: Request) {
  if (!(await isSignedIn(request))) return json({ error: 'Please sign in.' }, 401);
  // If the database is missing or unreachable, still open the panel and say why saving is off
  const problem = await checkStorage();
  if (problem) {
    const content = normalize({ cases: defaults.cases, more: defaults.more });
    return json({ ...content, saved: false, storage: false, storageError: problem === 'not-set-up' ? '' : problem, templates });
  }
  try {
    return json({ ...withHomeFields(await getContent()), storage: true, templates });
  } catch (e) {
    return json({ error: (e as Error).message }, 502);
  }
}

export async function PUT(request: Request) {
  if (!(await isSignedIn(request))) return json({ error: 'Please sign in again.' }, 401);
  const problem = await checkStorage();
  if (problem) {
    return json({ error: problem === 'not-set-up' ? 'Saving is not switched on yet. Add the MySQL settings in Vercel, then redeploy.' : `Can't reach the database: ${problem}` }, 503);
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
