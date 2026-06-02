"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Floating "back to top" control. Hidden until the user has scrolled
 * roughly one viewport, then fades in bottom-right. Respects
 * prefers-reduced-motion via the global CSS transition override and
 * scrolls instantly when reduced motion is requested.
 */
export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  const toTop = () => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Scroll back to top"
      title="Back to top"
      className="fixed bottom-5 right-5 z-40 w-10 h-10 inline-flex items-center justify-center rounded-full border border-white/[0.1] bg-[#0e0e12]/85 backdrop-blur-md text-[var(--color-fg-dim)] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] hover:text-white hover:bg-[#171922]/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black print:hidden"
    >
      <ArrowUp size={16} strokeWidth={1.75} />
    </button>
  );
}
