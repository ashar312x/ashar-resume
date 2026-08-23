/**
 * Idle detection for the canvas.
 *
 * The scene only changes while something is easing — scroll velocity decaying,
 * a hover settling, a plate tilting toward the cursor. Once all of that lands
 * on its target the image is identical frame to frame, so the canvas runs on
 * `frameloop="demand"` and only renders while this module says it should.
 */

let lastActiveAt = 0;

/** Called from a frame loop that still has somewhere to go. */
export function markActive() {
  lastActiveAt = performance.now();
}

/**
 * Grace period after the last `markActive`. Long enough to cover the ordering
 * between planes (which mark) and the driver (which reads), so the loop never
 * stalls a frame before the motion has actually finished.
 */
const GRACE_MS = 150;

export function isActive() {
  return performance.now() - lastActiveAt < GRACE_MS;
}
