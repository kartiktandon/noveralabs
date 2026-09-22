'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
];

export function BrandLogo() {
  return (
    <span className="brand-lockup group" aria-label="Novera">
      <Image
        className="brand-symbol"
        src="/novera-mark.png"
        alt=""
        width={1120}
        height={1405}
        priority
      />
      <span className="brand-wordmark">NOVERA</span>
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 20);
  });

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <Link className="logo-link" href="/" aria-label="Novera home">
          <BrandLogo />
        </Link>

        {/* Center Pill Island */}
        <nav
          className="desktop-nav"
          aria-label="Primary navigation"
          onMouseLeave={() => setHoveredTab(null)}
        >
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-pill-link ${isActive ? 'active-nav-link' : ''}`}
                onMouseEnter={() => setHoveredTab(item.href)}
              >
                {/* Framer Motion kinetic active indicator */}
                {isActive && (
                  <motion.span
                    layoutId="activeNavPill"
                    className="nav-active-pill-bg"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}

                {/* Subtle hover backdrop when not active */}
                {!isActive && hoveredTab === item.href && (
                  <motion.span
                    layoutId="hoverNavPill"
                    className="nav-hover-pill-bg"
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 35,
                    }}
                  />
                )}

                <span className="nav-pill-content">
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavDot"
                      className="nav-portfolio-indicator"
                      title={`Active: ${item.label}`}
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    >
                      <span className="nav-portfolio-dot" />
                    </motion.span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="header-actions">
          <Link className="header-cta group" href="/contact">
            <span>Start a project</span>
            <ArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <button
            className="menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mobile-menu-top">
              <BrandLogo />
              <button
                className="mobile-close-button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X />
              </button>
            </div>

            <nav className="mobile-menu-nav">
              {navItems.map((item, index) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 + 0.08, duration: 0.25 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                    >
                      <span className="flex items-center gap-3">
                        {item.label}
                        {isActive && (
                          <span className="nav-portfolio-indicator" title="Current screen">
                            <span className="nav-portfolio-dot" />
                          </span>
                        )}
                      </span>
                      <ArrowUpRight className="mobile-nav-arrow" />
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div
              className="mobile-menu-footer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.25 }}
            >
              <Link
                className="mobile-cta-button"
                href="/contact"
                onClick={() => setMenuOpen(false)}
              >
                <span>Start a project</span>
                <ArrowUpRight />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
