import { homePage } from '@/lib/site/pages';

// The home page's "Selected work" list comes from the case studies saved in /admin
export function GET() {
  return homePage();
}
