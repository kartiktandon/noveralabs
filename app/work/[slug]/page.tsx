import { notFound, redirect } from 'next/navigation';

const slugs = new Set(['ryve', 'popobozo', 'mediflow', 'detailing-adda', 'boombastic', 'flavours-of-gwalior-app', 'meta-ads-cockpit', 'flavours-of-gwalior-pos']);

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slugs.has(slug)) notFound();
  redirect(`/case-study-${slug}`);
}
