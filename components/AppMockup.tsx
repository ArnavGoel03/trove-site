"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

// The real app, not a drawing of it.
//
// This used to be a CSS grid of empty tinted tiles: 40-odd squares with an
// icon and a label, arranged to *suggest* an app window. It showed a visitor
// nothing about what Trove actually looks like or does, which is the one job
// a hero image has. `public/shots/trove-window.png` is rendered from the
// shipping binary by `swift run Trove --render-shots` (see
// macos/Sources/Trove/render_shots.swift), so it cannot drift from the product
// the way a hand-built mockup silently does.
const SHOT = {
  src: "/shots/trove-window.png",
  width: 2560,
  height: 1600,
  alt: "The Trove window on macOS: a sidebar listing Clipboard, Capture, OCR, PDF, Image Tools, Video Editor, Windows, Monitors, Storage and Drives, with the Video Editor open showing a clip timeline and trim controls.",
};

export default function AppMockup({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  // Parallax tilt: single rAF-throttled mousemove handler that writes
  // the transform directly to the element, no motion-value chain,
  // no springs sampling per frame, no React state.
  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    let targetX = 0.5;
    let targetY = 0.5;
    let curX = 0.5;
    let curY = 0.5;
    let rafId = 0;
    let pending = false;

    function applyTransform() {
      // curX / curY are clamped to [0,1] in onMove, so the tilt stays in a
      // subtle, premium range no matter where the cursor is on the page.
      // rotX: [0,1] -> [3,-3]   rotY: [0,1] -> [-4, 4]
      const rotX = 3 + curY * -6;
      const rotY = -4 + curX * 8;
      el!.style.transform = `perspective(1600px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    }

    function loop() {
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      applyTransform();
      if (
        Math.abs(targetX - curX) > 0.001 ||
        Math.abs(targetY - curY) > 0.001
      ) {
        rafId = requestAnimationFrame(loop);
      } else {
        pending = false;
      }
    }

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width;
      targetY = (e.clientY - rect.top) / rect.height;
      if (!pending) {
        pending = true;
        rafId = requestAnimationFrame(loop);
      }
    }

    applyTransform();
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [reduced]);

  return (
    <div
      ref={ref}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      className={`relative ${className}`}
    >
      <div className="rounded-xl overflow-hidden shadow-[0_50px_140px_-30px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.07)]">
        <Image
          src={SHOT.src}
          width={SHOT.width}
          height={SHOT.height}
          alt={SHOT.alt}
          // The hero image is the LCP element on the homepage: eager, high
          // priority, and sized so the browser never downloads the 2560px
          // original for a 1200px slot.
          priority
          fetchPriority="high"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 92vw, 1200px"
          className="w-full h-auto block"
        />
      </div>

      {/* Glow */}
      <div
        aria-hidden
        className="absolute -inset-16 -z-10 opacity-50 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 30%, rgb(var(--color-accent-rgb)/0.22), transparent 70%), radial-gradient(50% 50% at 70% 70%, rgb(var(--color-accent-rgb)/0.18), transparent 70%)",
        }}
      />
    </div>
  );
}
