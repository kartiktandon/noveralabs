import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/', destination: '/index.html' },
      { source: '/admin', destination: '/admin/index.html' },
      { source: '/services', destination: '/services.html' },
      { source: '/work', destination: '/work.html' },
      { source: '/how-we-work', destination: '/how-we-work.html' },
      { source: '/contact', destination: '/contact.html' },
      { source: '/website', destination: '/service-websites.html' },
      { source: '/websites', destination: '/service-websites.html' },
      { source: '/web-app', destination: '/service-web-apps.html' },
      { source: '/web-apps', destination: '/service-web-apps.html' },
      { source: '/webapps', destination: '/service-web-apps.html' },
      { source: '/mobile-app', destination: '/service-mobile-apps.html' },
      { source: '/mobile-apps', destination: '/service-mobile-apps.html' },
      { source: '/apps', destination: '/service-mobile-apps.html' },
      { source: '/crm', destination: '/service-crms.html' },
      { source: '/crms', destination: '/service-crms.html' },
      { source: '/ecommerce', destination: '/service-ecommerce.html' },
      { source: '/e-commerce', destination: '/service-ecommerce.html' },
      { source: '/ai', destination: '/service-ai-automation.html' },
      { source: '/automation', destination: '/service-ai-automation.html' },
      { source: '/ai-automation', destination: '/service-ai-automation.html' },
      { source: '/service-:slug', destination: '/service-:slug.html' },
      { source: '/case-study-:slug', destination: '/case-study-:slug.html' },
    ];
  },
};

export default nextConfig;
