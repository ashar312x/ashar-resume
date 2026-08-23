/**
 * Global pointer position, written by one document-level listener and read by
 * every frame loop that wants it. Same contract as `scroll-state`: a plain
 * mutable object, never React state.
 *
 * One listener for the whole page rather than per-element handlers — tilt is a
 * property of where the cursor is on screen, not of what it is over.
 */
export const pointerState = {
  /** Viewport pixels. */
  x: 0,
  y: 0,
  /** Offset from viewport centre, normalized to roughly -1..1. */
  nx: 0,
  ny: 0,
  /** False until the pointer has actually moved, and on coarse-pointer devices. */
  active: false,
};

/** Starts tracking. Returns a cleanup. No-op on touch and under reduced motion. */
export function startPointerTracking(): () => void {
  const fine = window.matchMedia("(pointer: fine)").matches;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || still) return () => {};

  const onMove = (e: PointerEvent) => {
    pointerState.x = e.clientX;
    pointerState.y = e.clientY;
    pointerState.nx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    pointerState.ny = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    pointerState.active = true;
  };

  // Tilt returns to rest when the cursor leaves the window rather than freezing
  // at whatever angle it exited on.
  const onLeave = () => {
    pointerState.nx = 0;
    pointerState.ny = 0;
  };

  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerleave", onLeave);

  return () => {
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerleave", onLeave);
  };
}
