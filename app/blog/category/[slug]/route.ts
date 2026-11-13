import { blogPage } from '@/lib/site/pages';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  return blogPage(request, { category: (await params).slug });
}
