import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger with GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function initSmoothScroll(): () => void {
  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return () => {};
  }

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  lenisInstance = lenis;

  // Synchronize Lenis scroll with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  const updateTicker = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(updateTicker);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(updateTicker);
    lenis.destroy();
    lenisInstance = null;
  };
}

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const cleanup = initSmoothScroll();
    lenisRef.current = lenisInstance;

    return () => {
      cleanup();
    };
  }, []);

  return lenisRef;
}
