"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function ThermalsVisual() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();

  const t = useMotionValue(0);

  // Only animate when the visual is on screen. Off-screen sections
  // were burning a rAF tick each frame even though nothing was
  // visible — multiply that by 5 visuals and you get permanent
  // main-thread load.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { rootMargin: "100px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      t.set((now - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, t]);

  const gpuTemp = useTransform(t, (v) => Math.round(62 + Math.sin(v * 0.9) * 6));
  const cpuTemp = useTransform(t, (v) => Math.round(54 + Math.sin(v * 1.4) * 4));
  const fan = useTransform(t, (v) => Math.round(2200 + Math.sin(v) * 250));

  const pathD = useTransform(t, (v) => {
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const x = (i / 40) * 100;
      const y =
        50 -
        Math.sin((i + v * 8) * 0.35) * 18 -
        Math.cos((i + v * 4) * 0.7) * 6;
      pts.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
    }
    return pts.join(" ");
  });

  const filledPath = useTransform(pathD, (d) => `${d} L 100 60 L 0 60 Z`);

  const tempSpring = useSpring(gpuTemp, { stiffness: 80, damping: 14 });
  // Format motion values to one decimal — without this they render full
  // floating-point precision ("63.289727933796...") because <span>{motionValue}</span>
  // serialises the raw number, not the displayed string.
  const tempLabel = useTransform(tempSpring, (v) => v.toFixed(1));
  const cpuLabel = useTransform(cpuTemp, (v) => v.toFixed(1));
  const fanLabel = useTransform(fan, (v) => Math.round(v).toLocaleString());

  return (
    <div
      ref={rootRef}
      className="w-full h-full p-6 sm:p-10 flex flex-col gap-5 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(255,93,143,0.12),transparent_60%)]"
    >
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-mute)]">
            GPU Temperature
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <motion.span className="text-5xl sm:text-6xl font-semibold tabular-nums tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              {tempLabel}
            </motion.span>
            <span className="text-xl text-[var(--color-fg-dim)]">°C</span>
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-2 text-[11px] text-[var(--color-fg-dim)]">
          <div>
            CPU{" "}
            <motion.span className="tabular-nums text-white font-medium">
              {cpuLabel}
            </motion.span>
            °C
          </div>
          <div>
            Fan{" "}
            <motion.span className="tabular-nums text-white font-medium">
              {fanLabel}
            </motion.span>{" "}
            rpm
          </div>
          <div className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
            <span className="text-emerald-300/90">nominal</span>
          </div>
        </div>
      </div>

      <div className="relative flex-1 rounded-xl border border-white/[0.06] bg-black/30 overflow-hidden">
        <svg
          viewBox="0 0 100 60"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff5d8f" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ff5d8f" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[12, 24, 36, 48].map((y) => (
            <line
              key={y}
              x1={0}
              x2={100}
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="0.2"
            />
          ))}
          <motion.path d={pathD} fill="none" stroke="#ff8aae" strokeWidth="0.5" />
          <motion.path d={filledPath} fill="url(#grad)" />
        </svg>
        <div className="absolute bottom-2 left-3 text-[10px] font-mono text-[var(--color-fg-mute)]">
          last 60s · sampled via private HID
        </div>
      </div>
    </div>
  );
}
