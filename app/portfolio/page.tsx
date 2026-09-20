'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, ExternalLink, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

const ease = [0.16, 1, 0.3, 1] as const;

type PortfolioCategory = 'all' | 'products' | 'crm' | 'ai';

interface Project {
  id: string;
  categoryTag: 'products' | 'crm' | 'ai';
  title: string;
  client: string;
  category: string;
  tagline: string;
  metric: string;
  metricLabel: string;
  body: string;
  deliverables: string[];
  techStack: string[];
}

const portfolioProjects: Project[] = [
  {
    id: 'orbit-capital',
    categoryTag: 'crm',
    title: 'Orbit Capital',
    client: 'Orbit Asset Management',
    category: 'Custom CRM systems',
    tagline: 'Private equity investor engagement with institutional confidence.',
    metric: '+310%',
    metricLabel: 'LP portal engagement',
    body: 'An institutional-grade LP portal and pipeline CRM that replaced disconnected spreadsheets with real-time capital deployment analytics, automated compliance audits, and instant distribution reporting.',
    deliverables: [
      'Multi-tier LP and GP permission matrices',
      'Automated quarterly statement generation',
      'Real-time portfolio IRR and MOIC calculations',
      'Zero-latency document signing integration',
    ],
    techStack: ['Next.js', 'PostgreSQL', 'TypeScript', 'Tailwind', 'Prisma'],
  },
  {
    id: 'beacon-health',
    categoryTag: 'products',
    title: 'Beacon Telehealth',
    client: 'Beacon Clinical Network',
    category: 'Digital product engineering',
    tagline: 'Frictionless patient scheduling and legacy EMR synchronization.',
    metric: '4.2x',
    metricLabel: 'Faster intake completion',
    body: 'A frictionless patient engagement and clinical scheduling system bridging complex legacy electronic medical records with intuitive digital healthcare experiences across web and mobile.',
    deliverables: [
      'HIPAA-compliant patient authentication and intake',
      'Instant bi-directional HL7/FHIR record synchronization',
      'Automated triage queuing and provider calendar matching',
      'Sub-second clinical chart retrieval',
    ],
    techStack: ['React', 'Node.js', 'GraphQL', 'PostgreSQL', 'Redis'],
  },
  {
    id: 'apex-logistics',
    categoryTag: 'products',
    title: 'Apex Fleet OS',
    client: 'Apex Global Logistics',
    category: 'Digital product engineering',
    tagline: 'Event-driven dispatch telemetry across 4,200 freight vehicles.',
    metric: '99.98%',
    metricLabel: 'On-time delivery telemetry',
    body: 'A mission-critical fleet telemetry platform that ingests vehicle IoT signals, calculates dynamic route modifications in response to weather patterns, and provides real-time carrier visibility.',
    deliverables: [
      'Sub-15ms WebSocket GPS and status telemetry streaming',
      'Dynamic geo-fence calculation and route deviation alerts',
      'Consolidated freight operator control center',
      'Offline-capable driver companion web app',
    ],
    techStack: ['Next.js', 'Go', 'WebSockets', 'Cloudflare Workers', 'Mapbox GL'],
  },
  {
    id: 'hyperion-wealth',
    categoryTag: 'ai',
    title: 'Hyperion Wealth AI',
    category: 'Autonomous AI workflows',
    client: 'Hyperion Partners',
    tagline: 'Autonomous equity research synthesis and portfolio risk extraction.',
    metric: '18 hrs',
    metricLabel: 'Weekly time saved per analyst',
    body: 'An agentic workflow platform that continuously ingests SEC filings, earnings calls, and macroeconomic data to generate structured executive research summaries with full citation traceability.',
    deliverables: [
      'Multi-agent document decomposition and fact verification',
      'Automated consensus estimate deviation highlighting',
      'Human-in-the-loop analyst review and commentary system',
      'Audit logs guaranteeing complete compliance transparency',
    ],
    techStack: ['FastAPI', 'Python', 'Claude 3.5 Sonnet', 'PostgreSQL', 'Vector Search'],
  },
];

const categoryFilters = [
  { label: 'All Projects', value: 'all' },
  { label: 'Digital Products', value: 'products' },
  { label: 'Custom CRMs', value: 'crm' },
  { label: 'Autonomous AI', value: 'ai' },
];

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<PortfolioCategory>('all');

  const filteredProjects =
    activeFilter === 'all'
      ? portfolioProjects
      : portfolioProjects.filter((p) => p.categoryTag === activeFilter);

  return (
    <div className="page-main">
      <Navbar />

      <section className="page-hero">
        <div className="page-hero-inner">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <span /> Selected work
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
          >
            Software engineered for <em>measurable impact.</em>
          </motion.h1>
          <motion.p
            className="lead"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease }}
          >
            Explore how we help ambitious teams build high-velocity digital products,
            custom revenue infrastructure, and autonomous AI systems.
          </motion.p>
        </div>
      </section>

      <section className="page-section">
        {/* Category Filters */}
        <div className="portfolio-filters" style={{ marginBottom: '48px' }}>
          {categoryFilters.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={activeFilter === tab.value ? 'active' : ''}
              onClick={() => setActiveFilter(tab.value as PortfolioCategory)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <motion.div layout className="portfolio-grid">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.article
                layout
                key={project.id}
                className="portfolio-card spotlight-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease }}
              >
                <div className="portfolio-header">
                  <div>
                    <span className="client-tag">{project.client}</span>
                    <small>{project.category}</small>
                  </div>
                  <div className="portfolio-stat">
                    <strong>{project.metric}</strong>
                    <span>{project.metricLabel}</span>
                  </div>
                </div>

                <h3>{project.title}</h3>
                <p>{project.body}</p>

                <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
                  <div className="tech-tag-group" style={{ borderTop: 'none', padding: 0 }}>
                    {project.techStack.map((t) => (
                      <span key={t} className="tech-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Call to action */}
        <div
          style={{
            marginTop: '100px',
            padding: '56px 40px',
            borderRadius: '20px',
            background: 'var(--navy)',
            color: '#ffffff',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '32px', marginBottom: '16px' }}>
            Have a project in mind?
          </h2>
          <p style={{ color: '#aebbd3', maxWidth: '540px', margin: '0 auto 32px' }}>
            Let&apos;s build a custom platform that turns technical complexity into your competitive advantage.
          </p>
          <Link href="/contact" className="button-primary">
            Start the conversation <ArrowUpRight />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
