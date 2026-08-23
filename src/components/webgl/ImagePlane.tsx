"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { pointerState } from "@/lib/pointer-state";
import { scrollState } from "@/lib/scroll-state";
import { markActive } from "./activity";
import { resolveTexture } from "./plate-texture";
import type { TrackedItem } from "./registry";

const vertex = /* glsl */ `
  uniform float uVelocity;
  uniform float uHover;
  varying vec2 vUv;
  varying float vBend;

  void main() {
    vUv = uv;

    vec3 pos = position;

    // Elastic bend: the plane lags behind the scroll, arcing away from the
    // direction of travel. The centre trails further than the edges.
    float arc = sin(uv.x * 3.14159) * sin(uv.y * 3.14159);
    float bend = arc * uVelocity * 90.0;
    pos.z += bend;

    // Leans toward the camera on hover.
    pos.z += arc * uHover * 30.0;

    vBend = bend;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uVelocity;
  uniform float uHover;
  uniform float uReveal;
  uniform vec2 uPlaneSize;
  uniform vec2 uTexSize;
  uniform vec3 uInk;
  varying vec2 vUv;
  varying float vBend;

  // object-fit: cover, in UV space.
  vec2 cover(vec2 uv, vec2 plane, vec2 tex) {
    vec2 ratio = plane / tex;
    float scale = max(ratio.x, ratio.y);
    vec2 size = tex * scale;
    return (uv - 0.5) * (plane / size) + 0.5;
  }

  void main() {
    vec2 uv = cover(vUv, uPlaneSize, uTexSize);

    // Punch in slightly on hover.
    uv = (uv - 0.5) * (1.0 - uHover * 0.07) + 0.5;

    // Chromatic split driven by scroll speed.
    float split = uVelocity * 0.02 + uHover * 0.003;
    float r = texture2D(uTexture, uv + vec2(split, 0.0)).r;
    float g = texture2D(uTexture, uv).g;
    float b = texture2D(uTexture, uv - vec2(split, 0.0)).b;
    vec3 color = vec3(r, g, b);

    // Resting state is mostly desaturated; hover restores full colour.
    float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
    color = mix(vec3(luma), color, 0.45 + uHover * 0.55);

    // Curvature reads as a soft specular sweep.
    color += vBend * 0.0018;

    // Wipe in from the bottom as the plate enters the viewport.
    float edge = uReveal * 1.4;
    float wipe = smoothstep(edge - 0.3, edge, 1.0 - vUv.y);
    color = mix(color, uInk, wipe);

    gl_FragColor = vec4(color, 1.0);
  }
`;

/** Ink, in raw sRGB. A custom ShaderMaterial gets no colour-space conversion,
 *  so THREE.Color (which decodes to linear) would land near-black here. */
const INK = new THREE.Vector3(0x0b / 255, 0x0a / 255, 0x09 / 255);

/** Peak tilt toward the cursor, in radians. Deliberately small — the plane is
 *  most of the viewport, so a few degrees already reads as a large gesture. */
const TILT_Y = 0.085; // ~4.9°, horizontal cursor offset
const TILT_X = 0.055; // ~3.2°, vertical cursor offset
/** Share of the tilt that applies when the plate is not hovered. */
const TILT_REST = 0.35;

/** Hover eases in slower than it eases out. Symmetric timing reads sluggish;
 *  a fast retreat is what makes the surface feel responsive. */
const HOVER_IN = 0.32;
const HOVER_OUT = 0.2;
/** Time constant for the tilt lerp, in seconds. */
const TILT_SETTLE = 0.25;

/** Frame-rate independent easing: the fraction of the remaining distance to
 *  close this frame so that ~99.9% is covered after `seconds`. */
function easeFactor(delta: number, seconds: number) {
  return 1 - Math.pow(0.001, delta / seconds);
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function ImagePlane({ item }: { item: TrackedItem }) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const texture = useMemo(() => resolveTexture(item.project), [item.project]);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uVelocity: { value: 0 },
      uHover: { value: 0 },
      uReveal: { value: 0 },
      uPlaneSize: { value: new THREE.Vector2(1, 1) },
      uTexSize: { value: new THREE.Vector2(1200, 900) },
      uInk: { value: INK },
    }),
    [texture],
  );

  useFrame((_, delta) => {
    const m = mesh.current;
    const mat = material.current;
    if (!m || !mat) return;

    const rect = item.el.getBoundingClientRect();

    // Skip work for plates nowhere near the viewport.
    const visible = rect.bottom > -200 && rect.top < size.height + 200;
    m.visible = visible;
    if (!visible) return;

    m.position.set(
      rect.left + rect.width / 2 - size.width / 2,
      -rect.top - rect.height / 2 + size.height / 2,
      0,
    );
    m.scale.set(rect.width, rect.height, 1);

    // Read the material's own uniforms — three clones the object passed as a
    // prop, so the memo above is only ever the initial value.
    const u = mat.uniforms;
    u.uPlaneSize.value.set(rect.width, rect.height);

    // Frame-rate independent easing toward the live targets.
    u.uVelocity.value +=
      (scrollState.velocity - u.uVelocity.value) * easeFactor(delta, 1);

    const hoverTarget = item.hover.current;
    const hoverDur = hoverTarget > u.uHover.value ? HOVER_IN : HOVER_OUT;
    u.uHover.value += (hoverTarget - u.uHover.value) * easeFactor(delta, hoverDur);

    // 0 when the top edge touches the bottom of the viewport, 1 once it has
    // travelled a third of the screen upward.
    const entered = (size.height - rect.top) / (size.height * 0.34);
    const reveal = clamp(entered, 0, 1);
    const revealMoved = Math.abs(reveal - u.uReveal.value) > 0.0005;
    u.uReveal.value = reveal;

    // Tilt toward the cursor, measured from this plate's own centre so two
    // plates on screen lean by different amounts. Hovering deepens it.
    const tiltEase = easeFactor(delta, TILT_SETTLE);
    let tiltY = 0;
    let tiltX = 0;
    if (pointerState.active) {
      const cx = clamp(
        (pointerState.x - (rect.left + rect.width / 2)) / (size.width / 2),
        -1.5,
        1.5,
      );
      const cy = clamp(
        (pointerState.y - (rect.top + rect.height / 2)) / (size.height / 2),
        -1.5,
        1.5,
      );
      const depth = TILT_REST + (1 - TILT_REST) * u.uHover.value;
      tiltY = cx * TILT_Y * depth;
      tiltX = -cy * TILT_X * depth;
    }
    m.rotation.y += (tiltY - m.rotation.y) * tiltEase;
    m.rotation.x += (tiltX - m.rotation.x) * tiltEase;

    // Tell the frame driver whether this plate still has somewhere to go. When
    // every plate is settled the canvas stops rendering entirely.
    if (
      revealMoved ||
      Math.abs(u.uVelocity.value) > 0.001 ||
      Math.abs(hoverTarget - u.uHover.value) > 0.001 ||
      Math.abs(tiltY - m.rotation.y) > 0.0002 ||
      Math.abs(tiltX - m.rotation.x) > 0.0002
    ) {
      markActive();
    }
  });

  return (
    <mesh ref={mesh} frustumCulled={false}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
      />
    </mesh>
  );
}
