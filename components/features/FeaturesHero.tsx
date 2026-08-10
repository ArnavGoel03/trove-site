"use client";

import { motion } from "motion/react";
import { PANE_COUNT } from "@/lib/panes";
import { TROVE } from "@/lib/brand";

export default function FeaturesHero() {
  return (
    <section className="relative px-6 pt-32 pb-12 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-80"
        style={{
          background:
            "radial-gradient(40% 50% at 20% 0%, rgb(var(--color-accent-rgb)/0.18), transparent 60%), radial-gradient(50% 50% at 80% 30%, rgb(var(--color-accent-rgb)/0.14), transparent 60%), radial-gradient(50% 50% at 50% 100%, rgba(76,184,255,0.08), transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface-1 backdrop-blur px-3 py-1 text-caption text-fg-dim mb-7">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.7)]" />
            v{TROVE.version} · {PANE_COUNT} panes · 11 Shortcuts intents
          </div>

          <h1 className="text-hero font-semibold bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">
            Every pane,
            <br className="hidden sm:block" /> exhaustively.
          </h1>

          <p className="mt-6 text-lead text-fg-dim max-w-2xl leading-relaxed">
            All {PANE_COUNT} panes in Trove {TROVE.version}, grouped by sidebar section:
            Clipboard, Compute, Capture, Files, System, Storage. Plus the
            macOS Shortcuts integration, the URL scheme, SHA256SUMS hash
            verification, Text Tools saved recipes, the Homebrew cask, and
            everything else the 14-beta cycle pulled into the stable release.
          </p>

          <div className="mt-7 flex flex-wrap gap-2 text-caption">
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
    <span className="rounded-full border border-line-soft bg-surface-1 px-3 py-1 text-fg-dim">
      {children}
    </span>
  );
}
