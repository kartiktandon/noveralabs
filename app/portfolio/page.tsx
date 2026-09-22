'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';
import {
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  X,
  Eye,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  CLIENT_PROJECTS,
  type ClientProject,
  type ShowcaseCategory,
} from '@/components/ui/portfolio-showcase';

const ease = [0.16, 1, 0.3, 1] as const;

/* ══════════════════════════════════════════════════════════════
   21st.dev Tilt Spotlight Card
   ══════════════════════════════════════════════════════════════ */
function TiltSpotlightCard({
  children,
  className = '',
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  }

  return (
    <div
      ref={cardRef}
      className={`pp-tilt-spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      <div className="pp-card-spotlight-glare" aria-hidden="true" />
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Interactive System Drawer Modal
   ══════════════════════════════════════════════════════════════ */
function SystemBlueprintDrawer({
  project,
  onClose,
}: {
  project: ClientProject | null;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="pp-drawer-backdrop" onClick={onClose}>
        <motion.div
          className="pp-drawer-pane"
          onClick={(e) => e.stopPropagation()}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: '100%' }}
          transition={{ duration: 0.45, ease }}
        >
          {/* Drawer Header */}
          <div className="pp-drawer-header">
            <div className="pp-drawer-meta">
              <span className="pp-drawer-chip">{project.categoryLabel.toUpperCase()}</span>
              <h2>{project.title}</h2>
              <small>Client: {project.client}</small>
            </div>
            <button
              type="button"
              className="pp-drawer-close-btn"
              onClick={onClose}
              aria-label="Close system drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content Body */}
          <div className="pp-drawer-body">
            {/* Direct Launch Banner */}
            <div className="pp-drawer-launch-banner">
              <div>
                <strong>Live Production Deployment</strong>
                <p>Verified deployed system online and active.</p>
              </div>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pp-drawer-launch-btn"
              >
                <span>Launch Live Site</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Core Metrics */}
            <div className="pp-drawer-section">
              <h3>Measurable Impact Telemetry</h3>
              <div className="pp-drawer-metrics-grid">
                {project.metrics.map((m, i) => (
                  <div key={i} className="pp-drawer-metric-card">
                    <small>{m.label}</small>
                    <strong>{m.value}</strong>
                    <span>{m.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Stack */}
            <div className="pp-drawer-section">
              <h3>System Architecture Blueprint</h3>
              <div className="pp-drawer-arch-box">
                <div className="pp-arch-row">
                  <span className="pp-arch-label">Frontend Tier:</span>
                  <strong className="pp-arch-val">{project.architecture.frontend}</strong>
                </div>
                <div className="pp-arch-row">
                  <span className="pp-arch-label">Backend Backbone:</span>
                  <strong className="pp-arch-val">{project.architecture.backend}</strong>
                </div>
                <div className="pp-arch-row">
                  <span className="pp-arch-label">Database & Queue:</span>
                  <strong className="pp-arch-val">{project.architecture.database}</strong>
                </div>
                <div className="pp-arch-row">
                  <span className="pp-arch-label">Infrastructure:</span>
                  <strong className="pp-arch-val">{project.architecture.infrastructure}</strong>
                </div>
                <div className="pp-arch-row">
                  <span className="pp-arch-label">Throughput / Scale:</span>
                  <strong className="pp-arch-val text-[#08b8f8]">{project.architecture.throughput}</strong>
                </div>
              </div>
            </div>

            {/* Engineering Deliverables */}
            <div className="pp-drawer-section">
              <h3>Key Engineering Deliverables</h3>
              <ul className="pp-drawer-deliverables-list">
                {project.deliverables.map((item, idx) => (
                  <li key={idx}>
                    <CheckCircle2 className="w-4 h-4 text-[#08b8f8] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legacy vs Novera Impact */}
            <div className="pp-drawer-section">
              <h3>Transformation Impact</h3>
              <div className="pp-drawer-impact-split">
                <div className="pp-impact-card is-legacy">
                  <span className="pp-impact-tag">BEFORE NOVERA</span>
                  <p>{project.impactComparison.before}</p>
                </div>
                <div className="pp-impact-card is-novera">
                  <span className="pp-impact-tag">AFTER NOVERA</span>
                  <p>{project.impactComparison.after}</p>
                </div>
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="pp-drawer-section">
              <h3>Technologies Used</h3>
              <div className="pp-drawer-tech-wrap">
                {project.techStack.map((tech) => (
                  <span key={tech} className="pp-drawer-tech-pill">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════════
   21st.dev Infinite Tech Stack River Marquee
   ══════════════════════════════════════════════════════════════ */
const riverTech = [
  'Next.js 14 App Router',
  'Real-Time WebSockets',
  'PostgreSQL & Prisma',
  'Framer Motion Physics',
  'Turbopack Engine',
  'Razorpay Escrow APIs',
  'Edge Function Routing',
  'DCI 4K Video Streaming',
  'Sub-15ms Real-Time Telemetry',
  'Zero Legacy Tech Debt',
];

function TechStackRiver() {
  const allItems = [...riverTech, ...riverTech];

  return (
    <div className="pp-tech-river" aria-hidden="true">
      <div className="pp-marquee-track">
        {allItems.map((item, idx) => (
          <div className="pp-marquee-pill" key={`${item}-${idx}`}>
            <span className="pp-marquee-dot" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main Portfolio Page Component
   ══════════════════════════════════════════════════════════════ */
export default function PortfolioPage() {
  const [selectedDrawerProject, setSelectedDrawerProject] = useState<ClientProject | null>(null);
  const [activeCategory, setActiveCategory] = useState<ShowcaseCategory>('all');
  const reduceMotion = useReducedMotion();

  const filteredProjects =
    activeCategory === 'all'
      ? CLIENT_PROJECTS
      : CLIENT_PROJECTS.filter((p) => p.categoryTag === activeCategory);

  return (
    <div className="page-main pp-page-root">
      <Navbar />

      {/* Hero Section with 21st.dev Blur-In Kinetic Reveal */}
      <section className="pp-hero-section">
        <div className="pp-hero-ambient-glow" aria-hidden="true" />

        <div className="pp-hero-container">
          {/* Eyebrow Status Pill */}
          <motion.div
            className="pp-live-status-pill"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="pp-live-dot" />
            <span>5 PRODUCTION PLATFORMS DEPLOYED · 100% CLIENT CODE OWNERSHIP</span>
          </motion.div>

          {/* Kinetic Display Headline */}
          <motion.h1
            className="pp-hero-title"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.85, delay: 0.08, ease }}
          >
            Systems built for scale.
            <br />
            Engineered for <span className="pp-hero-highlight">measurable impact.</span>
          </motion.h1>

          {/* Subtext Lead */}
          <motion.p
            className="pp-hero-lead"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.85, delay: 0.16, ease }}
          >
            Explore actual production software we architected and shipped for high-output companies—from
            custom studio CRMs and consumer marketplaces to real-time compliance orchestration.
          </motion.p>
        </div>
      </section>

      {/* Tech Stack River Marquee */}
      <TechStackRiver />

      {/* Showcase View Controls & Category Bar */}
      <section className="pp-showcase-section">
        <div className="container">
          {/* Category Filter Bar */}
          <div className="pp-view-controls-bar">
            <div className="pp-category-filter-pills">
              {(['all', 'crm', 'products', 'tools'] as ShowcaseCategory[]).map((cat) => {
                const labelMap = {
                  all: 'All Systems (5)',
                  crm: 'Custom CRMs (2)',
                  products: 'Digital Products (2)',
                  tools: 'Internal Ops (1)',
                };
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    className={`pp-cat-pill ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activePortfolioPillPage"
                        className="pp-cat-pill-active"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                    <span className="pp-cat-pill-text">{labelMap[cat]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cinematic 3D Tilt Grid View */}
          <div className="pp-cinematic-grid">
              {filteredProjects.map((project, index) => (
                <TiltSpotlightCard
                  key={project.id}
                  className="pp-grid-card"
                  onClick={() => setSelectedDrawerProject(project)}
                >
                  <div className="pp-grid-card-inner">
                    {/* Card Header */}
                    <div className="pp-grid-card-top">
                      <span className="pp-grid-category-badge">
                        0{index + 1} // {project.categoryLabel.toUpperCase()}
                      </span>
                      <div className="pp-grid-card-metrics">
                        {project.metrics.map((m, mIdx) => (
                          <div key={mIdx} className="pp-grid-metric-tag">
                            <small>{m.label}</small>
                            <strong>{m.value}</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Card Title & Content */}
                    <div className="pp-grid-card-body">
                      <h3>{project.title}</h3>
                      <p className="pp-grid-tagline">{project.tagline}</p>
                      <p className="pp-grid-desc">{project.body}</p>
                    </div>

                    {/* Deliverables Checklist */}
                    <ul className="pp-grid-deliverables">
                      {project.deliverables.slice(0, 3).map((item, dIdx) => (
                        <li key={dIdx}>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#08b8f8] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Tech Stack & Inspect Action */}
                    <div className="pp-grid-card-footer">
                      <div className="pp-grid-tech-tags">
                        {project.techStack.slice(0, 4).map((tech) => (
                          <span key={tech} className="pp-grid-tech-tag">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="pp-grid-actions-group">
                        <button
                          type="button"
                          className="pp-inspect-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDrawerProject(project);
                          }}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pp-live-btn"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Visit live site of ${project.client}`}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </TiltSpotlightCard>
              ))}
            </div>

          {/* Interactive Slide-Over Drawer */}
          <SystemBlueprintDrawer
            project={selectedDrawerProject}
            onClose={() => setSelectedDrawerProject(null)}
          />

          {/* High-Impact Partnership CTA Banner */}
          <div className="pp-partnership-cta">
            <div className="pp-cta-ambient-glow" aria-hidden="true" />
            <div className="pp-cta-content">
              <span className="pp-cta-badge">DIRECT ARCHITECT ENGAGEMENT</span>
              <h2>
                Have an ambitious system
                <br />
                you need engineered <em>right?</em>
              </h2>
              <p>
                Whether you need a high-velocity custom CRM, an on-demand booking marketplace, or an
                automated internal operations engine—we build software that compounds in enterprise value.
              </p>
              <div className="pp-cta-actions">
                <Link href="/contact" className="pp-cta-primary-btn">
                  <span>Start your project blueprint</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link href="/services" className="pp-cta-secondary-btn">
                  Explore Capabilities
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
