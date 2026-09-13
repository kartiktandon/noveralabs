'use client';

import { FormEvent, ReactNode, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Asterisk,
  Boxes,
  Check,
  Code2,
  DatabaseZap,
  Layers3,
  Menu,
  MousePointer2,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;
const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay, ease } }),
};

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>;
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return <motion.div className={className} initial={{ y: 28 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.8, delay, ease }}>{children}</motion.div>;
}

function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return <div className="section-label"><span>{index}</span><p>{children}</p></div>;
}

function CrmPreview() {
  return (
    <div className="crm-window">
      <div className="window-bar"><div className="window-dots"><i /><i /><i /></div><span>nova / overview</span><div className="online"><i /> LIVE</div></div>
      <div className="crm-body">
        <aside className="crm-sidebar"><BrandMark />{['⌂','⌁','◎','◇','⋯'].map((item,index)=><span className={index===1?'active':''} key={item}>{item}</span>)}</aside>
        <div className="crm-content">
          <div className="crm-heading"><div><small>Tuesday, 11:38 AM</small><h2>Pipeline pulse</h2></div><button>+ Add lead</button></div>
          <div className="metric-row">
            <div><small>Pipeline value</small><strong>$284.8K</strong><em>↗ 18.4%</em></div>
            <div><small>Qualified leads</small><strong>128</strong><em>↗ 12.1%</em></div>
            <div className="score-card"><small>Momentum score</small><strong>94<span>/100</span></strong></div>
          </div>
          <div className="pipeline-card">
            <div className="card-title"><span>Revenue trajectory</span><small>Last 6 months</small></div>
            <div className="chart-bars" aria-hidden="true">{[34,46,39,58,72,66,88,78,96].map((height,i)=><motion.i key={i} initial={{height:0}} whileInView={{height:`${height}%`}} viewport={{once:true}} transition={{delay:.25+i*.05,duration:.6}} />)}</div>
            <div className="chart-line" aria-hidden="true"><span /><span /><span /><span /><span /></div>
          </div>
          <div className="activity-row"><span className="activity-icon">N</span><div><strong>Novera AI matched 8 leads</strong><small>High-intent visitors from your product pages</small></div><button>Review</button></div>
        </div>
      </div>
    </div>
  );
}

function PortalHero() {
  const heroCapabilities = ['CUSTOM CRM', 'WEB EXPERIENCES', 'AUTOMATION', 'PRODUCT DESIGN'];
  return (
    <section className="portal-hero" id="top">
      <div className="portal-plate" aria-hidden="true">
        <video autoPlay muted loop playsInline preload="auto">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_112712_da9d53df-6d27-4b12-bdf6-aa9dc2622bdf.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="portal-vignette" aria-hidden="true" />
      <div className="portal-grain" aria-hidden="true" />

      <div className="portal-hero-copy">
        <motion.p initial="hidden" animate="visible" variants={reveal} custom={0} className="portal-eyebrow"><i /> Websites + CRM systems</motion.p>
        <motion.h1 initial="hidden" animate="visible" variants={reveal} custom={0.06}>The next layer<br />of your <em>business.</em></motion.h1>
        <motion.p initial="hidden" animate="visible" variants={reveal} custom={0.14} className="portal-hero-lede">We design and build connected digital systems that help ambitious companies attract, convert, and scale with confidence.</motion.p>
        <motion.div initial="hidden" animate="visible" variants={reveal} custom={0.22} className="portal-hero-actions">
          <a href="#contact">Start a project <ArrowUpRight /></a>
          <a href="#services">Explore our systems <ArrowDownRight /></a>
        </motion.div>
      </div>

      <motion.div className="portal-capability-strip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.1, delay: 0.34, ease }}>
        {heroCapabilities.map((capability, index) => <div key={capability}><span>0{index + 1}</span><strong>{capability}</strong></div>)}
      </motion.div>
    </section>
  );
}

function SystemPortal() {
  const portalRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: portalRef, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.45, 1], [reduceMotion ? 1 : 0.78, 1, reduceMotion ? 1 : 0.88]);
  const rotateX = useTransform(scrollYProgress, [0, 0.45, 1], [reduceMotion ? 0 : 11, 0, reduceMotion ? 0 : -7]);
  const headingX = useTransform(scrollYProgress, [0, 1], ['8%', reduceMotion ? '8%' : '-10%']);

  return (
    <section className="system-portal" ref={portalRef}>
      <div className="portal-sticky">
        <motion.p className="portal-watermark" style={{ x: headingX }}>FROM SIGNAL TO SYSTEM</motion.p>
        <div className="portal-copy"><span>THE NOVERA CORE</span><h2>Attention is only<br />the beginning.</h2><p>Your website creates demand. Your CRM makes it useful. We design the connection between both.</p></div>
        <motion.div className="portal-frame" style={{ scale, rotateX }}><CrmPreview /></motion.div>
      </div>
    </section>
  );
}

const services = [
  { icon: DatabaseZap, tag: 'CUSTOM CRM', title: 'Sales systems your team will actually use.', body: 'A clear, custom-fit CRM experience that turns scattered leads, follow-ups, and reporting into one reliable revenue rhythm.', items: ['Pipeline architecture','Lead automation','Custom dashboards','Team onboarding'], tone: 'violet' },
  { icon: Code2, tag: 'WEB & DIGITAL PRODUCTS', title: 'Digital experiences built around real users.', body: 'Sharp positioning, expressive interaction, and a frontend engineered for speed, composed into a product people remember.', items: ['Strategy & UX','Visual direction','Motion & interaction','Frontend development'], tone: 'acid' },
];

const capabilities = [
  { icon: Boxes, title: 'Custom systems', note: 'Built around your process' },
  { icon: DatabaseZap, title: 'Custom CRM', note: 'Your customers, your rules' },
  { icon: Layers3, title: 'Internal tools', note: 'Less repetitive work' },
  { icon: Code2, title: 'Digital products', note: 'Built for your users' },
  { icon: Zap, title: 'Automation', note: 'Make repetition disappear' },
];

function BusinessUniverse() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const spin = useTransform(scrollYProgress, [0, 1], [-16, reduceMotion ? -16 : 22]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [reduceMotion ? 1 : 0.82, 1.05, reduceMotion ? 1 : 0.9]);
  const titleX = useTransform(scrollYProgress, [0, 1], ['6%', reduceMotion ? '6%' : '-8%']);

  return (
    <section className="business-universe" ref={ref}>
      <div className="universe-sticky">
        <motion.p className="universe-watermark" style={{ x: titleX }}>BUILT AROUND YOU</motion.p>
        <div className="universe-intro"><span>NOT OFF THE SHELF</span><h2>One business.<br />Five ways to<br /><em>fit better.</em></h2></div>
        <motion.div className="universe-system" style={{ rotate: spin, scale }}>
          <img src="/novera-3d-mark.png" alt="Novera Labs custom technology system spanning five business capabilities" />
          {capabilities.map((capability, index) => { const Icon = capability.icon; return <div className={`capability-satellite satellite-${index + 1}`} key={capability.title}><Icon /><div><strong>{capability.title}</strong><span>{capability.note}</span></div></div>; })}
        </motion.div>
      </div>
    </section>
  );
}

const process = [
  ['01','Decode','We unpack the business, audience, bottlenecks, and growth opportunity.'],
  ['02','Direct','We turn insight into a focused system, message, and visual direction.'],
  ['03','Design','We prototype the experience and make every interaction earn its place.'],
  ['04','Deliver','We build, test, launch, and leave your team with a system they own.'],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const workRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: workRef, offset: ['start end','end start'] });
  const drift = useTransform(scrollYProgress,[0,1],['6%','-16%']);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <main className="site-shell">
      <header className="nav-wrap">
        <a className="brand" href="#top" aria-label="Novera Labs home"><BrandMark /><span>NOVERA LABS</span></a>
        <nav className="desktop-nav" aria-label="Primary navigation"><a href="#services">Services</a><a href="#work">Work</a><a href="#process">Process</a><a href="#about">About</a></nav>
        <a className="nav-cta" href="#contact">Start a project <ArrowUpRight /></a>
        <button className="menu-button" onClick={()=>setMenuOpen(true)} aria-label="Open menu"><Menu /></button>
      </header>

      {menuOpen && <motion.div className="mobile-menu" initial={{opacity:0,y:-24}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
        <div className="mobile-menu-top"><a className="brand" href="#top"><BrandMark /><span>NOVERA LABS</span></a><button onClick={()=>setMenuOpen(false)} aria-label="Close menu"><X /></button></div>
        <nav>{['Services','Work','Process','About','Contact'].map(item=><a key={item} onClick={()=>setMenuOpen(false)} href={`#${item.toLowerCase()}`}>{item}<ArrowUpRight /></a>)}</nav>
      </motion.div>}

      <PortalHero />

      <div className="signal-strip" aria-label="Novera Labs capabilities"><motion.div animate={{x:['0%','-50%']}} transition={{duration:24,repeat:Infinity,ease:'linear'}}>{[0,1].map(copy=><span key={copy}>CRM SYSTEMS <Asterisk /> WEB EXPERIENCES <Asterisk /> UX STRATEGY <Asterisk /> AUTOMATION <Asterisk /> DIGITAL PRODUCTS <Asterisk /></span>)}</motion.div></div>

      <SystemPortal />

      <BusinessUniverse />

      <section className="services-section" id="services">
        <SectionLabel index="02">What we build</SectionLabel>
        <Reveal className="section-intro"><p>Two engines.<br />One <em>trajectory.</em></p><span>We connect the experience that creates demand with the system that turns it into useful, visible growth.</span></Reveal>
        <div className="service-stack">
          {services.map((service,index)=>{
            const Icon=service.icon;
            return <Reveal className={`service-panel ${service.tone}`} key={service.tag} delay={index*.08}>
              <div className="service-number">0{index+1}</div>
              <div className="service-main"><div className="service-icon"><Icon /></div><small>{service.tag}</small><h3>{service.title}</h3><p>{service.body}</p><a href="#contact">Explore this service <ArrowUpRight /></a></div>
              <ul>{service.items.map(item=><li key={item}><Check />{item}</li>)}</ul>
              <div className="service-visual" aria-hidden="true">
                {index===0 ? <div className="mini-pipeline"><div className="mini-title"><span>Deals</span><em>+ New</em></div>{['Discovery','Proposal','Won'].map((item,i)=><div className="mini-column" key={item}><small>{item}</small>{Array.from({length:3-i}).map((_,j)=><motion.i key={j} whileHover={{x:5,rotate:1}}><span>{['Northstar','Vertex','Morrow','Aperture'][i+j]}</span><b>{['$18K','$32K','$24K'][j]}</b></motion.i>)}</div>)}</div>
                : <div className="mini-browser"><div className="mini-browser-bar"><i /><i /><i /><span>novera.build</span></div><div className="mini-site"><span className="mini-kicker">Digital, made useful.</span><strong>Ideas that<br /><em>move.</em></strong><div className="mini-cursor"><MousePointer2 /></div><div className="mini-cta">Start here <ArrowRight /></div></div></div>}
              </div>
            </Reveal>;
          })}
        </div>
      </section>

      <section className="work-section" id="work" ref={workRef}>
        <SectionLabel index="03">Selected directions</SectionLabel>
        <motion.div className="work-watermark" style={{x:drift}}>PROOF / NOT PROMISES</motion.div>
        <div className="work-heading"><Reveal><h2>Designed around<br /><em>the shift.</em></h2></Reveal><Reveal delay={.08}><p>Every engagement begins with the before and after: what should feel clearer, move faster, or convert better?</p></Reveal></div>
        <div className="project-grid">
          <Reveal className="project-card project-violet">
            <div className="project-meta"><span>01 / CRM EXPERIENCE</span><span>CONCEPT STUDY</span></div>
            <div className="project-art crm-art"><div className="large-ring" /><div className="deal-card deal-a"><small>Qualified</small><strong>$48,200</strong><span>Atlas Partners</span></div><div className="deal-card deal-b"><Sparkles /><span>AI follow-up ready</span></div><div className="deal-card deal-c"><small>Pipeline health</small><strong>92%</strong></div></div>
            <div className="project-title"><div><h3>Nova Revenue OS</h3><p>A calmer command center for complex B2B sales.</p></div><ArrowUpRight /></div>
          </Reveal>
          <Reveal className="project-card project-acid" delay={.08}>
            <div className="project-meta"><span>02 / WEB EXPERIENCE</span><span>CONCEPT STUDY</span></div>
            <div className="project-art web-art"><div className="web-poster"><small>NEXT / IS / NOW</small><strong>Build<br /><i>bolder.</i></strong><span>Scroll to explore</span></div><div className="poster-tag">Strategy × Design × Code</div></div>
            <div className="project-title"><div><h3>Orbit Launch Site</h3><p>A kinetic launch story for an AI infrastructure team.</p></div><ArrowUpRight /></div>
          </Reveal>
        </div>
        <p className="concept-note">Concept studies illustrate Novera Labs’ creative and product direction.</p>
      </section>

      <section className="process-section" id="process">
        <SectionLabel index="04">How momentum gets made</SectionLabel>
        <div className="process-layout">
          <Reveal className="process-sticky"><div className="process-orbit"><Zap /></div><h2>Clear steps.<br /><em>No theatre.</em></h2><p>Senior attention, visible progress, and a tight feedback loop from first call to launch.</p><a className="outline-button" href="#contact">See if we fit <ArrowUpRight /></a></Reveal>
          <div className="process-list">{process.map(([number,title,body],index)=><Reveal className="process-step" key={number} delay={index*.05}><span>{number}</span><div><h3>{title}</h3><p>{body}</p></div><ArrowDownRight /></Reveal>)}</div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-grid" aria-hidden="true" />
        <Reveal className="about-copy"><SectionLabel index="05">Why Novera</SectionLabel><h2>Small team.<br />Serious <em>range.</em></h2><p>Novera Labs is a technology studio for teams that want strategy, design, and delivery to speak the same language.</p></Reveal>
        <div className="principle-grid">
          {[['01','Business before buzzwords','Every choice connects to a useful business outcome.'],['02','Motion with a job','Animation guides attention, explains systems, and gives the brand energy.'],['03','Systems over surfaces','We think beyond pages and screens to the workflows underneath.'],['04','Built to be owned','Clear handoff, maintainable UI, and no mysterious black box.']].map(([n,title,body],i)=><Reveal className="principle" key={n} delay={i*.06}><span>{n}</span><Layers3 /><h3>{title}</h3><p>{body}</p></Reveal>)}
        </div>
      </section>

      <section className="quote-section"><Reveal><Asterisk /><blockquote>“Good digital work does not just look advanced. It makes the business feel easier to move.”</blockquote><p>THE NOVERA PRINCIPLE</p></Reveal></section>

      <section className="contact-section" id="contact">
        <div className="contact-top"><Reveal><span className="contact-kicker"><i /> Now booking select projects</span><h2>Let’s build the<br /><em>next version.</em></h2></Reveal><Reveal className="contact-aside" delay={.08}><p>Tell us what you are building, what is getting in the way, and where you want to go.</p><a href="mailto:hello@noveralabs.com">hello@noveralabs.com <ArrowUpRight /></a></Reveal></div>
        <Reveal className="contact-form-wrap">
          {sent ? <motion.div className="form-success" initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}}><span><Check /></span><h3>Message captured.</h3><p>This UI demo does not send data yet, but the full interaction is ready for backend connection.</p><button onClick={()=>setSent(false)}>Send another</button></motion.div>
          : <form className="contact-form" onSubmit={handleSubmit}><label><span>Your name</span><input required placeholder="Name" /></label><label><span>Work email</span><input required type="email" placeholder="you@company.com" /></label><label className="full"><span>What should we build?</span><textarea required placeholder="A new website, a better CRM, or both..." /></label><div className="full form-footer"><p>No pitch deck required. A rough idea is enough.</p><button type="submit" className="send-button">Send project note <ArrowUpRight /></button></div></form>}
        </Reveal>
        <footer><a className="brand" href="#top"><BrandMark /><span>NOVERA LABS</span></a><p>© 2026 NOVERA LABS. BUILT FOR MOMENTUM.</p><div><a href="#top">Back to top ↑</a></div></footer>
      </section>
    </main>
  );
}
