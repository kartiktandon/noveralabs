'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Compass, Cpu, HeartHandshake, Shield, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

const ease = [0.16, 1, 0.3, 1] as const;

const principles = [
  {
    title: 'Clear',
    tagline: 'Complexity made visible and simple.',
    description:
      'We strip away artificial abstraction. Interfaces and data models should immediately clarify what is happening and what action to take next.',
  },
  {
    title: 'Useful',
    tagline: 'Built around how real people work.',
    description:
      'Software is useless if your team avoids using it. We design platforms that align with natural operational incentives and real-world workflows.',
  },
  {
    title: 'Fast',
    tagline: 'Sub-15ms responsiveness as an invariant.',
    description:
      'Speed is a feature and a psychological advantage. We engineer every endpoint, query, and render path to feel instantaneous.',
  },
  {
    title: 'Durable',
    tagline: 'Zero legacy debt, full IP ownership.',
    description:
      'We write modular, strictly typed TypeScript that your engineers can proudly adopt and expand for years without needing rewrites.',
  },
];

const processSteps = [
  {
    stage: 'Discovery & Blueprint',
    timing: 'Weeks 1 to 2',
    description:
      'We examine your operational bottlenecks, audit existing systems, and establish a clear technical specification with measurable success criteria.',
  },
  {
    stage: 'Architecture & System Design',
    timing: 'Weeks 3 to 4',
    description:
      'We shape the data models, component hierarchy, and API contracts. You review interactive prototypes before heavy engineering begins.',
  },
  {
    stage: 'Production Engineering',
    timing: 'Weeks 5 to 8',
    description:
      'High-velocity implementation with reactive state management, edge deployment pipelines, and automated integration tests.',
  },
  {
    stage: 'Observability & Handover',
    timing: 'Weeks 9 to 10',
    description:
      'We instrument production telemetry, conduct team training sessions, and hand over 100% of the documented source code and infrastructure.',
  },
];

export default function AboutPage() {
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
            <span /> Studio philosophy
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
          >
            Intelligent by nature. <em>Human by design.</em>
          </motion.h1>
          <motion.p
            className="lead"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease }}
          >
            Novera was founded on a simple conviction: modern enterprise software
            should not feel clunky, slow, or fragmented. We combine world-class
            design taste with production-grade engineering.
          </motion.p>
        </div>
      </section>

      {/* Principles Section */}
      <section className="page-section">
        <div style={{ maxWidth: '640px', marginBottom: '40px' }}>
          <p className="eyebrow">
            <span /> Foundational values
          </p>
          <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '36px', letterSpacing: '-0.03em' }}>
            Four principles that guide every build.
          </h2>
        </div>

        <div className="principle-grid">
          {principles.map((item, index) => (
            <motion.article
              key={item.title}
              className="principle-card spotlight-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.08, ease }}
            >
              <h3>{item.title}</h3>
              <p style={{ fontWeight: 600, color: 'var(--blue)', marginBottom: '10px' }}>
                {item.tagline}
              </p>
              <p>{item.description}</p>
            </motion.article>
          ))}
        </div>

        {/* Process Section */}
        <div style={{ marginTop: '120px' }}>
          <div style={{ maxWidth: '640px', marginBottom: '48px' }}>
            <p className="eyebrow">
              <span /> How we work
            </p>
            <h2 style={{ fontFamily: 'var(--font-sora)', fontSize: '36px', letterSpacing: '-0.03em' }}>
              Four focused stages to build momentum.
            </h2>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '16px' }}>
              We work in focused sprints with transparent milestone reviews and zero guesswork.
            </p>
          </div>

          <div className="process-list">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.stage}
                className="process-step"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.08, ease }}
              >
                <span className="process-marker" />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '6px' }}>
                    <h3 style={{ margin: 0 }}>{step.stage}</h3>
                    <span className="tech-tag" style={{ fontSize: '11px' }}>
                      {step.timing}
                    </span>
                  </div>
                  <p>{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: '100px',
            textAlign: 'center',
            padding: '60px 24px',
            background: 'var(--paper)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-sora)', fontSize: '28px', marginBottom: '16px' }}>
            Ready to build what comes next?
          </h3>
          <p style={{ color: 'var(--muted-foreground)', maxWidth: '480px', margin: '0 auto 28px' }}>
            Tell us about your team and vision. A rough idea is enough to begin.
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

