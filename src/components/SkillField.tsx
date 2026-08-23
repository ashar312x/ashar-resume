"use client";

import { useEffect, useRef } from "react";
import { pointerState } from "@/lib/pointer-state";

/**
 * Turns the skills inside it into a field that reacts to the cursor: each item
 * brightens by how close the pointer is, so moving across the block reads as a
 * light passing over it.
 *
 * Progressive enhancement, deliberately. Items render fully opaque; only once
 * this mounts, on a fine pointer, outside reduced motion, does the wrapper gain
 * `is-field` and hand opacity over to the `--near` variable. With JS off, on
 * touch, or under reduced motion the list is simply a legible list.
 *
 * Writes `--near` straight to each node — 14 values a frame is nothing, but 14
 * React renders a frame would be.
 */

/** Distance at which an item is fully lit, in CSS pixels. */
const RADIUS = 260;
/** Above 1 makes the falloff tighter, so the spotlight has an edge. */
const FALLOFF = 1.7;
/** Per-frame chase toward the target, so items ease rather than snap. */
const CHASE = 0.16;

export function SkillField({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-skill]"));
    if (!items.length) return;

    root.classList.add("is-field");

    // Item centres in document space. Only re-read on layout changes, never per
    // frame — subtracting scrollY is enough to follow the page.
    let centres: { x: number; y: number }[] = [];
    const measure = () => {
      const scroll = window.scrollY;
      centres = items.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 + scroll };
      });
    };

    const current = new Float32Array(items.length);
    let inView = false;
    let pointerInside = true;
    let raf = 0;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!inView) return;

      const scroll = window.scrollY;

      for (let i = 0; i < items.length; i++) {
        const c = centres[i];
        let target = 0;

        if (pointerInside && c) {
          const dx = pointerState.x - c.x;
          const dy = pointerState.y - (c.y - scroll);
          const d = Math.hypot(dx, dy);
          target = d >= RADIUS ? 0 : Math.pow(1 - d / RADIUS, FALLOFF);
        }

        const next = current[i] + (target - current[i]) * CHASE;
        // Skip the style write unless it would actually be visible.
        if (Math.abs(next - current[i]) > 0.002) {
          current[i] = next;
          items[i].style.setProperty("--near", next.toFixed(3));
        }
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) measure();
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(root);

    const onLeave = () => (pointerInside = false);
    const onEnter = () => (pointerInside = true);

    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", measure);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      root.classList.remove("is-field");
      for (const el of items) el.style.removeProperty("--near");
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
