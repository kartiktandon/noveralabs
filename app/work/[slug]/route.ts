import { casePage } from '@/lib/site/pages';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  return casePage((await params).slug, request);
}
