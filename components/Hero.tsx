"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
} from "motion/react";
import { useEffect, useRef } from "react";
import DownloadButton from "./DownloadButton";
import AppMockup from "./AppMockup";
import { APPS, PLATFORM } from "@/lib/brand";

export default function Hero() {
  // The mouse-tracked gradient is driven via a single rAF-throttled
  // direct DOM write to CSS variables, zero React re-renders per
  // mousemove, zero motion-value subscriptions firing per frame.
  const gradientRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  // Scroll-linked 3D depth: as the user scrolls the mockup out of the
  // hero, it tilts back and recedes into Z-space instead of just
  // sliding up flat. motion's useScroll is rAF-batched (no raw
  // scroll listener, no per-frame React re-render) and drives the
  // transform via motion values, same discipline as the mousemove
  // loop above. useSpring smooths the raw scroll signal so fast
  // trackpad flicks don't snap the tilt.
  const { scrollYProgress: heroProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const heroProgressSmooth = useSpring(heroProgress, {
    stiffness: 300,
    damping: 40,
    mass: 0.5,
  });
  const mockupRotateX = useTransform(heroProgressSmooth, [0, 1], [0, 10]);
  const mockupZ = useTransform(heroProgressSmooth, [0, 1], [0, -140]);
  const mockupFade = useTransform(heroProgressSmooth, [0, 1], [1, 0.45]);

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
      // Cheap spring-ish lerp toward the target, runs at most once
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
      ref={sectionRef}
      id="top"
      className="relative flex flex-col items-center justify-start px-6 pt-24 sm:pt-28 pb-20 overflow-hidden"
    >
      {/* Mouse-responsive gradient: driven via CSS vars, GPU-composited */}
      <div
        ref={gradientRef}
        aria-hidden
        className="absolute inset-0 -z-10 opacity-90"
        style={{
          background: `
            radial-gradient(45% 55% at calc(var(--mx, 50) * 1%) calc(var(--my, 30) * 1%), rgb(var(--color-accent-rgb)/0.13), transparent 62%),
            radial-gradient(70% 50% at 50% 0%, rgb(var(--color-accent-rgb)/0.05), transparent 60%)
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
        className="relative z-10 max-w-4xl mx-auto text-center"
        style={{ willChange: "transform, opacity" }}
      >
        <h1 className="text-[42px] sm:text-[60px] md:text-[76px] leading-[0.95] font-semibold tracking-[-0.045em] text-white">
          One app instead
          <br className="hidden sm:block" /> of a dozen.
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-6 text-[17px] sm:text-[19px] text-[var(--color-fg-dim)] max-w-xl mx-auto leading-[1.55]"
        >
          {APPS.trove.name} puts clipboard history, screen capture, OCR, a PDF
          kit, a video trimmer, window management, system monitors and 30-odd
          more into one native Mac app. Everything runs on your machine.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          id="download"
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <DownloadButton />
          <a
            href="/features"
            className="btn-ghost inline-flex items-center gap-2 rounded-full font-medium px-5 py-3 text-[14px] transition-all hover:translate-y-[-1px]"
          >
            See everything it does
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-5 text-[12.5px] text-[var(--color-fg-dim)]"
        >
          14-day free trial · No account · {PLATFORM.arch} · macOS 13+
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-6xl mx-auto mt-12 sm:mt-14"
        style={{ willChange: "transform, opacity", perspective: "1600px" }}
      >
        {/* Nested wrapper: entrance (opacity/y/scale above) and
            scroll-depth (rotateX/z/opacity below) are separate motion
            values on separate elements so they never fight over the
            same key. The entrance plays once on mount, the depth
            tilt tracks scroll continuously afterward. */}
        <motion.div
          style={
            reduced
              ? undefined
              : {
                  rotateX: mockupRotateX,
                  z: mockupZ,
                  opacity: mockupFade,
                  transformStyle: "preserve-3d",
                }
          }
        >
          <AppMockup />
        </motion.div>
      </motion.div>
    </section>
  );
}
