"use client";

import { motion } from "motion/react";
import { CAPABILITIES } from "@/lib/panes";
import { TROVE } from "@/lib/brand";
import { useReveal } from "@/lib/reveal";

// The 12 power-user capabilities introduced in v1.11.2, Shortcuts,
// URL scheme, chord HUD, cross-pane data flow, SHA256SUMS, saved
// recipes, history regex+dedup, channels, Homebrew, XDG, perf,
// crash discipline.
export default function CapabilityList() {
  const rise = useReveal();
  return (
    <section
      id="capabilities"
      className="relative px-6 py-24 max-w-7xl mx-auto"
    >
      <motion.div
        {...rise()}
        className="max-w-3xl mb-14"
      >
        <div className="text-micro uppercase tracking-[0.2em] text-fg-mute mb-4">
          Power-user surface · {TROVE.version}
        </div>
        <h2 className="text-display font-semibold">
          The headline upgrades{" "}
          <span className="text-fg-dim">
            that landed across the 14-beta cycle.
          </span>
        </h2>
        <p className="mt-5 text-body text-fg-dim max-w-2xl leading-relaxed">
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
              {...rise({
                y: 24,
                margin: "-10%",
                duration: 0.5,
                delay: (i % 2) * 0.05,
              })}
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
                  className="w-10 h-10 rounded-xl border border-line-soft bg-surface-1 flex items-center justify-center shrink-0"
                  style={{ boxShadow: `inset 0 0 0 1px ${cap.accent}33` }}
                >
                  <Icon size={18} className="text-white/90" />
                </div>
                <div className="min-w-0">
                  <div
                    className="text-micro uppercase mb-2"
                    style={{ color: cap.accent }}
                  >
                    {cap.eyebrow}
                  </div>
                  <h3 className="text-lead font-semibold text-white leading-snug">
                    {cap.title}
                  </h3>
                </div>
              </div>

              <p className="mt-5 text-caption text-fg-dim leading-relaxed">
                {cap.body}
              </p>

              <ul className="mt-5 space-y-2 text-caption">
                {cap.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <span
                      aria-hidden
                      className="mt-2 inline-block w-1 h-1 rounded-full shrink-0"
                      style={{ background: cap.accent }}
                    />
                    <span className="text-fg-dim">{b}</span>
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
