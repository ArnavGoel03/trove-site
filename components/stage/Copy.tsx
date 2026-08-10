"use client";

import { useEffect, useState } from "react";

import type { Beat } from "@/lib/beats";
import { stageDistance, type StageId } from "@/lib/timeline";
import type { ProgressStore } from "./progress";
import Demo from "../demos/Demo";
import Receipt from "./Receipt";

interface Props {
  readonly id: StageId;
  readonly beat: Beat;
  /** False in the stacked fallback, where everything is visible at once. */
  readonly live: boolean;
  readonly store: ProgressStore;
  readonly register: (el: HTMLElement | null) => void;
}

/**
 * One beat: eyebrow, headline, body, evidence, and whatever is interactive.
 *
 * The whole element is server-rendered, including the beats nobody has scrolled
 * to yet, because a crawler that runs no JS should still read the entire
 * argument. What is NOT server-rendered is the interactive proof: a demo is a
 * live widget with its own state, and six of them running at once for the
 * benefit of the one the reader is looking at is how a scroll page ends up at
 * 20fps. They mount within one stage of active and unmount past it.
 */
export default function Copy({ id, beat, live, store, register }: Props) {
  const [near, setNear] = useState(!live);

  useEffect(() => {
    if (!live) {
      setNear(true);
      return;
    }
    return store.subscribe((frame) => {
      // Signed distance, so a beat coming up and a beat just left are both
      // within one and stay mounted across the boundary. Remounting a demo at
      // the exact moment its beat becomes readable would show an empty box.
      const within = Math.abs(stageDistance(frame.index, id)) <= 1;
      setNear((was) => (was === within ? was : within));
    });
  }, [id, live, store]);

  return (
    <article
      ref={register}
      className="stage-beat"
      data-stage={id}
      aria-label={beat.headline}
    >
      <div className="stage-copy">
        <p className="text-micro font-mono uppercase text-accent">{beat.eyebrow}</p>
        <h2 className="mt-4 text-display font-display font-semibold text-fg text-balance">
          {beat.headline}
        </h2>
        <p className="mt-5 text-lead text-fg-dim text-pretty">{beat.body}</p>
        {beat.kicker ? (
          <p className="stage-kicker mt-4 text-caption text-fg-mute text-pretty">{beat.kicker}</p>
        ) : null}
      </div>

      {beat.demos?.length ? (
        <div className="stage-demos mt-8 grid gap-4 sm:grid-cols-2 lg:max-w-4xl">
          {beat.demos.map((key) => (
            <Demo key={key} which={key} active={near} />
          ))}
        </div>
      ) : null}

      {beat.widget === "receipt" ? <Receipt store={store} live={live} /> : null}
    </article>
  );
}
