/**
 * Single source of truth for scroll physics, written by Lenis and read by the
 * render loop. Deliberately a plain mutable object — this is read every frame,
 * so it must never trigger React renders.
 */
export const scrollState = {
  /** Normalized scroll velocity, roughly -1..1 after clamping. */
  velocity: 0,
  /** Raw pixel scroll offset. */
  scroll: 0,
};

export function setScroll(scroll: number, velocity: number) {
  scrollState.scroll = scroll;
  scrollState.velocity = Math.max(-1, Math.min(1, velocity / 60));
}
