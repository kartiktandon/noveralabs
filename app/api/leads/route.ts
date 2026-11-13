import { json } from '@/lib/site/auth';
import { saveLead, storageReady } from '@/lib/site/store';

// The quote forms on the site post here; enquiries show under Leads in /admin
const FIELDS = ['name', 'phone', 'email', 'type', 'message', 'budget', 'page'];

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== 'object') return json({ error: 'Please fill in the form.' }, 400);
  // Bots fill in every field, including the hidden "website" one
  if (String(body.website || '').trim()) return json({ ok: true });
  const lead: Record<string, string> = {};
  for (const k of FIELDS) lead[k] = String(body[k] ?? '').trim().slice(0, k === 'message' ? 3000 : 200);
  if (!lead.name || !lead.phone) return json({ error: 'Please add your name and phone number.' }, 400);
  if (!storageReady()) return json({ error: 'Enquiries are not switched on yet.' }, 503);
  lead.referrer = String(request.headers.get('referer') || '').slice(0, 300);
  try {
    await saveLead(lead);
    return json({ ok: true });
  } catch (e) {
    console.error(e);
    return json({ error: 'Could not send your enquiry.' }, 502);
  }
}
