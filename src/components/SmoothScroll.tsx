"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import { startPointerTracking } from "@/lib/pointer-state";
import { setScroll } from "@/lib/scroll-state";

/**
 * Lenis drives real window scroll, so `getBoundingClientRect` stays truthful
 * for the WebGL layer. GSAP's ticker owns the RAF loop and ScrollTrigger is
 * refreshed from Lenis so both systems agree on scroll position.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Separate from the scroll effect: pointer tracking has its own opt-outs
  // (coarse pointers) and must not be skipped just because Lenis was.
  useEffect(() => startPointerTracking(), []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", (e: { scroll: number; velocity: number }) => {
      setScroll(e.scroll, e.velocity);
      ScrollTrigger.update();
    });

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // In-page anchors bypass Lenis and jump instantly, because the browser sets
    // scroll position directly. Delegate one listener and hand them to Lenis so
    // nav links travel at the same speed as the wheel.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      const href = anchor?.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { duration: 1.6, offset: -32 });
      history.pushState(null, "", href);
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
