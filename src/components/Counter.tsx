"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Counts up to a figure the first time it scrolls into view.
 *
 * Takes the display string straight from `content.ts` ("200+", "9,000") and
 * keeps whatever wraps the digits, so copy stays a content concern — only the
 * numeric run animates.
 *
 * The count is written to the text node directly rather than held in state:
 * it changes every frame, and none of it affects what React renders.
 */

const DURATION = 1.3;
/** Everything starts at 1 rather than 0: a row of zeroes reads as "not loaded". */
const START = 1;

/** Splits "9,000" into ["", 9000, ""] and "200+" into ["", 200, "+"]. */
function parse(value: string) {
  const match = value.match(/^(\D*)([\d,.]+)(\D*)$/);
  if (!match) return null;

  const [, prefix, digits, suffix] = match;
  const target = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(target)) return null;

  return { prefix, suffix, target, grouped: digits.includes(",") };
}

/** Fast out, long settle — the same shape as the site's easing curve. */
function easeOutExpo(t: number) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function Counter({ value, delay = 0 }: { value: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  // Before the browser paints, drop to the starting figure. The markup ships
  // the final string — it is what hydration matches, what crawlers read, and
  // what stays put with JS disabled.
  useLayoutEffect(() => {
    const el = ref.current;
    const parsed = parse(value);
    if (!el || !parsed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.textContent = `${parsed.prefix}${START}${parsed.suffix}`;
  }, [value]);

  useEffect(() => {
    const el = ref.current;
    const parsed = parse(value);
    if (!el || !parsed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { prefix, suffix, target, grouped } = parsed;
    let raf = 0;
    let timer = 0;
    let startedAt = 0;

    const tick = (now: number) => {
      if (!startedAt) startedAt = now;
      const t = Math.min(1, (now - startedAt) / 1000 / DURATION);
      const n = Math.round(START + (target - START) * easeOutExpo(t));

      // Land on the authored string, comma for comma, rather than on whatever
      // toLocaleString produces for the final number.
      el.textContent =
        t < 1
          ? `${prefix}${grouped ? n.toLocaleString("en-US") : n}${suffix}`
          : value;

      if (t < 1) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        // Matches the tile's own `--d` stagger, so the figure starts counting
        // as its card finishes fading in.
        timer = window.setTimeout(() => {
          raf = requestAnimationFrame(tick);
        }, delay * 1000);
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    io.observe(el);

    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [value, delay]);

  return (
    <span className="tabular-nums" aria-label={value}>
      <span ref={ref} aria-hidden>
        {value}
      </span>
    </span>
  );
}
