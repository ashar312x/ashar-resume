"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  as?: "div" | "section" | "header" | "footer" | "li";
  className?: string;
  id?: string;
  /** Stagger, in seconds, applied to every animated child inside. */
  delay?: number;
  children: React.ReactNode;
};

/**
 * Flips `is-revealed` once the element enters the viewport; all motion lives in
 * CSS so the reveal costs nothing on the main thread while scrolling.
 */
export function Reveal({
  as = "div",
  className = "",
  id,
  delay = 0,
  children,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as "div";

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      id={id}
      className={`${className} ${shown ? "is-revealed" : ""}`}
      style={{ "--d": `${delay}s` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** A single masked line of display type. */
export function Line({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={`line ${className}`}>
      <span style={{ "--d": `${delay}s` } as React.CSSProperties}>{children}</span>
    </span>
  );
}
