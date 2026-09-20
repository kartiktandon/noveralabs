'use client';

import { useState, type SyntheticEvent } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Clock, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Component as LumaSpin } from '@/components/ui/luma-spin';

const ease = [0.16, 1, 0.3, 1] as const;

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 1400);
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
            <span /> Start a project
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
          >
            Let&apos;s build <em>what comes next.</em>
          </motion.h1>
          <motion.p
            className="lead"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease }}
          >
            Tell us what should feel clearer, move faster, or work better.
            We respond to every qualified inquiry within 24 hours.
          </motion.p>
        </div>
      </section>

      <section className="page-section" style={{ paddingTop: '20px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(300px, 0.8fr)',
            gap: '64px',
            alignItems: 'start',
          }}
        >
          {/* Intake Form */}
          <div
            className="contact-panel"
            style={{
              background: 'var(--card-bg, #ffffff)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              padding: 'clamp(28px, 4vw, 48px)',
              boxShadow: '0 20px 50px rgba(3, 27, 74, 0.05)',
            }}
          >
            {submitting ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease }}
                style={{
                  minHeight: '380px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  gap: '20px',
                }}
              >
                <div className="dark">
                  <LumaSpin />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-sora)', fontSize: '24px', margin: '0 0 8px' }}>
                    Transmitting requirements
                  </h3>
                  <p style={{ color: 'var(--muted-foreground)', fontSize: '14px', margin: 0 }}>
                    Encrypting project brief and routing to engineering leadership.
                  </p>
                </div>
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
                <h3 style={{ color: 'var(--navy)' }}>Message captured.</h3>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  Thank you for reaching out. A partner from our technical team will review your specifications and contact you within 24 hours.
                </p>
                <button
                  type="button"
                  className="button-primary"
                  onClick={() => {
                    setSent(false);
                    setSubmitting(false);
                  }}
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label>
                  <span>Your Name</span>
                  <input
                    required
                    placeholder="Jane Doe"
                    style={{ color: 'var(--navy)', borderBottomColor: 'var(--border)' }}
                  />
                </label>
                <label>
                  <span>Work Email</span>
                  <input
                    required
                    type="email"
                    placeholder="jane@company.com"
                    style={{ color: 'var(--navy)', borderBottomColor: 'var(--border)' }}
                  />
                </label>
                <label className="full">
                  <span>Organization & Website</span>
                  <input
                    placeholder="Acme Corp · acme.com"
                    style={{ color: 'var(--navy)', borderBottomColor: 'var(--border)' }}
                  />
                </label>
                <label className="full">
                  <span>What should we build?</span>
                  <textarea
                    required
                    placeholder="A digital product, a custom CRM, an autonomous AI pipeline, or high-performance telemetry..."
                    style={{ color: 'var(--navy)', borderBottomColor: 'var(--border)' }}
                  />
                </label>
                <div className="form-footer full" style={{ marginTop: '16px' }}>
                  <p style={{ color: 'var(--muted-foreground)' }}>
                    A rough idea is enough to begin.
                  </p>
                  <button type="submit" className="button-primary">
                    Start the conversation <ArrowUpRight />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            <div
              style={{
                padding: '36px',
                borderRadius: '20px',
                background: 'var(--paper)',
                border: '1px solid var(--border)',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-sora)', fontSize: '20px', marginBottom: '16px' }}>
                Direct Channels
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <Mail style={{ width: '20px', height: '20px', color: 'var(--blue)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', marginBottom: '2px' }}>
                      Inquiries & Briefs
                    </strong>
                    <span style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>
                      hello@noveralabs.com
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <Clock style={{ width: '20px', height: '20px', color: 'var(--blue)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', marginBottom: '2px' }}>
                      Response Window
                    </strong>
                    <span style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>
                      Under 24 hours on business days
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <ShieldCheck style={{ width: '20px', height: '20px', color: 'var(--blue)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', marginBottom: '2px' }}>
                      IP & NDA Protection
                    </strong>
                    <span style={{ color: 'var(--muted-foreground)', fontSize: '14px' }}>
                      Standard mutual NDAs provided upon request
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '36px',
                borderRadius: '20px',
                background: 'var(--navy)',
                color: '#ffffff',
              }}
            >
              <h4 style={{ fontFamily: 'var(--font-sora)', fontSize: '18px', marginBottom: '12px' }}>
                Immediate Discovery Calls
              </h4>
              <p style={{ color: '#aebbd3', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                Have an urgent launch deadline or an institutional mandate? Schedule a direct 30-minute technical evaluation with a principal engineer.
              </p>
              <a
                href="mailto:hello@noveralabs.com?subject=Technical%20Evaluation%20Request"
                className="button-primary"
                style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
              >
                Request priority call <ArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
