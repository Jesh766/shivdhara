import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Compass, ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import { pointer, initPointerTracker } from '../../lib/pointerTracker';
import { SCROLL_DISTANCE } from '../../lib/motionConfig';
import { SiteSettings } from '../../types';

interface HeroSectionProps {
  onOpenConsultation: () => void;
  onExplore: () => void;
  siteSettings?: SiteSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenConsultation,
  onExplore,
  siteSettings,
}) => {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Floating particle field with cursor repulsion
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    initPointerTracker();

    let animId: number;
    const particles: Array<{
      x: number; y: number; r: number;
      vx: number; vy: number; opacity: number; pulse: number;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0.6 + Math.random() * 1.4,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -0.06 - Math.random() * 0.14,
        opacity: 0.1 + Math.random() * 0.25,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const REPEL_RADIUS = 130;
    const REPEL_STRENGTH = 0.6;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const rect = canvas.getBoundingClientRect();
      const px = pointer.x - rect.left;
      const py = pointer.y - rect.top;
      const pointerOnCanvas = pointer.active && px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height;

      particles.forEach((p) => {
        p.pulse += 0.012;
        const alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230,181,90,${alpha})`;
        ctx.fill();

        let vx = p.vx;
        let vy = p.vy;

        if (pointerOnCanvas) {
          const dx = p.x - px;
          const dy = p.y - py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < REPEL_RADIUS && dist > 0.001) {
            const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
            vx += (dx / dist) * force;
            vy += (dy / dist) * force;
          }
        }

        p.x += vx;
        p.y += vy;

        if (p.y < -10) p.y = canvas.height + 10;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Mouse-reactive gradient mesh
  useEffect(() => {
    const stage = heroRef.current;
    if (!stage) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const mx = (e.clientX / window.innerWidth) * 100;
        const my = (e.clientY / window.innerHeight) * 100;
        stage.style.setProperty('--hero-mx', `${mx}%`);
        stage.style.setProperty('--hero-my', `${my}%`);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero-section"
      className="relative min-h-screen bg-[#163A36] text-[#F7F1E6] overflow-hidden flex items-center justify-center pt-24 pb-16"
    >
      {/* Base deep emerald teal gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0E2623] via-[#163A36] to-[#12302D]" />

      {/* Floating gold particles with cursor repulsion */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
        aria-hidden="true"
      />

      {/* Rotating mandala SVG overlay */}
      <div className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none overflow-hidden">
        <svg
          className="w-[140vw] max-w-[1400px] h-[140vw] max-h-[1400px] hero-mandala-spin opacity-[0.05]"
          viewBox="0 0 800 800"
          fill="none"
          aria-hidden="true"
        >
          {[340, 280, 220, 160, 100].map((r, i) => (
            <circle
              key={i}
              cx="400" cy="400" r={r}
              stroke="rgba(230,181,90,1)"
              strokeWidth={i === 0 ? 0.6 : 0.4}
              strokeDasharray={i % 2 === 0 ? '6 14' : '2 10'}
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const x2 = 400 + 340 * Math.cos(angle);
            const y2 = 400 + 340 * Math.sin(angle);
            return (
              <line
                key={i}
                x1="400" y1="400"
                x2={x2} y2={y2}
                stroke="rgba(230,181,90,1)"
                strokeWidth="0.35"
                strokeDasharray="3 8"
              />
            );
          })}
          <circle cx="400" cy="400" r="390" stroke="rgba(49,92,82,1)" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Static sacred geometry rings */}
      <div className="absolute inset-0 z-[3] flex items-center justify-center pointer-events-none opacity-[0.16]">
        <div className="w-[640px] sm:w-[880px] h-[640px] sm:h-[880px] rounded-full border border-[#E6D5B8]/25" />
        <div className="absolute w-[460px] sm:w-[640px] h-[460px] sm:h-[640px] rounded-full border border-[#315C52]/45 border-dashed" />
        <div className="absolute w-[280px] sm:w-[420px] h-[280px] sm:h-[420px] rounded-full border border-[#C56A45]/30" />
      </div>

      {/* Drifting atmospheric glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(49,92,82,0.45)_0%,transparent_70%)] blur-[90px] pointer-events-none z-[2] hero-glow-drift-1" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(197,106,69,0.18)_0%,transparent_70%)] blur-[80px] pointer-events-none z-[2] hero-glow-drift-2" />

      {/* Hero content — directly visible on load with smooth fade-in */}
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl mx-auto text-center relative z-10 w-full px-4 sm:px-6 lg:px-8"
      >
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4.5 py-1.5 rounded-full bg-[#0E2623]/80 border border-[#315C52]/70 backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C56A45] animate-ping" />
            <span className="type-label text-[#E6D5B8] font-semibold text-[11px] tracking-widest">
              NUMEROLOGY • VASTU • MEDITATION
            </span>
          </div>
        </div>

        <div className="space-y-1 sm:space-y-3 select-none text-center">
          <div className="type-hero text-[#F7F1E6] sm:-translate-x-5">
            {siteSettings?.heroTitle?.split(' ').slice(0, 3).join(' ') || 'Align Your'} <span className="text-[#FAF6EF]">{siteSettings?.heroTitle?.split(' ').slice(3, 6).join(' ') || 'Numbers.'}</span>
          </div>
          <div className="type-hero text-[#F7F1E6] sm:translate-x-5">
            {siteSettings?.heroTitle?.split(' ').slice(6, 9).join(' ') || 'Align Your'} <span className="text-[#C56A45]">{siteSettings?.heroTitle?.split(' ').slice(9, 12).join(' ') || 'Space.'}</span>
          </div>
          <div className="type-hero text-[#F7F1E6] sm:-translate-x-2">
            {siteSettings?.heroTitle?.split(' ').slice(12, 15).join(' ') || 'Align'} <span className="type-italic-accent text-[#E6D5B8] text-[1.12em]">{siteSettings?.heroTitle?.split(' ').slice(15).join(' ') || 'Within.'}</span>
          </div>
        </div>

        <p className="type-body-editorial text-[#E6D5B8]/85 mx-auto mt-8 max-w-2xl text-base sm:text-lg">
          {siteSettings?.heroSubtitle || 'A grounded synthesis of ancient sciences, harmonious spatial architecture, and conscious stillness guided by Falgun Thakkr.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <button
            id="hero-book-consultation-btn"
            onClick={onOpenConsultation}
            className="btn-primary-terracotta w-full sm:w-auto shadow-lg hover:shadow-xl transition-all"
          >
            <span>Book Consultation</span>
            <ArrowRight className="w-4 h-4 text-[#F7F1E6]" />
          </button>
          <button
            id="hero-explore-btn"
            onClick={onExplore}
            className="btn-secondary-ivory w-full sm:w-auto border-[#E6D5B8]/40 text-[#F7F1E6] hover:bg-white/10"
          >
            <Compass className="w-4 h-4 text-[#E6D5B8]" />
            <span>Explore The Triad</span>
          </button>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none">
        <span className="type-label-subtle text-[#E6D5B8]/70 font-medium">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 6, 0], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-4 h-4 text-[#E6D5B8]" />
        </motion.div>
      </div>
    </section>
  );
};