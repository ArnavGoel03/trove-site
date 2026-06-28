"use client";

import { motion } from "motion/react";
import DownloadButton from "./DownloadButton";

const SPECS = [
  { label: "macOS", value: "13 Ventura or later" },
  { label: "Architecture", value: "Apple Silicon + Intel" },
  { label: "Disk", value: "~14 MB" },
  { label: "Memory at rest", value: "< 30 MB" },
  { label: "Distribution", value: "Direct download (.zip) · ad-hoc signed" },
  { label: "Update channel", value: "GitHub Releases (in-app, every 6h)" },
];

export default function Requirements() {
  return (
    <section
      id="requirements"
      className="relative px-6 py-32 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-start">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-fg-dim)] mb-4">
            System requirements
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-[56px] font-semibold tracking-[-0.03em] leading-[1.02]">
            Light on disk.{" "}
            <span className="text-[var(--color-fg-dim)]">
              Lighter on memory.
            </span>
          </h2>
          <p className="mt-5 text-[15px] text-[var(--color-fg-dim)] max-w-lg leading-relaxed">
            Trove is a single Swift / SwiftUI binary. There's no Electron, no
            background daemon, no helper process. Quitting it actually quits it.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-start gap-4">
            <DownloadButton />
            <a
              href="/features"
              className="btn-ghost inline-flex items-center gap-2 rounded-full font-medium px-5 py-3 text-[14px]"
            >
              Tour all 53 panes
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="pane rounded-2xl p-2"
        >
          <div className="rounded-xl bg-black/30 border border-white/[0.04] overflow-hidden">
            {SPECS.map((s, i) => (
              <div
                key={s.label}
                className={`grid grid-cols-[1fr_auto] items-baseline gap-6 px-5 py-4 ${i !== SPECS.length - 1 ? "border-b border-white/[0.04]" : ""}`}
              >
                <div className="text-[12px] uppercase tracking-[0.16em] text-[var(--color-fg-dim)]">
                  {s.label}
                </div>
                <div className="text-[14px] font-medium tabular-nums">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
