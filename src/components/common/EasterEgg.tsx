import React, { useEffect, useRef, useState } from 'react';

const TRIGGER = 'shiv';

export const EasterEgg: React.FC = () => {
  const [flashing, setFlashing] = useState(false);
  const bufferRef = useRef('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;
      if (e.key.length !== 1) return;

      bufferRef.current = (bufferRef.current + e.key.toLowerCase()).slice(-TRIGGER.length);

      if (bufferRef.current === TRIGGER) {
        bufferRef.current = '';
        if (prefersReducedMotion) return; // no visual flash if motion is reduced

        setFlashing(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setFlashing(false), 1200);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!flashing) return null;

  return <div aria-hidden="true" className="fixed inset-0 z-[9996] pointer-events-none easter-egg-flash" />;
};

export default EasterEgg;