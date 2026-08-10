// The apps Trove replaces, with prices that can be checked.
//
// This is the evidence behind the homepage receipt, and it is the one part of
// the site a sceptical reader is most likely to fact-check, so every entry
// carries the URL it was read from and the date it was read. A price with no
// source is not allowed to render: test/rivals.test.ts fails the build.
//
// WHAT IS DELIBERATELY NOT HERE
//   - Apps with a usable free tier (Postman, ColorSlurp, Amphetamine). Counting
//     them as money the visitor spends would be a lie, and one provable lie
//     costs more than the whole ledger gains.
//   - CleanMyMac, whose store page renders its price in client-side JS. It
//     could not be read from the page, so it is not claimed.
//   - Any price sourced from a review site or a deal aggregator. Vendor page or
//     App Store lookup API only.
//
// CADENCE HONESTY
// Subscriptions and one-time purchases are kept apart and summed separately.
// Amortising a $139.99 lifetime purchase into "per year" is the trick every
// comparison page pulls, and it is exactly the kind of thing that makes a
// reader stop trusting the rest of the page. The homepage shows both totals and
// labels the combined figure "first year".

/** Cents. Same convention as lib/pricing.ts, so ledger sums stay exact. */
type Minor = number;

export type Cadence = "year" | "once";

export interface Rival {
  /** Product name exactly as its vendor writes it. */
  readonly name: string;
  /** Pane names this app overlaps with. Must match `name` in lib/panes.ts. */
  readonly replaces: readonly string[];
  /** One line on what it does, in the visitor's words rather than the vendor's. */
  readonly does: string;
  readonly priceMinor: Minor;
  readonly cadence: Cadence;
  /** Exactly what the source page displays, e.g. "$8/mo billed annually". */
  readonly asShown: string;
  /** Vendor pricing page or App Store listing. Never a review or deal site. */
  readonly source: string;
  /** ISO date the price above was read from `source`. */
  readonly checked: string;
}

/**
 * Read 2026-08-10. Vendor pages were fetched directly; App Store prices come
 * from the iTunes lookup API, which is the store's own machine-readable feed.
 *
 * Re-check these before any release that touches the receipt. A stale price is
 * the same defect as an invented one, it just takes longer to become wrong.
 */
export const RIVALS: readonly Rival[] = [
  {
    name: "Raycast Pro",
    replaces: ["History", "Snippets", "Local AI", "Calculator"],
    does: "Launcher, clipboard history, snippets and AI",
    priceMinor: 9600,
    cadence: "year",
    asShown: "$8/mo billed annually",
    source: "https://www.raycast.com/pro",
    checked: "2026-08-10",
  },
  {
    name: "TextExpander",
    replaces: ["Snippets"],
    does: "Text snippets that expand as you type",
    priceMinor: 3996,
    cadence: "year",
    asShown: "$4.16/mo, billed annually at $39.96",
    source: "https://textexpander.com/pricing",
    checked: "2026-08-10",
  },
  {
    name: "Paste",
    replaces: ["History", "Stage"],
    does: "Clipboard history with search and pinning",
    priceMinor: 2999,
    cadence: "year",
    asShown: "$29.99 billed annually",
    source: "https://pasteapp.io/",
    checked: "2026-08-10",
  },
  {
    name: "PDF Expert",
    replaces: ["PDF"],
    does: "Edit, merge, split and sign PDFs",
    priceMinor: 13999,
    cadence: "once",
    asShown: "$139.99",
    source: "https://apps.apple.com/us/app/pdf-expert-edit-sign-pdfs/id1055273043",
    checked: "2026-08-10",
  },
  {
    name: "CleanShot X",
    replaces: ["Snip", "Record"],
    does: "Screenshots and screen recording with annotation",
    priceMinor: 2900,
    cadence: "once",
    asShown: "$29 one-time payment",
    source: "https://cleanshot.com/pricing",
    checked: "2026-08-10",
  },
  {
    name: "iStat Menus 7",
    replaces: ["Overview", "GPU", "Battery", "Network"],
    does: "CPU, GPU, memory, network and battery in the menu bar",
    priceMinor: 1199,
    cadence: "once",
    asShown: "$11.99",
    source: "https://apps.apple.com/us/app/istat-menus-7/id6499559693",
    checked: "2026-08-10",
  },
  {
    name: "TextSniper",
    replaces: ["OCR"],
    does: "Pull text out of anything on screen",
    priceMinor: 999,
    cadence: "once",
    asShown: "$9.99",
    source: "https://apps.apple.com/us/app/textsniper/id1528890965",
    checked: "2026-08-10",
  },
  {
    name: "DaisyDisk",
    replaces: ["Treemap", "Scan", "Clean"],
    does: "See what is eating the disk, then delete it",
    priceMinor: 999,
    cadence: "once",
    asShown: "$9.99",
    source: "https://apps.apple.com/us/app/daisydisk/id411643860",
    checked: "2026-08-10",
  },
  {
    name: "Magnet",
    replaces: ["Snap", "Switcher"],
    does: "Snap windows into halves, quarters and thirds",
    priceMinor: 499,
    cadence: "once",
    asShown: "$4.99",
    source: "https://apps.apple.com/us/app/magnet/id441258766",
    checked: "2026-08-10",
  },
  {
    name: "RegExRX",
    replaces: ["Regex"],
    does: "Build and test regular expressions",
    priceMinor: 499,
    cadence: "once",
    asShown: "$4.99",
    source: "https://apps.apple.com/us/app/regexrx/id498370702",
    checked: "2026-08-10",
  },
];

/** Recurring spend, per year. */
export function recurringPerYearMinor(): Minor {
  return RIVALS.filter((r) => r.cadence === "year").reduce(
    (sum, r) => sum + r.priceMinor,
    0,
  );
}

/** One-time purchases, paid once in year one. */
export function oneTimeMinor(): Minor {
  return RIVALS.filter((r) => r.cadence === "once").reduce(
    (sum, r) => sum + r.priceMinor,
    0,
  );
}

/**
 * What year one costs if you buy the stack: every subscription for a year plus
 * every one-time purchase. Labelled "first year" wherever it renders, because
 * year two is cheaper and pretending otherwise would be the amortisation trick
 * in reverse.
 */
export function firstYearMinor(): Minor {
  return recurringPerYearMinor() + oneTimeMinor();
}

/** Oldest `checked` date in the table, for the "prices checked" stamp. */
export function oldestCheck(): string {
  return RIVALS.reduce(
    (oldest, r) => (r.checked < oldest ? r.checked : oldest),
    RIVALS[0].checked,
  );
}

/**
 * The cited price for a product, exactly as its own vendor shows it, or null.
 *
 * /compare listed thirteen prices in one hand-typed sentence with no source and
 * no date, and four of them disagreed with the table above: TextSniper was
 * written as $7 where its App Store listing says $9.99, DaisyDisk as $10 where
 * the listing says $9.99. A comparison page that gets a rival's own price wrong
 * has handed the reader a reason to disbelieve every other row.
 *
 * Matching is by prefix so a column headed "iStat Menus" finds the versioned
 * entry "iStat Menus 7" and "Raycast" finds "Raycast Pro". Anything not in
 * RIVALS returns null, and the caller must then say nothing about its price
 * rather than guess: an uncited number is the defect this replaces.
 */
export function citedPrice(product: string): string | null {
  const match = RIVALS.find(
    (r) => r.name === product || r.name.startsWith(`${product} `),
  );
  if (!match) return null;
  return match.cadence === "year"
    ? `${match.asShown} per year`
    : `${match.asShown} one-time`;
}
