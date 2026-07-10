"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { PANES as ALL_PANES, type Pane } from "@/lib/panes";

// Drive the mockup grid from the shared panes registry so adding /
// renaming a pane on the macOS side only needs one site edit.
const SECTION_TO_GROUP: Record<Pane["section"], string> = {
  Clipboard: "clip",
  Compute: "compute",
  Capture: "capture",
  Files: "files",
  System: "sys",
  Storage: "storage",
  App: "app",
  Profile: "profile",
};

const PANES = ALL_PANES.map((p) => ({
  icon: p.icon,
  label: p.name,
  group: SECTION_TO_GROUP[p.section],
}));

// Uniform subtle red tint drawn from the central accent token (no rainbow
// category colors, no red/blue clash): cohesive and on-brand. `accent` is the
// Tailwind color from --color-accent in globals.css, itself mirroring
// suite.config.json brand.accent, so this tracks the one red everywhere.
const TILE_TINT = "from-accent/15 to-transparent";
const GROUP_COLORS: Record<string, string> = {
  clip: TILE_TINT,
  compute: TILE_TINT,
  capture: TILE_TINT,
  files: TILE_TINT,
  sys: TILE_TINT,
  storage: TILE_TINT,
  app: TILE_TINT,
  profile: TILE_TINT,
};

export default function AppMockup({
  className = "",
}: {
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  // Parallax tilt: single rAF-throttled mousemove handler that writes
  // the transform directly to the element, no motion-value chain,
  // no springs sampling per frame, no React state.
  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    let targetX = 0.5;
    let targetY = 0.5;
    let curX = 0.5;
    let curY = 0.5;
    let rafId = 0;
    let pending = false;

    function applyTransform() {
      // curX / curY are clamped to [0,1] in onMove, so the tilt stays in a
      // subtle, premium range no matter where the cursor is on the page.
      // rotX: [0,1] -> [4,-4]   rotY: [0,1] -> [-5, 5]
      const rotX = 4 + curY * -8;
      const rotY = -5 + curX * 10;
      el!.style.transform = `perspective(1400px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    }

    function loop() {
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      applyTransform();
      if (
        Math.abs(targetX - curX) > 0.001 ||
        Math.abs(targetY - curY) > 0.001
      ) {
        rafId = requestAnimationFrame(loop);
      } else {
        pending = false;
      }
    }

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width;
      targetY = (e.clientY - rect.top) / rect.height;
      if (!pending) {
        pending = true;
        rafId = requestAnimationFrame(loop);
      }
    }

    applyTransform();
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [reduced]);

  return (
    <div
      ref={ref}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className={`relative ${className}`}
    >
      <div className="pane rounded-2xl shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)] overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/30">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="text-[11px] text-[var(--color-fg-mute)] font-mono tracking-tight">
            Trove
          </div>
          <div className="w-12" />
        </div>

        {/* Pane grid */}
        <div className="p-4 sm:p-6 bg-gradient-to-br from-[#0c0c10] to-[#08080b]">
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2.5">
            {PANES.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={`${p.label}-${i}`}
                  initial={{ opacity: 0, scale: 0.9, y: 6 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{
                    duration: 0.4,
                    delay: 0.02 * i,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className={`group relative aspect-square rounded-xl bg-gradient-to-br ${GROUP_COLORS[p.group]} bg-white/[0.02] border border-white/[0.06] flex flex-col items-center justify-center gap-1.5 cursor-default`}
                >
                  <Icon
                    size={18}
                    className="text-white/85 group-hover:text-white transition-colors"
                  />
                  <span className="text-[10.5px] sm:text-[11px] text-[var(--color-fg-dim)] text-center leading-tight px-1 truncate max-w-full">
                    {p.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Glow */}
      <div
        className="absolute -inset-20 -z-10 opacity-60 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 30%, rgb(var(--color-accent-rgb)/0.25), transparent 70%), radial-gradient(50% 50% at 70% 70%, rgb(var(--color-accent-rgb)/0.22), transparent 70%)",
        }}
      />
    </div>
  );
}
