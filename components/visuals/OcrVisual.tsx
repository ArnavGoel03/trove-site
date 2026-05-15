"use client";

import { motion } from "motion/react";
import { ScanLine, Languages, ArrowRight } from "lucide-react";

export default function OcrVisual() {
  return (
    <div className="w-full h-full p-6 sm:p-10 flex flex-col gap-5 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(178,124,255,0.12),transparent_60%)]">
      <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-mute)]">
        OCR + Translate
      </div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
        {/* Source: a "screenshot" */}
        <div className="relative rounded-xl border border-white/[0.06] bg-black/40 p-4 overflow-hidden">
          <div className="text-[9.5px] uppercase tracking-wider text-[var(--color-fg-mute)] mb-3 flex items-center gap-1.5">
            <ScanLine size={11} /> capture
          </div>
          <div className="space-y-1.5">
            {[
              "東京駅 — 新幹線のりば",
              "次の列車: のぞみ 234号",
              "発車 10:42  ホーム 14",
              "終点: 新大阪",
            ].map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                className="relative inline-block text-[12.5px] text-white/85 font-medium"
              >
                {line}
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: false, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                  className="absolute -inset-x-1 inset-y-0 origin-left bg-[#b27cff]/15 border-y border-[#b27cff]/40 rounded-sm -z-10"
                />
              </motion.div>
            ))}
          </div>
          {/* scanning line */}
          <motion.div
            aria-hidden
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 200, opacity: [0, 1, 1, 0] }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-3 right-3 h-px bg-gradient-to-r from-transparent via-[#b27cff] to-transparent"
          />
        </div>

        <div className="flex items-center justify-center text-[var(--color-fg-mute)]">
          <ArrowRight size={18} className="hidden sm:block" />
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="text-[9.5px] uppercase tracking-wider text-[var(--color-fg-mute)] mb-3 flex items-center gap-1.5">
            <Languages size={11} /> english
          </div>
          <div className="space-y-1.5">
            {[
              "Tokyo Station — Shinkansen platforms",
              "Next train: Nozomi 234",
              "Departs 10:42  Platform 14",
              "Final stop: Shin-Osaka",
            ].map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.08 }}
                className="text-[12.5px] text-white/85"
              >
                {line}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-[11.5px] text-[var(--color-fg-mute)]">
        Snip any region. Text is extracted on-device, translated via Apple
        Translate or your preferred provider, and ready to paste.
      </div>
    </div>
  );
}
