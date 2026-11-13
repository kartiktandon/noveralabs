import { blogPage } from '@/lib/site/pages';

// The blog home: every published post, newest first
export function GET(request: Request) {
  return blogPage(request);
}
