"use client";

import dynamic from "next/dynamic";
import type { DemoKey } from "@/lib/beats";

/**
 * The proof, mounted only when it is nearly on screen.
 *
 * Every one of these is the real algorithm, not a video of one and not a
 * scripted fake: the JSON demo actually parses, the hash demo actually calls
 * `crypto.subtle`, the treemap actually runs a squarified layout. That is the
 * argument the page is making. A page claiming "these tools work" and shipping
 * a looping mp4 of them working is making the opposite argument.
 *
 * Each is its own chunk. Six widgets is a real amount of JavaScript, and a
 * reader who bounces at the second beat should never have paid for the sixth.
 */
const REGISTRY: Record<DemoKey, React.ComponentType> = {
  json: dynamic(() => import("./Json"), { ssr: false, loading: Skeleton }),
  hash: dynamic(() => import("./Hash"), { ssr: false, loading: Skeleton }),
  regex: dynamic(() => import("./Regex"), { ssr: false, loading: Skeleton }),
  units: dynamic(() => import("./Units"), { ssr: false, loading: Skeleton }),
  color: dynamic(() => import("./Color"), { ssr: false, loading: Skeleton }),
  treemap: dynamic(() => import("./Treemap"), { ssr: false, loading: Skeleton }),
};

/**
 * Occupies the exact box the demo will, so the arrival of a chunk never moves
 * the copy above it. The min-height lives in one place, `.demo-shell`, and both
 * states use it.
 */
function Skeleton() {
  return <div className="demo-shell" aria-hidden="true" />;
}

export default function Demo({
  which,
  active,
}: {
  readonly which: DemoKey;
  readonly active: boolean;
}) {
  const Widget = REGISTRY[which];
  // Unmounting rather than hiding: a hidden widget still holds its listeners,
  // its intervals and its canvas, and six of those is the whole frame budget.
  if (!active) return <Skeleton />;
  return <Widget />;
}
