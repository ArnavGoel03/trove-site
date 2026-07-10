"use client";

import { motion } from "motion/react";
import { Image as ImageIcon, Link as LinkIcon, FileText } from "lucide-react";

const items = [
  {
    kind: "text",
    icon: FileText,
    title: "Customer interview notes",
    preview: "Q3 plan, the main blocker on the rollout is...",
    tint: "from-accent/15 to-transparent",
  },
  {
    kind: "image",
    icon: ImageIcon,
    title: "Screenshot 2026-05-12 at 10.24.41.png",
    preview: "1440 × 900 · PNG",
    tint: "from-accent/15 to-transparent",
  },
  {
    kind: "link",
    icon: LinkIcon,
    title: "github.com/your-org/toolbox",
    preview: "github.com",
    tint: "from-[#4cb8ff]/15 to-transparent",
  },
];

export default function StageVisual() {
  return (
    <div className="w-full h-full p-6 sm:p-10 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-mute)]">
          Stage
        </div>
        <div className="text-[10px] font-mono text-[var(--color-fg-mute)]">
          ⌘⇧V to pin
        </div>
      </div>

      <div className="flex-1 grid grid-rows-3 gap-3">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`relative rounded-xl border border-white/[0.06] bg-gradient-to-r ${it.tint} bg-black/30 px-4 py-3 flex items-center gap-3.5 overflow-hidden`}
            >
              <div className="shrink-0 w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <Icon size={16} className="text-white/80" />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-medium truncate">
                  {it.title}
                </div>
                <div className="text-[11.5px] text-[var(--color-fg-dim)] truncate">
                  {it.preview}
                </div>
              </div>
              <div className="ml-auto shrink-0 text-[10px] text-[var(--color-fg-mute)] font-mono">
                ⌥{i + 1}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="text-[11.5px] text-[var(--color-fg-mute)]">
        Pin anything to the Stage: survives reboots, syncs across spaces.
      </div>
    </div>
  );
}
