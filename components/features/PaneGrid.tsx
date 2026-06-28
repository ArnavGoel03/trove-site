"use client";

import { motion } from "motion/react";
import { PANES, SECTIONS, type Pane } from "@/lib/panes";

// 53 panes, grouped by sidebar section. Identical to the in-app Customize
// panel: same names, same one-liners, same section labels.
export default function PaneGrid() {
  return (
    <section id="panes" className="relative px-6 py-20 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mb-14"
      >
        <div className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-fg-mute)] mb-4">
          The full set
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-[56px] font-semibold tracking-[-0.03em] leading-[1.02]">
          53 panes, grouped the way{" "}
          <span className="text-[var(--color-fg-dim)]">
            the app groups them.
          </span>
        </h2>
        <p className="mt-5 text-[15px] text-[var(--color-fg-dim)] max-w-2xl leading-relaxed">
          Hide any pane you don&rsquo;t use from Trove → Settings → Customize
          (Stage is the only one that stays, it&rsquo;s where everything else
          drops). The list below mirrors that panel exactly.
        </p>
      </motion.div>

      <div className="space-y-16">
        {SECTIONS.map((section) => {
          const panes = PANES.filter((p) => p.section === section.name);
          if (panes.length === 0) return null;
          return (
            <SectionBlock
              key={section.name}
              title={section.name}
              tagline={section.tagline}
              accent={section.accent}
              panes={panes}
            />
          );
        })}
      </div>
    </section>
  );
}

function SectionBlock({
  title,
  tagline,
  accent,
  panes,
}: {
  title: string;
  tagline: string;
  accent: string;
  panes: Pane[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-baseline justify-between gap-6 mb-6">
        <div className="flex items-baseline gap-3">
          <span
            aria-hidden
            className="inline-block w-2 h-2 rounded-full"
            style={{
              background: accent,
              boxShadow: `0 0 14px 2px ${accent}55`,
            }}
          />
          <h3 className="text-[26px] sm:text-[30px] font-semibold tracking-[-0.025em] text-white">
            {title}
          </h3>
          <span className="text-[12px] text-[var(--color-fg-mute)] font-mono tabular-nums">
            {panes.length} pane{panes.length === 1 ? "" : "s"}
          </span>
        </div>
        <span className="hidden sm:block text-[13px] text-[var(--color-fg-dim)] max-w-md text-right leading-snug">
          {tagline}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {panes.map((pane) => (
          <PaneCard key={pane.name} pane={pane} accent={accent} />
        ))}
      </div>
    </motion.div>
  );
}

function PaneCard({ pane, accent }: { pane: Pane; accent: string }) {
  const Icon = pane.icon;
  return (
    <div
      className="pane rounded-xl p-5 transition-all hover:-translate-y-0.5 hover:border-white/[0.12] relative overflow-hidden"
      style={
        {
          // Each card gets a faint accent wash in the bottom-right corner
          // so users can scan a column at a glance and tell which section
          // they're in even after scrolling.
          backgroundImage: `radial-gradient(80% 80% at 100% 100%, ${accent}11, transparent 60%)`,
        } as React.CSSProperties
      }
    >
      <div className="flex items-start gap-3.5">
        <div
          className="w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-center shrink-0"
          style={{ boxShadow: `inset 0 0 0 1px ${accent}22` }}
        >
          <Icon size={16} className="text-white/90" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-[15px] font-semibold tracking-tight text-white truncate">
              {pane.name}
            </div>
            <code
              className="text-[10px] font-mono text-[var(--color-fg-mute)] truncate ml-2"
              title={`SF Symbol: ${pane.sfSymbol}`}
            >
              {pane.sfSymbol}
            </code>
          </div>
          <p className="mt-1.5 text-[13px] text-[var(--color-fg-dim)] leading-relaxed">
            {pane.blurb}
          </p>
        </div>
      </div>
    </div>
  );
}
