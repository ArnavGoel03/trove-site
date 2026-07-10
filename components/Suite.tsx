"use client";

import { motion, useReducedMotion } from "motion/react";
import { APPS, SUITE, STUDIO } from "@/lib/brand";

// The suite listing: all apps the studio makes, unlocked by ONE subscription
// key. Everything renders from lib/brand.ts, rename an app there and this
// updates. Order is deliberate: the live flagship first, then what's next.
const ORDER = ["trove", "relay", "tend"] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

// Deterministic date format (no locale, hydration-safe): "Jul 8, 2026".
function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[(m ?? 1) - 1]} ${d}, ${y}`;
}

export default function Suite() {
  const reduced = useReducedMotion();

  return (
    <section
      id="suite"
      className="relative px-6 py-24 sm:py-28 border-t border-white/[0.06]"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="text-[12.5px] uppercase tracking-[0.18em] text-[var(--color-fg-mute)] mb-3">
            One subscription
          </p>
          <h2 className="text-[32px] sm:text-[44px] font-semibold tracking-[-0.03em] leading-[1.05] bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
            One key. Every app.
          </h2>
          <p className="mt-5 text-[15px] sm:text-[16px] text-[var(--color-fg-dim)] leading-relaxed">
            {STUDIO.name} makes private, native Mac apps that never phone home.
            A single subscription is one license key that unlocks all of them,
            on every Mac you own. {SUITE.trial}, no account required.
          </p>
        </motion.div>

        <div
          className="mt-14 grid gap-4 sm:grid-cols-3"
          style={{ perspective: "1400px" }}
        >
          {ORDER.map((k, i) => {
            const a = APPS[k];
            const live = a.status === "live";
            return (
              <motion.article
                key={a.key}
                initial={
                  reduced
                    ? { opacity: 1 }
                    : { opacity: 0, y: 28, rotateX: 10 }
                }
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
                className="relative flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-[border-color,transform] duration-300 hover:border-white/[0.14] hover:-translate-y-1"
              >
                <span
                  className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    live
                      ? "bg-emerald-500/12 text-emerald-300"
                      : "bg-white/[0.05] text-[var(--color-fg-mute)]"
                  }`}
                >
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      live ? "bg-emerald-400" : "bg-white/40"
                    }`}
                  />
                  {live ? "Available now" : "Coming soon"}
                </span>

                <h3 className="mt-4 text-[20px] font-semibold tracking-tight">
                  {a.name}
                </h3>
                <p className="mt-1 text-[13.5px] text-[var(--color-accent)]">
                  {a.tagline}
                </p>
                <p className="mt-3 text-[13.5px] text-[var(--color-fg-dim)] leading-relaxed flex-1">
                  {a.blurb}
                </p>

                <p className="mt-4 text-[11.5px] text-[var(--color-fg-mute)] font-mono tabular-nums">
                  v{a.version} &middot; {fmtDate(a.releaseDate)}
                </p>

                <div className="mt-5 text-[13px]">
                  {live ? (
                    <a
                      href={a.href}
                      className="inline-flex items-center gap-1 font-medium text-white hover:text-[var(--color-accent)] transition-colors"
                    >
                      Learn more &rarr;
                    </a>
                  ) : (
                    <a
                      href={a.href}
                      className="inline-flex items-center gap-1 font-medium text-[var(--color-fg-dim)] hover:text-white transition-colors"
                    >
                      Preview &rarr;
                    </a>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-10 text-center text-[13px] text-[var(--color-fg-mute)]">
          {SUITE.pitch} Buy once, own your tools, keep your data.
        </p>
      </div>
    </section>
  );
}
