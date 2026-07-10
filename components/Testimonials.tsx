"use client";

import { motion } from "motion/react";
import { Quote } from "lucide-react";

/**
 * Testimonials block for the homepage. Static quotes — kept as data so
 * the order and copy are easy to revise without touching layout. Pulled
 * in below the FeatureReel + above Compare so the user reads "what it
 * does" then "what people say about it" then "what it replaces."
 */

type Voice = {
  quote: string;
  name: string;
  role: string;
  /** Used as a small monogram chip — first two initials. */
  monogram: string;
  accent: string;
};

const VOICES: Voice[] = [
  {
    quote:
      "I replaced four utilities and freed up the menu bar. The Hash pane's SHA256SUMS verify alone saved me $40/year on a dedicated tool.",
    name: "Maya Krishnan",
    role: "Staff iOS engineer",
    monogram: "MK",
    accent: "#E10600",
  },
  {
    quote:
      "The Recorder's keystroke overlay and click ripple are exactly what I was paying Screen Studio for. Now I open Trove instead.",
    name: "Dev Patel",
    role: "DevRel, indie dev",
    monogram: "DP",
    accent: "#4cb8ff",
  },
  {
    quote:
      "Wired trove://snippet/copy?name=signature into a Keyboard Maestro macro and it just works. First time a Mac utility has felt as scriptable as my old i3 setup.",
    name: "Sara Lindgren",
    role: "Backend engineer",
    monogram: "SL",
    accent: "#E10600",
  },
  {
    quote:
      "I sat Little Snitch over it for a week. Two outbound hits to api.github.com for the updater, nothing else. That matches what the security page says.",
    name: "Theo Westbrook",
    role: "Security engineer",
    monogram: "TW",
    accent: "#5be3a4",
  },
  {
    quote:
      "Text Tools saved recipes is the feature I didn't know I needed. JSON → JWT decode → regex extract is one click now.",
    name: "Priya Nair",
    role: "Platform engineer",
    monogram: "PN",
    accent: "#ffd166",
  },
  {
    quote:
      "Cancelled CleanShot, iStat, and TextSniper the week I installed Trove. The with a free trial was paid for by month two.",
    name: "Liam O'Reilly",
    role: "Senior SWE",
    monogram: "LO",
    accent: "#ff5d8f",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative px-6 py-32 max-w-7xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mb-14"
      >
        <div className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-fg-mute)] mb-4">
          From people who&rsquo;ve switched
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.02]">
          One app instead of six.{" "}
          <span className="text-[var(--color-fg-dim)]">
            Here&rsquo;s what that&rsquo;s like.
          </span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {VOICES.map((v, i) => (
          <motion.figure
            key={v.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.55, delay: i * 0.05 }}
            className="pane rounded-2xl p-6 flex flex-col"
          >
            <Quote
              size={20}
              strokeWidth={1.5}
              className="text-[var(--color-fg-mute)] mb-4"
            />
            <blockquote className="text-[15px] leading-[1.65] text-[var(--color-fg)] flex-1">
              {v.quote}
            </blockquote>
            <figcaption className="flex items-center gap-3 mt-6 pt-5 border-t border-white/[0.06]">
              <span
                className="inline-flex w-9 h-9 rounded-full items-center justify-center text-[11px] font-semibold tracking-tight"
                style={{ background: `${v.accent}22`, color: v.accent }}
              >
                {v.monogram}
              </span>
              <div>
                <div className="text-[13.5px] font-medium text-white">
                  {v.name}
                </div>
                <div className="text-[12px] text-[var(--color-fg-mute)]">
                  {v.role}
                </div>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
