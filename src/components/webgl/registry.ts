"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import type { Project } from "@/lib/content";

export type TrackedItem = {
  id: string;
  el: HTMLElement;
  project: Project;
  /** Hover intent, written by DOM listeners, read by the shader every frame. */
  hover: { current: number };
};

const items = new Map<string, TrackedItem>();
const listeners = new Set<() => void>();
let snapshot: TrackedItem[] = [];

function emit() {
  snapshot = Array.from(items.values());
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

/** Canvas side: the list of DOM nodes that currently want a WebGL plane. */
export function useTrackedItems() {
  return useSyncExternalStore(subscribe, getSnapshot, () => snapshot);
}

/**
 * DOM side: attach the returned ref to the placeholder element. The canvas
 * mirrors that element's rect every frame, so layout stays a pure CSS concern.
 */
export function useTrack(project: Project) {
  const hover = useRef({ current: 0 });

  const ref = useCallback(
    (el: HTMLElement | null) => {
      if (el) {
        items.set(project.id, { id: project.id, el, project, hover: hover.current });
      } else {
        items.delete(project.id);
      }
      emit();
    },
    [project],
  );

  useEffect(() => () => void items.delete(project.id), [project.id]);

  return { ref, hover: hover.current };
}
