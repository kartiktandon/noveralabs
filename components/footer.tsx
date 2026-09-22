'use client';

import React from 'react';
import Image from 'next/image';
import Link from '@/components/ui/link';
import { ChevronUp } from 'lucide-react';

export function Footer() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="footer-root">
      {/* Ambient background glow */}
      <div className="footer-ambient-glow" aria-hidden="true" />
      <div className="footer-grid-overlay" aria-hidden="true" />

      <div className="footer-container">

        {/* Main Columns Grid */}
        <div className="footer-columns-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <Link href="/" className="footer-brand-lockup group" aria-label="Novera Home">
              <Image
                className="footer-brand-symbol"
                src="/novera-mark.png"
                alt="Novera"
                width={1120}
                height={1405}
              />
              <span className="footer-brand-name">NOVERA</span>
            </Link>
            <p className="footer-brand-desc">
              High-output venture engineering studio. We build resilient digital products, custom platforms, and connected telemetry architectures.
            </p>
          </div>

          {/* Navigation Links Column */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links-list">
              <li>
                <Link href="/" className="footer-link">
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="footer-link">
                  <span>Portfolio</span>
                  <span className="footer-pill-badge">5 Live</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Capabilities Column */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Core Capabilities</h4>
            <ul className="footer-links-list">
              <li>
                <Link href="/contact" className="footer-link">
                  <span>Autonomous AI & Agents</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  <span>Custom Web Applications</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  <span>Enterprise CRM & ERP Systems</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  <span>Cloud & Telemetry Pipelines</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  <span>Design Systems & UI Engineering</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Platforms Column */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Client Platforms</h4>
            <ul className="footer-links-list">
              <li>
                <Link href="/portfolio" className="footer-link">
                  <span>Detailing Adda · 48+ Centers</span>
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="footer-link">
                  <span>Hepki · Fintech Intelligence</span>
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="footer-link">
                  <span>Boombastic · Omnichannel CRM</span>
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="footer-link">
                  <span>Sort Marketing · Growth Hub</span>
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="footer-link">
                  <span>WorkPulse.in · Ops Telemetry</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Back to Top Strip */}
        <div className="footer-bottom-strip">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Novera Labs Inc. All rights reserved. High-output digital systems.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="footer-back-to-top group"
            aria-label="Back to top of page"
          >
            <span>Back to top</span>
            <div className="footer-top-arrow-btn">
              <ChevronUp className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
