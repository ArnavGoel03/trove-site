"use client";

// Scroll-reveal props, defined once.
//
// THE BUG THIS EXISTS TO PREVENT: every one of the 13 copy-pasted reveal
// blocks on this site started at `opacity: 0`. Content below the fold was
// invisible until the viewport reached it, so a full-page capture was the hero
// followed by ~4000px of black, and any visitor whose motion bundle failed to
// hydrate got a page that never became readable at all. A reveal is
// decoration. It must never be the thing that decides whether text can be
// seen.
//
// So the opacity policy is fixed here and is not overridable: elements are
// opaque from first paint and animate the OFFSET only, sliding the last few
// pixels into place. What legitimately differs per section (how far it
// travels, how early it triggers, how a grid staggers) stays a per-call-site
// choice, because that is design intent rather than drift.

import { useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

export interface RevealOptions {
  /** Pixels the element rises through. Cards usually travel further than headings. */
  y?: number;
  /** `viewport.margin`: how far into the viewport before it triggers. */
  margin?: string;
  duration?: number;
  delay?: number;
}

/**
 * Spread into any `motion` element: `<motion.div {...reveal({ y: 24 })}>`.
 *
 * `once: true` keeps it a one-shot, so scrolling back up does not replay.
 * Prefer `useReveal()` in components; it adds the reduced-motion opt-out.
 */
export function reveal({
  y = 16,
  margin = "-15%",
  duration = 0.6,
  delay = 0,
}: RevealOptions = {}) {
  return {
    initial: { opacity: 1, y },
    whileInView: { y: 0 },
    viewport: { once: true, margin },
    transition: { duration, delay, ease: EASE },
  } as const;
}

/**
 * `reveal` with `prefers-reduced-motion` honoured in one place.
 *
 * Only two of the nine components that reveal on scroll used to check the
 * setting, so the same motion was suppressed in the app grid and played
 * anyway in the pane grid directly below it. Returning an empty prop bag when
 * the user has asked for less motion drops the animation entirely; because
 * the element was already opaque and un-offset in its resting state, it simply
 * renders finished.
 */
export function useReveal() {
  const reduced = useReducedMotion();
  return (opts?: RevealOptions) => (reduced ? {} : reveal(opts));
}
