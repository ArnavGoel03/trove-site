"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect } from "react";
import DownloadButton from "./DownloadButton";
import AppMockup from "./AppMockup";

export default function Hero() {
  const mx = useMotionValue(50);
  const my = useMotionValue(30);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });

  useEffect(() => {
    function onMove(e: MouseEvent) {
      mx.set((e.clientX / window.innerWidth) * 100);
      my.set((e.clientY / window.innerHeight) * 100);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-24 overflow-hidden"
    >
      {/* Mouse-responsive gradient */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-90"
        style={{
          background: `
            radial-gradient(40% 50% at calc(var(--mx) * 1%) calc(var(--my) * 1%), rgba(255, 122, 69, 0.18), transparent 60%),
            radial-gradient(50% 60% at calc((100 - var(--mx)) * 1%) calc((100 - var(--my)) * 1%), rgba(178, 124, 255, 0.16), transparent 60%),
            radial-gradient(60% 60% at 50% 100%, rgba(76, 184, 255, 0.08), transparent 60%)
          `,
        }}
        // wire spring values to CSS vars
        ref={(el) => {
          if (!el) return;
          const unsubX = sx.on("change", (v) =>
            el.style.setProperty("--mx", String(v)),
          );
          const unsubY = sy.on("change", (v) =>
            el.style.setProperty("--my", String(v)),
          );
          el.style.setProperty("--mx", String(sx.get()));
          el.style.setProperty("--my", String(sy.get()));
          // store cleanup
          (el as HTMLElement & { __cleanup?: () => void }).__cleanup = () => {
            unsubX();
            unsubY();
          };
        }}
      />

      {/* Soft horizon line */}
      <div
        aria-hidden
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px opacity-40 -z-10"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-5xl mx-auto text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] backdrop-blur px-3 py-1 text-[12px] text-[var(--color-fg-dim)] mb-7"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.7)]" />
          30+ panes. One native app. ~14 MB.
        </motion.div>

        <h1 className="text-[44px] sm:text-[64px] md:text-[84px] leading-[0.96] font-semibold tracking-[-0.04em] bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent">
          Your Mac,
          <br className="hidden sm:block" /> finally tidy.
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-6 text-[16px] sm:text-[18px] text-[var(--color-fg-dim)] max-w-2xl mx-auto leading-relaxed"
        >
          Trove folds a clipboard manager, a window snapper, a system monitor,
          an OCR, a PDF kit, a disk cleaner and 25+ more panes into a single,
          fast, native macOS app.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          id="download"
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <DownloadButton />
          <a
            href="#features"
            className="btn-ghost inline-flex items-center gap-2 rounded-full font-medium px-5 py-3 text-[14px] transition-all hover:translate-y-[-1px]"
          >
            See the panes
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-5 text-[12.5px] text-[var(--color-fg-mute)]"
        >
          Apple Silicon &amp; Intel · macOS 13+ · Signed &amp; notarized
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-5xl mx-auto mt-16 sm:mt-20"
      >
        <AppMockup />
      </motion.div>
    </section>
  );
}
