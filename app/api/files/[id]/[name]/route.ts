import { getFile, storageReady } from '@/lib/site/store';

// Serves images and PDFs uploaded in /admin. Each upload gets a new id, so it can be cached for good.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string; name: string }> }) {
  const { id } = await params;
  if (!storageReady() || !/^[a-f0-9]{24}$/.test(id)) return new Response('Not found', { status: 404 });
  const file = await getFile(id);
  if (!file) return new Response('Not found', { status: 404 });
  return new Response(new Uint8Array(file.data), {
    headers: {
      'Content-Type': file.type,
      'Content-Length': String(file.data.length),
      'Content-Disposition': `inline; filename="${file.name.replace(/"/g, '')}"`,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
