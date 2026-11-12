import { casePage, workPage } from '@/lib/site/pages';

// The Work page and case study pages are built from what is saved in /admin;
// the other top-level pages are static files in public/.
const staticPages = new Set([
  'services',
  'how-we-work',
  'contact',
  'service-websites',
  'service-web-apps',
  'service-mobile-apps',
  'service-crms',
  'service-ecommerce',
  'service-ai-automation',
]);

const aliasMap: Record<string, string> = {
  website: 'service-websites',
  websites: 'service-websites',
  'web-app': 'service-web-apps',
  'web-apps': 'service-web-apps',
  webapps: 'service-web-apps',
  'mobile-app': 'service-mobile-apps',
  'mobile-apps': 'service-mobile-apps',
  apps: 'service-mobile-apps',
  crm: 'service-crms',
  crms: 'service-crms',
  ecommerce: 'service-ecommerce',
  'e-commerce': 'service-ecommerce',
  ai: 'service-ai-automation',
  automation: 'service-ai-automation',
  'ai-automation': 'service-ai-automation',
};

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug.replace(/\.html$/, '');
  if (slug === 'index') return Response.redirect(new URL('/', request.url), 308);
  if (slug === 'work') return workPage();
  if (slug.startsWith('case-study-')) return casePage(slug.slice('case-study-'.length), request);
  if (staticPages.has(slug)) return Response.redirect(new URL(`/${slug}.html`, request.url), 307);
  if (aliasMap[slug]) return Response.redirect(new URL(`/${aliasMap[slug]}.html`, request.url), 307);
  return new Response('Not found', { status: 404 });
}
