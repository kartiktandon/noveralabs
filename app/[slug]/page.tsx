import { notFound, redirect } from 'next/navigation';
import caseStudySlugs from '@/lib/case-study-slugs.json';

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
  // Case studies come from the editor (content/case-studies), listed by scripts/build-content.mjs
  ...caseStudySlugs.map((s) => `case-study-${s}`),
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

