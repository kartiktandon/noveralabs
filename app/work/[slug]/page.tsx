import { notFound, redirect } from 'next/navigation';
import caseStudySlugs from '@/lib/case-study-slugs.json';

const slugs = new Set(caseStudySlugs);

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slugs.has(slug)) notFound();
  redirect(`/case-study-${slug}`);
}
