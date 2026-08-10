import { CanvasTexture, LinearFilter, SRGBColorSpace, type Texture } from "three";

/**
 * Window faces, drawn at runtime into a 2D canvas.
 *
 * Ten rival windows means ten labels, and the labels have to be the actual
 * product names from lib/rivals.ts or the whole receipt argument is undercut by
 * a scene showing invented apps. Baking ten PNGs would put the names in two
 * places and guarantee they drift the first time a price is re-checked and an
 * entry is swapped out; drawing them means the scene reads the same array the
 * ledger does.
 *
 * Canvas text also renders at whatever DPI the device has, costs one draw at
 * mount, and needs no font file on the critical path: these are drawn in the
 * system UI stack, which is already resident.
 */

const W = 512;
const H = 320;

function rounded(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function finish(canvas: HTMLCanvasElement): Texture {
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  // No mipmaps: these planes are always roughly screen-sized, mipmapping them
  // costs memory and blurs the title text at exactly the distance it is read.
  tex.generateMipmaps = false;
  tex.minFilter = LinearFilter;
  tex.magFilter = LinearFilter;
  return tex;
}

function base(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } | null {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  return ctx ? { canvas, ctx } : null;
}

/**
 * A soft radial falloff, used as the accent glow behind the hero window.
 *
 * A texture rather than a light: the windows are unlit materials, so a real
 * light would have nothing to illuminate. This is drawn once, blended
 * additively, and faded by `moodAt().rim`, which costs one transparent quad and
 * behaves identically on every GPU.
 */
export function glowTexture(color: string): Texture | null {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, color);
  grad.addColorStop(0.35, color);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  return finish(canvas);
}

/** A minor window: chrome, a title, and a suggestion of content. */
export function rivalTexture(title: string, subtitle: string): Texture | null {
  const made = base();
  if (!made) return null;
  const { canvas, ctx } = made;

  ctx.clearRect(0, 0, W, H);
  rounded(ctx, 4, 4, W - 8, H - 8, 18);
  ctx.fillStyle = "#131318";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Title bar
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fillRect(6, 6, W - 12, 44);
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(30 + i * 20, 28, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "600 22px -apple-system, system-ui, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(title, 104, 29);

  ctx.fillStyle = "rgba(255,255,255,0.38)";
  ctx.font = "400 18px -apple-system, system-ui, sans-serif";
  ctx.fillText(subtitle.slice(0, 46), 28, 86);

  // Content suggestion. Deterministic bar widths, because a scrubbed scene
  // that reshuffles its own furniture when you scroll back up is a bug.
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.1 - i * 0.008})`;
    ctx.fillRect(28, 118 + i * 28, 180 + ((i * 53) % 260), 12);
  }

  return finish(canvas);
}

/**
 * The hero window: a real sidebar with real section names, because this is the
 * thing the page is selling and a blurred rectangle would be selling nothing.
 */
export function heroTexture(
  appName: string,
  sections: readonly string[],
  accent: string,
  activeIndex: number,
): Texture | null {
  const made = base();
  if (!made) return null;
  const { canvas, ctx } = made;

  ctx.clearRect(0, 0, W, H);
  rounded(ctx, 4, 4, W - 8, H - 8, 20);
  ctx.fillStyle = "#0d0d11";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fillRect(6, 6, W - 12, 40);
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(28, 26, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  for (let i = 1; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(28 + i * 20, 26, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "600 18px -apple-system, system-ui, sans-serif";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(appName, W / 2, 26);
  ctx.textAlign = "left";

  // Sidebar
  ctx.fillStyle = "rgba(255,255,255,0.03)";
  ctx.fillRect(6, 46, 168, H - 52);
  sections.slice(0, 8).forEach((name, i) => {
    const y = 62 + i * 30;
    if (i === activeIndex) {
      rounded(ctx, 14, y - 2, 150, 26, 8);
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.22;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = `rgba(255,255,255,${i === activeIndex ? 0.85 : 0.42})`;
    ctx.font = "500 16px -apple-system, system-ui, sans-serif";
    ctx.fillText(name, 26, y + 11);
  });

  // Detail: two cards, the house layout.
  rounded(ctx, 190, 62, W - 214, 104, 12);
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fill();
  rounded(ctx, 190, 180, W - 214, 118, 12);
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fill();
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.24 - i * 0.06})`;
    ctx.fillRect(212, 84 + i * 26, 210 - i * 42, 10);
  }

  return finish(canvas);
}
