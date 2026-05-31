"use client";

import { motion } from "motion/react";
import { CAPABILITIES } from "@/lib/panes";

// The 12 power-user capabilities introduced in v1.1.0 — Shortcuts,
// URL scheme, chord HUD, cross-pane data flow, SHA256SUMS, saved
// recipes, history regex+dedup, channels, Homebrew, XDG, perf,
// crash discipline.
export default function CapabilityList() {
  return (
    <section
      id="capabilities"
      className="relative px-6 py-24 max-w-7xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mb-14"
      >
        <div className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-fg-mute)] mb-4">
          Power-user surface · 1.1.0
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-[56px] font-semibold tracking-[-0.03em] leading-[1.02]">
          The headline upgrades{" "}
          <span className="text-[var(--color-fg-dim)]">
            that landed across the 14-beta cycle.
          </span>
        </h2>
        <p className="mt-5 text-[15px] text-[var(--color-fg-dim)] max-w-2xl leading-relaxed">
          Stable users arriving from 1.0.7 get everything below in a single
          update. The per-beta history is preserved in the changelog if you
          need it.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {CAPABILITIES.map((cap, i) => {
          const Icon = cap.icon;
          return (
            <motion.article
              key={cap.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.5,
                delay: (i % 2) * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="pane rounded-2xl p-7 sm:p-8 relative overflow-hidden"
            >
              <div
                aria-hidden
                className="absolute -inset-20 -z-10 opacity-30 blur-3xl pointer-events-none"
                style={{
                  background: `radial-gradient(40% 40% at 80% 0%, ${cap.accent}44, transparent 70%)`,
                }}
              />

              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center shrink-0"
                  style={{ boxShadow: `inset 0 0 0 1px ${cap.accent}33` }}
                >
                  <Icon size={18} className="text-white/90" />
                </div>
                <div className="min-w-0">
                  <div
                    className="text-[11.5px] uppercase tracking-[0.18em] mb-2"
                    style={{ color: cap.accent }}
                  >
                    {cap.eyebrow}
                  </div>
                  <h3 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] text-white leading-snug">
                    {cap.title}
                  </h3>
                </div>
              </div>

              <p className="mt-5 text-[14px] text-[var(--color-fg-dim)] leading-relaxed">
                {cap.body}
              </p>

              <ul className="mt-5 space-y-2 text-[13px]">
                {cap.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <span
                      aria-hidden
                      className="mt-2 inline-block w-1 h-1 rounded-full shrink-0"
                      style={{ background: cap.accent }}
                    />
                    <span className="text-[var(--color-fg-dim)]">{b}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
