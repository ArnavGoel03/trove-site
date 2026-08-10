"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { BEATS } from "@/lib/beats";
import { copyEnvelope, STAGES, TRACK_VH, type StageId } from "@/lib/timeline";
import { detect, SAFE, type Capability } from "@/scene/quality";
import { RIVALS } from "@/lib/rivals";
import Poster from "./Poster";
import Copy from "./Copy";
import { createProgressStore } from "./progress";

/**
 * three.js and react-three-fiber, off the critical path.
 *
 * `ssr: false` is not an optimisation here, it is the rule the budget gate
 * enforces: nothing in the server graph for `/` may import three, or the
 * poster stops being the thing that paints first. The import expression is
 * inside a client component and only evaluated once `capable` is true, so a
 * machine with no WebGL2 never fetches the chunk at all.
 */
const Scene = dynamic(() => import("@/scene/Scene"), { ssr: false });

/** How far a beat travels while fading. Layout decision, so it lives here. */
const NUDGE_PX = 28;

export default function Track() {
  const trackRef = useRef<HTMLElement>(null);
  const beatRefs = useRef(new Map<StageId, HTMLElement>());
  const store = useMemo(() => createProgressStore(0), []);

  // Starts at the server's assumption and is corrected before the first paint
  // the client controls, so the reader never sees the wrong layout.
  const [cap, setCap] = useState<Capability>(SAFE);
  const [measured, setMeasured] = useState(false);
  const [drawn, setDrawn] = useState(false);

  useLayoutEffect(() => {
    setCap(detect(RIVALS.length));
    setMeasured(true);
  }, []);

  const live = measured && cap.webgl && !cap.reducedMotion;

  /**
   * The poster hands over only once the canvas has drawn a frame.
   *
   * Not on mount: `<Canvas>` exists as soon as the chunk lands, several frames
   * before three has anything in it, and fading the poster then puts a black
   * hole where the hero should be. And not never: the poster and the scene are
   * the same composition, so leaving both up shows the reader two overlapping
   * windows and the illusion is finished.
   */
  const handleDrawn = useCallback(() => setDrawn(true), []);

  /**
   * One loop, one read of the scroll position, one `stageAt`, then every
   * consumer. rAF rather than a scroll listener because a scroll listener fires
   * at whatever rate the input device chooses (a trackpad can beat 120Hz) and
   * would do this work several times for one painted frame.
   */
  useEffect(() => {
    if (!live) {
      // Stacked mode: clear anything a previous live frame wrote, so the CSS
      // fallback rules are not fighting stale inline styles.
      for (const el of beatRefs.current.values()) el.removeAttribute("style");
      return;
    }

    let raf = 0;
    let lastProgress = -1;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      // The sticky frame is pinned from the track's top until one viewport
      // before its bottom, so the travel is (height - viewport). See the height
      // arithmetic note in globals.css: this denominator is what makes the DOM
      // and lib/timeline agree on where a beat sits.
      const travel = rect.height - window.innerHeight;
      const progress = travel <= 0 ? 0 : -rect.top / travel;
      if (progress === lastProgress) return;
      lastProgress = progress;

      const frame = store.set(progress);

      for (const [id, el] of beatRefs.current) {
        const isActive = id === frame.id;
        if (!isActive) {
          if (el.style.visibility !== "hidden") {
            el.style.visibility = "hidden";
            el.style.opacity = "0";
            el.style.pointerEvents = "none";
          }
          continue;
        }
        const { opacity, shift } = copyEnvelope(frame.local);
        el.style.visibility = "visible";
        el.style.opacity = String(opacity);
        el.style.transform = `translate3d(0, ${(shift * NUDGE_PX).toFixed(2)}px, 0)`;
        // A beat at 4% opacity must not swallow a click meant for the demo
        // fading in behind it.
        el.style.pointerEvents = opacity > 0.6 ? "auto" : "none";
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live, store]);

  return (
    <section
      ref={trackRef}
      className="stage-track"
      data-live={measured ? (live ? "1" : "0") : undefined}
      style={{ "--track-vh": TRACK_VH } as React.CSSProperties}
      aria-label="How Trove replaces a stack of Mac utilities"
    >
      <div className="stage-frame">
        <div className="stage-layer stage-poster" data-handed-over={drawn ? "1" : undefined}>
          <Poster />
        </div>

        {live ? (
          <div className="stage-layer stage-scene">
            <Scene store={store} capability={cap} onReady={handleDrawn} />
          </div>
        ) : null}

        {/* The words are DOM over a moving picture, which is the one thing that
            reliably makes copy unreadable. The scrim is what buys legibility at
            every stage without the camera having to dodge the text: the side
            the copy is on stays close to the page background, the side the
            subject is on stays clear. */}
        <div className="stage-layer stage-scrim" aria-hidden="true" />

        <div className="stage-beats">
          {STAGES.map((stage) => (
            <Copy
              key={stage.id}
              id={stage.id}
              beat={BEATS[stage.id]}
              live={live}
              store={store}
              register={(el) => {
                if (el) beatRefs.current.set(stage.id, el);
                else beatRefs.current.delete(stage.id);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
