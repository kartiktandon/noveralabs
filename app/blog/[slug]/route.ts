import { postPage, rssFeed } from '@/lib/site/pages';

// A blog post, or the RSS feed at /blog/rss.xml
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  if (slug === 'rss.xml' || slug === 'feed') return rssFeed(request);
  return postPage(slug.replace(/\.html$/, ''), request);
}
