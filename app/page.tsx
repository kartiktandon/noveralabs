'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  type ReactNode,
  type SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  Code2,
  Database,
  Gauge,
  Menu,
  Network,
  Sparkles,
  Workflow,
  X,
} from 'lucide-react';
import { Component as LumaSpin } from '@/components/ui/luma-spin';

const ease = [0.16, 1, 0.3, 1] as const;

/* ══════════════════════════════════════════════════════════════
   21st.dev Inspired Motion Primitives
   ══════════════════════════════════════════════════════════════ */

/** Global Scroll Progress Bar */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 380,
    damping: 38,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="scroll-progress-bar"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}

/** 21st.dev Signature Blur-In Reveal */
function Reveal({
  children,
  className = '',
  delay = 0,
  onMouseMove,
  onMouseLeave,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: reduceMotion ? 0 : 22,
        filter: reduceMotion ? 'none' : 'blur(10px)',
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
      }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.85, delay, ease }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  );
}

/** 21st.dev Interactive Cursor Spotlight Card */
function SpotlightCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    cardRef.current.style.setProperty('--spotlight-opacity', '1');
  }

  function handleMouseLeave() {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--spotlight-opacity', '0');
  }

  return (
    <div
      ref={cardRef}
      className={`spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}


/** Number Ticker for Live Animated Numbers on Scroll */
function NumberTicker({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setDisplayValue(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplayValue(latest),
    });
    return () => controls.stop();
  }, [inView, value, reduceMotion]);

  return (
    <span ref={ref} className="number-ticker">
      {prefix}
      {decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue)}
      {suffix}
    </span>
  );
}

/** 21st.dev Infinite River Marquee */
const riverItems = [
  'Sub-15ms Real-Time Telemetry',
  'Custom Enterprise CRMs',
  'Autonomous AI Agents',
  'Reactive Cloud Architecture',
  'Event-Driven Blueprints',
  'Full IP & Source Ownership',
  'Production LLM Pipelines',
  'High-Velocity Digital Products',
  'Zero Legacy Tech Debt',
];

function CapabilitiesRiver() {
  const allItems = [...riverItems, ...riverItems];

  return (
    <section className="capabilities-river" aria-label="Technological capabilities">
      <div className="marquee-track">
        {allItems.map((item, idx) => (
          <div className="marquee-pill" key={`${item}-${idx}`}>
            <span className="marquee-pill-dot" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}


function SectionIntro({
  eyebrow,
  title,
  body,
  light = false,
}: {
  eyebrow: string;
  title: ReactNode;
  body: string;
  light?: boolean;
}) {
  return (
    <div className={`section-intro ${light ? 'is-light' : ''}`}>
      <Reveal>
        <p className="eyebrow">
          <span />
          {eyebrow}
        </p>
        <h2>{title}</h2>
      </Reveal>
      <Reveal className="section-intro-copy" delay={0.08}>
        <p>{body}</p>
      </Reveal>
    </div>
  );
}

const services = [
  {
    category: 'Product Engineering',
    icon: Code2,
    title: 'Websites & digital products',
    body: 'Clear positioning, thoughtful interaction, and production-ready frontend systems built around real people.',
    tags: ['Strategy', 'UX/UI', 'Development'],
  },
  {
    category: 'Revenue Operations',
    icon: Database,
    title: 'Custom CRM systems',
    body: 'Purpose-built revenue systems that make leads, follow-ups, reporting, and team ownership easier to see.',
    tags: ['Architecture', 'Automation', 'Dashboards'],
  },
  {
    category: 'Internal Infrastructure',
    icon: Workflow,
    title: 'Automation & internal tools',
    body: 'Connected workflows that remove repetitive work and give teams more time for decisions that matter.',
    tags: ['Workflows', 'Integrations', 'Operations'],
  },
  {
    category: 'Technical Strategy',
    icon: Network,
    title: 'Technology direction',
    body: 'Practical guidance that turns technical complexity into a focused roadmap with measurable priorities.',
    tags: ['Discovery', 'Roadmaps', 'Delivery'],
  },
];

const processSteps = [
  {
    step: 'Understand',
    body: 'We clarify the business model, friction holding progress back, and measurable definitions of commercial success.',
  },
  {
    step: 'Architect',
    body: 'We shape the right software system, technical interfaces, and scalable component hierarchy.',
  },
  {
    step: 'Engineer',
    body: 'We design and build in visible, testable increments with continuous integration and tight feedback loops.',
  },
  {
    step: 'Deliver & Own',
    body: 'We launch, instrument production telemetry, and hand over a documented system your team can confidently own.',
  },
];

const filterCategories = [
  { id: 'all', label: 'All Work' },
  { id: 'product', label: 'Digital Products' },
  { id: 'crm', label: 'Custom CRMs' },
  { id: 'automation', label: 'Automations & Tools' },
] as const;

type PortfolioCategory = (typeof filterCategories)[number]['id'];

const portfolioProjects = [
  {
    id: 'orbit-capital',
    category: 'Websites & digital products',
    categoryTag: 'product' as const,
    icon: Code2,
    title: 'Orbit Capital',
    subtitle: 'Institutional Investment Portal & Real-Time Telemetry',
    body: 'A next-generation wealth management platform engineered with sub-15ms WebSocket market feeds, predictive portfolio analytics, and high-frequency order execution.',
    metrics: [
      { label: 'Conversion Rate', value: '+142%' },
      { label: 'Capital Processed', value: '$180M+' },
    ],
    tags: ['Next.js', 'Real-time WebSockets', 'Financial Telemetry', 'Design System'],
    mockup: {
      status: 'Live Feed - 12ms',
      statLabel: 'Portfolio Index Value',
      statValue: '$24.8M (+18.4%)',
      type: 'chart' as const,
      bars: [30, 48, 42, 65, 55, 82, 90, 100],
    },
  },
  {
    id: 'pulseflow-crm',
    category: 'Custom CRM systems',
    categoryTag: 'crm' as const,
    icon: Database,
    title: 'Pulseflow CRM',
    subtitle: 'Enterprise Pipeline Orchestration & Revenue Intelligence',
    body: 'Purpose-built sales intelligence workspace that eliminates administrative friction, synchronizes multi-touch customer signals, and accelerates mid-market deal velocity.',
    metrics: [
      { label: 'Deal Velocity', value: '3.4x Faster' },
      { label: 'Admin Overhead', value: '-45% Less' },
    ],
    tags: ['Custom CRM', 'Pipeline Automation', 'Bi-directional Sync', 'Analytics'],
    mockup: {
      status: 'Pipeline Synchronized',
      statLabel: 'Active Pipeline Volume',
      statValue: '$1.42M Arr',
      type: 'pipeline' as const,
      steps: ['Qualified (38)', 'Proposal (14)', 'Closing (8)', 'Won ($420k)'],
    },
  },
  {
    id: 'synapse-automation',
    category: 'Automation & internal tools',
    categoryTag: 'automation' as const,
    icon: Workflow,
    title: 'Synapse Automation Hub',
    subtitle: 'Autonomous Operations Engine & ERP Integrations',
    body: 'Mission-critical workflow infrastructure orchestrating automated contract verification, real-time ERP reconciliation, and instant Slack event alerts across departments.',
    metrics: [
      { label: 'Time Saved', value: '1,200+ hrs/mo' },
      { label: 'Reliability', value: '99.98%' },
    ],
    tags: ['Event-Driven', 'Webhook Ingestion', 'ERP Sync', 'Internal Ops'],
    mockup: {
      status: 'Event Bus Healthy',
      statLabel: 'Execution Speed',
      statValue: '42ms Avg Latency',
      type: 'pipeline' as const,
      steps: ['Webhook', 'Schema Check', 'Transform', 'ERP Commit'],
    },
  },
  {
    id: 'lumina-health',
    category: 'Websites & digital products',
    categoryTag: 'product' as const,
    icon: Code2,
    title: 'Lumina Health Platform',
    subtitle: 'Human-Centric Patient Engagement & Telemedicine Suite',
    body: 'A frictionless patient engagement and clinical scheduling system bridging complex legacy electronic medical records with intuitive digital healthcare experiences.',
    metrics: [
      { label: 'Patient CSAT', value: '98.6%' },
      { label: 'Support Inquiries', value: '-60%' },
    ],
    tags: ['HIPAA Compliant', 'Telehealth UX', 'Mobile First', 'Microservices'],
    mockup: {
      status: 'Clinical Systems Online',
      statLabel: 'Patient Triage Velocity',
      statValue: '< 90s Avg Wait',
      type: 'chart' as const,
      bars: [35, 45, 60, 52, 75, 84, 91, 98],
    },
  },
];

const dashboardViews = [
  {
    tag: 'Momentum workspace',
    title: 'Good morning, team.',
    metrics: [
      { label: 'Pipeline value', value: '$284.8K', num: 284.8, prefix: '$', suffix: 'K', decimals: 1, sub: '+18.4% this quarter', accent: false },
      { label: 'Qualified leads', value: '128', num: 128, prefix: '', suffix: '', decimals: 0, sub: '12 ready for action', accent: false },
      { label: 'Momentum score', value: '94/100', num: 94, prefix: '', suffix: '/100', decimals: 0, sub: 'Systems aligned', accent: true },
    ],
    chartTitle: 'Business trajectory',
    chartSub: 'Last 6 months',
    bars: [34, 46, 41, 58, 68, 64, 79, 88, 96],
    actionsTitle: 'Next best actions',
    actions: [
      'Review 8 priority leads',
      'Approve website release',
      'Connect finance workflow',
    ],
  },
  {
    tag: 'Pipeline intelligence',
    title: 'Revenue & Deal Radar',
    metrics: [
      { label: 'Active Pipeline', value: '$1.84M', num: 1.84, prefix: '$', suffix: 'M', decimals: 2, sub: '28 active negotiations', accent: false },
      { label: 'Win Velocity', value: '68.2%', num: 68.2, prefix: '', suffix: '%', decimals: 1, sub: '3.4x faster cycle', accent: false },
      { label: 'Pipeline Health', value: '96/100', num: 96, prefix: '', suffix: '/100', decimals: 0, sub: 'Zero deal stalls', accent: true },
    ],
    chartTitle: 'Deal velocity index',
    chartSub: 'Q3 pipeline pacing',
    bars: [45, 52, 60, 72, 68, 85, 90, 98],
    actionsTitle: 'High-conviction deals',
    actions: [
      'Acme Global ($320k proposal sent)',
      'Finovate ($140k procurement call)',
      'HealthTech ($210k contract ready)',
    ],
  },
  {
    tag: 'Autonomous engine',
    title: 'Operations & Event Flow',
    metrics: [
      { label: 'Events Handled', value: '1.24M', num: 1.24, prefix: '', suffix: 'M', decimals: 2, sub: 'Zero dropped payloads', accent: false },
      { label: 'Avg Execution', value: '28ms', num: 28, prefix: '', suffix: 'ms', decimals: 0, sub: 'Real-time telemetry', accent: false },
      { label: 'Reliability', value: '99.99%', num: 99.99, prefix: '', suffix: '%', decimals: 2, sub: 'Self-healing clusters', accent: true },
    ],
    chartTitle: 'Throughput capacity',
    chartSub: 'Peak events / minute',
    bars: [30, 42, 55, 78, 65, 88, 92, 99],
    actionsTitle: 'Active automation flows',
    actions: [
      'DocuSign to ERP sync: Healthy',
      'Auto lead enrichment: Active',
      'Billing reconciliation: Complete',
    ],
  },
  {
    tag: 'AI copilots & agents',
    title: 'Autonomous System Agents',
    metrics: [
      { label: 'Tasks Resolved', value: '8,420', num: 8420, prefix: '', suffix: '', decimals: 0, sub: '94.6% fully automated', accent: false },
      { label: 'Escalation Rate', value: '1.4%', num: 1.4, prefix: '', suffix: '%', decimals: 1, sub: 'Human-in-the-loop review', accent: false },
      { label: 'Weekly Savings', value: '460 hrs', num: 460, prefix: '', suffix: ' hrs', decimals: 0, sub: 'Compounding impact', accent: true },
    ],
    chartTitle: 'Autonomous task execution',
    chartSub: 'Agent output trend',
    bars: [38, 50, 62, 70, 84, 89, 94, 100],
    actionsTitle: 'Agent activity log',
    actions: [
      'Agent Alpha: Triaged 42 tickets',
      'Agent Beta: Generated financial memo',
      'Agent Gamma: Verified system contracts',
    ],
  },
];

export default function Home() {
  const [pageLoading, setPageLoading] = useState(true);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [syncingTelemetry, setSyncingTelemetry] = useState(false);
  const [dashboardTab, setDashboardTab] = useState(0);
  const [portfolioFilter, setPortfolioFilter] = useState<PortfolioCategory>('all');
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const glassLogoY = useTransform(
    heroScrollProgress,
    [0, 1],
    [0, reduceMotion ? 0 : 140],
  );
  const glassLogoScale = useTransform(
    heroScrollProgress,
    [0, 1],
    [1, reduceMotion ? 1 : 0.82],
  );

  const emblemX = useMotionValue(0);
  const emblemY = useMotionValue(0);
  const springCfg = { damping: 24, stiffness: 180 };
  const emblemRotateX = useSpring(
    useTransform(emblemY, [-0.5, 0.5], [14, -14]),
    springCfg,
  );
  const emblemRotateY = useSpring(
    useTransform(emblemX, [-0.5, 0.5], [-14, 14]),
    springCfg,
  );

  function handleHeroMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    emblemX.set(x);
    emblemY.set(y);
  }

  function handleHeroMouseLeave() {
    emblemX.set(0);
    emblemY.set(0);
  }

  function handleSpotlightMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    e.currentTarget.style.setProperty('--spotlight-opacity', '1');
  }

  function handleSpotlightLeave(e: React.MouseEvent<HTMLElement>) {
    e.currentTarget.style.setProperty('--spotlight-opacity', '0');
  }

  const filteredProjects =
    portfolioFilter === 'all'
      ? portfolioProjects
      : portfolioProjects.filter((p) => p.categoryTag === portfolioFilter);

  function handleTabChange(index: number) {
    if (index === dashboardTab) return;
    setSyncingTelemetry(true);
    setDashboardTab(index);
    setTimeout(() => {
      setSyncingTelemetry(false);
    }, 650);
  }

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 1300);
  }

  return (
    <main>
      <AnimatePresence>
        {pageLoading && (
          <motion.div
            key="site-preloader"
            className="site-preloader dark"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.55, ease }}
          >
            <div className="preloader-glow" />
            <div className="preloader-content">
              <LumaSpin />
              <div className="preloader-meta">
                <span className="preloader-brand">NOVERA</span>
                <span className="preloader-status">Initializing systems</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ScrollProgressBar />
      <Navbar />

      <section
        className="hero"
        id="top"
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <motion.div
            className="eyebrow-badge"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="radar-ping" />
            <span>Next-generation technology, made practical</span>
          </motion.div>
          <motion.h1
            initial={{
              opacity: 0,
              y: reduceMotion ? 0 : 24,
              filter: reduceMotion ? 'none' : 'blur(12px)',
            }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.85, delay: 0.06, ease }}
          >
            Technology that moves{' '}
            <em className="animate-text-shimmer">business forward.</em>
          </motion.h1>
          <motion.p
            className="hero-lede"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.14, ease }}
          >
            Novera turns complex technology into clear business momentum -
            through digital products, custom platforms, and connected systems.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease }}
          >
            <Link
              className="button-primary"
              href="/contact"
              aria-label="Build what comes next"
            >
              Build what comes next <ArrowUpRight />
            </Link>
            <Link className="button-text" href="/services">
              Explore capabilities <ArrowRight />
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="momentum-stage"
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.12, ease }}
          aria-label="Novera brand mark representing connected business momentum"
        >
          <div className="stage-glow" />
          <div className="orbit orbit-one">
            <i />
            <i />
          </div>
          <div className="orbit orbit-two">
            <i />
          </div>
          <div className="orbit orbit-three" />
          <motion.div
            className="glass-n-motion"
            style={{
              y: glassLogoY,
              scale: glassLogoScale,
              rotateX: reduceMotion ? 0 : emblemRotateX,
              rotateY: reduceMotion ? 0 : emblemRotateY,
              transformPerspective: 1000,
            }}
          >
            <Image
              className="glass-n-logo"
              src="/novera-3d-mark.png"
              alt="Glass Novera N surrounded by connected technology symbols"
              width={1536}
              height={1024}
              priority
            />
          </motion.div>
          <motion.div
            className="signal-card signal-clarity"
            animate={reduceMotion ? {} : { y: [-6, 6, -6] }}
            transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut' }}
          >
            <strong>Clarity</strong>
            <small>See the right move</small>
          </motion.div>
          <motion.div
            className="signal-card signal-capability"
            animate={reduceMotion ? {} : { y: [6, -6, 6] }}
            transition={{
              repeat: Infinity,
              duration: 5.6,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          >
            <strong>Capability</strong>
            <small>Build the right system</small>
          </motion.div>
          <motion.div
            className="signal-card signal-progress"
            animate={reduceMotion ? {} : { y: [-6, 6, -6] }}
            transition={{
              repeat: Infinity,
              duration: 5.2,
              ease: 'easeInOut',
              delay: 1,
            }}
          >
            <strong>Progress</strong>
            <small>Measure what changes</small>
          </motion.div>
        </motion.div>

        <a
          href="#services"
          className="hero-scroll-cue"
          aria-label="Scroll to explore capabilities"
        >
          <span>Explore</span>
          <ArrowDown className="hero-scroll-arrow" />
        </a>
      </section>

      <CapabilitiesRiver />

      <section className="services" id="services">
        <SectionIntro
          eyebrow="What we build"
          title={
            <>
              Practical technology.
              <br />
              <em>Visible momentum.</em>
            </>
          }
          body="We combine strategy, design, and engineering into systems that are easier to understand, adopt, and grow."
        />
        <div className="service-grid">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Reveal
                className="service-card spotlight-card"
                key={service.title}
                delay={index * 0.05}
                onMouseMove={handleSpotlightMove}
                onMouseLeave={handleSpotlightLeave}
              >
                <div className="service-card-top">
                  <span className="service-category-tag">{service.category}</span>
                  <div className="service-icon-wrap">
                    <Icon />
                  </div>
                </div>
                <h3>{service.title}</h3>
                <p>{service.body}</p>
                <ul>
                  {service.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <Link href="/contact" aria-label={`Discuss ${service.title}`}>
                  Discuss your system <ArrowUpRight />
                </Link>
              </Reveal>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link href="/services" className="button-secondary">
            Explore all capabilities <ArrowRight />
          </Link>
        </div>
      </section>

      <section className="portfolio" id="portfolio">
        <div className="portfolio-header">
          <SectionIntro
            eyebrow="Proven Impact"
            title={
            <>
              Selected systems.
              <br />
              <em>Measurable results.</em>
            </>
          }
          body="Explore how we partner with forward-thinking teams to architect platforms, streamline operations, and deliver tangible commercial outcomes."
        />
        <Reveal delay={0.08}>
          <div
            className="portfolio-filters"
            role="tablist"
            aria-label="Portfolio filters"
          >
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={portfolioFilter === cat.id}
                className={`filter-btn ${portfolioFilter === cat.id ? 'active' : ''}`}
                onClick={() => setPortfolioFilter(cat.id)}
              >
                {portfolioFilter === cat.id && (
                  <motion.span
                    layoutId="activeFilterPill"
                    className="filter-pill-active"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="filter-btn-text">{cat.label}</span>
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="portfolio-grid">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.article
                key={project.id}
                className="portfolio-card spotlight-card"
                layout
                initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                whileHover={
                  reduceMotion
                    ? {}
                    : { y: -6, transition: { duration: 0.25 } }
                }
                transition={{ duration: 0.45, delay: index * 0.05, ease }}
                onMouseMove={handleSpotlightMove}
                onMouseLeave={handleSpotlightLeave}
              >
                  <div className="portfolio-card-top">
                    <span className="portfolio-category-badge">
                      <Icon />
                      {project.category}
                    </span>
                  </div>

                  <h3>{project.title}</h3>
                  <div className="portfolio-card-subtitle">
                    {project.subtitle}
                  </div>
                  <p>{project.body}</p>

                  <div className="portfolio-preview-box" aria-hidden="true">
                    <div className="preview-nav-mock">
                      <div className="preview-dots">
                        <span />
                        <span />
                        <span />
                      </div>
                      <span className="preview-status">
                        <i /> {project.mockup.status}
                      </span>
                    </div>

                    <div className="preview-body-mock">
                      <div className="preview-row">
                        <span className="preview-label">
                          {project.mockup.statLabel}
                        </span>
                        <strong className="preview-val">
                          {project.mockup.statValue}
                        </strong>
                      </div>

                      {project.mockup.type === 'chart' &&
                        project.mockup.bars && (
                          <div className="preview-chart-bars">
                            {project.mockup.bars.map((height, i) => (
                              <motion.i
                                key={i}
                                initial={{ height: 0 }}
                                whileInView={{ height: `${height}%` }}
                                viewport={{ once: true }}
                                transition={{
                                  duration: 0.6,
                                  delay: 0.08 + i * 0.04,
                                  ease,
                                }}
                              />
                            ))}
                          </div>
                        )}

                      {project.mockup.type === 'pipeline' &&
                        project.mockup.steps && (
                          <div className="preview-pipeline">
                            {project.mockup.steps.map((step, i) => (
                              <div
                                key={i}
                                className={`preview-step ${i === project.mockup.steps!.length - 1 ? 'active' : ''}`}
                              >
                                {step}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="portfolio-metrics">
                    {project.metrics.map((m, i) => (
                      <div key={i} className="portfolio-metric-item">
                        <small>{m.label}</small>
                        <strong>{m.value}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="portfolio-tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <div className="portfolio-card-footer">
                    <Link
                      href="/contact"
                      aria-label={`Start a project like ${project.title}`}
                    >
                      Discuss this build <ArrowUpRight />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link href="/portfolio" className="button-secondary">
            Explore all case studies <ArrowRight />
          </Link>
        </div>
      </section>

      <section className="systems" id="systems">
        <div className="systems-grid" aria-hidden="true" />
        <SectionIntro
          light
          eyebrow="Connected by design"
          title={
            <>
              From scattered signals
              <br />
              to <em>one clear system.</em>
            </>
          }
          body="A useful platform does more than store information. It helps people understand what is happening, decide what matters, and act with confidence."
        />
        <Reveal className="system-demo">
          <aside className="demo-rail">
            <Image src="/novera-mark.png" alt="" width={1120} height={1405} />
            {[
              { icon: Gauge, label: 'Momentum workspace' },
              { icon: Database, label: 'Pipeline CRM' },
              { icon: Workflow, label: 'Workflow engine' },
              { icon: Bot, label: 'Autonomous agents' },
            ].map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  key={index}
                  type="button"
                  aria-label={tab.label}
                  className={dashboardTab === index ? 'active' : ''}
                  onClick={() => handleTabChange(index)}
                >
                  <Icon />
                </button>
              );
            })}
          </aside>
          <AnimatePresence mode="wait">
            <motion.div
              key={dashboardTab}
              className="demo-main"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease }}
            >
              <div className="demo-header">
                <div>
                  <small>{dashboardViews[dashboardTab].tag}</small>
                  <h3>{dashboardViews[dashboardTab].title}</h3>
                </div>
                <span>
                  {syncingTelemetry ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--cyan)',
                      }}
                    >
                      <span
                        className="dark"
                        style={{
                          transform: 'scale(0.32)',
                          margin: '-22px -20px',
                          display: 'inline-block',
                        }}
                      >
                        <LumaSpin />
                      </span>
                      Syncing telemetry...
                    </span>
                  ) : (
                    <>
                      <i /> Systems live
                    </>
                  )}
                </span>
              </div>
              <div className="metric-grid">
                {dashboardViews[dashboardTab].metrics.map((m, i) => (
                  <article key={`${dashboardTab}-${i}`} className={m.accent ? 'metric-accent' : ''}>
                    <small>{m.label}</small>
                    <strong>
                      <NumberTicker
                        value={m.num}
                        prefix={m.prefix}
                        suffix={m.suffix}
                        decimals={m.decimals}
                      />
                    </strong>
                    <span>{m.sub}</span>
                  </article>
                ))}
              </div>
              <div className="demo-lower">
                <div className="trajectory">
                  <div className="demo-title">
                    <span>{dashboardViews[dashboardTab].chartTitle}</span>
                    <small>{dashboardViews[dashboardTab].chartSub}</small>
                  </div>
                  <div className="bars">
                    {dashboardViews[dashboardTab].bars.map((height, index) => (
                      <motion.i
                        key={`${dashboardTab}-${index}`}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.03,
                          ease,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="next-actions">
                  <div className="demo-title">
                    <span>{dashboardViews[dashboardTab].actionsTitle}</span>
                    <Sparkles />
                  </div>
                  {dashboardViews[dashboardTab].actions.map((item, index) => (
                    <p key={item}>
                      <span>0{index + 1}</span>
                      {item}
                      <ArrowRight />
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </section>

      <section className="principles" id="about">
        <SectionIntro
          eyebrow="How Novera feels"
          title={
            <>
              Intelligent by nature.
              <br />
              <em>Human by design.</em>
            </>
          }
          body="Enterprise confidence without the complexity. Every choice is made to create clarity for the people who use the system."
        />
        <div className="principle-grid">
          {[
            [
              'Clear',
              'Technical complexity translated into direct business value.',
            ],
            [
              'Confident',
              'Decisive recommendations supported by evidence and intent.',
            ],
            [
              'Forward-looking',
              'A practical view of what becomes possible next.',
            ],
            ['Human', 'Technology that speaks to people, not systems.'],
          ].map(([title, body], index) => (
            <Reveal
              className="principle-card spotlight-card"
              key={title}
              delay={index * 0.05}
              onMouseMove={handleSpotlightMove}
              onMouseLeave={handleSpotlightLeave}
            >
              <span className="principle-bullet" />
              <h3>{title}</h3>
              <p>{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="process" id="process">
        <div className="process-copy">
          <Reveal>
            <p className="eyebrow">
              <span /> A precise path forward
            </p>
            <h2>
              Direction before
              <br />
              <em>decoration.</em>
            </h2>
            <p>
              Four focused stages keep the work useful, visible, and moving.
            </p>
          </Reveal>
        </div>
        <div className="process-list">
          {processSteps.map((item, index) => (
            <Reveal className="process-step" key={item.step} delay={index * 0.05}>
              <span className="process-marker" />
              <div>
                <h3>{item.step}</h3>
                <p>{item.body}</p>
              </div>
              <ArrowUpRight />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contact-orbit" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <Reveal className="contact-copy">
          <p className="eyebrow">
            <span /> Ready when you are
          </p>
          <h2>
            Build smarter systems.
            <br />
            Create what comes next.
          </h2>
          <p>Tell us what should feel clearer, move faster, or work better.</p>
        </Reveal>
        <Reveal className="contact-panel" delay={0.08}>
          {submitting ? (
            <motion.div
              className="form-success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease }}
              style={{ alignItems: 'flex-start' }}
            >
              <div className="dark" style={{ marginBottom: '24px' }}>
                <LumaSpin />
              </div>
              <h3 style={{ fontSize: '30px', margin: '0 0 12px', color: 'var(--white)' }}>
                Connecting to Novera systems
              </h3>
              <p style={{ maxWidth: '440px', margin: 0, color: '#aebbd3', lineHeight: 1.6 }}>
                Processing and encrypting your project brief telemetry.
              </p>
            </motion.div>
          ) : sent ? (
            <motion.div
              className="form-success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span>
                <Check />
              </span>
              <h3>Message captured.</h3>
              <p>
                This demonstration is ready to connect to your preferred form
                backend.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setSubmitting(false);
                }}
              >
                Send another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label>
                <span>Your name</span>
                <input required placeholder="Name" />
              </label>
              <label>
                <span>Work email</span>
                <input required type="email" placeholder="you@company.com" />
              </label>
              <label className="full">
                <span>What should we build?</span>
                <textarea
                  required
                  placeholder="A digital product, a better CRM, or a connected system..."
                />
              </label>
              <div className="form-footer full">
                <p>A rough idea is enough to begin.</p>
                <button type="submit">
                  Start the conversation <ArrowUpRight />
                </button>
              </div>
            </form>
          )}
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
