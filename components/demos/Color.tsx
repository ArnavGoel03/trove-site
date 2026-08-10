"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Shell from "./Shell";

const W = 320;
const H = 120;

interface Picked {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

function hex({ r, g, b }: Picked): string {
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

/** Standard HSL conversion, kept here because it is four lines and one import. */
function hsl({ r, g, b }: Picked): string {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  return `hsl(${h} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`;
}

/**
 * A real eyedropper over real pixels.
 *
 * The canvas is painted once, then every reading is a `getImageData` of a
 * single pixel at the cursor. That is the same operation the app performs over
 * a screen capture, minus the capture: a browser tab cannot read the desktop,
 * and pretending otherwise with a fake screenshot would be the one dishonest
 * thing on this page.
 *
 * Keyboard reachable: the canvas takes focus and the arrow keys move the
 * crosshair a pixel at a time, ten with shift. An eyedropper that only works
 * with a mouse is an eyedropper half the readers cannot try.
 */
export default function Color() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pos, setPos] = useState({ x: Math.round(W * 0.28), y: Math.round(H * 0.45) });
  const [picked, setPicked] = useState<Picked>({ r: 0, g: 0, b: 0 });

  const read = useCallback((x: number, y: number) => {
    const ctx = canvasRef.current?.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const d = ctx.getImageData(x, y, 1, 1).data;
    setPicked({ r: d[0], g: d[1], b: d[2] });
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    // Hue sweep horizontally, lightness vertically. A gradient a reader can
    // aim at, rather than a photograph that would need a network request.
    for (let x = 0; x < W; x++) {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      const hue = (x / W) * 360;
      grad.addColorStop(0, `hsl(${hue} 90% 72%)`);
      grad.addColorStop(0.5, `hsl(${hue} 85% 46%)`);
      grad.addColorStop(1, `hsl(${hue} 60% 12%)`);
      ctx.fillStyle = grad;
      ctx.fillRect(x, 0, 1, H);
    }
    read(pos.x, pos.y);
    // Paint once. `pos` is intentionally not a dependency: re-running this
    // would repaint the whole canvas on every arrow key press.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [read]);

  function move(x: number, y: number) {
    const nx = Math.max(0, Math.min(W - 1, Math.round(x)));
    const ny = Math.max(0, Math.min(H - 1, Math.round(y)));
    setPos({ x: nx, y: ny });
    read(nx, ny);
  }

  function fromPointer(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    move(((e.clientX - rect.left) / rect.width) * W, ((e.clientY - rect.top) / rect.height) * H);
  }

  function onKey(e: React.KeyboardEvent) {
    const step = e.shiftKey ? 10 : 1;
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const d = delta[e.key];
    if (!d) return;
    e.preventDefault();
    move(pos.x + d[0], pos.y + d[1]);
  }

  return (
    <Shell
      title="Colour"
      href="/pane/color"
      hint="Drag or use the arrow keys. Every reading is a real pixel out of this canvas."
    >
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          tabIndex={0}
          role="application"
          aria-label="Colour field. Arrow keys move the picker."
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            fromPointer(e);
          }}
          onPointerMove={(e) => {
            if (e.buttons === 1) fromPointer(e);
          }}
          onKeyDown={onKey}
          className="w-full cursor-crosshair rounded-md border border-line-soft outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        />
        <span
          aria-hidden="true"
          // Pure white, not the fg token: this ring sits on top of whatever
          // colour the user is hovering, so it wants maximum contrast rather
          // than the page's slightly-warm foreground.
          className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.6)]"
          style={{ left: `${(pos.x / W) * 100}%`, top: `${(pos.y / H) * 100}%` }}
        />
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="size-9 shrink-0 rounded-md border border-line-strong"
          style={{ background: hex(picked) }}
        />
        <output className="font-mono text-caption text-fg-dim" aria-live="polite">
          <span className="text-fg">{hex(picked)}</span>
          {"  "}
          rgb({picked.r} {picked.g} {picked.b}){"  "}
          {hsl(picked)}
        </output>
      </div>
    </Shell>
  );
}
