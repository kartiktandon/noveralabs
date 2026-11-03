import { notFound, redirect } from 'next/navigation';

const validSlugs = new Set([
  'services',
  'work',
  'how-we-work',
  'contact',
  'service-websites',
  'service-web-apps',
  'service-mobile-apps',
  'service-crms',
  'service-ecommerce',
  'service-ai-automation',
  'case-study-ryve',
  'case-study-popobozo',
  'case-study-mediflow',
  'case-study-detailing-adda',
  'case-study-boombastic',
  'case-study-flavours-of-gwalior-app',
  'case-study-flavours-of-gwalior-pos',
  'case-study-meta-ads-cockpit',
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

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (validSlugs.has(slug)) {
    redirect(`/${slug}.html`);
  }
  if (aliasMap[slug]) {
    redirect(`/${aliasMap[slug]}.html`);
  }
  notFound();
}

