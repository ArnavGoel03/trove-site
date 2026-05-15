"use client";

import { motion, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";
import { ArrowDownToLine, Trash2 } from "lucide-react";

const files = [
  { name: "screen-recording-2024-12-04.mov", size: "1.2 GB", age: "168 days" },
  { name: "node_modules.tar.gz", size: "486 MB", age: "92 days" },
  { name: "IMG_4421.heic", size: "12 MB", age: "73 days" },
  { name: "macOS-Sequoia.dmg", size: "14.1 GB", age: "48 days" },
  { name: "old-design-export.fig", size: "84 MB", age: "31 days" },
];

export default function SweepVisual() {
  const t = useMotionValue(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      t.set(((now - start) / 1000) % 6);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [t]);

  const reclaimed = useTransform(t, (v) => {
    const n = 15.9 * (v / 6);
    return `${n.toFixed(1)} GB`;
  });

  return (
    <div className="w-full h-full p-6 sm:p-10 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-mute)]">
            Sweep ~/Downloads
          </div>
          <div className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">
            <motion.span className="tabular-nums">{reclaimed}</motion.span>{" "}
            <span className="text-[var(--color-fg-dim)] text-base font-normal">
              to reclaim
            </span>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ff5d8f]/15 border border-[#ff5d8f]/30 px-2.5 py-1 text-[11px] text-[#ffb0c5]">
          <Trash2 size={11} />
          older than 30 days
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
        {files.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{
              duration: 0.5,
              delay: i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-3 py-2 rounded-lg border border-white/[0.04] bg-white/[0.015]"
          >
            <ArrowDownToLine
              size={13}
              className="text-[var(--color-fg-mute)]"
            />
            <div className="text-[12.5px] font-medium truncate">{f.name}</div>
            <div className="text-[11px] text-[var(--color-fg-mute)] font-mono tabular-nums">
              {f.age}
            </div>
            <div className="text-[11.5px] tabular-nums font-medium text-white/85 w-16 text-right">
              {f.size}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-[11.5px] text-[var(--color-fg-mute)]">
        Preview every file before it leaves your disk. Sweep is opt-in,
        per-file.
      </div>
    </div>
  );
}
