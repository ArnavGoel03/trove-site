"use client";

import { motion } from "motion/react";
import { Lock, WifiOff, FileBadge2, Cpu } from "lucide-react";

const POINTS = [
  {
    icon: WifiOff,
    title: "Local-only by default",
    body: "Trove never phones home. No anonymous analytics. No \"to improve your experience.\" If a pane needs the network — say, fetching a translation — it's opt-in and labelled.",
  },
  {
    icon: Lock,
    title: "No accounts required",
    body: "There's no sign-in screen, no email gate, no license server. Download, open, use. Updates are delivered via the GitHub Releases page; the in-app checker polls the GitHub Releases API once every 6 hours.",
  },
  {
    icon: FileBadge2,
    title: "Ad-hoc signed · hardened runtime",
    body: "Currently signed ad-hoc with a hardened runtime. Apple notarization is on the near-term roadmap. The first launch requires right-click → Open to pass Gatekeeper.",
  },
  {
    icon: Cpu,
    title: "Native, not a webview",
    body: "Written in Swift / SwiftUI. One process, ~14 MB on disk, single-digit MB RAM at rest. No Chromium tab pretending to be a Mac app.",
  },
];

export default function Privacy() {
  return (
    <section id="privacy" className="relative px-6 py-32 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mb-14"
      >
        <div className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-fg-dim)] mb-4">
          Privacy &amp; native
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.02]">
          Local-only productivity.{" "}
          <span className="text-[var(--color-fg-dim)]">
            No telemetry. No accounts required.
          </span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {POINTS.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.5,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="pane rounded-2xl p-7 sm:p-8 hover:-translate-y-0.5 transition-transform"
            >
              <div className="w-10 h-10 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center mb-5">
                <Icon size={18} className="text-white/85" />
              </div>
              <div className="text-[17px] font-semibold tracking-tight mb-2">
                {p.title}
              </div>
              <div className="text-[13.5px] text-[var(--color-fg-dim)] leading-relaxed">
                {p.body}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
