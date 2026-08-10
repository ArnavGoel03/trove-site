// The words for each beat of the homepage.
//
// Keyed by StageId and typed as a total record, so adding a stage to
// lib/timeline.ts without writing its copy is a compile error rather than a
// blank screen halfway down the page. The timeline owns pacing; this owns
// language; neither can gain a beat the other has not heard of.
//
// Every number in here is interpolated from the file that owns it. There is no
// hand-typed count of apps or dollars, because the two places a marketing page
// most reliably goes stale are the price and the tally, and both of those have
// a source of truth one import away.

import { PLATFORM, PRODUCT, SIGNING, TROVE } from "./brand.ts";
import { TOOL_COUNT } from "./panes.ts";
import { formatUSD, PRICING, TRIAL_LABEL } from "./pricing.ts";
import { firstYearMinor, RIVALS } from "./rivals.ts";
import type { StageId } from "./timeline.ts";

/** Live widgets a beat can carry. One component each, mounted only near its beat. */
export type DemoKey = "json" | "hash" | "regex" | "units" | "color" | "treemap";

export interface Beat {
  /** Small label above the headline. Carries the act number. */
  readonly eyebrow: string;
  readonly headline: string;
  readonly body: string;
  /** One short line of evidence under the body. Optional. */
  readonly kicker?: string;
  /** Interactive proof, in render order. */
  readonly demos?: readonly DemoKey[];
  /**
   * A one-off widget this beat carries instead of demos. Only the receipt has
   * one, and it is named rather than boolean so a second never has to squeeze
   * itself into a flag called `hasReceipt`.
   */
  readonly widget?: "receipt";
}

const RIVAL_COUNT = RIVALS.length;

/**
 * Spelled out because "10 apps to do one job" reads as a spec and "Ten apps to
 * do one job" reads as a complaint, and the complaint is the argument. Falls
 * back to the numeral past twelve, where spelling stops helping.
 */
const NUMBER_WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six",
  "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
] as const;

const RIVAL_WORD = NUMBER_WORDS[RIVAL_COUNT] ?? String(RIVAL_COUNT);

export const BEATS: Record<StageId, Beat> = {
  desk: {
    eyebrow: "01 / The machine",
    headline: "Your Mac ships with a screenshot key.",
    body: "Everything past that, you added yourself. A clipboard manager here, a window snapper there, a disk cleaner you bought once and open twice a year.",
    kicker: `${PLATFORM.minMacOS}. ${PLATFORM.arch}.`,
  },

  sprawl: {
    eyebrow: "02 / The sprawl",
    headline: `${RIVAL_WORD} apps to do one job.`,
    body: "Each one is a menu bar icon, a login item, an update prompt and a renewal email. Each one is a company with an opinion about what your clipboard is worth to it.",
    kicker: `${RIVAL_COUNT} of them, ${formatUSD(firstYearMinor())} in the first year, counted at the end of this page.`,
  },

  collapse: {
    eyebrow: "03 / The collapse",
    headline: "They fold into one window.",
    body: `${TROVE.name} is ${TOOL_COUNT} tools behind a single sidebar. One shortcut opens it, one search field finds anything in it, and there is one thing to keep up to date.`,
    kicker: "Cold launch under half a second, because it is one native app and not a browser wearing a hat.",
  },

  clipboard: {
    eyebrow: "04 / Proof",
    headline: "Everything you copied, still there.",
    body: "Searchable history, pinned snippets, and a staging area for the six fragments you are assembling right now. None of it is synced anywhere, because there is nowhere to sync it to.",
    kicker: "Try it here. This runs in your browser, the same way the app runs on your Mac: locally.",
    demos: ["json", "hash"],
  },

  text: {
    eyebrow: "05 / Proof",
    headline: "Text, actually worked on.",
    body: "Case and slugs, diffs, encoding, hashing, a regex tester that shows you the matches as you type. The jobs you currently do by pasting company text into a website you have never heard of.",
    demos: ["regex", "units"],
  },

  capture: {
    eyebrow: "06 / Proof",
    headline: "Capture the screen, then read it.",
    body: "Snip, record, annotate, and pull the text straight back out of the pixels with the same Vision framework Preview uses. No upload step, so no screenshot of your bank balance in someone else's bucket.",
    demos: ["color"],
  },

  system: {
    eyebrow: "07 / Proof",
    headline: "What the machine is actually doing.",
    body: "CPU and GPU die temperatures, memory pressure, network throughput, battery health, and a treemap of the disk that answers the only question you have: what do I delete.",
    demos: ["treemap"],
  },

  receipt: {
    eyebrow: "08 / The receipt",
    headline: "What it replaces, and what it costs.",
    body: "Every price below was read from the vendor's own page on the date shown. Subscriptions and one-time purchases are counted separately, because turning a one-time purchase into a per-year figure is how comparison pages lie.",
    kicker: `${TROVE.name}: ${formatUSD(PRICING.yearly)} a year, or ${formatUSD(PRICING.monthly)} a month. ${TRIAL_LABEL}.`,
    widget: "receipt",
  },

  trust: {
    eyebrow: "09 / The reason",
    headline: "No account. No cloud. No telemetry.",
    body: "There has never been a server to send anything to. No sign-up, no analytics, no crash reporter phoning home. Your licence is a signature your own Mac verifies, offline, in a millisecond.",
    kicker: SIGNING.short,
  },
};

/**
 * The one caveat that belongs on the page rather than buried in a support doc.
 * Read from SIGNING so the day notarization lands, the sentence disappears from
 * every surface at once.
 */
export const FIRST_LAUNCH_NOTE = SIGNING.firstLaunch;
