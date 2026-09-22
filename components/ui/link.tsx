'use client';

import React, { forwardRef } from 'react';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean;
  children?: React.ReactNode;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, replace = false, scroll = true, prefetch, onClick, children, ...rest },
  ref
) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (onClick) {
      onClick(e);
    }

    // Allow user to open in new tab with Cmd / Ctrl / Shift / Alt / middle click
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.altKey ||
      e.shiftKey ||
      rest.target === '_blank'
    ) {
      return;
    }

    // Hash links on same page
    if (href.startsWith('#')) {
      return;
    }

    // External URLs
    if (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')
    ) {
      return;
    }

    // For internal navigation between routes
    if (typeof window !== 'undefined') {
      const targetUrl = new URL(href, window.location.origin);
      if (targetUrl.pathname === window.location.pathname && !targetUrl.hash) {
        e.preventDefault();
        if (scroll) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      // Safe, immediate navigation without buggy RSC prefetch crashes
      e.preventDefault();
      if (replace) {
        window.location.replace(href);
      } else {
        window.location.assign(href);
      }
    }
  }

  return (
    <a ref={ref} href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
});

export default Link;

