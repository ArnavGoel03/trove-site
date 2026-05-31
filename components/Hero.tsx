"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import DownloadButton from "./DownloadButton";
import AppMockup from "./AppMockup";

export default function Hero() {
  // The mouse-tracked gradient is driven via a single rAF-throttled
  // direct DOM write to CSS variables — zero React re-renders per
  // mousemove, zero motion-value subscriptions firing per frame.
  const gradientRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = gradientRef.current;
    if (!el) return;

    // Initial values match the previous default.
    let targetX = 50;
    let targetY = 30;
    let currentX = targetX;
    let currentY = targetY;
    el.style.setProperty("--mx", String(currentX));
    el.style.setProperty("--my", String(currentY));

    let rafId = 0;
    let pending = false;

    function loop() {
      // Cheap spring-ish lerp toward the target — runs at most once
      // per frame regardless of how many mousemove events fired.
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      el!.style.setProperty("--mx", currentX.toFixed(2));
      el!.style.setProperty("--my", currentY.toFixed(2));

      if (
        Math.abs(targetX - currentX) > 0.05 ||
        Math.abs(targetY - currentY) > 0.05
      ) {
        rafId = requestAnimationFrame(loop);
      } else {
        pending = false;
      }
    }

    function onMove(e: MouseEvent) {
      targetX = (e.clientX / window.innerWidth) * 100;
      targetY = (e.clientY / window.innerHeight) * 100;
      if (!pending) {
        pending = true;
        rafId = requestAnimationFrame(loop);
      }
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [reduced]);

  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-24 overflow-hidden"
    >
      {/* Mouse-responsive gradient — driven via CSS vars, GPU-composited */}
      <div
        ref={gradientRef}
        aria-hidden
        className="absolute inset-0 -z-10 opacity-90"
        style={{
          background: `
            radial-gradient(40% 50% at calc(var(--mx, 50) * 1%) calc(var(--my, 30) * 1%), rgba(255, 122, 69, 0.18), transparent 60%),
            radial-gradient(50% 60% at calc((100 - var(--mx, 50)) * 1%) calc((100 - var(--my, 30)) * 1%), rgba(178, 124, 255, 0.16), transparent 60%),
            radial-gradient(60% 60% at 50% 100%, rgba(76, 184, 255, 0.08), transparent 60%)
          `,
          willChange: "background-position",
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
        style={{ willChange: "transform, opacity" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] backdrop-blur px-3 py-1 text-[12px] text-[var(--color-fg-dim)] mb-7"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.7)]" />
          v1.1.0 · 33 panes · 11 Shortcuts intents · ~14 MB
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
          an OCR, a PDF kit, a disk cleaner and 27 more panes into a single,
          fast, native macOS app — scriptable from macOS Shortcuts, installable
          via Homebrew, sub-500 ms cold launch.
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
            href="/features"
            className="btn-ghost inline-flex items-center gap-2 rounded-full font-medium px-5 py-3 text-[14px] transition-all hover:translate-y-[-1px]"
          >
            See all 33 panes
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-5 text-[12.5px] text-[var(--color-fg-dim)]"
        >
          Apple Silicon &amp; Intel · macOS 13+ · Open source on GitHub
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-5xl mx-auto mt-16 sm:mt-20"
        style={{ willChange: "transform, opacity" }}
      >
        <AppMockup />
      </motion.div>
    </section>
  );
}
