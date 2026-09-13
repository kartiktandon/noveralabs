'use client';

import Image from 'next/image';
import { type ReactNode, type SyntheticEvent, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  Code2,
  Database,
  Gauge,
  Menu,
  Network,
  Sparkles,
  Workflow,
  X,
} from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function BrandLogo() {
  return (
    <Image
      className="brand-logo"
      src="/nexora-tech-logo.png"
      alt="Nexora Tech"
      width={1760}
      height={518}
      priority
    />
  );
}

function SectionIntro({
  eyebrow,
  title,
  body,
  light = false,
}: {
  eyebrow: string;
  title: ReactNode;
  body: string;
  light?: boolean;
}) {
  return (
    <div className={`section-intro ${light ? 'is-light' : ''}`}>
      <Reveal>
        <p className="eyebrow">
          <span />
          {eyebrow}
        </p>
        <h2>{title}</h2>
      </Reveal>
      <Reveal className="section-intro-copy" delay={0.08}>
        <p>{body}</p>
      </Reveal>
    </div>
  );
}

const services = [
  {
    number: '01',
    icon: Code2,
    title: 'Websites & digital products',
    body: 'Clear positioning, thoughtful interaction, and production-ready frontend systems built around real people.',
    tags: ['Strategy', 'UX/UI', 'Development'],
  },
  {
    number: '02',
    icon: Database,
    title: 'Custom CRM systems',
    body: 'Purpose-built revenue systems that make leads, follow-ups, reporting, and team ownership easier to see.',
    tags: ['Architecture', 'Automation', 'Dashboards'],
  },
  {
    number: '03',
    icon: Workflow,
    title: 'Automation & internal tools',
    body: 'Connected workflows that remove repetitive work and give teams more time for decisions that matter.',
    tags: ['Workflows', 'Integrations', 'Operations'],
  },
  {
    number: '04',
    icon: Network,
    title: 'Technology direction',
    body: 'Practical guidance that turns technical complexity into a focused roadmap with measurable priorities.',
    tags: ['Discovery', 'Roadmaps', 'Delivery'],
  },
];

const process = [
  [
    '01',
    'Understand',
    'We clarify the business, the people it serves, and the friction holding progress back.',
  ],
  [
    '02',
    'Direct',
    'We shape the right system, message, and measurable definition of success.',
  ],
  [
    '03',
    'Build',
    'We design and engineer in visible, testable increments with a tight feedback loop.',
  ],
  [
    '04',
    'Move forward',
    'We launch, document, and hand over a system your team can confidently own.',
  ],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const reduceMotion = useReducedMotion();

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <main>
      <header className="site-header">
        <a className="logo-link" href="#top" aria-label="Nexora Tech home">
          <BrandLogo />
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#services">Services</a>
          <a href="#systems">Systems</a>
          <a href="#process">Process</a>
          <a href="#about">About</a>
        </nav>
        <a className="header-cta" href="#contact">
          Start a project <ArrowUpRight />
        </a>
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="mobile-menu-top">
            <BrandLogo />
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X />
            </button>
          </div>
          <nav>
            {['Services', 'Systems', 'Process', 'About', 'Contact'].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                  <ArrowUpRight />
                </a>
              ),
            )}
          </nav>
        </motion.div>
      )}

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <span /> Next-generation technology, made practical
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.06, ease }}
          >
            Technology that moves <em>business forward.</em>
          </motion.h1>
          <motion.p
            className="hero-lede"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.14, ease }}
          >
            Nexora Tech turns complex technology into clear business momentum -
            through digital products, custom platforms, and connected systems.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease }}
          >
            <a className="button-primary" href="#contact">
              Build what comes next <ArrowUpRight />
            </a>
            <a className="button-text" href="#services">
              Explore capabilities <ArrowRight />
            </a>
          </motion.div>
        </div>

        <motion.div
          className="momentum-stage"
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.12, ease }}
          aria-label="Nexora Tech brand mark representing connected business momentum"
        >
          <div className="stage-glow" />
          <div className="orbit orbit-one">
            <i />
            <i />
          </div>
          <div className="orbit orbit-two">
            <i />
          </div>
          <div className="orbit orbit-three" />
          <Image
            src="/nexora-tech-mark.png"
            alt=""
            width={413}
            height={518}
            priority
          />
          <div className="signal-card signal-clarity">
            <span>01</span>
            <strong>Clarity</strong>
            <small>See the right move</small>
          </div>
          <div className="signal-card signal-capability">
            <span>02</span>
            <strong>Capability</strong>
            <small>Build the right system</small>
          </div>
          <div className="signal-card signal-progress">
            <span>03</span>
            <strong>Progress</strong>
            <small>Measure what changes</small>
          </div>
        </motion.div>
      </section>

      <section className="promise-strip" aria-label="Nexora Tech promise">
        <p>Clear systems.</p>
        <i />
        <p>Smarter decisions.</p>
        <i />
        <p>Stronger outcomes.</p>
      </section>

      <section className="services" id="services">
        <SectionIntro
          eyebrow="What we build"
          title={
            <>
              Practical technology.
              <br />
              <em>Visible momentum.</em>
            </>
          }
          body="We combine strategy, design, and engineering into systems that are easier to understand, adopt, and grow."
        />
        <div className="service-grid">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Reveal
                className="service-card"
                key={service.number}
                delay={index * 0.05}
              >
                <div className="service-card-top">
                  <span>{service.number}</span>
                  <Icon />
                </div>
                <h3>{service.title}</h3>
                <p>{service.body}</p>
                <ul>
                  {service.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <a href="#contact" aria-label={`Discuss ${service.title}`}>
                  Discuss your system <ArrowUpRight />
                </a>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="systems" id="systems">
        <div className="systems-grid" aria-hidden="true" />
        <SectionIntro
          light
          eyebrow="Connected by design"
          title={
            <>
              From scattered signals
              <br />
              to <em>one clear system.</em>
            </>
          }
          body="A useful platform does more than store information. It helps people understand what is happening, decide what matters, and act with confidence."
        />
        <Reveal className="system-demo">
          <aside className="demo-rail">
            <Image
              src="/nexora-tech-mark.png"
              alt=""
              width={413}
              height={518}
            />
            {[Gauge, Database, Workflow, Bot].map((Icon, index) => (
              <span className={index === 0 ? 'active' : ''} key={index}>
                <Icon />
              </span>
            ))}
          </aside>
          <div className="demo-main">
            <div className="demo-header">
              <div>
                <small>Momentum workspace</small>
                <h3>Good morning, team.</h3>
              </div>
              <span>
                <i /> Systems live
              </span>
            </div>
            <div className="metric-grid">
              <article>
                <small>Pipeline value</small>
                <strong>$284.8K</strong>
                <span>+18.4% this quarter</span>
              </article>
              <article>
                <small>Qualified leads</small>
                <strong>128</strong>
                <span>12 ready for action</span>
              </article>
              <article className="metric-accent">
                <small>Momentum score</small>
                <strong>
                  94<em>/100</em>
                </strong>
                <span>Systems aligned</span>
              </article>
            </div>
            <div className="demo-lower">
              <div className="trajectory">
                <div className="demo-title">
                  <span>Business trajectory</span>
                  <small>Last 6 months</small>
                </div>
                <div className="bars">
                  {[34, 46, 41, 58, 68, 64, 79, 88, 96].map((height, index) => (
                    <i key={index} style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>
              <div className="next-actions">
                <div className="demo-title">
                  <span>Next best actions</span>
                  <Sparkles />
                </div>
                {[
                  'Review 8 priority leads',
                  'Approve website release',
                  'Connect finance workflow',
                ].map((item, index) => (
                  <p key={item}>
                    <span>0{index + 1}</span>
                    {item}
                    <ArrowRight />
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="principles" id="about">
        <SectionIntro
          eyebrow="How Nexora feels"
          title={
            <>
              Intelligent by nature.
              <br />
              <em>Human by design.</em>
            </>
          }
          body="Enterprise confidence without the complexity. Every choice is made to create clarity for the people who use the system."
        />
        <div className="principle-grid">
          {[
            [
              'Clear',
              'Technical complexity translated into direct business value.',
            ],
            [
              'Confident',
              'Decisive recommendations supported by evidence and intent.',
            ],
            [
              'Forward-looking',
              'A practical view of what becomes possible next.',
            ],
            ['Human', 'Technology that speaks to people, not systems.'],
          ].map(([title, body], index) => (
            <Reveal className="principle-card" key={title} delay={index * 0.05}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="process" id="process">
        <div className="process-copy">
          <Reveal>
            <p className="eyebrow">
              <span /> A precise path forward
            </p>
            <h2>
              Direction before
              <br />
              <em>decoration.</em>
            </h2>
            <p>
              Four focused stages keep the work useful, visible, and moving.
            </p>
          </Reveal>
        </div>
        <div className="process-list">
          {process.map(([number, title, body], index) => (
            <Reveal className="process-step" key={number} delay={index * 0.05}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
              <ArrowUpRight />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contact-orbit" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <Reveal className="contact-copy">
          <p className="eyebrow">
            <span /> Ready when you are
          </p>
          <h2>
            Build smarter systems.
            <br />
            Create what comes next.
          </h2>
          <p>Tell us what should feel clearer, move faster, or work better.</p>
        </Reveal>
        <Reveal className="contact-panel" delay={0.08}>
          {sent ? (
            <motion.div
              className="form-success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span>
                <Check />
              </span>
              <h3>Message captured.</h3>
              <p>
                This demonstration is ready to connect to your preferred form
                backend.
              </p>
              <button onClick={() => setSent(false)}>Send another</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label>
                <span>Your name</span>
                <input required placeholder="Name" />
              </label>
              <label>
                <span>Work email</span>
                <input required type="email" placeholder="you@company.com" />
              </label>
              <label className="full">
                <span>What should we build?</span>
                <textarea
                  required
                  placeholder="A digital product, a better CRM, or a connected system..."
                />
              </label>
              <div className="form-footer full">
                <p>A rough idea is enough to begin.</p>
                <button type="submit">
                  Start the conversation <ArrowUpRight />
                </button>
              </div>
            </form>
          )}
        </Reveal>
      </section>

      <footer className="site-footer">
        <div>
          <Image
            src="/nexora-tech-mark.png"
            alt="Nexora Tech"
            width={413}
            height={518}
          />
          <span>NEXORA TECH</span>
        </div>
        <p>Technology that moves business forward.</p>
        <a href="#top">
          Back to top <ArrowUpRight />
        </a>
      </footer>
    </main>
  );
}
