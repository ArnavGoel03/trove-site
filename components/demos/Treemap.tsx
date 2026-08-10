"use client";

import { useMemo, useState } from "react";
import Shell from "./Shell";

/**
 * Clearly labelled sample data.
 *
 * A browser tab cannot read your disk, and inventing a plausible-looking scan
 * of "your" Mac would be a lie the rest of the page cannot afford. So this is
 * one ordinary developer's home directory, said out loud, and the thing being
 * demonstrated is the layout algorithm, which is the part that is identical in
 * the app.
 */
const SAMPLE: readonly { name: string; bytes: number }[] = [
  { name: "Xcode", bytes: 41_200_000_000 },
  { name: "node_modules", bytes: 18_900_000_000 },
  { name: "Photos Library", bytes: 12_400_000_000 },
  { name: "Simulators", bytes: 9_600_000_000 },
  { name: "Downloads", bytes: 6_100_000_000 },
  { name: "Docker", bytes: 4_800_000_000 },
  { name: "Mail", bytes: 2_300_000_000 },
  { name: "Music", bytes: 1_700_000_000 },
  { name: "Caches", bytes: 1_250_000_000 },
  { name: "Documents", bytes: 820_000_000 },
];

interface Tile {
  readonly name: string;
  readonly bytes: number;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Worst aspect ratio in a row, the quantity squarified layout minimises. */
function worst(row: readonly number[], side: number, scale: number): number {
  const sum = row.reduce((s, v) => s + v, 0) * scale;
  const max = Math.max(...row) * scale;
  const min = Math.min(...row) * scale;
  if (sum === 0 || side === 0) return Infinity;
  return Math.max((side * side * max) / (sum * sum), (sum * sum) / (side * side * min));
}

/**
 * Squarified treemap, Bruls, Huizing and van Wijk.
 *
 * The naive slice-and-dice layout produces slivers: a 40GB folder rendered as
 * a 4px wide strip is technically proportional and completely useless. This
 * packs each row so the tiles stay as close to square as the numbers allow,
 * which is what makes the picture answerable at a glance.
 */
function squarify(values: readonly { name: string; bytes: number }[], area: Rect): Tile[] {
  const total = values.reduce((s, v) => s + v.bytes, 0);
  if (total === 0 || values.length === 0) return [];

  const out: Tile[] = [];
  const remaining = [...values].sort((a, b) => b.bytes - a.bytes);
  let rect: Rect = { ...area };
  let scale = (rect.w * rect.h) / total;
  let row: typeof remaining = [];

  const layoutRow = () => {
    const side = Math.min(rect.w, rect.h);
    const rowSum = row.reduce((s, v) => s + v.bytes, 0) * scale;
    const thickness = side === 0 ? 0 : rowSum / side;
    let offset = 0;

    for (const item of row) {
      const length = rowSum === 0 ? 0 : ((item.bytes * scale) / rowSum) * side;
      out.push(
        rect.w >= rect.h
          ? { ...item, x: rect.x, y: rect.y + offset, w: thickness, h: length }
          : { ...item, x: rect.x + offset, y: rect.y, w: length, h: thickness },
      );
      offset += length;
    }

    rect =
      rect.w >= rect.h
        ? { x: rect.x + thickness, y: rect.y, w: rect.w - thickness, h: rect.h }
        : { x: rect.x, y: rect.y + thickness, w: rect.w, h: rect.h - thickness };
    row = [];
  };

  while (remaining.length > 0) {
    const next = remaining[0];
    const side = Math.min(rect.w, rect.h);
    const current = row.map((v) => v.bytes);
    const widened = [...current, next.bytes];

    if (row.length === 0 || worst(widened, side, scale) <= worst(current, side, scale)) {
      row.push(next);
      remaining.shift();
    } else {
      layoutRow();
      // The scale is per-rectangle: after a row is placed, the leftover area
      // must be shared out among what is left, not among the original total.
      const left = remaining.reduce((s, v) => s + v.bytes, 0);
      scale = left === 0 ? 0 : (rect.w * rect.h) / left;
    }
  }
  if (row.length > 0) layoutRow();
  return out;
}

function gb(bytes: number): string {
  return `${(bytes / 1e9).toFixed(bytes < 1e9 ? 2 : 1)} GB`;
}

export default function Treemap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const tiles = useMemo(() => squarify(SAMPLE, { x: 0, y: 0, w: 100, h: 60 }), []);
  const total = SAMPLE.reduce((s, v) => s + v.bytes, 0);
  const shown = hovered ? SAMPLE.find((s) => s.name === hovered) : null;

  return (
    <Shell
      title="Disk treemap"
      href="/pane/treemap"
      hint={
        shown
          ? `${shown.name}: ${gb(shown.bytes)}, ${Math.round((shown.bytes / total) * 100)}% of ${gb(total)}.`
          : `${gb(total)} across ${SAMPLE.length} folders. Sample data, laid out by the real algorithm.`
      }
    >
      <svg
        viewBox="0 0 100 60"
        role="img"
        aria-label={`Treemap of ${SAMPLE.length} folders totalling ${gb(total)}`}
        className="w-full rounded-md border border-line-soft bg-surface-1"
      >
        {tiles.map((t) => {
          const share = t.bytes / total;
          const isHot = hovered === t.name;
          return (
            <g
              key={t.name}
              tabIndex={0}
              role="button"
              aria-label={`${t.name}, ${gb(t.bytes)}`}
              onMouseEnter={() => setHovered(t.name)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(t.name)}
              onBlur={() => setHovered(null)}
              className="outline-none"
            >
              <rect
                x={t.x + 0.25}
                y={t.y + 0.25}
                width={Math.max(0, t.w - 0.5)}
                height={Math.max(0, t.h - 0.5)}
                rx="0.8"
                fill="var(--color-accent)"
                fillOpacity={0.14 + share * 0.9}
                stroke={isHot ? "var(--color-fg)" : "var(--color-line-strong)"}
                strokeWidth={isHot ? 0.4 : 0.2}
              />
              {t.w > 13 && t.h > 6 ? (
                <text
                  x={t.x + 1.4}
                  y={t.y + 4.2}
                  fill="var(--color-fg)"
                  fontSize="2.6"
                  className="font-sans"
                >
                  {t.name}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </Shell>
  );
}
