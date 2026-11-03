import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/', destination: '/index.html' },
      { source: '/services', destination: '/services.html' },
      { source: '/work', destination: '/work.html' },
      { source: '/how-we-work', destination: '/how-we-work.html' },
      { source: '/contact', destination: '/contact.html' },
      { source: '/service-:slug', destination: '/service-:slug.html' },
      { source: '/case-study-:slug', destination: '/case-study-:slug.html' },
    ];
  },
};

export default nextConfig;
