import { notFound, redirect } from 'next/navigation';

const slugs = new Set(['websites', 'web-apps', 'mobile-apps', 'crms', 'ecommerce', 'ai-automation']);

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slugs.has(slug)) notFound();
  redirect(`/service-${slug}`);
}
