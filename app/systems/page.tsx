'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from '@/components/ui/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Database,
  Gauge,
  Lock,
  Network,
  Radio,
  Server,
  Sparkles,
  Workflow,
  Zap,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Component as LumaSpin } from '@/components/ui/luma-spin';

const ease = [0.16, 1, 0.3, 1] as const;

const dashboardViews = [
  {
    tag: 'Operational telemetry',
    title: 'Executive telemetry console',
    metrics: [
      { label: 'Active pipelines', value: '24', num: 24, prefix: '', suffix: '', decimals: 0, sub: 'All operational' },
      { label: 'Median latency', value: '14.2ms', num: 14.2, prefix: '', suffix: 'ms', decimals: 1, sub: 'Sub-15ms SLA target' },
      { label: 'Automation rate', value: '94.8%', num: 94.8, prefix: '', suffix: '%', decimals: 1, sub: '+8.4% this quarter', accent: true },
    ],
    chartTitle: 'Telemetry throughput (req/sec)',
    chartSub: 'Real-time platform load',
    bars: [28, 42, 58, 48, 65, 78, 92, 84],
    actionsTitle: 'Automated signals',
    actions: [
      'Webhook: Payment event verified (3ms)',
      'Queue: 142 batch events ingested',
      'Telemetry: Ingress stable across all regions',
    ],
  },
  {
    tag: 'Pipeline CRM',
    title: 'Revenue velocity engine',
    metrics: [
      { label: 'Active deals', value: '184', num: 184, prefix: '', suffix: '', decimals: 0, sub: 'Qualified opportunities' },
      { label: 'Win rate', value: '41.6%', num: 41.6, prefix: '', suffix: '%', decimals: 1, sub: '+6.2% vs industry avg' },
      { label: 'Pipeline value', value: '$8.4M', num: 8.4, prefix: '$', suffix: 'M', decimals: 1, sub: 'Contracted ARR', accent: true },
    ],
    chartTitle: 'Deal velocity across stages',
    chartSub: 'Average days to close',
    bars: [70, 60, 52, 45, 38, 32, 26, 21],
    actionsTitle: 'Actionable pipeline items',
    actions: [
      'Automated followup sent to Enterprise tier lead',
      'Contract redline flagged for legal review',
      'Renewal scheduled for Q4 accounts',
    ],
  },
  {
    tag: 'Workflow automation',
    title: 'Deterministic execution engine',
    metrics: [
      { label: 'Executed tasks', value: '142k', num: 142, prefix: '', suffix: 'k', decimals: 0, sub: 'Zero manual handoffs' },
      { label: 'Error rate', value: '0.002%', num: 0.002, prefix: '', suffix: '%', decimals: 3, sub: 'Deterministic guarantees' },
      { label: 'Avg duration', value: '180ms', num: 180, prefix: '', suffix: 'ms', decimals: 0, sub: 'Edge-executed', accent: true },
    ],
    chartTitle: 'Workflow execution frequency',
    chartSub: 'Hourly scheduled task volume',
    bars: [30, 45, 60, 55, 70, 85, 95, 90],
    actionsTitle: 'Engine logs',
    actions: [
      'Payroll ledger reconciliation complete',
      'Customer onboarding sequence triggered',
      'Data warehouse snapshot exported',
    ],
  },
  {
    tag: 'Autonomous AI swarms',
    title: 'Multi-agent orchestration',
    metrics: [
      { label: 'Agent instances', value: '18', num: 18, prefix: '', suffix: '', decimals: 0, sub: 'Coordinated execution' },
      { label: 'Accuracy score', value: '99.4%', num: 99.4, prefix: '', suffix: '%', decimals: 1, sub: 'Human-verified benchmark' },
      { label: 'Weekly savings', value: '460 hrs', num: 460, prefix: '', suffix: ' hrs', decimals: 0, sub: 'Compounding impact', accent: true },
    ],
    chartTitle: 'Autonomous task execution',
    chartSub: 'Agent output trend',
    bars: [38, 50, 62, 70, 84, 89, 94, 100],
    actionsTitle: 'Agent activity log',
    actions: [
      'Agent Alpha: Triaged 42 support tickets',
      'Agent Beta: Generated financial summary memo',
      'Agent Gamma: Verified system contracts',
    ],
  },
];

export default function SystemsPage() {
  const [dashboardTab, setDashboardTab] = useState(0);
  const [syncingTelemetry, setSyncingTelemetry] = useState(false);

  function handleTabChange(index: number) {
    if (index === dashboardTab) return;
    setSyncingTelemetry(true);
    setDashboardTab(index);
    setTimeout(() => {
      setSyncingTelemetry(false);
    }, 650);
  }

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
            <span /> Platform architecture
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
          >
            From scattered signals to <em>one clear system.</em>
          </motion.h1>
          <motion.p
            className="lead"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease }}
          >
            A useful system does more than store information. It unifies operations,
            automates deterministic handoffs, and gives leaders real-time visibility.
          </motion.p>
        </div>
      </section>

      <section className="systems" id="systems" style={{ paddingTop: '60px' }}>
        <div className="systems-grid" aria-hidden="true" />

        <div className="system-demo">
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
                    <strong>{m.value}</strong>
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
        </div>

        {/* Architecture Standards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginTop: '80px',
          }}
        >
          {[
            {
              icon: Zap,
              title: 'Sub-15ms edge routing',
              desc: 'Distributed edge runtimes ensure zero-lag interactivity worldwide.',
            },
            {
              icon: Lock,
              title: 'Institutional security',
              desc: 'Encrypted at rest and in transit. Ready for SOC2 and HIPAA compliance.',
            },
            {
              icon: Server,
              title: 'Full source ownership',
              desc: 'You own 100% of your codebase, intellectual property, and infrastructure.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                style={{
                  padding: '32px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: 'rgba(8, 184, 248, 0.1)',
                    color: 'var(--cyan)',
                    display: 'grid',
                    placeItems: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <Icon />
                </div>
                <h4 style={{ fontFamily: 'var(--font-sora)', fontSize: '18px', marginBottom: '8px' }}>
                  {item.title}
                </h4>
                <p style={{ color: '#aebbd3', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}

