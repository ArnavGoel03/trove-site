"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  MotionValue,
} from "motion/react";
import { useRef } from "react";
import ThermalsVisual from "./visuals/ThermalsVisual";
import StageVisual from "./visuals/StageVisual";
import PdfVisual from "./visuals/PdfVisual";
import SweepVisual from "./visuals/SweepVisual";
import OcrVisual from "./visuals/OcrVisual";

type Feature = {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  Visual: React.ComponentType;
  accent: string;
};

const FEATURES: Feature[] = [
  {
    eyebrow: "System / GPU & Thermals",
    title: "See your GPU temp.\nFor real.",
    body: "Trove reads the same private HID sensors Apple uses internally, no kexts, no admin password. CPU, GPU, fan speed, throttle state, all in one pane.",
    bullets: [
      "Live GPU/CPU/SOC temperatures",
      "Fan RPM and per-core throttle",
      "60-second history sparkline",
    ],
    Visual: ThermalsVisual,
    accent: "#ff5d8f",
  },
  {
    eyebrow: "Clipboard / Stage",
    title: "Pin clipboard items\nthat won't disappear.",
    body: "The Stage is a small, always-available shelf for clipboard items you want to keep around. Pin a link, a screenshot, a paragraph: paste back with one keystroke.",
    bullets: [
      "Survives reboots and logouts",
      "Per-item hotkeys (⌥1 … ⌥9)",
      "Manual iCloud Drive backup of preferences + snippets + notes (plain JSON, no clipboard history)",
    ],
    Visual: StageVisual,
    accent: "#E10600",
  },
  {
    eyebrow: "Files / PDF",
    title: "A full PDF kit\nwith no upload step.",
    body: "Merge, split, rotate, redact, encrypt and compress PDFs entirely on-device. Drag in a folder, get a single file back without sending your documents to a stranger's server.",
    bullets: [
      "Merge, split, rotate, redact, OCR",
      "AES-256 encrypt with one click",
      "Batch-process whole folders",
    ],
    Visual: PdfVisual,
    accent: "#4cb8ff",
  },
  {
    eyebrow: "Storage / Sweep",
    title: "Reclaim disk space\nwithout panic.",
    body: 'Sweep finds the biggest stale files in your Downloads, dev caches and trash, shows them to you with a preview, and only deletes the ones you check. No "smart clean" surprises.',
    bullets: [
      "Reclaim GBs in seconds",
      "Per-file preview & undo",
      "Cleans Xcode, npm, pip, brew caches",
    ],
    Visual: SweepVisual,
    accent: "#ff5d8f",
  },
  {
    eyebrow: "Capture / OCR + Translate",
    title: "Snip text, even from\na language you can't read.",
    body: "Hit a shortcut, drag a rectangle, get accurate text in your clipboard, translated to your language on the way through. Works on Japanese train signs, German PDFs, French menus, all on-device.",
    bullets: [
      "On-device OCR (Vision framework)",
      "Auto-translate to your locale",
      "Saves both original and translation",
    ],
    Visual: OcrVisual,
    accent: "#E10600",
  },
];

export default function FeatureReel() {
  return (
    <section id="features" className="relative">
      <div className="px-6 pt-32 pb-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-fg-dim)] mb-4">
            The reel
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.02]">
            Five panes worth showing.{" "}
            <span className="text-[var(--color-fg-dim)]">
              The other twenty-eight live on the{" "}
              <a
                href="/features"
                className="text-white underline decoration-white/30 hover:decoration-white/80 underline-offset-4"
              >
                features page
              </a>
              .
            </span>
          </h2>
        </motion.div>
      </div>

      {FEATURES.map((f, idx) => (
        <FeatureBlock key={f.title} feature={f} index={idx} />
      ))}
    </section>
  );
}

function FeatureBlock({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // One useScroll per block: motion's scroll listener uses a single
  // shared rAF and only ticks when the target is on/near screen.
  // With `position: sticky` only one block is ever in-view at once.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Fade/scale/3D-tilt windows were previously [0, 0.15, 0.85, 1] on a
  // 220vh block: 30% of the track (66vh, more than half a screen) sat
  // at near-zero opacity while the section was pinned, which read as a
  // blank black gap between features. Tightened to [0, 0.08, 0.92, 1]
  // on a shorter 170vh block so content is at full opacity for ~84% of
  // the scroll instead of ~70%, and the remaining transition is framed
  // as an intentional 3D swing (rotateX/z) rather than a flat fade.
  const visualOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.92, 1],
    [0, 1, 1, 0],
  );
  const visualScale = useTransform(
    scrollYProgress,
    [0, 0.08, 0.92, 1],
    [0.97, 1, 1, 0.98],
  );
  const visualY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  // 3D perspective reveal: the visual pane swings in out of depth
  // (rotated + pushed back on Z) instead of just fading, so the block
  // transition itself carries the "wow" instead of dead air.
  const visualRotateX = useTransform(
    scrollYProgress,
    [0, 0.08, 0.92, 1],
    [12, 0, 0, -10],
  );
  const visualZ = useTransform(
    scrollYProgress,
    [0, 0.08, 0.92, 1],
    [-160, 0, 0, -120],
  );

  const Visual = feature.Visual;

  return (
    <div
      ref={ref}
      className="relative feature-block"
      style={{ height: "170vh" }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden feature-block-sticky">
        {/* Background accent glow per feature, static, no animation */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-50 pointer-events-none"
          style={{
            background: `radial-gradient(60% 50% at ${index % 2 === 0 ? "20%" : "80%"} 50%, ${feature.accent}22, transparent 60%)`,
          }}
        />

        <div
          className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
          style={{ perspective: "1600px" }}
        >
          {/* Text column, order swaps for visual rhythm */}
          <FeatureCopy
            feature={feature}
            progress={scrollYProgress}
            reduced={!!reduced}
            className={index % 2 === 1 ? "lg:order-2" : ""}
          />

          {/* Pinned visual */}
          <motion.div
            style={
              reduced
                ? undefined
                : {
                    opacity: visualOpacity,
                    scale: visualScale,
                    y: visualY,
                    rotateX: visualRotateX,
                    z: visualZ,
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity",
                  }
            }
            className={index % 2 === 1 ? "lg:order-1" : ""}
          >
            <div className="pane rounded-2xl aspect-[4/3] w-full overflow-hidden shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)]">
              <Visual />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FeatureCopy({
  feature,
  progress,
  reduced,
  className = "",
}: {
  feature: Feature;
  progress: MotionValue<number>;
  reduced: boolean;
  className?: string;
}) {
  // Collapse 4 separate parallax MotionValues into 1 driver + scalar
  // multipliers; motion still applies them via the same shared rAF,
  // but the JS work per scroll tick is now just one useTransform
  // sample instead of four.
  const drive = useTransform(progress, [0, 1], [1, -1]);
  // Widened to match the visual column's tightened window (was
  // [0, 0.15, 0.85, 1]): the copy now reaches full opacity for the
  // same ~84% of the block instead of fading out early into the gap.
  const fadeIn = useTransform(progress, [0, 0.08, 0.92, 1], [0, 1, 1, 0]);
  // Subtle depth push on enter/exit so the copy column reads as part
  // of the same 3D reveal as the visual, not a separate flat fade.
  const copyZ = useTransform(progress, [0, 0.08, 0.92, 1], [-40, 0, 0, -30]);

  // Per-row Y stagger was the bug: any non-zero delta between the
  // title's and body's Y transforms creates a chance of overlap on
  // scroll. The previous "tight" range (60/55/50/45) still allowed
  // ~5px gap collapse per adjacency, which at the extreme of a
  // long-form recap with leading-relaxed body text was enough to
  // visually touch. The fix is structural: every row in the copy
  // column shares one Y transform, so they move as a rigid block,
  // never relative to each other. The column-level `fadeIn` opacity
  // still provides the scroll-in feel.
  const sharedY = useTransform(drive, (v) => v * 50);
  const eyebrowY = sharedY;
  const titleY = sharedY;
  const bodyY = sharedY;
  const bulletY = sharedY;

  const style = reduced ? undefined : { opacity: fadeIn, z: copyZ };

  return (
    <motion.div
      style={style}
      className={className}
    >
      <motion.div
        style={
          reduced ? undefined : { y: eyebrowY, willChange: "transform" }
        }
        className="text-[12px] uppercase tracking-[0.22em] text-[var(--color-fg-mute)] mb-5"
      >
        <span
          className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle"
          style={{ background: feature.accent }}
        />
        {feature.eyebrow}
      </motion.div>

      <motion.h3
        style={reduced ? undefined : { y: titleY, willChange: "transform" }}
        className="text-4xl sm:text-5xl md:text-[56px] font-semibold tracking-[-0.03em] leading-[1.02] whitespace-pre-line"
      >
        {feature.title}
      </motion.h3>

      <motion.p
        style={reduced ? undefined : { y: bodyY, willChange: "transform" }}
        className="mt-6 text-[16px] sm:text-[17px] text-[var(--color-fg-dim)] leading-relaxed max-w-xl"
      >
        {feature.body}
      </motion.p>

      <motion.ul
        style={reduced ? undefined : { y: bulletY, willChange: "transform" }}
        className="mt-7 space-y-2.5 text-[14px] text-[var(--color-fg)]"
      >
        {feature.bullets.map((b) => (
          <li key={b} className="flex items-start gap-2.5">
            <span
              aria-hidden
              className="mt-2 inline-block w-1 h-1 rounded-full shrink-0"
              style={{ background: feature.accent }}
            />
            <span className="text-[var(--color-fg-dim)]">{b}</span>
          </li>
        ))}
      </motion.ul>
    </motion.div>
  );
}
