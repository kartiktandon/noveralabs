'use client';

import React, { useState, type SyntheticEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Mail,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Component as LumaSpin } from '@/components/ui/luma-spin';

const ease = [0.16, 1, 0.3, 1] as const;

const SERVICE_CHIPS = [
  'AI & Autonomous Agents',
  'Custom Web Application',
  'Enterprise CRM / Platform',
  'Design System & UX',
  'Cloud & Telemetry',
];

export function ContactSection({ isStandalonePage = false }: { isStandalonePage?: boolean }) {
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Custom Web Application',
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  function toggleService(service: string) {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  }

  function handleCopyEmail() {
    navigator.clipboard.writeText('hello@noveralabs.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 1400);
  }

  return (
    <section className={`cs-root ${isStandalonePage ? 'cs-standalone' : ''}`} id="contact">
      {/* Ambient background mesh and orbital radar */}
      <div className="cs-ambient-glow" aria-hidden="true" />
      <div className="cs-grid-backdrop" aria-hidden="true" />

      {/* Futuristic Gyroscope Orbit Graphic */}
      <div className="cs-orbit-wrapper" aria-hidden="true">
        <div className="cs-orbit-ring cs-orbit-ring-outer">
          <span className="cs-orbit-node cs-orbit-node-1" />
        </div>
        <div className="cs-orbit-ring cs-orbit-ring-mid">
          <span className="cs-orbit-node cs-orbit-node-2" />
        </div>
        <div className="cs-orbit-ring cs-orbit-ring-inner">
          <span className="cs-orbit-node cs-orbit-node-3" />
        </div>
      </div>

      <div className="cs-container">
        {/* Left Column: Vision & Trust Telemetry */}
        <div className="cs-info-column">
          <h2 className="cs-heading">
            Build smarter systems.
            <br />
            <span className="cs-heading-gradient">Create what comes next.</span>
          </h2>

          <p className="cs-lead">
            Whether you need an autonomous AI pipeline, a bespoke high-throughput
            CRM, or a flagship consumer product — we engineer scalable platforms
            that drive real business outcomes.
          </p>

          {/* Quick Value Pillars */}
          <div className="cs-pillars-grid">
            <div className="cs-pillar-item">
              <div className="cs-pillar-icon">
                <Clock />
              </div>
              <div>
                <strong>&lt; 24h Response SLA</strong>
                <p>Direct review by technical leadership</p>
              </div>
            </div>

            <div className="cs-pillar-item">
              <div className="cs-pillar-icon">
                <ShieldCheck />
              </div>
              <div>
                <strong>Enterprise Mutual NDA</strong>
                <p>Full IP protection from day one</p>
              </div>
            </div>

            <div className="cs-pillar-item">
              <div className="cs-pillar-icon">
                <Zap />
              </div>
              <div>
                <strong>Rapid Sprint Velocity</strong>
                <p>From scoping to working build in weeks</p>
              </div>
            </div>
          </div>

          {/* Direct Channels Card */}
          <div className="cs-direct-card">
            <div className="cs-direct-header">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#08b8f8]" />
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Direct Channel
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="cs-copy-btn"
                title="Copy email to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <a
              href="mailto:hello@noveralabs.com"
              className="cs-direct-email"
            >
              hello@noveralabs.com
            </a>
            <p className="text-xs text-slate-400 mt-1">
              Prefer a direct executive call? Mention it in your message for calendar routing.
            </p>
          </div>
        </div>

        {/* Right Column: High-Conversion Interactive Form Panel */}
        <div className="cs-form-column">
          <div className="cs-form-glass-card">
            <AnimatePresence mode="wait">
              {submitting ? (
                <motion.div
                  key="submitting"
                  className="cs-form-state-panel"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <div className="cs-spin-container">
                    <LumaSpin />
                  </div>
                  <h3 className="cs-state-title">Encrypting & Routing Brief</h3>
                  <p className="cs-state-subtitle">
                    Transmitting project requirements to engineering leadership via secure telemetry.
                  </p>
                </motion.div>
              ) : sent ? (
                <motion.div
                  key="sent"
                  className="cs-form-state-panel"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <div className="cs-success-icon-badge">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="cs-state-title">Brief Received</h3>
                  <p className="cs-state-subtitle">
                    Thank you, {formData.name || 'Partner'}. Your inquiry has been routed to our technical team. We will review your scope and follow up within 24 hours.
                  </p>

                  <div className="cs-receipt-card">
                    <div className="cs-receipt-row">
                      <span>Services:</span>
                      <strong className="text-cyan-400">
                        {selectedServices.length > 0 ? selectedServices.join(', ') : 'Custom Scope'}
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="cs-reset-btn"
                    onClick={() => {
                      setSent(false);
                      setSubmitting(false);
                      setFormData({ name: '', email: '', company: '', message: '' });
                    }}
                  >
                    Send another brief
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="cs-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Category / Scope Pill Selectors */}
                  <div className="cs-chips-section">
                    <span className="cs-field-label">
                      What are you looking to build?
                    </span>
                    <div className="cs-chips-container">
                      {SERVICE_CHIPS.map((service) => {
                        const isSelected = selectedServices.includes(service);
                        return (
                          <button
                            key={service}
                            type="button"
                            onClick={() => toggleService(service)}
                            className={`cs-chip ${isSelected ? 'cs-chip-active' : ''}`}
                          >
                            {isSelected && <Sparkles className="w-3 h-3 text-[#08b8f8]" />}
                            <span>{service}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>


                  {/* Text Input Grid */}
                  <div className="cs-inputs-grid">
                    <label className="cs-input-label">
                      <span>Your Name *</span>
                      <input
                        type="text"
                        required
                        placeholder="Alex Morgan"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="cs-input"
                      />
                    </label>

                    <label className="cs-input-label">
                      <span>Work Email *</span>
                      <input
                        type="email"
                        required
                        placeholder="alex@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="cs-input"
                      />
                    </label>

                    <label className="cs-input-label cs-full-col">
                      <span>Company / Organization (Optional)</span>
                      <input
                        type="text"
                        placeholder="Company name or URL"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="cs-input"
                      />
                    </label>

                    <label className="cs-input-label cs-full-col">
                      <span>Project Details & Objectives *</span>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us about the product or challenge, your timeline goals, or systems to connect..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="cs-textarea"
                      />
                    </label>
                  </div>

                  {/* Form Action Footer */}
                  <div className="cs-form-footer" style={{ justifyContent: 'flex-end' }}>
                    <button type="submit" className="cs-submit-btn group">
                      <span>Submit brief</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

