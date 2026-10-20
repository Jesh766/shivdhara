import React, { useEffect, useState } from 'react';
import { initPointerTracker } from '../../lib/pointerTracker';

export const AmbientGlowCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    // Disable on touch / mobile devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }
    setIsTouch(false);

    // Feeds the hero particle field's cursor-repulsion effect
    initPointerTracker();

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (isTouch || !isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-30 transition-transform duration-300 ease-out will-change-transform"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        left: -150,
        top: -150,
      }}
    >
      <div className="w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,_rgba(168,92,59,0.06)_0%,_rgba(197,138,53,0.02)_50%,_transparent_70%)] blur-2xl pointer-events-none" />
    </div>
  );
};