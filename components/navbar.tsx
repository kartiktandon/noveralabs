'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Systems', href: '/systems' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function BrandLogo() {
  return (
    <span className="brand-lockup" aria-label="Novera">
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
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 20);
  });

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <Link className="logo-link" href="/" aria-label="Novera home">
          <BrandLogo />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? 'active-nav-link' : ''}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link className="header-cta" href="/contact">
          Start a project <ArrowUpRight />
        </Link>
        <button
          className="menu-button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu />
        </button>
      </header>

      {menuOpen && (
        <motion.div
          className="mobile-menu"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <div className="mobile-menu-top">
            <BrandLogo />
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X />
            </button>
          </div>
          <nav>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
                <ArrowUpRight />
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </>
  );
}

