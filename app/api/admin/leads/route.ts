import { isSignedIn, json } from '@/lib/site/auth';
import { checkStorage, deleteLead, listLeads, updateLead } from '@/lib/site/store';

export async function GET(request: Request) {
  if (!(await isSignedIn(request))) return json({ error: 'Please sign in.' }, 401);
  if (await checkStorage()) return json({ leads: [] });
  try {
    return json({ leads: await listLeads() });
  } catch (e) {
    return json({ error: (e as Error).message }, 502);
  }
}

// { id, status: 'new' | 'contacted' | 'won' | 'lost' } or { id, delete: true }
export async function PATCH(request: Request) {
  if (!(await isSignedIn(request))) return json({ error: 'Please sign in again.' }, 401);
  const body = (await request.json().catch(() => null)) as { id?: number; status?: string; delete?: boolean } | null;
  const id = Number(body?.id);
  if (!id) return json({ error: 'Which lead?' }, 400);
  try {
    if (body?.delete) await deleteLead(id);
    else if (['new', 'contacted', 'won', 'lost'].includes(String(body?.status))) await updateLead(id, String(body!.status));
    else return json({ error: 'Unknown status.' }, 400);
    return json({ ok: true });
  } catch (e) {
    return json({ error: (e as Error).message }, 502);
  }
}
