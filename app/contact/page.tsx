'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ContactSection } from '@/components/contact-section';

export default function ContactPage() {
  return (
    <div className="page-main pp-page-root" style={{ background: '#07090d', minHeight: '100vh' }}>
      <Navbar />
      <ContactSection isStandalonePage={true} />
      <Footer />
    </div>
  );
}
