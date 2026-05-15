"use client";

import { motion } from "motion/react";
import { FileText, Combine, Scissors, RotateCw, Lock } from "lucide-react";

const actions = [
  { icon: Combine, label: "Merge" },
  { icon: Scissors, label: "Split" },
  { icon: RotateCw, label: "Rotate" },
  { icon: Lock, label: "Encrypt" },
];

export default function PdfVisual() {
  return (
    <div className="w-full h-full p-6 sm:p-10 flex flex-col gap-5 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(76,184,255,0.12),transparent_60%)]">
      <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-mute)]">
        PDF Tools
      </div>

      <div className="relative flex-1 flex items-center justify-center">
        {/* Stacked PDF pages */}
        <div className="relative w-44 h-56 sm:w-52 sm:h-64">
          {[2, 1, 0].map((i) => (
            <motion.div
              key={i}
              initial={{ y: 12, opacity: 0, rotate: 0 }}
              whileInView={{
                y: -i * 6,
                x: -i * 8,
                opacity: 1,
                rotate: -i * 4,
              }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute inset-0 rounded-lg border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] p-4 flex flex-col gap-2 origin-bottom-left"
              style={{ zIndex: 10 - i }}
            >
              <FileText size={20} className="text-[#4cb8ff]" />
              <div className="mt-2 space-y-1.5">
                {[100, 86, 92, 70, 80, 60].map((w, j) => (
                  <div
                    key={j}
                    className="h-1 rounded-full bg-white/[0.08]"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
              <div className="mt-auto text-[9px] font-mono text-[var(--color-fg-mute)]">
                quarterly-report-{i + 1}.pdf
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {actions.map((a, i) => {
          const Icon = a.icon;
          return (
            <motion.button
              key={a.label}
              type="button"
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.06 }}
              className="rounded-lg border border-white/[0.06] bg-white/[0.025] hover:bg-white/[0.05] transition-colors px-2 py-2.5 flex flex-col items-center gap-1.5 text-[11px] text-[var(--color-fg-dim)]"
            >
              <Icon size={14} className="text-white/80" />
              {a.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
