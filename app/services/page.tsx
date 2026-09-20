'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Code2,
  Database,
  Layers,
  Network,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

const ease = [0.16, 1, 0.3, 1] as const;

const servicesData = [
  {
    id: 'digital-products',
    icon: Code2,
    title: 'Digital Product Engineering',
    tagline: 'High-velocity web and mobile applications with zero legacy debt.',
    description:
      'We architect, design, and engineer custom digital products tailored to your operational workflows. From customer-facing SaaS platforms to complex multi-tenant applications, we bridge design polish with production-grade engineering.',
    deliverables: [
      'Reactive Next.js and TypeScript frontend applications',
      'Design systems and modular component libraries',
      'High-performance API contracts and backend engines',
      'Real-time state synchronization and telemetry',
    ],
    techStack: ['Next.js', 'React 19', 'TypeScript', 'Tailwind CSS', 'GraphQL', 'Node.js'],
  },
  {
    id: 'custom-crms',
    icon: Database,
    title: 'Custom CRM & Revenue Systems',
    tagline: 'Purpose-built software that fits how your team actually works.',
    description:
      'Off-the-shelf CRMs often create friction and cognitive overhead. We build specialized revenue platforms that unify customer lifecycle stages, automate follow-ups, and give leadership real-time visibility into pipeline momentum.',
    deliverables: [
      'Custom lead and pipeline tracking workspaces',
      'Automated multi-channel client engagement',
      'Role-based access control and institutional compliance',
      'Bi-directional sync with legacy data warehouses',
    ],
    techStack: ['PostgreSQL', 'Prisma', 'Redis', 'Tailwind', 'REST/RPC', 'Webhooks'],
  },
  {
    id: 'autonomous-ai',
    icon: Bot,
    title: 'Autonomous AI Workflows & Agents',
    tagline: 'Production-ready LLM pipelines with human-in-the-loop governance.',
    description:
      'Turn repetitive knowledge work into autonomous background processes. We build secure agentic workflows that extract document intelligence, triage tickets, and draft communications while keeping your team in control.',
    deliverables: [
      'Domain-specific autonomous agent swarms',
      'Retrieval-Augmented Generation (RAG) knowledge retrieval',
      'Deterministic fallback systems and safety guardrails',
      'Structured audit logging and confidence scoring',
    ],
    techStack: ['LangChain', 'OpenAI / Claude APIs', 'Vector DBs', 'Python', 'FastAPI'],
  },
  {
    id: 'cloud-architecture',
    icon: Network,
    title: 'Cloud Architecture & Telemetry',
    tagline: 'Sub-15ms edge routing, automated CI/CD, and global resilience.',
    description:
      'Modern systems require instantaneous responsiveness. We configure serverless and edge environments that scale horizontally without ballooning infrastructure overhead or maintenance drag.',
    deliverables: [
      'Edge deployment pipelines on Cloudflare and Vercel',
      'Distributed caching and sub-15ms telemetry monitoring',
      'Automated zero-downtime CI/CD workflows',
      'SOC2-ready security audits and infrastructure-as-code',
    ],
    techStack: ['Cloudflare Workers', 'Vercel', 'Docker', 'GitHub Actions', 'Terraform'],
  },
];

export default function ServicesPage() {
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
            <span /> Comprehensive capabilities
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
          >
            Engineering built for <em>lasting advantage.</em>
          </motion.h1>
          <motion.p
            className="lead"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease }}
          >
            We don&apos;t just write code. We shape purposeful systems that simplify complex
            operations, accelerate team throughput, and create unmistakable business momentum.
          </motion.p>
        </div>
      </section>

      <section className="page-section">
        <div className="service-deep-grid">
          {servicesData.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.id}
                className="service-deep-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, delay: index * 0.1, ease }}
              >
                <div>
                  <div className="service-deep-header">
                    <div className="service-icon-box">
                      <Icon />
                    </div>
                    <span className="tech-tag">{service.techStack[0]}</span>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul className="service-feature-list">
                    {service.deliverables.map((item) => (
                      <li key={item} className="service-feature-item">
                        <CheckCircle2 />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="tech-tag-group">
                  {service.techStack.map((tech) => (
                    <span key={tech} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>

        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <Link href="/contact" className="button-primary" style={{ minHeight: '52px', padding: '0 32px' }}>
            Discuss your system requirements <ArrowUpRight />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
