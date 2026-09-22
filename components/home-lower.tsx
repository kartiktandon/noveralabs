'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Case } from '@/components/ui/cases-with-infinite-scroll';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
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

      {/* Clients We Have Built For - Infinite Scroll Carousel */}
      <Case />

      {/* Process */}
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

      {/* 4. Measurable Velocity & 3D Telemetry Container Scroll */}
      <section className="hl-scroll-telemetry-section overflow-hidden -my-12 md:-my-20" aria-labelledby="impact-title">
        <ContainerScroll
          titleComponent={
            <div className="flex flex-col items-center mb-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#08b8f8]/10 border border-[#08b8f8]/25 text-[#08b8f8] text-xs font-mono uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span id="impact-title">Measurable Velocity</span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-[family-name:var(--font-sora)]">
                Built for today. <br />
                <span className="bg-gradient-to-r from-[#08b8f8] via-[#38bdf8] to-[#146bff] bg-clip-text text-transparent">
                  Ready for tomorrow.
                </span>
              </h2>
              <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto mt-4 leading-relaxed">
                We engineer modular, resilient software foundations that lower your operating costs and compound in enterprise value as your platform grows.
              </p>
            </div>
          }
        >
          {/* Production Console Inside 3D Rotating Card */}
          <div className="h-full w-full flex flex-col justify-between p-4 md:p-6 bg-[#080d19] rounded-xl border border-white/10 text-left relative overflow-hidden">
            {/* Top Console Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-[#08b8f8]/80" />
                <span className="ml-3 text-[11px] font-mono text-slate-400 font-semibold tracking-wider">
                  NOVERA // TELEMETRY OS
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/30">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-[#34d399] tracking-wider uppercase">
                  Online · 99.98%
                </span>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 my-3">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <small className="text-[10px] font-mono text-slate-400 uppercase block">Operating Friction</small>
                <strong className="text-lg md:text-xl font-bold text-white font-[family-name:var(--font-sora)]">40% Less</strong>
                <span className="text-[10px] text-slate-500 block">Manual ops overhead</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <small className="text-[10px] font-mono text-slate-400 uppercase block">Pipeline Velocity</small>
                <strong className="text-lg md:text-xl font-bold text-[#34d399] font-[family-name:var(--font-sora)]">2.4×</strong>
                <span className="text-[10px] text-slate-500 block">Lead-to-close speed</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <small className="text-[10px] font-mono text-slate-400 uppercase block">System Visibility</small>
                <strong className="text-lg md:text-xl font-bold text-[#08b8f8] font-[family-name:var(--font-sora)]">100%</strong>
                <span className="text-[10px] text-slate-500 block">Single source of truth</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <small className="text-[10px] font-mono text-slate-400 uppercase block">Global Latency</small>
                <strong className="text-lg md:text-xl font-bold text-[#a855f7] font-[family-name:var(--font-sora)]">&lt; 15ms</strong>
                <span className="text-[10px] text-slate-500 block">Sub-second edge routing</span>
              </div>
            </div>

            {/* Visual Health & Activity Split */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 flex-1 items-center">
              {/* Left: Health Gauge & Glowing Bars (User's Exact Uploaded Visual) */}
              <div className="md:col-span-6 p-4 rounded-xl bg-[#0c1424]/80 border border-[#08b8f8]/20 flex flex-col justify-between h-full shadow-[inset_0_0_30px_rgba(8,184,248,0.06)]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#08b8f8]/10 border border-[#08b8f8]/30 flex items-center justify-center text-[#08b8f8] shadow-[0_0_20px_rgba(8,184,248,0.2)]">
                    <CircleGauge className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Platform Health</span>
                    <strong className="text-2xl md:text-3xl font-extrabold text-white font-[family-name:var(--font-sora)] tracking-tight">
                      99.98%
                    </strong>
                  </div>
                </div>

                {/* Glowing Bars from User Screenshot */}
                <div className="flex items-end gap-2 h-20 pt-3 mt-1">
                  <div className="flex-1 h-[45%] rounded-t-md bg-gradient-to-t from-[#0284c7] to-[#08b8f8] shadow-[0_0_12px_rgba(8,184,248,0.5)]" />
                  <div className="flex-1 h-[65%] rounded-t-md bg-gradient-to-t from-[#0284c7] to-[#08b8f8] shadow-[0_0_14px_rgba(8,184,248,0.5)]" />
                  <div className="flex-1 h-[52%] rounded-t-md bg-gradient-to-t from-[#0284c7] to-[#08b8f8] shadow-[0_0_12px_rgba(8,184,248,0.5)]" />
                  <div className="flex-1 h-[88%] rounded-t-md bg-gradient-to-t from-[#0284c7] to-[#08b8f8] shadow-[0_0_18px_rgba(8,184,248,0.6)]" />
                  <div className="flex-1 h-[70%] rounded-t-md bg-gradient-to-t from-[#0284c7] to-[#08b8f8] shadow-[0_0_14px_rgba(8,184,248,0.5)]" />
                  <div className="flex-1 h-[100%] rounded-t-md bg-gradient-to-t from-[#0284c7] to-[#38bdf8] shadow-[0_0_22px_rgba(8,184,248,0.7)]" />
                  <div className="flex-1 h-[82%] rounded-t-md bg-gradient-to-t from-[#0284c7] to-[#08b8f8] shadow-[0_0_16px_rgba(8,184,248,0.5)]" />
                </div>
              </div>

              {/* Right: Live Production Platform Feed */}
              <div className="md:col-span-6 flex flex-col gap-1.5 justify-center h-full">
                <div className="p-2 sm:p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium text-[11px]">Sort Marketing 4K Stream</span>
                  <span className="font-mono text-[#08b8f8] text-[10px]">48.2 MB/s · OK</span>
                </div>
                <div className="p-2 sm:p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium text-[11px]">Hepki Escrow & Dispatch</span>
                  <span className="font-mono text-[#10b981] text-[10px]">Webhook Synced</span>
                </div>
                <div className="p-2 sm:p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium text-[11px]">Detailing Adda Bay Ops</span>
                  <span className="font-mono text-[#ef4444] text-[10px]">GST Invoiced</span>
                </div>
                <div className="hidden sm:flex p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium text-[11px]">Boombastic Sales Matrix</span>
                  <span className="font-mono text-[#34d399] text-[10px]">+$45k ARR Added</span>
                </div>
                <div className="hidden sm:flex p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium text-[11px]">WorkPulse Compliance Audit</span>
                  <span className="font-mono text-[#a855f7] text-[10px]">SOC2 Clear</span>
                </div>
              </div>
            </div>

            {/* Bottom Link */}
            <div className="pt-2.5 mt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
              <span>Novera Production Operating Engine</span>
              <Link href="/portfolio" className="inline-flex items-center gap-1 text-[#08b8f8] hover:text-[#38bdf8] font-semibold transition-colors">
                <span>Explore production case studies</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </ContainerScroll>
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
