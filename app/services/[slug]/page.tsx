import { notFound, redirect } from 'next/navigation';

const slugMap: Record<string, string> = {
  websites: 'websites',
  website: 'websites',
  'web-apps': 'web-apps',
  'web-app': 'web-apps',
  webapps: 'web-apps',
  'mobile-apps': 'mobile-apps',
  'mobile-app': 'mobile-apps',
  apps: 'mobile-apps',
  crms: 'crms',
  crm: 'crms',
  ecommerce: 'ecommerce',
  'e-commerce': 'ecommerce',
  'ai-automation': 'ai-automation',
  ai: 'ai-automation',
  automation: 'ai-automation',
};

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const target = slugMap[slug];
  if (!target) notFound();
  redirect(`/service-${target}`);
}
