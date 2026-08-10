/**
 * Every colour on the site that is not the brand accent.
 *
 * Five hues were written out by hand in eight files, and `lib/panes.ts` alone
 * repeated three of them 53 times: once per pane, always equal to the accent of
 * the section that pane belongs to. So a section's colour lived in 54 places
 * and a single typo would have shown a pane page in a colour that disagreed
 * with its own section header. Each value is written once, here.
 *
 * `HUE` is the raw palette. `STATUS` names the three that carry meaning
 * (shipped / in progress / partial, and yes / partial on the comparison
 * matrix), and those three are mirrored into `@theme` in app/globals.css so
 * className call sites can say `text-ok` or `bg-warn/15`. This file stays the
 * source of the values; test/palette.test.ts parses the stylesheet and fails if
 * the mirror drifts.
 *
 * The raw strings matter because most call sites build a hex-alpha fill by
 * concatenation (`${accent}22`), which a CSS custom property cannot do.
 */
export const HUE = {
  green: "#5be3a4",
  blue: "#4cb8ff",
  amber: "#ffd166",
  pink: "#ff5d8f",
  /** Muted, for the one section that should not compete for attention. */
  slate: "#9ca3af",
} as const;

/** The three hues that mean something rather than merely distinguish. */
export const STATUS = {
  /** Shipped, present, yes. */
  ok: HUE.green,
  /** Neutral emphasis: in progress, a link, a document. */
  info: HUE.blue,
  /** Partial, planned, caveated. */
  warn: HUE.amber,
} as const;

export type StatusTone = keyof typeof STATUS;
