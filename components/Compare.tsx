"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { PRODUCT } from "@/lib/brand";

const BUNDLE = [
  { name: "Raycast Pro", price: "$96", role: "Launcher + clipboard" },
  { name: "iStat Menus", price: "$12", role: "System sensors" },
  { name: "CleanMyMac", price: "$45", role: "Disk cleanup" },
  { name: "Bartender", price: "$20", role: "Menu bar tidy" },
  { name: "TextSniper", price: "$8", role: "OCR" },
  { name: "Stats", price: "free", role: "Activity widgets" },
];

const TOOLBOX_HAS = [
  "Clipboard manager (Stage + History)",
  "Window snap & AltTab",
  "GPU & CPU thermals with sparkline",
  "Disk cleanup with per-file preview",
  "On-device OCR + translate",
  "PDF kit, image tools, hash, rename",
  "Process viewer, network monitor",
  "Local-only, no telemetry",
];

const COMPETITORS_MISS = [
  "All-in-one, one app to update",
  "GPU temps from private HID sensors",
  "Per-file preview on every delete",
  "OCR with translate in the same flow",
  "Native Swift, ~14 MB, no Electron",
];

export default function Compare() {
  const total = BUNDLE.reduce((sum, b) => {
    if (b.price === "free") return sum;
    return sum + parseInt(b.price.replace(/[^0-9]/g, ""), 10);
  }, 0);

  return (
    <section id="compare" className="relative px-6 py-32 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mb-14"
      >
        <div className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-fg-mute)] mb-4">
          Why Trove vs the bundle
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.02]">
          One app instead of six.{" "}
          <span className="text-[var(--color-fg-dim)]">
            One subscription instead of a stack.
          </span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* The bundle */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.6 }}
          className="pane rounded-2xl p-7 sm:p-9"
        >
          <div className="flex items-baseline justify-between mb-5">
            <div className="text-[13px] uppercase tracking-[0.18em] text-[var(--color-fg-mute)]">
              The bundle
            </div>
            <div className="text-[12px] text-[var(--color-fg-mute)]">
              annualized
            </div>
          </div>
          <div className="space-y-3">
            {BUNDLE.map((b) => (
              <div
                key={b.name}
                className="flex items-baseline justify-between gap-3 py-2 border-b border-white/[0.04] last:border-0"
              >
                <div>
                  <div className="text-[14.5px] font-medium">{b.name}</div>
                  <div className="text-[11.5px] text-[var(--color-fg-mute)]">
                    {b.role}
                  </div>
                </div>
                <div className="font-mono text-[13px] tabular-nums text-[var(--color-fg-dim)]">
                  {b.price === "free" ? "free" : `${b.price}/yr`}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-baseline justify-between">
            <div className="text-[13px] text-[var(--color-fg-dim)]">
              You pay roughly
            </div>
            <div className="text-3xl font-semibold tabular-nums">
              <span className="text-[var(--color-fg-mute)] mr-1">~$</span>
              {total}+
              <span className="text-base text-[var(--color-fg-dim)] font-normal">
                {" "}
                /yr
              </span>
            </div>
          </div>
          <div className="mt-4 text-[12px] text-[var(--color-fg-mute)] flex items-start gap-1.5">
            <X size={13} className="text-rose-400/80 mt-0.5 shrink-0" />
            Six update prompts. Six menu bar icons. Six separate preferences windows.
          </div>
        </motion.div>

        {/* Trove */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="relative rounded-2xl p-7 sm:p-9 overflow-hidden border border-[#ff7a45]/30 bg-gradient-to-br from-[#ff7a45]/8 via-transparent to-[#b27cff]/8"
        >
          <div
            aria-hidden
            className="absolute -inset-32 -z-10 opacity-50 blur-3xl"
            style={{
              background:
                "radial-gradient(50% 50% at 30% 0%, rgba(255,122,69,0.35), transparent 70%), radial-gradient(50% 50% at 80% 100%, rgba(178,124,255,0.3), transparent 70%)",
            }}
          />

          <div className="flex items-baseline justify-between mb-5">
            <div className="text-[13px] uppercase tracking-[0.18em] text-[var(--color-fg-mute)]">
              Trove
            </div>
            <div className="text-[12px] text-[var(--color-fg-mute)]">
              one app
            </div>
          </div>

          <div className="space-y-2.5">
            {TOOLBOX_HAS.map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <span className="mt-0.5 shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-400/20 border border-emerald-400/40">
                  <Check size={10} className="text-emerald-300" />
                </span>
                <span className="text-[13.5px] text-white/90">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-7 pt-5 border-t border-white/[0.08] flex items-baseline justify-between">
            <div className="text-[13px] text-[var(--color-fg-dim)]">
              You pay
            </div>
            <div className="text-2xl font-semibold">{PRODUCT.priceLabel}</div>
          </div>

          <div className="mt-5 grid gap-1.5">
            {COMPETITORS_MISS.map((row) => (
              <div
                key={row}
                className="text-[11.5px] text-[var(--color-fg-dim)] flex items-start gap-1.5"
              >
                <Check size={12} className="text-[#ff7a45] mt-0.5 shrink-0" />
                {row}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-6 text-[11.5px] text-[var(--color-fg-mute)] max-w-3xl">
        Prices listed are public, at time of writing. None of this is a dunk:
        most of those apps are great at the one thing they do. Trove just does
        a lot of them in one place, on your machine.
      </div>
    </section>
  );
}
