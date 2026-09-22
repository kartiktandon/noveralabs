'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Bot,
  Braces,
  Check,
  CircleGauge,
  Database,
  Quote,
  Sparkles,
  Workflow,
} from 'lucide-react';

const services = [
  {
    icon: Database,
    number: '01',
    title: 'Custom CRM',
    copy: 'Relationships, pipelines, and reporting shaped around how your team actually sells.',
  },
  {
    icon: Workflow,
    number: '02',
    title: 'Internal Tools',
    copy: 'Replace repetitive manual workflows with reliable, automated operational backbones.',
  },
  {
    icon: Blocks,
    number: '03',
    title: 'Digital Products',
    copy: 'Validate the core hypothesis, then engineer a production-ready system prepared to scale.',
  },
  {
    icon: Braces,
    number: '04',
    title: 'Web Platforms',
    copy: 'Sub-15ms edge routing and responsive interfaces backed by zero legacy debt.',
  },
  {
    icon: Bot,
    number: '05',
    title: 'AI Solutions',
    copy: 'Deterministic agentic workflows embedded straight into operational loops—not demo toys.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Understand',
    copy: 'Deconstruct the business model, friction points, data flows, and compounding levers.',
  },
  {
    number: '02',
    title: 'Simplify',
    copy: 'Turn distributed cognitive complexity into one unified, opinionated product architecture.',
  },
  {
    number: '03',
    title: 'Build',
    copy: 'Engineer and deploy in rapid, visible iterations with end-to-end type safety.',
  },
  {
    number: '04',
    title: 'Evolve',
    copy: 'Monitor real-time telemetry, observe user bottlenecks, and refine continuously.',
  },
];

const stories = [
  {
    company: 'HealthPlus',
    sector: 'Healthcare Tech',
    quote:
      'Novera made our multi-tier clinical CRM feel effortless. Our staff adopted it in days because it mirrors how our operations actually move.',
    name: 'Rohan Mehta',
    role: 'Founder & CEO',
  },
  {
    company: 'UrbanNest',
    sector: 'Real Estate Platform',
    quote:
      'The internal tools eliminated dozens of spreadsheet handoffs every week, giving leadership an instant, single source of truth.',
    name: 'Priya Sharma',
    role: 'Head of Operations',
  },
  {
    company: 'PlayVerse',
    sector: 'Gaming & Fintech',
    quote:
      'From architecture to edge deployment, Novera brought rare technical ownership, speed, and design rigor to every milestone.',
    name: 'Arjun Kapoor',
    role: 'VP Product Engineering',
  },
];

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function HomeLower() {
  return (
    <div className="home-lower">
      {/* 1. The Reality */}
      <section className="hl-reality" aria-labelledby="reality-title">
        <Reveal className="hl-reality-copy">
          <p className="hl-kicker">The Reality</p>
          <h2 id="reality-title">
            Your business is unique.
            <br />
            Your software should be <em>too.</em>
          </h2>
          <p>
            Off-the-shelf SaaS forces your team into rigid templates and compounding subscription bloat.
            We engineer custom software systems around your exact workflows, proprietary data, and ambitious growth targets.
          </p>
          <Link href="/contact" className="hl-text-link">
            <span>Diagnose your current bottlenecks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>

        <Reveal className="hl-reality-visual" delay={0.08}>
          <div className="hl-orbit" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="hl-system-card hl-system-card-main">
            <div className="hl-card-header">
              <span className="hl-card-pill">Core Engine</span>
              <span className="hl-card-pulse" />
            </div>
            <strong>One Unified System</strong>
            <div className="hl-card-checks">
              <small>
                <Check className="w-3.5 h-3.5 text-[#08b8f8]" /> Your proprietary data
              </small>
              <small>
                <Check className="w-3.5 h-3.5 text-[#08b8f8]" /> Zero manual handoffs
              </small>
              <small>
                <Check className="w-3.5 h-3.5 text-[#08b8f8]" /> 100% IP sovereignty
              </small>
            </div>
          </div>
          <div className="hl-system-card hl-system-card-note">
            <span>Tailored Architecture</span>
            <strong>Built for your team.</strong>
          </div>
        </Reveal>
      </section>

      {/* 2. Services Grid */}
      <section className="hl-services" aria-labelledby="services-title">
        <div className="hl-section-head">
          <Reveal>
            <p className="hl-kicker">Capabilities</p>
            <h2 id="services-title">
              Engineered for scale.
              <br />
              Shaped around <em>you.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p>
              From custom revenue infrastructure to high-performance customer applications,
              we design and construct the exact technology your company needs to unlock its next phase.
            </p>
          </Reveal>
        </div>

        <div className="hl-service-grid">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Reveal
                className="hl-service-card"
                delay={index * 0.05}
                key={service.title}
              >
                <div className="hl-service-icon">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="hl-service-number">{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
                <Link
                  href="/services"
                  className="hl-service-arrow"
                  aria-label={`Learn more about ${service.title}`}
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* 3. Process */}
      <section className="hl-process" aria-labelledby="process-title">
        <Reveal>
          <p className="hl-kicker">Methodology</p>
          <h2 id="process-title">
            Exceptional engineering starts
            <br />
            <em>before the code.</em>
          </h2>
        </Reveal>

        <div className="hl-process-line" aria-hidden="true">
          <span>
            <Image
              src="/novera-mark.png"
              alt=""
              width={22}
              height={28}
              className="hl-process-logo-img"
            />
          </span>
        </div>

        <div className="hl-step-grid">
          {steps.map((step, index) => (
            <Reveal className="hl-step" delay={index * 0.06} key={step.number}>
              <span className="hl-step-num">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 4. Real Impact Telemetry */}
      <section className="hl-impact" aria-labelledby="impact-title">
        <div className="hl-impact-grid" aria-hidden="true" />
        <Reveal className="hl-impact-copy">
          <p className="hl-kicker">Measurable Velocity</p>
          <h2 id="impact-title">
            Built for today.
            <br />
            Ready for <em>tomorrow.</em>
          </h2>
          <p>
            We don’t simply ship and disappear. We build modular, resilient software foundations
            that lower your operating costs and compound in enterprise value as your platform grows.
          </p>
          <Link href="/portfolio" className="hl-text-link">
            <span>Explore production case studies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>

        <Reveal className="hl-impact-visual" delay={0.08}>
          <div className="hl-console-top">
            <span />
            <span />
            <span />
            <small>NOVERA // TELEMETRY</small>
          </div>
          <div className="hl-console-body">
            <CircleGauge className="w-12 h-12 text-[#08b8f8]" />
            <div>
              <span>Platform Health</span>
              <strong>99.98%</strong>
            </div>
          </div>
          <div className="hl-console-bars" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </Reveal>

        <Reveal className="hl-impact-result" delay={0.14}>
          <p className="hl-kicker">Production Results</p>
          <h3>One single source of truth for high-output teams.</h3>
          <div className="hl-stat-row">
            <div>
              <strong>40%</strong>
              <small>Fewer manual operational hours</small>
            </div>
            <div>
              <strong>2.4×</strong>
              <small>Faster lead-to-close pipeline velocity</small>
            </div>
            <div>
              <strong>100%</strong>
              <small>Centralized system visibility</small>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 5. Client Stories */}
      <section className="hl-stories" aria-labelledby="stories-title">
        <div className="hl-section-head">
          <Reveal>
            <p className="hl-kicker">Social Proof</p>
            <h2 id="stories-title">
              Real partners.
              <br />
              Measurable <em>impact.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p>
              We collaborate with visionary founders and technology leaders who refuse to settle for generic off-the-shelf compromises.
            </p>
          </Reveal>
        </div>

        <div className="hl-story-grid">
          {stories.map((story, index) => (
            <Reveal className="hl-story" delay={index * 0.06} key={story.company}>
              <Quote className="hl-quote-icon" />
              <div className="hl-story-label">
                <strong>{story.company}</strong>
                <span>{story.sector}</span>
              </div>
              <blockquote>“{story.quote}”</blockquote>
              <div className="hl-person">
                <span className="hl-person-avatar">{story.name.charAt(0)}</span>
                <p>
                  <strong>{story.name}</strong>
                  <small>
                    {story.role}, {story.company}
                  </small>
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="hl-cta-section" aria-label="Start a project">
        <div className="hl-cta">
          <div className="hl-cta-mark" aria-hidden="true">
            <Image
              src="/novera-mark.png"
              alt="Novera"
              width={54}
              height={68}
              className="hl-cta-logo-img"
              priority
            />
          </div>
          <div className="hl-cta-content">
            <h2>
              Let&apos;s engineer something
              <br />
              extraordinary <em>together.</em>
            </h2>
            <p>
              Share your vision or rough specifications. Our senior architects will map the exact engineering blueprint.
            </p>
          </div>
          <div className="hl-cta-actions">
            <Link href="/contact" className="hl-cta-btn-primary">
              <span>Start your project</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link href="/portfolio" className="hl-cta-btn-secondary">
              Explore Portfolio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
