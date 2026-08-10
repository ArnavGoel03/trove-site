import { TROVE } from "@/lib/brand";

/**
 * The first frame, drawn without a renderer.
 *
 * This is what paints on the first byte, what a reader with no WebGL keeps for
 * the whole page, and what sits under the canvas while three.js is still on the
 * wire. It is deliberately the same composition as the scene's opening pose: a
 * single window, lit from above and behind, sitting on a dark floor. If the
 * handoff is done right nobody sees it happen.
 *
 * Pure CSS and inline SVG. No image request, nothing to lazy-load, nothing that
 * can 404 on a bad connection and leave a hole where the hero should be.
 */
export default function Poster() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-bg">
      {/* Room light. Two soft sources, one warm accent low and behind the
          subject, so the window reads as an object in a space rather than a
          rectangle on a background. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, color-mix(in oklab, var(--color-accent) 14%, transparent) 0%, transparent 60%)," +
            "radial-gradient(90% 60% at 50% 115%, color-mix(in oklab, var(--color-accent) 10%, transparent) 0%, transparent 55%)",
        }}
      />

      {/* Floor. A single horizon line does more for depth than any amount of
          gradient, so there is one, and it is faint. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[38%]"
        style={{
          background:
            "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--color-surface-3) 70%, transparent))",
          borderTop: "1px solid var(--color-line-soft)",
        }}
      />

      <div className="absolute inset-0 grid place-items-center">
        <svg
          viewBox="0 0 640 400"
          role="img"
          aria-label={`${TROVE.name}, a single window on a dark desktop`}
          className="w-[min(78vw,46rem)] drop-shadow-[0_40px_80px_rgba(0,0,0,0.55)]"
        >
          <defs>
            <linearGradient id="poster-glass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-surface-3)" />
              <stop offset="100%" stopColor="var(--color-surface-2)" />
            </linearGradient>
            <linearGradient id="poster-edge" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--color-line-strong)" />
              <stop offset="55%" stopColor="var(--color-line-soft)" />
              <stop offset="100%" stopColor="var(--color-line-strong)" />
            </linearGradient>
          </defs>

          <rect
            x="8"
            y="8"
            width="624"
            height="384"
            rx="18"
            fill="url(#poster-glass)"
            stroke="url(#poster-edge)"
            strokeWidth="1.5"
          />

          {/* Title bar */}
          <line
            x1="8"
            y1="46"
            x2="632"
            y2="46"
            stroke="var(--color-line-soft)"
            strokeWidth="1"
          />
          <circle cx="34" cy="27" r="5.5" fill="var(--color-accent)" opacity="0.85" />
          <circle cx="54" cy="27" r="5.5" fill="var(--color-line-strong)" />
          <circle cx="74" cy="27" r="5.5" fill="var(--color-line-strong)" />

          {/* Sidebar: one list, which is the whole product in one glance. */}
          <line
            x1="196"
            y1="46"
            x2="196"
            y2="392"
            stroke="var(--color-line-soft)"
            strokeWidth="1"
          />
          {Array.from({ length: 9 }, (_, i) => (
            <g key={i}>
              <rect
                x="28"
                y={72 + i * 34}
                width="14"
                height="14"
                rx="4"
                fill="var(--color-line-strong)"
              />
              <rect
                x="52"
                y={75 + i * 34}
                width={i === 3 ? 104 : 76 + ((i * 17) % 46)}
                height="8"
                rx="4"
                fill="var(--color-line-strong)"
                opacity={i === 3 ? 0.9 : 0.45}
              />
            </g>
          ))}
          <rect
            x="18"
            y="166"
            width="164"
            height="30"
            rx="8"
            fill="var(--color-accent)"
            opacity="0.16"
          />

          {/* Detail pane: a card, a couple of rows, nothing legible. The point
              is the shape of a native app, not a screenshot. */}
          <rect
            x="220"
            y="72"
            width="392"
            height="120"
            rx="12"
            fill="var(--color-surface-3)"
            stroke="var(--color-line-soft)"
          />
          <rect
            x="220"
            y="212"
            width="392"
            height="160"
            rx="12"
            fill="var(--color-surface-3)"
            stroke="var(--color-line-soft)"
          />
          {Array.from({ length: 4 }, (_, i) => (
            <rect
              key={i}
              x="242"
              y={100 + i * 22}
              width={i === 0 ? 150 : 250 - ((i * 41) % 90)}
              height="8"
              rx="4"
              fill="var(--color-line-strong)"
              opacity={i === 0 ? 0.8 : 0.4}
            />
          ))}
        </svg>
      </div>

      {/* Vignette, last, so it darkens everything including the subject's
          corners. Without it the window's edges compete with the copy. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(100% 70% at 50% 45%, transparent 40%, color-mix(in oklab, var(--color-bg) 85%, transparent) 100%)",
        }}
      />
    </div>
  );
}
