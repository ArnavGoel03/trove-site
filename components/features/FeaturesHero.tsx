"use client";

import { motion } from "motion/react";
import { PANE_COUNT } from "@/lib/panes";

export default function FeaturesHero() {
  return (
    <section className="relative px-6 pt-32 pb-12 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-80"
        style={{
          background:
            "radial-gradient(40% 50% at 20% 0%, rgba(225,6,0,0.18), transparent 60%), radial-gradient(50% 50% at 80% 30%, rgba(225,6,0,0.14), transparent 60%), radial-gradient(50% 50% at 50% 100%, rgba(76,184,255,0.08), transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] backdrop-blur px-3 py-1 text-[12px] text-[var(--color-fg-dim)] mb-7">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.7)]" />
            v1.11.2 · {PANE_COUNT} panes · 11 Shortcuts intents
          </div>

          <h1 className="text-[44px] sm:text-[60px] md:text-[76px] leading-[0.98] font-semibold tracking-[-0.04em] bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">
            Every pane,
            <br className="hidden sm:block" /> exhaustively.
          </h1>

          <p className="mt-6 text-[16px] sm:text-[18px] text-[var(--color-fg-dim)] max-w-2xl leading-relaxed">
            All {PANE_COUNT} panes in Trove 1.11.2, grouped by sidebar section:
            Clipboard, Compute, Capture, Files, System, Storage. Plus the
            macOS Shortcuts integration, the URL scheme, SHA256SUMS hash
            verification, Text Tools saved recipes, the Homebrew cask, and
            everything else the 14-beta cycle pulled into the stable release.
          </p>

          <div className="mt-7 flex flex-wrap gap-2 text-[12px]">
            <Chip>{PANE_COUNT} panes</Chip>
            <Chip>11 Shortcuts intents</Chip>
            <Chip>5 URL-scheme verbs</Chip>
            <Chip>Sub-500 ms cold launch</Chip>
            <Chip>~14 MB on disk</Chip>
            <Chip>Stable + beta channels</Chip>
            <Chip>Homebrew cask</Chip>
            <Chip>XDG ~/.config/trove</Chip>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[var(--color-fg-dim)]">
      {children}
    </span>
  );
}
