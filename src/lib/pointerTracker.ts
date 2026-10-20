// Lightweight shared pointer-position singleton.
// One mousemove listener feeds both the ambient glow cursor AND
// the hero particle field's repulsion effect — avoids duplicate
// listeners doing the same work on every pointer move.

export const pointer = { x: -9999, y: -9999, active: false };

let initialized = false;

export function initPointerTracker() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  // Skip entirely on touch devices — repulsion is a desktop-only flourish
  if (window.matchMedia('(pointer: coarse)').matches) return;

  window.addEventListener(
    'pointermove',
    (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    },
    { passive: true }
  );

  window.addEventListener('pointerleave', () => {
    pointer.active = false;
  });
}