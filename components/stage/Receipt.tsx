"use client";

import { useEffect, useRef } from "react";

import { TROVE } from "@/lib/brand";
import { formatUSD, PRICING, savingsVs } from "@/lib/pricing";
import {
  firstYearMinor,
  oldestCheck,
  oneTimeMinor,
  recurringPerYearMinor,
} from "@/lib/rivals";
import { easeOutCubic, stageDistance, type StageAt } from "@/lib/timeline";
import type { ProgressStore } from "./progress";

/**
 * The receipt: the page's argument reduced to two numbers a reader can check.
 *
 * Every figure is derived. There is no total typed into this file, because the
 * one thing a page like this cannot survive is a reader adding up the column
 * themselves and getting a different answer. Change a price in lib/rivals.ts
 * and the ledger, the totals, the saving and the sprawl beat's kicker all move
 * together or none of them do.
 *
 * Only the four totals live in the sticky frame, which is one viewport tall and
 * already holding a headline. The itemised list every one of them comes from is
 * components/Ledger.tsx, immediately below the track, where a reader who wants
 * to check the arithmetic has room to check it.
 *
 * The count-up is a pure function of the scroll, like everything else on this
 * page: no interval, no accumulator. Scroll back up and the numbers count back
 * down, which is the only behaviour that makes sense once the reader is holding
 * the clock.
 */

/** Cents, so the running total is exact and the display rounds once, at the end. */
const RECURRING = recurringPerYearMinor();
const ONE_TIME = oneTimeMinor();
const FIRST_YEAR = firstYearMinor();
const SAVING = savingsVs(FIRST_YEAR);

/**
 * Where the count-up sits, given the frame.
 *
 * Runs 0 to 1 across the receipt beat and holds at 1 for everything after it, so
 * a reader who scrolls past and comes back does not watch the totals re-tally.
 * Before the beat it is 0 and the row is dashes: numbers that spin up before
 * anyone has read what they are counting are decoration.
 */
function tallyAt(frame: StageAt): number {
  const ahead = stageDistance(frame.index, "receipt");
  if (ahead > 0) return 0;
  if (ahead < 0) return 1;
  // Front-loaded: the numbers land while the reader is still on the beat rather
  // than finishing exactly as it leaves.
  return easeOutCubic(Math.min(1, frame.local * 1.55));
}

function counted(minor: number, tally: number): string {
  return formatUSD(Math.round(minor * tally));
}

export default function Receipt({
  store,
  live,
}: {
  readonly store: ProgressStore;
  /** False in the stacked fallback, where the totals are simply shown. */
  readonly live: boolean;
}) {
  const recurring = useRef<HTMLElement>(null);
  const once = useRef<HTMLElement>(null);
  const total = useRef<HTMLElement>(null);
  const saved = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!live) return;
    return store.subscribe((frame) => {
      const tally = tallyAt(frame);
      if (recurring.current) recurring.current.textContent = counted(RECURRING, tally);
      if (once.current) once.current.textContent = counted(ONE_TIME, tally);
      if (total.current) total.current.textContent = counted(FIRST_YEAR, tally);
      if (saved.current) saved.current.textContent = counted(SAVING, tally);
    });
  }, [live, store]);

  return (
    <div className="receipt">
      <dl className="receipt-totals">
        <div>
          <dt>Subscriptions</dt>
          <dd>
            <span ref={recurring}>{formatUSD(RECURRING)}</span>
            <span className="receipt-unit"> / year</span>
          </dd>
        </div>
        <div>
          <dt>One-time</dt>
          <dd>
            <span ref={once}>{formatUSD(ONE_TIME)}</span>
            <span className="receipt-unit"> once</span>
          </dd>
        </div>
        <div className="receipt-headline">
          <dt>First year</dt>
          <dd>
            <span ref={total}>{formatUSD(FIRST_YEAR)}</span>
          </dd>
        </div>
        <div className="receipt-headline receipt-win">
          <dt>{TROVE.name}</dt>
          <dd>
            {formatUSD(PRICING.yearly)}
            <span className="receipt-unit"> / year</span>
          </dd>
        </div>
      </dl>

      <p className="receipt-note">
        You keep <span ref={saved}>{formatUSD(SAVING)}</span> in the first year. Prices read from
        each vendor&rsquo;s own page, oldest check {oldestCheck()}. Subscriptions and one-time
        purchases are summed separately and never amortised.
      </p>
    </div>
  );
}
