"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect } from "react";
import * as THREE from "three";
import { isActive, markActive } from "./activity";
import { ImagePlane } from "./ImagePlane";
import { useTrackedItems } from "./registry";

/** Distance from camera to the z=0 plane, where 1 world unit === 1 CSS pixel. */
const CAMERA_Z = 620;

function PixelPerfectCamera() {
  const { camera, size } = useThree();

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.z = CAMERA_Z;
    cam.fov = 2 * Math.atan(size.height / 2 / CAMERA_Z) * (180 / Math.PI);
    cam.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

/**
 * The canvas runs on demand, not on a permanent RAF. This keeps it alive while
 * anything is still easing, and wakes it on the events that can start motion.
 * A fully settled page costs zero GPU frames.
 */
function FrameDriver() {
  const invalidate = useThree((s) => s.invalidate);

  useFrame(() => {
    if (isActive()) invalidate();
  });

  useEffect(() => {
    const wake = () => {
      markActive();
      invalidate();
    };

    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("pointermove", wake, { passive: true });
    window.addEventListener("resize", wake);

    // Layout is not final until fonts have swapped — the plates would otherwise
    // hold whatever rect they measured on the very first frame.
    document.fonts?.ready.then(wake);
    const raf = requestAnimationFrame(wake);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("pointermove", wake);
      window.removeEventListener("resize", wake);
    };
  }, [invalidate]);

  return null;
}

function Planes() {
  const items = useTrackedItems();
  return (
    <>
      {items.map((item) => (
        <ImagePlane key={item.id} item={item} />
      ))}
    </>
  );
}

export function CanvasRoot() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      <Canvas
        frameloop="demand"
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, CAMERA_Z], near: 1, far: 4000 }}
        onCreated={() => document.documentElement.classList.add("webgl-ready")}
      >
        <PixelPerfectCamera />
        <Planes />
        <FrameDriver />
      </Canvas>
    </div>
  );
}
