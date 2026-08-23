# Portfolio — Ahsun Iqbal

Next.js 16 · React 19 · react-three-fiber · GSAP · Lenis · Tailwind v4.

```bash
npm run dev     # http://localhost:3000
npm run build
```

## How the scroll system works

Three layers, deliberately kept independent:

1. **Lenis** ([SmoothScroll.tsx](src/components/SmoothScroll.tsx)) drives real window
   scroll — not a transformed wrapper — so `getBoundingClientRect()` stays truthful for
   everything else. GSAP's ticker owns the RAF loop; `ScrollTrigger.update()` is called
   from Lenis so both agree on position. Disabled entirely under
   `prefers-reduced-motion`.
2. **DOM owns layout and interaction.** Each project row renders a transparent
   placeholder div (`.plate`). Hover, links, and focus are plain DOM — the canvas is
   `pointer-events-none`, so nothing about accessibility is traded away.
3. **WebGL mirrors the DOM.** A single fixed fullscreen canvas
   ([CanvasRoot.tsx](src/components/webgl/CanvasRoot.tsx)) holds one textured plane per
   placeholder. The camera is set so **1 world unit = 1 CSS pixel**, and every frame each
   plane copies its placeholder's rect.

Placeholders register themselves through
[registry.ts](src/components/webgl/registry.ts) (`useTrack`), which the canvas reads via
`useSyncExternalStore`. Adding a WebGL-backed image anywhere is one hook call.

### The shader

[ImagePlane.tsx](src/components/webgl/ImagePlane.tsx):

- **Vertex** — elastic bend on the z axis, scaled by scroll velocity, so plates lag
  behind fast scrolling and settle when it stops.
- **Fragment** — `cover()` UV fit, RGB split proportional to velocity, desaturated at
  rest and full colour on hover, plus a bottom-up wipe driven by viewport entry.

Two gotchas worth remembering:

- **three clones the `uniforms` object** passed as a JSX prop. Mutating the memoized
  object does nothing — always write through `materialRef.current.uniforms`.
- A custom `ShaderMaterial` gets **no automatic colour-space conversion**, so
  `new THREE.Color('#0b0a09')` decodes to near-linear-black. Colours are passed as raw
  sRGB `Vector3`s instead.

## Adding real work images

The plates are procedurally generated ([plate-texture.ts](src/components/webgl/plate-texture.ts))
so the site is complete with zero assets. To use a real screenshot:

1. Drop it at `public/work/<id>.jpg` (4:3 reads best).
2. Set `image: "/work/<id>.jpg"` on that project in [content.ts](src/lib/content.ts).

Everything else — copy, ordering, stack chips, experience rows, numbers — lives in that
same file. No copy is hard-coded in components.

## Design tokens

[globals.css](src/app/globals.css). Ink `#0b0a09`, bone `#ede7de`, signal `#ff4d19`.
Instrument Serif (display) / Familjen Grotesk (body) / Martian Mono (meta).

Note: Tailwind v4 only emits theme variables that generated utilities reference, so the
`--font-*` aliases are restated in a `@layer base :root` block for the hand-written
classes. Removing that block silently drops the display font back to system sans.

## Motion budget

All reveals are CSS transitions toggled by one IntersectionObserver class flip
([Reveal.tsx](src/components/Reveal.tsx)) — nothing animates on the main thread during
scroll. `prefers-reduced-motion` disables Lenis, the grain drift, the marquee, and all
reveal transforms.
