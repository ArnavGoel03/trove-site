"use client";

// SmoothScroll was previously a Lenis-based smooth-scroll wrapper.
// Lenis's rAF loop fought macOS Magic Trackpad inertia and made
// scroll feel rubbery / laggy on real hardware, especially when
// combined with scroll-driven motion transforms elsewhere on the page.
//
// We now rely on the browser's native trackpad inertia plus the
// `html { scroll-behavior: smooth }` rule in globals.css (which is
// suppressed under `prefers-reduced-motion`).
//
// Kept as a no-op so existing imports keep working — and so it can
// be re-enabled behind a query flag in the future if needed.
export default function SmoothScroll() {
  return null;
}
