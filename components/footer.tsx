'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function Footer() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Link href="/" className="footer-logo-link">
          <Image
            src="/novera-mark.png"
            alt="Novera"
            width={1120}
            height={1405}
          />
          <span>NOVERA</span>
        </Link>
        <p className="footer-tagline">
          Next-generation digital products, custom platforms, and connected systems.
        </p>
      </div>

      <div className="footer-status-pill">
        <span className="status-dot-pulse" />
        <span>All Systems Operational · Sub-15ms Latency</span>
      </div>

      <div className="footer-actions">
        <button
          type="button"
          onClick={scrollToTop}
          className="back-to-top"
          aria-label="Back to top"
        >
          Back to top <ArrowUpRight />
        </button>
      </div>
    </footer>
  );
}

