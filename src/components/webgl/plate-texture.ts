import * as THREE from "three";
import type { Project } from "@/lib/content";

const cache = new Map<string, THREE.Texture>();

/**
 * Generates a stand-in "plate" per project so the site is complete without
 * assets. Swap in real work by setting `image` on the project — see
 * `resolveTexture` below.
 */
function drawPlate(project: Project) {
  const w = 1200;
  const h = 900;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;

  const g = ctx.createLinearGradient(0, h, w, 0);
  g.addColorStop(0, `hsl(${project.hue} 55% 8%)`);
  g.addColorStop(0.55, `hsl(${project.hue} 62% 22%)`);
  g.addColorStop(1, `hsl(${(project.hue + 24) % 360} 78% 46%)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Hairline instrument grid.
  ctx.strokeStyle = "rgba(237,231,222,0.10)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= w; x += w / 12) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += h / 9) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Oversized index numeral, cropped by the frame on purpose.
  ctx.fillStyle = "rgba(237,231,222,0.92)";
  ctx.font = `700 ${h * 0.78}px "Familjen Grotesk", Helvetica, sans-serif`;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(project.index, w * 0.05, h * 0.95);

  ctx.fillStyle = "rgba(11,10,9,0.85)";
  ctx.font = `500 ${h * 0.045}px "Martian Mono", monospace`;
  ctx.fillText(project.title.toUpperCase(), w * 0.05, h * 0.14);
  ctx.fillText(project.year, w * 0.05, h * 0.21);

  // Film grain.
  const grain = ctx.getImageData(0, 0, w, h);
  for (let i = 0; i < grain.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 26;
    grain.data[i] += n;
    grain.data[i + 1] += n;
    grain.data[i + 2] += n;
  }
  ctx.putImageData(grain, 0, 0);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function resolveTexture(project: Project): THREE.Texture {
  const cached = cache.get(project.id);
  if (cached) return cached;

  let tex: THREE.Texture;
  if (project.image) {
    tex = new THREE.TextureLoader().load(project.image);
    tex.colorSpace = THREE.SRGBColorSpace;
  } else {
    tex = drawPlate(project);
  }
  cache.set(project.id, tex);
  return tex;
}
