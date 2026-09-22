'use client';

import Link from 'next/link';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export type AnimationPhase = 'scatter' | 'line' | 'circle';
type Target = { x: number; y: number; rotation: number; scale: number; opacity: number };
type Project = { src: string; client: string; discipline: string };

const W = 68;
const H = 96;
const MAX_SCROLL = 1800;
const PROJECT_DATA = [
  ['photo-1556742049-0cfed4f6a45d', 'Boombastic', 'Commerce'],
  ['photo-1551650975-87deedd944c3', 'SORT', 'Mobile'],
  ['photo-1552664730-d307ca884978', 'Hepki', 'Platform'],
  ['photo-1503376780353-7e6692767b70', 'Detailing Adda', 'CRM'],
  ['photo-1558655146-d09347e92766', 'Interface', 'Product'],
  ['photo-1460925895917-afdab827c52f', 'Systems', 'Analytics'],
  ['photo-1516321318423-f06f85e504b3', 'Novera', 'Web'],
  ['photo-1559028012-481c04fa702d', 'Digital', 'Experience'],
  ['photo-1523726491678-bf852e717f6a', 'Design', 'UI / UX'],
  ['photo-1498050108023-c5249f4df085', 'Build', 'Engineering'],
  ['photo-1488590528505-98d2b5aba04b', 'Scale', 'Technology'],
  ['photo-1551434678-e076c223a692', 'Teams', 'Workflow'],
  ['photo-1551288049-bebda4e38f71', 'Insight', 'Data'],
  ['photo-1547658719-da2b51169166', 'Launch', 'Web App'],
  ['photo-1517245386807-bb43f82c33c4', 'Connect', 'CRM'],
  ['photo-1524758631624-e2822e304c36', 'Operate', 'Systems'],
  ['photo-1553877522-43269d4ea984', 'Strategy', 'Product'],
  ['photo-1556761175-b413da4baf72', 'Partner', 'Studio'],
  ['photo-1542744173-8e7e53415bb0', 'Momentum', 'Growth'],
  ['photo-1519389950473-47ba0277781c', 'Future', 'Technology'],
] as const;
const PROJECTS: Project[] = PROJECT_DATA.map(([photo, client, discipline]) => ({
  src: `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=600&q=85`, client, discipline,
}));
const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

function FlipCard({ project, index, target }: { project: Project; index: number; target: Target }) {
  return (
    <motion.div animate={{ x: target.x, y: target.y, rotate: target.rotation, scale: target.scale, opacity: target.opacity }}
      transition={{ type: 'spring', stiffness: 42, damping: 16 }} className="morph-card" style={{ width: W, height: H }}>
      <motion.div className="morph-card-inner" style={{ transformStyle: 'preserve-3d' }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }} whileHover={{ rotateY: 180 }}>
        <div className="morph-card-face morph-card-front">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.src} alt={`${project.client} — ${project.discipline}`} />
          <span className="morph-card-index">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <div className="morph-card-face morph-card-back"><span>{project.discipline}</span><strong>{project.client}</strong></div>
      </motion.div>
    </motion.div>
  );
}

export default function ScrollMorphHero() {
  const [phase, setPhase] = useState<AnimationPhase>('scatter');
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [morph, setMorph] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [parallax, setParallax] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const scrollRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const virtualScroll = useMotionValue(0);
  const smoothMorph = useSpring(useTransform(virtualScroll, [0, 650], [0, 1]), { stiffness: 45, damping: 22 });
  const smoothRotate = useSpring(useTransform(virtualScroll, [650, MAX_SCROLL], [0, 360]), { stiffness: 42, damping: 22 });
  const mouseX = useMotionValue(0);
  const smoothMouse = useSpring(mouseX, { stiffness: 36, damping: 24 });
  const contentOpacity = useTransform(smoothMorph, [0.68, 0.95], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.68, 0.95], [24, 0]);
  const scrollProgress = useTransform(virtualScroll, [0, MAX_SCROLL], [0, 1]);

  useEffect(() => {
    const node = ref.current; if (!node) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(node); return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (reduceMotion) { setPhase('circle'); virtualScroll.set(MAX_SCROLL); scrollRef.current = MAX_SCROLL; return; }
    const a = window.setTimeout(() => setPhase('line'), 450);
    const b = window.setTimeout(() => setPhase('circle'), 1900);
    return () => { window.clearTimeout(a); window.clearTimeout(b); };
  }, [reduceMotion, virtualScroll]);
  useEffect(() => {
    const node = ref.current;
    if (!node || reduceMotion) return;
    let touchY = 0;

    const update = (delta: number) => {
      const next = Math.min(Math.max(scrollRef.current + delta, 0), MAX_SCROLL);
      scrollRef.current = next;
      virtualScroll.set(next);
    };

    const wheel = (e: WheelEvent) => {
      if (window.scrollY > 0) {
        return;
      }
      if (scrollRef.current <= 0 && e.deltaY < 0) {
        return;
      }
      if (scrollRef.current >= MAX_SCROLL && e.deltaY > 0) {
        window.scrollBy({ top: e.deltaY, behavior: 'auto' });
        return;
      }
      e.preventDefault();
      const normalizedDelta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      update(Math.max(-120, Math.min(120, normalizedDelta)));
    };

    const touchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
    };

    const touchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchY;
      const delta = touchY - y;
      touchY = y;
      if (window.scrollY > 0) {
        return;
      }
      if (scrollRef.current <= 0 && delta < 0) {
        return;
      }
      if (scrollRef.current >= MAX_SCROLL && delta > 0) {
        window.scrollBy({ top: delta, behavior: 'auto' });
        return;
      }
      e.preventDefault();
      update(delta * 2.2);
    };

    const handleWindowScroll = () => {
      if (window.scrollY > 0 && scrollRef.current < MAX_SCROLL) {
        scrollRef.current = MAX_SCROLL;
        virtualScroll.set(MAX_SCROLL);
      }
    };

    node.addEventListener('wheel', wheel, { passive: false });
    node.addEventListener('touchstart', touchStart, { passive: true });
    node.addEventListener('touchmove', touchMove, { passive: false });
    window.addEventListener('scroll', handleWindowScroll, { passive: true });

    return () => {
      node.removeEventListener('wheel', wheel);
      node.removeEventListener('touchstart', touchStart);
      node.removeEventListener('touchmove', touchMove);
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, [reduceMotion, virtualScroll]);

  useEffect(() => {
    const node = ref.current; if (!node || reduceMotion) return;
    const move = (e: MouseEvent) => { const box = node.getBoundingClientRect(); mouseX.set((((e.clientX - box.left) / box.width) * 2 - 1) * 54); };
    const leave = () => mouseX.set(0); node.addEventListener('mousemove', move); node.addEventListener('mouseleave', leave);
    return () => { node.removeEventListener('mousemove', move); node.removeEventListener('mouseleave', leave); };
  }, [mouseX, reduceMotion]);
  useEffect(() => {
    const a = smoothMorph.on('change', setMorph); const b = smoothRotate.on('change', setRotation); const c = smoothMouse.on('change', setParallax);
    return () => { a(); b(); c(); };
  }, [smoothMorph, smoothMouse, smoothRotate]);

  const scatter = useMemo(() => PROJECTS.map((_, i) => { const angle = i * 2.399963; const distance = 620 + (i % 5) * 145;
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, rotation: ((i * 47) % 180) - 90, scale: 0.65, opacity: 0 };
  }), []);

  return (
    <section ref={ref} className="morph-hero" id="top" aria-label="Novera engineering studio">
      <div className="morph-hero-grid" aria-hidden="true" /><div className="morph-hero-glow" aria-hidden="true" />
      <div className="morph-intro" aria-hidden={phase !== 'circle'}>
        <motion.p className="morph-kicker" initial={{ opacity: 0 }} animate={phase === 'circle' ? { opacity: Math.max(0, 1 - morph * 2.4) } : { opacity: 0 }}>
          Independent engineering studio · India / Worldwide
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
          animate={phase === 'circle' ? { opacity: Math.max(0, 1 - morph * 2.2), y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 24, filter: 'blur(12px)' }} transition={{ duration: 0.9 }}>
          We engineer digital products<br /><em>built to move.</em>
        </motion.h1>
        <motion.p className="morph-intro-copy" initial={{ opacity: 0 }} animate={phase === 'circle' ? { opacity: Math.max(0, 0.72 - morph) } : { opacity: 0 }}>
          Web platforms, mobile applications, and custom CRM systems — designed and built as one connected experience.
        </motion.p>
      </div>
      <motion.div className="morph-active-copy" style={{ opacity: contentOpacity, y: contentY }}>
        <span className="morph-kicker">Strategy · Design · Engineering</span>
        <h2>From ambitious idea<br />to <em>working system.</em></h2>
        <p>One senior team for the interface your customers see and the infrastructure your business runs on.</p>
        <div className="morph-actions"><Link href="/contact">Start a project <ArrowUpRight /></Link><Link href="/portfolio">View selected work</Link></div>
      </motion.div>
      <motion.div className="morph-progress" style={{ opacity: contentOpacity }} aria-hidden="true">
        <span>Shape the system</span>
        <div><motion.i style={{ scaleX: scrollProgress }} /></div>
        <span>Explore</span>
      </motion.div>
      <div className="morph-stage" aria-label="Selected Novera work">
        {PROJECTS.map((project, i) => {
          let target: Target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };
          if (phase === 'scatter') target = scatter[i];
          else if (phase === 'line') { const gap = Math.min(76, Math.max(46, size.width / PROJECTS.length)); target = { x: i * gap - ((PROJECTS.length - 1) * gap) / 2, y: 0, rotation: 0, scale: 1, opacity: 1 }; }
          else {
            const mobile = size.width < 768; const min = Math.min(size.width, size.height); const radius = Math.min(min * (mobile ? 0.34 : 0.32), 330);
            const angle = (i / PROJECTS.length) * 360; const rad = angle * Math.PI / 180;
            const circle = { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius, rotation: angle + 90 };
            const base = Math.min(size.width, size.height * 1.45); const arcRadius = base * (mobile ? 1.55 : 1.12); const centerY = size.height * (mobile ? 0.38 : 0.3) + arcRadius;
            const spread = mobile ? 96 : 126; const progress = Math.min(Math.max(rotation / 360, 0), 1); const current = -90 - spread / 2 + i * spread / (PROJECTS.length - 1) - progress * spread * 0.78; const arcRad = current * Math.PI / 180;
            const arc = { x: Math.cos(arcRad) * arcRadius + parallax, y: Math.sin(arcRad) * arcRadius + centerY, rotation: current + 90, scale: mobile ? 1.25 : 1.68 };
            target = { x: lerp(circle.x, arc.x, morph), y: lerp(circle.y, arc.y, morph), rotation: lerp(circle.rotation, arc.rotation, morph), scale: lerp(1, arc.scale, morph), opacity: 1 };
          }
          return <FlipCard key={`${project.client}-${i}`} project={project} index={i} target={target} />;
        })}
      </div>
      <motion.button
        type="button"
        className="morph-scroll-prompt"
        onClick={() => {
          document.querySelector('.home-lower')?.scrollIntoView({ behavior: 'smooth' });
        }}
        animate={phase === 'circle' ? { opacity: morph > 0.75 ? 0 : 1 } : { opacity: 0 }}
        aria-label="Scroll to explore content"
      >
        <span>Scroll to shape the system</span>
        <ArrowDown />
      </motion.button>
      <div className="morph-service-rail" aria-label="Core services"><span>01 / Web</span><span>02 / Mobile</span><span>03 / Custom CRM</span></div>
    </section>
  );
}
