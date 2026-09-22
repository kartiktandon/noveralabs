'use client';

import React, { useState, useRef } from 'react';
import Link from '@/components/ui/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  TrendingUp,
  Activity,
  ShieldCheck,
  Video,
  Database,
  Calendar,
  Gauge,
  Clock,
  Car,
  Users,
  Cpu,
  Server,
  Zap,
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
  SlidersHorizontal,
  FileText,
  MapPin,
  Radio,
  BarChart3,
} from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

export type ShowcaseCategory = 'all' | 'crm' | 'products' | 'tools';
export type StageMode = 'console' | 'blueprint' | 'telemetry';

export interface ClientProject {
  id: string;
  categoryTag: 'crm' | 'products' | 'tools';
  categoryLabel: string;
  client: string;
  title: string;
  tagline: string;
  body: string;
  liveUrl: string;
  metrics: { label: string; value: string; detail: string }[];
  deliverables: string[];
  techStack: string[];
  badgeColor: string;
  previewKind: 'sort-marketing' | 'hepki' | 'detailing-adda' | 'boombastic' | 'workpulse';
  architecture: {
    frontend: string;
    backend: string;
    database: string;
    infrastructure: string;
    throughput: string;
  };
  impactComparison: {
    before: string;
    after: string;
  };
}

export const CLIENT_PROJECTS: ClientProject[] = [
  {
    id: 'sort-marketing',
    categoryTag: 'products',
    categoryLabel: 'Digital Products & Media',
    client: 'Sort Marketing',
    title: 'Sort Marketing',
    tagline: 'Cinematic video production platform with sub-second stream orchestration.',
    body: 'An immersive digital showcase engineered for India’s premier video production studio, featuring edge-routed 4K reel previews, fluid kinetic transitions, and an interactive brand roster.',
    liveUrl: 'https://www.sortmarketing.com/',
    metrics: [
      { label: 'Video Engagement', value: '+240%', detail: 'Average session watch-time' },
      { label: 'Edge Load Speed', value: '< 420ms', detail: 'First Contentful Paint globally' },
    ],
    deliverables: [
      'Edge-cached video streaming architecture',
      'Fluid kinetic portfolio interaction model',
      'Interactive client brand roster marquee',
      'Zero-layout-shift responsive media player',
    ],
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vimeo API', 'Edge CDN'],
    badgeColor: '#08b8f8',
    previewKind: 'sort-marketing',
    architecture: {
      frontend: 'Next.js App Router + Framer Motion',
      backend: 'Vimeo Pro Video API + Edge Workers',
      database: 'Headless CMS + Edge Key-Value Cache',
      infrastructure: 'Vercel Global Edge Network',
      throughput: '1.2M+ monthly video impressions',
    },
    impactComparison: {
      before: 'Laggy 4.8s initial load with buffering Vimeo embeds on mobile',
      after: 'Sub-450ms instantaneous edge playback with silky kinetic transitions',
    },
  },
  {
    id: 'hepki',
    categoryTag: 'products',
    categoryLabel: 'Consumer Marketplace',
    client: 'Hepki Technologies',
    title: 'Hepki',
    tagline: 'Verified on-demand assistance marketplace with real-time buddy dispatch.',
    body: 'A production on-demand assistance platform connecting customers with vetted Buddies for hospital visits, shopping, and everyday support with automated dispatching and secure payment escrow.',
    liveUrl: 'https://hepki-frontend.vercel.app/',
    metrics: [
      { label: 'Intake Velocity', value: '4.2× Faster', detail: 'From category selection to booking' },
      { label: 'Vetted Security', value: '100% Verified', detail: 'Multi-layer ID & police verification' },
    ],
    deliverables: [
      'Multi-category service booking engine',
      'Automated Buddy dispatch & calendar matching',
      'Razorpay payment integration with instant invoice',
      'Live booking progress & safety verification matrix',
    ],
    techStack: ['Next.js App Router', 'React', 'Tailwind CSS', 'Razorpay', 'Vercel'],
    badgeColor: '#38bdf8',
    previewKind: 'hepki',
    architecture: {
      frontend: 'Next.js 14 Responsive PWA',
      backend: 'Serverless Node API + WebSocket Dispatch',
      database: 'PostgreSQL + Redis Queue',
      infrastructure: 'Vercel + AWS S3 Media CDN',
      throughput: 'Sub-60s end-to-end booking turnaround',
    },
    impactComparison: {
      before: 'Manual phone calls & unverified WhatsApp coordination',
      after: 'Self-serve booking platform with verified security & real-time dispatch',
    },
  },
  {
    id: 'detailing-adda',
    categoryTag: 'crm',
    categoryLabel: 'Custom Studio CRM',
    client: 'Detailing Adda',
    title: 'Detailing Adda CRM',
    tagline: 'In-house automotive studio OS — bay scheduling, PPF inventory & GST invoicing.',
    body: 'A bespoke enterprise studio CRM replacing manual physical bay sheets with automated PPF and ceramic coating job workflows, dynamic film roll stock tracking, and instant compliant GST invoice generation.',
    liveUrl: 'https://detailingadda.vercel.app/login',
    metrics: [
      { label: 'Admin Overhead', value: '-65% Reduced', detail: 'Zero lost jobs or untracked film rolls' },
      { label: 'Invoicing Speed', value: 'Instant GST', detail: 'One-click compliant tax ledgers' },
    ],
    deliverables: [
      'Bay scheduling & ceramic coating job allocation',
      'PPF roll usage & film square-footage inventory',
      'One-click GST tax invoices with client ledger',
      'Vehicle inspection checklist & technician sign-off',
    ],
    techStack: ['Next.js App Router', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'Turbopack'],
    badgeColor: '#ef4444',
    previewKind: 'detailing-adda',
    architecture: {
      frontend: 'Turbopack Next.js Client Dashboard',
      backend: 'RESTful API + Prisma ORM',
      database: 'PostgreSQL with Automated Daily Snapshots',
      infrastructure: 'Isolated Secure Cloud Hosting',
      throughput: '100% bay utilization visibility across all active shifts',
    },
    impactComparison: {
      before: 'Paper slips, missing invoice numbers & manual inventory stock counting',
      after: 'Unified studio dashboard: live bays, auto-calculated GST, roll inventory',
    },
  },
  {
    id: 'boombastic-crm',
    categoryTag: 'crm',
    categoryLabel: 'Pipeline Automation',
    client: 'Boombastic',
    title: 'Boombastic CRM',
    tagline: 'High-velocity sales intelligence with weekly booking matrices and deal pacing.',
    body: 'A purpose-built sales velocity CRM eliminating deal stalls through synchronized weekly booking calendars, multi-tier company pipeline visualization, and automated follow-up cadences.',
    liveUrl: 'https://boombastic-crm-frontend.vercel.app/',
    metrics: [
      { label: 'Deal Velocity', value: '3.6× Pacing', detail: 'Faster lead-to-proposal conversion' },
      { label: 'Active Pipeline', value: '$1.42M Arr', detail: 'Zero deal leakage across team' },
    ],
    deliverables: [
      'Weekly booking calendar orchestration',
      'Multi-stage company lead pipeline radar',
      'Automated prospect follow-up sequences',
      'Team accountability & conversion telemetry',
    ],
    techStack: ['React', 'JavaScript', 'CSS Modules', 'Vercel', 'REST APIs'],
    badgeColor: '#10b981',
    previewKind: 'boombastic',
    architecture: {
      frontend: 'React Component Architecture',
      backend: 'Node.js Microservices + Webhooks',
      database: 'Cloud Document Database',
      infrastructure: 'Vercel Edge Platform',
      throughput: 'Dozens of simultaneous deal state synchronizations',
    },
    impactComparison: {
      before: 'Stalled deals scattered across private calendars & email threads',
      after: 'Shared team pipeline with weekly booking cadence & zero missed follow-ups',
    },
  },
  {
    id: 'workpulse',
    categoryTag: 'tools',
    categoryLabel: 'Internal Operations',
    client: 'WorkPulse.in',
    title: 'WorkPulse.in',
    tagline: 'Enterprise audit & compliance workflow engine for high-output distributed teams.',
    body: 'A unified compliance workflow platform where cross-functional operations run without friction, consolidating complex regulatory checklists, automated deviation triggers, and executive audit logs.',
    liveUrl: 'https://workpulse.in/',
    metrics: [
      { label: 'Audit Uptime', value: '99.98%', detail: 'Zero compliance reporting lapses' },
      { label: 'Weekly Savings', value: '32 hrs/team', detail: 'Eliminated manual audit reporting meetings' },
    ],
    deliverables: [
      'Multi-tier compliance checklist verification',
      'Real-time regulatory audit trail logging',
      'Event-driven deviation alert dispatch',
      'Executive governance & team health index',
    ],
    techStack: ['React', 'Node.js', 'Tailwind CSS', 'WebSockets', 'Cloud Architecture'],
    badgeColor: '#a855f7',
    previewKind: 'workpulse',
    architecture: {
      frontend: 'React Enterprise Single-Page Application',
      backend: 'Event-Driven WebSocket Hub',
      database: 'Relational Audit Store with Immutable Log Chain',
      infrastructure: 'High-Availability Cloud Cluster',
      throughput: 'Real-time telemetry event bus handling high-frequency audit signals',
    },
    impactComparison: {
      before: 'Endless spreadsheet checklists and missed compliance deadlines',
      after: 'Automated 99.4% compliant workflow with real-time exception alerting',
    },
  },
];

const categoryTabs: { id: ShowcaseCategory; label: string }[] = [
  { id: 'all', label: 'All Systems' },
  { id: 'crm', label: 'Custom CRMs' },
  { id: 'products', label: 'Digital Products' },
  { id: 'tools', label: 'Internal Ops' },
];

/* ══════════════════════════════════════════════════════════════
   Interactive Stage Visual Previews
   ══════════════════════════════════════════════════════════════ */

function PreviewSortMarketing() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeBrand, setActiveBrand] = useState('Netflix');

  return (
    <div className="ps-preview-canvas ps-preview-sort">
      <div className="ps-mock-header">
        <div className="ps-mock-dots">
          <span />
          <span />
          <span />
        </div>
        <div className="ps-mock-title">sortmarketing.com // 4K REEL SUITE</div>
        <span className="ps-mock-badge">EDGE STREAMING</span>
      </div>

      <div className="ps-sort-player-box">
        <div className="ps-sort-film-frame">
          <div className="ps-sort-grid-overlay" />
          <div className="ps-sort-center-play">
            <button
              type="button"
              className="ps-play-toggle-btn"
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pause reel preview' : 'Play reel preview'}
            >
              <Video className="w-7 h-7 text-[#08b8f8]" />
            </button>
            <div className="ps-reel-meta">
              <strong>{activeBrand.toUpperCase()} // BRAND REEL</strong>
              <small>PRORES 422 · 60FPS · DCI 4K</small>
            </div>
          </div>

          <div className="ps-sort-hud-top">
            <span className="ps-hud-rec">
              <span className={`ps-rec-dot ${isPlaying ? 'is-blinking' : ''}`} />
              {isPlaying ? 'ACTIVE STREAM' : 'STANDBY'}
            </span>
            <span className="ps-hud-res">BITRATE: 48.2 MB/S</span>
          </div>

          <div className="ps-sort-hud-bottom">
            <span className="ps-timecode">TC 00:04:18:12</span>
            <div className="ps-sort-audio-bars">
              <i style={{ height: isPlaying ? '40%' : '15%' }} />
              <i style={{ height: isPlaying ? '85%' : '20%' }} />
              <i style={{ height: isPlaying ? '60%' : '15%' }} />
              <i style={{ height: isPlaying ? '100%' : '25%' }} />
              <i style={{ height: isPlaying ? '45%' : '15%' }} />
              <i style={{ height: isPlaying ? '75%' : '20%' }} />
              <i style={{ height: isPlaying ? '90%' : '20%' }} />
              <i style={{ height: isPlaying ? '50%' : '15%' }} />
            </div>
            <span className="ps-hud-audio">DOLBY ATMOS 7.1</span>
          </div>
        </div>

        <div className="ps-brand-selector-strip">
          <span className="ps-brand-strip-label">CLIENT REELS:</span>
          {['Netflix', 'Adobe', 'Samsung', 'Google', 'AKQA'].map((brand) => (
            <button
              key={brand}
              type="button"
              className={`ps-brand-pill ${activeBrand === brand ? 'is-selected' : ''}`}
              onClick={() => setActiveBrand(brand)}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PreviewHepki() {
  const [activeCategory, setActiveCategory] = useState<'Hospital' | 'Shopping' | 'Cinema'>('Hospital');

  return (
    <div className="ps-preview-canvas ps-preview-hepki">
      <div className="ps-mock-header">
        <div className="ps-mock-dots">
          <span />
          <span />
          <span />
        </div>
        <div className="ps-mock-title">hepki.in // DISPATCH RADAR</div>
        <span className="ps-mock-badge" style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
          LIVE MARKETPLACE
        </span>
      </div>

      <div className="ps-hepki-grid">
        <div className="ps-service-tabs-mini">
          {(['Hospital', 'Shopping', 'Cinema'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              className={`ps-mini-cat-btn ${activeCategory === cat ? 'is-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat} Companion
            </button>
          ))}
        </div>

        <div className="ps-hepki-card-main">
          <div className="ps-hepki-status-row">
            <span className="ps-hepki-dot" />
            <strong>Buddy Dispatched</strong>
            <small>Arriving in 12 Mins</small>
          </div>
          <div className="ps-hepki-buddy-row">
            <div className="ps-hepki-avatar">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="ps-buddy-info">
              <strong>Arun K. (Verified Buddy #482)</strong>
              <small>Specialist: {activeCategory} Support · 52 Completed · 4.9★</small>
            </div>
          </div>
          <div className="ps-hepki-safety-pill">
            <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
            <span>Govt ID Verified · Police Verification Cleared · 24/7 SOS Linked</span>
          </div>
        </div>

        <div className="ps-hepki-metrics-row">
          <div className="ps-hepki-sub-stat">
            <small>Active Categories</small>
            <strong>12 Services</strong>
          </div>
          <div className="ps-hepki-sub-stat">
            <small>Razorpay Escrow</small>
            <strong className="text-[#34d399]">100% Secured</strong>
          </div>
          <div className="ps-hepki-sub-stat">
            <small>Live Telemetry</small>
            <strong className="text-[#38bdf8]">Sub-60s Match</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewDetailingAdda() {
  const [selectedBay, setSelectedBay] = useState<1 | 2>(1);

  return (
    <div className="ps-preview-canvas ps-preview-detailing">
      <div className="ps-mock-header">
        <div className="ps-mock-dots">
          <span />
          <span />
          <span />
        </div>
        <div className="ps-mock-title">detailingadda.in // STUDIO OS</div>
        <span className="ps-mock-badge" style={{ color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.3)' }}>
          BAY CONTROL ACTIVE
        </span>
      </div>

      <div className="ps-detailing-content">
        <div className="ps-bays-row">
          <button
            type="button"
            className={`ps-bay-chip ${selectedBay === 1 ? 'is-active' : ''}`}
            onClick={() => setSelectedBay(1)}
          >
            <Car className="w-5 h-5 text-[#f87171]" />
            <div className="text-left">
              <strong>Bay 01: Porsche 911 GT3</strong>
              <small>Full Body TPU PPF · Stage 3 of 4</small>
            </div>
            <span className="ps-pill-tag">In Application</span>
          </button>

          <button
            type="button"
            className={`ps-bay-chip ${selectedBay === 2 ? 'is-active' : ''}`}
            onClick={() => setSelectedBay(2)}
          >
            <Car className="w-5 h-5 text-[#38bdf8]" />
            <div className="text-left">
              <strong>Bay 02: BMW M3 Competition</strong>
              <small>9H Graphene Ceramic Coating · Curing</small>
            </div>
            <span className="ps-pill-tag">IR Heat Curing</span>
          </button>
        </div>

        {/* Selected Bay Inspection Checklist */}
        <div className="ps-job-timeline-card">
          <div className="ps-job-header">
            <span className="ps-job-title">
              {selectedBay === 1 ? 'BAY 01 WORKFLOW: PPF REEL ALLOCATION' : 'BAY 02 WORKFLOW: 9H GRAPHENE'}
            </span>
            <span className="ps-job-status">TECH: VIKRAM S.</span>
          </div>
          <div className="ps-job-steps-bar">
            <div className="ps-step-marker is-complete">Prep & Decon ✓</div>
            <div className="ps-step-marker is-complete">Plotter Cut ✓</div>
            <div className="ps-step-marker is-active">Edge Tuck & Wrap</div>
            <div className="ps-step-marker">QC & Ledger</div>
          </div>
        </div>

        <div className="ps-detailing-stats">
          <div className="ps-detail-kpi">
            <small>Film Stock On-Bay</small>
            <strong>18 Rolls (8,420 sq.ft)</strong>
          </div>
          <div className="ps-detail-kpi">
            <small>Automated GST Invoicing</small>
            <strong className="text-[#34d399]">100% Tax Compliant</strong>
          </div>
          <div className="ps-detail-kpi">
            <small>Studio Bay Velocity</small>
            <strong className="text-[#f87171]">94% Capacity</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewBoombastic() {
  const [activeStage, setActiveStage] = useState<'all' | 'qualified' | 'closing'>('all');

  return (
    <div className="ps-preview-canvas ps-preview-boombastic">
      <div className="ps-mock-header">
        <div className="ps-mock-dots">
          <span />
          <span />
          <span />
        </div>
        <div className="ps-mock-title">boombastic.crm // PIPELINE RADAR</div>
        <span className="ps-mock-badge" style={{ color: '#34d399', borderColor: 'rgba(52, 211, 153, 0.3)' }}>
          $1.42M ARR SYNCED
        </span>
      </div>

      <div className="ps-pipeline-grid">
        <div className="ps-pipe-col">
          <span className="ps-pipe-head">QUALIFIED LEADS (18)</span>
          <div className="ps-pipe-card">
            <strong>Apex Logistics Group</strong>
            <small>$45,000 / yr · Contract Sent</small>
          </div>
          <div className="ps-pipe-card">
            <strong>Kinetix Media Studio</strong>
            <small>$28,000 / yr · Demo Scheduled</small>
          </div>
        </div>

        <div className="ps-pipe-col">
          <span className="ps-pipe-head">PROPOSALS SENT (8)</span>
          <div className="ps-pipe-card is-active">
            <strong>Starlight Global Platform</strong>
            <small>$84,000 / yr · Decision Due Fri</small>
          </div>
          <div className="ps-pipe-card">
            <strong>HealthCare Partners</strong>
            <small>$62,000 / yr · Security Review</small>
          </div>
        </div>

        <div className="ps-pipe-col">
          <span className="ps-pipe-head">WON DEALS (4)</span>
          <div className="ps-pipe-card is-won">
            <strong>Global Fleet OS</strong>
            <small>$120,000 / yr · Live & Billing</small>
          </div>
          <div className="ps-pipe-card is-won">
            <strong>UrbanNest Retail</strong>
            <small>$95,000 / yr · Live & Billing</small>
          </div>
        </div>
      </div>

      <div className="ps-booking-week-row">
        <Calendar className="w-4 h-4 text-[#34d399]" />
        <span>Weekly Booking Matrix: <strong>26 demos confirmed</strong> across team this sprint</span>
      </div>
    </div>
  );
}

function PreviewWorkPulse() {
  return (
    <div className="ps-preview-canvas ps-preview-workpulse">
      <div className="ps-mock-header">
        <div className="ps-mock-dots">
          <span />
          <span />
          <span />
        </div>
        <div className="ps-mock-title">workpulse.in // AUDIT TELEMETRY</div>
        <span className="ps-mock-badge" style={{ color: '#c084fc', borderColor: 'rgba(192, 132, 252, 0.3)' }}>
          99.98% AUDIT UPTIME
        </span>
      </div>

      <div className="ps-audit-content">
        <div className="ps-audit-score-card">
          <div className="ps-score-ring">
            <Gauge className="w-10 h-10 text-[#c084fc]" />
          </div>
          <div className="ps-score-meta">
            <span className="ps-score-label">Compliance Health Index</span>
            <strong className="ps-score-val">99.4%</strong>
          </div>
          <div className="ps-score-status">
            <span className="ps-audit-badge">ZERO DEVIATIONS</span>
            <small>32/32 Workflows Verified</small>
          </div>
        </div>

        <div className="ps-audit-steps">
          <div className="ps-audit-step-row is-done">
            <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
            <span>ISO 27001 Data Encryption Telemetry</span>
            <small>Automated · Verified</small>
          </div>
          <div className="ps-audit-step-row is-done">
            <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
            <span>Multi-Department Access Ledger Audit</span>
            <small>Real-time Stream</small>
          </div>
          <div className="ps-audit-step-row is-done">
            <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
            <span>Regulatory Financial Controls Certification</span>
            <small>Auto-Signed</small>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Architecture Blueprint View (High-Tech System Diagram)
   ══════════════════════════════════════════════════════════════ */

function StageBlueprintView({ project }: { project: ClientProject }) {
  return (
    <div className="ps-blueprint-canvas">
      <div className="ps-mock-header">
        <div className="ps-mock-dots">
          <span />
          <span />
          <span />
        </div>
        <div className="ps-mock-title">SYSTEM ARCHITECTURE // {project.client.toUpperCase()}</div>
        <span className="ps-mock-badge">EDGE TYPE-SAFE</span>
      </div>

      <div className="ps-blueprint-diagram">
        {/* Tier 1: Client Gateway */}
        <div className="ps-blueprint-node">
          <div className="ps-node-icon">
            <Zap className="w-5 h-5 text-[#08b8f8]" />
          </div>
          <div className="ps-node-info">
            <small>01 // CLIENT TIER</small>
            <strong>{project.architecture.frontend}</strong>
            <span>Sub-15ms hydration, SSR & RSC caching</span>
          </div>
        </div>

        <div className="ps-blueprint-connector">
          <span className="ps-connector-line" />
          <span className="ps-connector-tag">TLS 1.3 / HTTP 3</span>
        </div>

        {/* Tier 2: Backend Logic & Bus */}
        <div className="ps-blueprint-node">
          <div className="ps-node-icon">
            <Server className="w-5 h-5 text-[#3b82f6]" />
          </div>
          <div className="ps-node-info">
            <small>02 // APPLICATION BACKBONE</small>
            <strong>{project.architecture.backend}</strong>
            <span>Event-driven webhooks & atomic transactions</span>
          </div>
        </div>

        <div className="ps-blueprint-connector">
          <span className="ps-connector-line" />
          <span className="ps-connector-tag">Type-Safe RPC</span>
        </div>

        {/* Tier 3: Storage & Persistence */}
        <div className="ps-blueprint-node">
          <div className="ps-node-icon">
            <Database className="w-5 h-5 text-[#10b981]" />
          </div>
          <div className="ps-node-info">
            <small>03 // PERSISTENCE & TELEMETRY</small>
            <strong>{project.architecture.database}</strong>
            <span>{project.architecture.throughput}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Production Metrics Deep Dive View
   ══════════════════════════════════════════════════════════════ */

function StageTelemetryView({ project }: { project: ClientProject }) {
  return (
    <div className="ps-telemetry-canvas">
      <div className="ps-mock-header">
        <div className="ps-mock-dots">
          <span />
          <span />
          <span />
        </div>
        <div className="ps-mock-title">MEASURABLE ROI // {project.client.toUpperCase()}</div>
        <span className="ps-mock-badge">VERIFIED TELEMETRY</span>
      </div>

      <div className="ps-roi-comparison-grid">
        <div className="ps-roi-box is-before">
          <div className="ps-roi-label">LEGACY SYSTEM FRICTION</div>
          <p>{project.impactComparison.before}</p>
        </div>

        <div className="ps-roi-box is-after">
          <div className="ps-roi-label">NOVERA PRODUCTION SYSTEM</div>
          <p>{project.impactComparison.after}</p>
        </div>
      </div>

      <div className="ps-metrics-detailed-row">
        {project.metrics.map((m, idx) => (
          <div key={idx} className="ps-metric-highlight-card">
            <span className="ps-metric-pill-label">{m.label}</span>
            <strong className="ps-metric-giant-val">{m.value}</strong>
            <small className="ps-metric-subdetail">{m.detail}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main PortfolioShowcase Component
   ══════════════════════════════════════════════════════════════ */

export function PortfolioShowcase() {
  const [activeCategory, setActiveCategory] = useState<ShowcaseCategory>('all');
  const [activeProject, setActiveProject] = useState<ClientProject>(CLIENT_PROJECTS[0]);
  const [stageMode, setStageMode] = useState<StageMode>('console');
  const reduceMotion = useReducedMotion();

  const filteredProjects =
    activeCategory === 'all'
      ? CLIENT_PROJECTS
      : CLIENT_PROJECTS.filter((p) => p.categoryTag === activeCategory);

  function handleSelectProject(project: ClientProject) {
    setActiveProject(project);
  }

  function handleNextProject() {
    const currentIndex = filteredProjects.findIndex((p) => p.id === activeProject.id);
    const nextIndex = (currentIndex + 1) % filteredProjects.length;
    setActiveProject(filteredProjects[nextIndex]);
  }

  function handlePrevProject() {
    const currentIndex = filteredProjects.findIndex((p) => p.id === activeProject.id);
    const prevIndex = (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
    setActiveProject(filteredProjects[prevIndex]);
  }

  function handleCardMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--card-mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--card-mouse-y', `${y}px`);
  }

  return (
    <section className="hl-portfolio-showcase" aria-labelledby="portfolio-showcase-title">
      {/* Background Ambient Glows */}
      <div className="ps-ambient-glow-1" aria-hidden="true" />
      <div className="ps-ambient-glow-2" aria-hidden="true" />

      {/* Section Header */}
      <div className="hl-section-head ps-head-wrap">
        <div>
          <p className="hl-kicker">Client Engineering</p>
          <h2 id="portfolio-showcase-title">
            Real platforms.
            <br />
            Measurable <em>outcomes.</em>
          </h2>
        </div>
        <p className="ps-head-copy">
          Explore actual production software we architected and deployed for high-growth businesses—spanning
          custom studio CRMs, on-demand marketplaces, and automated operations.
        </p>
      </div>

      {/* Filter Bar & Category Tabs */}
      <div className="ps-filter-bar-row">
        <div className="ps-filter-bar" role="tablist" aria-label="Portfolio category filter">
          {categoryTabs.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`ps-filter-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  setActiveCategory(tab.id);
                  const visible =
                    tab.id === 'all'
                      ? CLIENT_PROJECTS
                      : CLIENT_PROJECTS.filter((p) => p.categoryTag === tab.id);
                  if (visible.length > 0 && !visible.some((p) => p.id === activeProject.id)) {
                    setActiveProject(visible[0]);
                  }
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="activePortfolioPill"
                    className="ps-filter-pill-active"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="ps-filter-label">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Stepper Navigation for Desktop */}
        <div className="ps-stepper-nav" aria-label="Browse projects">
          <button
            type="button"
            className="ps-step-arrow-btn"
            onClick={handlePrevProject}
            aria-label="Previous project"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="ps-stepper-counter">
            0{filteredProjects.findIndex((p) => p.id === activeProject.id) + 1} / 0{filteredProjects.length}
          </span>
          <button
            type="button"
            className="ps-step-arrow-btn"
            onClick={handleNextProject}
            aria-label="Next project"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Split-Stage Interactive Workspace (Hero Studios & Agentura) */}
      <div className="ps-stage-workspace">
        {/* Left: Dynamic Live Stage Preview */}
        <div className="ps-stage-display-col">
          <div className="ps-sticky-monitor">
            <div className="ps-monitor-outer">
              {/* Chrome Top Bar */}
              <div className="ps-monitor-chrome">
                <div className="ps-chrome-meta">
                  <span className="ps-live-pulse-dot" />
                  <strong>NOVERA // TELEMETRY PREVIEW</strong>
                </div>

                {/* Interactive Stage Mode Switcher */}
                <div className="ps-mode-switcher" role="tablist" aria-label="Monitor view mode">
                  <button
                    type="button"
                    className={`ps-mode-btn ${stageMode === 'console' ? 'is-active' : ''}`}
                    onClick={() => setStageMode('console')}
                  >
                    Console
                  </button>
                  <button
                    type="button"
                    className={`ps-mode-btn ${stageMode === 'blueprint' ? 'is-active' : ''}`}
                    onClick={() => setStageMode('blueprint')}
                  >
                    Architecture
                  </button>
                  <button
                    type="button"
                    className={`ps-mode-btn ${stageMode === 'telemetry' ? 'is-active' : ''}`}
                    onClick={() => setStageMode('telemetry')}
                  >
                    Metrics
                  </button>
                </div>
              </div>

              {/* Dynamic Simulated Preview Component */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeProject.id}-${stageMode}`}
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, filter: 'blur(6px)' }}
                  transition={{ duration: 0.35, ease }}
                  className="ps-monitor-content-pane"
                >
                  {stageMode === 'console' && (
                    <>
                      {activeProject.previewKind === 'sort-marketing' && <PreviewSortMarketing />}
                      {activeProject.previewKind === 'hepki' && <PreviewHepki />}
                      {activeProject.previewKind === 'detailing-adda' && <PreviewDetailingAdda />}
                      {activeProject.previewKind === 'boombastic' && <PreviewBoombastic />}
                      {activeProject.previewKind === 'workpulse' && <PreviewWorkPulse />}
                    </>
                  )}
                  {stageMode === 'blueprint' && <StageBlueprintView project={activeProject} />}
                  {stageMode === 'telemetry' && <StageTelemetryView project={activeProject} />}
                </motion.div>
              </AnimatePresence>

              {/* Stage Footer Bar */}
              <div className="ps-monitor-bottom">
                <div className="ps-monitor-client-badge">
                  <small>Verified Client Platform</small>
                  <strong>{activeProject.client}</strong>
                </div>

                <a
                  href={activeProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ps-stage-launch-link"
                >
                  <span>Launch Live Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Project Selection Cards */}
        <div className="ps-stage-list-col">
          <div className="ps-project-cards-stack">
            {filteredProjects.map((project, index) => {
              const isSelected = project.id === activeProject.id;
              return (
                <motion.article
                  key={project.id}
                  className={`ps-project-row-card ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleSelectProject(project)}
                  onMouseEnter={() => handleSelectProject(project)}
                  onMouseMove={handleCardMouseMove}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: index * 0.05, ease }}
                >
                  {/* Spotlight Radial Background Glow */}
                  <div className="ps-card-spotlight" aria-hidden="true" />

                  {/* Card Header & Category Tag */}
                  <div className="ps-row-top">
                    <span className="ps-row-mono-tag">
                      0{index + 1} // {project.categoryLabel.toUpperCase()}
                    </span>
                    <div className="ps-row-metrics-group">
                      {project.metrics.map((m, mIdx) => (
                        <div key={mIdx} className="ps-row-metric-item">
                          <small>{m.label}</small>
                          <strong>{m.value}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="ps-row-body">
                    <h3>{project.title}</h3>
                    <p className="ps-row-tagline">{project.tagline}</p>
                    <p className="ps-row-desc">{project.body}</p>
                  </div>

                  {/* Architecture Deliverables */}
                  <ul className="ps-row-deliverables" aria-label="Key deliverables">
                    {project.deliverables.map((item, dIdx) => (
                      <li key={dIdx}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#08b8f8] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech Stack Pills & Direct Anchor */}
                  <div className="ps-row-footer">
                    <div className="ps-tech-pills">
                      {project.techStack.map((tech) => (
                        <span key={tech} className="ps-tech-pill">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ps-row-cta"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Visit live website of ${project.client}`}
                    >
                      <span>Visit Site</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
