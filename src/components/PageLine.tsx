"use client";

import { useEffect, useRef } from "react";

/**
 * A single trace that threads down the page through every `[data-line-node]`
 * element — the project plates — drawn on a fixed 2D canvas.
 *
 * Three things make it feel alive rather than scrubbed:
 *  - progress lags scroll (eased, never bound), so it overshoots and settles;
 *  - each node ignites once, the first time the head passes it;
 *  - ignition throws short-lived bolts, drawn additively.
 *
 * The stroke is masked inside each plate, so the trace reads as passing behind
 * the image rather than across it. The loop clears itself and stops the moment
 * progress has settled and the last bolt has died, so a still page costs
 * nothing.
 */

type Point = { x: number; y: number };
type Node = Point & { lit: number; ignited: boolean };
type Bolt = { pts: Point[]; life: number; max: number };
/** A plate's box in document coordinates. The trace is masked out inside it. */
type Rect = { left: number; right: number; top: number; bottom: number };

/** Document-space sampling step for the traced path, in CSS pixels. */
const STEP = 7;
/** Share of the remaining distance the head closes each frame at 60fps. */
const CHASE = 0.09;
/** Where in the viewport the head wants to sit, as a fraction of height. */
const HEAD_LINE = 0.62;
/** Clearance left around a plate where the trace is hidden, in CSS pixels. */
const PLATE_PAD = 10;
/** How far the S-curve handles reach, as a share of the gap between plates. */
const DRAPE = 0.42;

const SIGNAL = "255, 77, 25";
const BONE = "237, 231, 222";

/** Keeps a computed path index inside the array, whatever the easing did. */
function clampIndex(i: number, length: number) {
  if (!Number.isFinite(i)) return 0;
  return Math.max(0, Math.min(length - 1, i));
}

function catmull(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x:
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y:
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
}

/** Samples a Catmull-Rom spline through control points at a fixed step, so the
 *  head advances at a constant speed regardless of how far apart they are. */
function sample(ctrl: Point[]): Point[] {
  const out: Point[] = [];
  for (let i = 0; i < ctrl.length - 1; i++) {
    const p0 = ctrl[Math.max(0, i - 1)];
    const p1 = ctrl[i];
    const p2 = ctrl[i + 1];
    const p3 = ctrl[Math.min(ctrl.length - 1, i + 2)];
    const segments = Math.max(2, Math.round(Math.hypot(p2.x - p1.x, p2.y - p1.y) / STEP));
    for (let s = 0; s < segments; s++) out.push(catmull(p0, p1, p2, p3, s / segments));
  }
  out.push(ctrl[ctrl.length - 1]);
  return out;
}

/** A jagged polyline between two points: perpendicular noise under a sine
 *  envelope, so the bolt bows in the middle and pins at both ends. */
function makeBolt(ax: number, ay: number, bx: number, by: number): Point[] {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const lean = Math.random() > 0.5 ? 1 : -1;
  const pts: Point[] = [{ x: ax, y: ay }];

  for (let i = 1; i <= 8; i++) {
    const t = i / 9;
    const env = Math.sin(t * Math.PI);
    const spread = Math.min(len * 0.18, 12) * (0.5 + Math.random() * 0.8) * env;
    const bow = Math.min(len * 0.08, 6) * env * lean;
    pts.push({
      x: ax + dx * t + (Math.random() - 0.5) * spread * 1.4 + nx * bow,
      y: ay + dy * t + (Math.random() - 0.5) * spread + ny * bow,
    });
  }

  pts.push({ x: bx, y: by });
  return pts;
}

export function PageLine() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let path: Point[] = [];
    let nodes: Node[] = [];
    let bolts: Bolt[] = [];
    let plates: Rect[] = [];
    let progress = 0;
    let eased = 0;
    let raf = 0;
    let last = 0;
    /** Scroll offset the last painted frame used, or null if a repaint is due. */
    let paintedAt: number | null = null;

    function measure() {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Plate boxes, in document coordinates. Static until layout changes, so
      // they are measured here rather than re-read every frame.
      const scroll = window.scrollY;
      const measured = Array.from(
        document.querySelectorAll<HTMLElement>("[data-line-node]"),
      )
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            el,
            rect: {
              left: r.left - PLATE_PAD,
              right: r.right + PLATE_PAD,
              top: r.top + scroll - PLATE_PAD,
              bottom: r.bottom + scroll + PLATE_PAD,
            },
          };
        })
        .sort((a, b) => a.rect.top - b.rect.top);

      plates = measured.map((m) => m.rect);

      if (plates.length < 2) {
        path = [];
        nodes = [];
        return;
      }

      // The curve aims at plate centres — that is what produces the zigzag —
      // but the stroke is masked inside the box, so it reads as passing behind.
      const anchors: Point[] = plates.map((r) => ({
        x: (r.left + r.right) / 2,
        y: (r.top + r.bottom) / 2,
      }));

      // Lead-in from above the first anchor, and a run-out that lands exactly on
      // `[data-line-end]` — the hairline opening the next section. The trace
      // belongs to the work list, so it must neither stop short in open page nor
      // trail past that rule.
      const first = anchors[0];
      const lastAnchor = anchors[anchors.length - 1];

      const endEl = document.querySelector<HTMLElement>("[data-line-end]");
      const endY = endEl
        ? endEl.getBoundingClientRect().top + scroll
        : // No marker: keep the tail inside the section owning the plates.
          (measured[measured.length - 1].el.closest("section")?.getBoundingClientRect()
            .bottom ?? 0) +
          scroll -
          24;

      const runOut = Math.max(lastAnchor.y + 40, endY);

      // Straight from centre to centre, consecutive plates are a flat diagonal.
      // Two handles per gap turn each one into an S: the trace leaves a plate
      // heading down, crosses the page, and arrives at the next one heading down
      // again. Longer arc, and it reads as a routed cable rather than a ruler.
      const ctrl: Point[] = [{ x: first.x, y: first.y - h * 0.9 }, anchors[0]];
      for (let i = 1; i < anchors.length; i++) {
        const a = anchors[i - 1];
        const b = anchors[i];
        const drape = Math.min(
          Math.max(Math.hypot(b.x - a.x, b.y - a.y) * DRAPE, 140),
          420,
        );
        ctrl.push({ x: a.x, y: a.y + drape });
        ctrl.push({ x: b.x, y: b.y - drape });
        ctrl.push(b);
      }
      ctrl.push({ x: lastAnchor.x, y: runOut });

      path = sample(ctrl);

      // Nodes sit where the trace actually enters each plate, not at its centre
      // — ignition has to happen on the visible line, and somewhere the sparks
      // are not drawn across the image.
      nodes = plates.map((r) => {
        const hit = path.findIndex(
          (p) => p.x >= r.left && p.x <= r.right && p.y >= r.top,
        );
        // The sample just before the box, so the node's glow clears the plate.
        const entry = path[hit > 0 ? hit - 1 : 0];
        return { x: entry.x, y: entry.y, lit: 0, ignited: false };
      });
    }

    /** True if a document-space point falls inside any plate. */
    function inPlate(x: number, y: number) {
      for (const r of plates) {
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return true;
      }
      return false;
    }

    function ignite(node: Node) {
      node.ignited = true;
      node.lit = 1;
      const count = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        // Thrown upward, away from the plate the node sits on top of — a bolt
        // arcing down would be drawn across the image.
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
        const reach = 26 + Math.random() * 46;
        bolts.push({
          pts: makeBolt(
            node.x,
            node.y,
            node.x + Math.cos(angle) * reach,
            node.y + Math.sin(angle) * reach,
          ),
          life: 0.07 + Math.random() * 0.08,
          max: 0.15,
        });
      }
    }

    /** Strokes the first `count` samples of the path. */
    function strokePath(count: number, scroll: number) {
      if (count < 2) return;

      // Three passes: a faint bundle either side of a brighter core, so the
      // trace reads as a cable rather than a stroke.
      const passes = [
        { dx: -1.6, width: 1, alpha: 0.14 },
        { dx: 1.6, width: 1, alpha: 0.14 },
        { dx: 0, width: 1.25, alpha: 0.5 },
      ];

      for (const pass of passes) {
        ctx!.beginPath();
        let started = false;
        for (let i = 0; i < count; i++) {
          const y = path[i].y - scroll;
          // Off screen, or behind a plate: lift the pen and pick up on the far
          // side, so the trace disappears under the image instead of over it.
          if (y < -60 || y > h + 60 || inPlate(path[i].x, path[i].y)) {
            started = false;
            continue;
          }
          const x = path[i].x + pass.dx;
          if (started) ctx!.lineTo(x, y);
          else {
            ctx!.moveTo(x, y);
            started = true;
          }
        }
        ctx!.strokeStyle = `rgba(${BONE}, ${pass.alpha})`;
        ctx!.lineWidth = pass.width;
        ctx!.stroke();
      }
    }

    function drawNodes(scroll: number) {
      for (const node of nodes) {
        const y = node.y - scroll;
        if (y < -20 || y > h + 20) continue;

        ctx!.beginPath();
        ctx!.arc(node.x, y, 1.6, 0, Math.PI * 2);
        ctx!.fillStyle = node.ignited
          ? `rgba(${SIGNAL}, ${0.35 + node.lit * 0.65})`
          : `rgba(${BONE}, 0.28)`;
        ctx!.fill();

        if (node.lit > 0.01) {
          ctx!.beginPath();
          ctx!.arc(node.x, y, 3 + node.lit * 14, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${SIGNAL}, ${node.lit * 0.13})`;
          ctx!.fill();
        }
      }
    }

    function drawBolts(scroll: number) {
      if (!bolts.length) return;
      ctx!.save();
      ctx!.globalCompositeOperation = "lighter";
      ctx!.lineWidth = 1;
      for (const bolt of bolts) {
        const alpha = Math.max(0, bolt.life / bolt.max);
        ctx!.beginPath();
        ctx!.moveTo(bolt.pts[0].x, bolt.pts[0].y - scroll);
        for (let i = 1; i < bolt.pts.length; i++) {
          ctx!.lineTo(bolt.pts[i].x, bolt.pts[i].y - scroll);
        }
        ctx!.strokeStyle = `rgba(${SIGNAL}, ${alpha})`;
        ctx!.stroke();
      }
      ctx!.restore();
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      // Clamped at both ends. The first rAF timestamp is taken at the start of
      // the frame and can predate the `performance.now()` that seeded `last`,
      // which makes delta negative — and a negative delta inverts the chase
      // below, driving `eased` out of 0..1.
      const delta = Math.max(0, Math.min((now - last) / 1000, 0.05));
      last = now;

      if (!path.length) return;

      const scroll = window.scrollY;
      const focus = scroll + h * HEAD_LINE;

      const startY = path[0].y;
      const span = Math.max(1, path[path.length - 1].y - startY);
      progress = Math.max(0, Math.min(1, (focus - startY) / span));

      // Frame-rate independent form of a 0.09-per-frame chase.
      eased += (progress - eased) * (1 - Math.pow(1 - CHASE, delta * 60));
      eased = Math.max(0, Math.min(1, eased));

      bolts = bolts.filter((b) => (b.life -= delta) > 0);

      // Idle: the head has caught up, no bolt is alive, no node is still
      // glowing, and the page has not moved since the last paint.
      const settled =
        Math.abs(progress - eased) < 0.0004 &&
        !bolts.length &&
        !nodes.some((n) => n.lit > 0.002);

      if (settled && paintedAt === scroll) return;
      paintedAt = settled ? scroll : null;

      ctx!.clearRect(0, 0, w, h);

      // `drawn` is a count, not an index: at full progress it must include the
      // final sample, or the trace stops one step short of where it should land.
      const drawn = Math.min(path.length, Math.floor(eased * path.length) + 1);
      const head = clampIndex(drawn - 1, path.length);
      strokePath(drawn, scroll);

      // Ignite every node the head has now passed.
      const headY = path[head].y;
      const decay = Math.pow(0.12, delta);
      for (const node of nodes) {
        if (!node.ignited && headY >= node.y) ignite(node);
        node.lit *= decay;
      }

      drawNodes(scroll);
      drawBolts(scroll);

      // The head itself. Gone once the trace has run out to the end, or while
      // it is behind a plate.
      if (head > 0 && head < path.length - 1) {
        const p = path[head];
        const y = p.y - scroll;
        if (y > -20 && y < h + 20 && !inPlate(p.x, p.y)) {
          ctx!.beginPath();
          ctx!.arc(p.x, y, 2, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${SIGNAL}, 0.9)`;
          ctx!.fill();
        }
      }
    }

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        measure();
        paintedAt = null;
      }, 200);
    };

    measure();
    // Layout is not final until fonts have swapped.
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", onResize);
    last = performance.now();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-15"
    />
  );
}
