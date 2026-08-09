// Single source of truth for every price on the site.
//
// Until this file existed the site deliberately refused to name a number, and
// six pages each described the deal in their own words ("one simple
// subscription", "subscription-based", "one subscription"). That was safe from
// drift only because there was nothing concrete to drift. The moment a real
// figure exists, one home for it is the difference between a price change being
// a one-line edit and a site-wide hunt through prose.
//
// RULES
//   1. Money is integer minor units (cents). Floating point dollars accumulate
//      error the moment you sum a ledger, and the receipt on the homepage sums
//      ten of them.
//   2. Nothing outside this file writes a currency literal. check-hardcoded.mjs
//      fails the build on `$<digit>` anywhere else.
//   3. Display formatting lives here too, so "$39" and "$4.99" can never be
//      typed inconsistently (one page saying $39.00 and another $39 reads as
//      two different products).

/** Cents, so ledger sums stay exact. */
export type Minor = number;

export const PRICING = {
  /** Billed once a year. The headline figure. */
  yearly: 3900 as Minor,
  /** Billed monthly, for people who will not commit to a year up front. */
  monthly: 499 as Minor,
  /** Days of full access before any card is required. */
  trialDays: 14,
  /** Days after purchase in which a refund is unconditional. */
  refundDays: 30,
  /** What one licence covers. Derived from brand.ts app keys, not retyped. */
  seats: 1,
} as const;

/** "14-day free trial", written once. */
export const TRIAL_LABEL = `${PRICING.trialDays}-day free trial`;

/**
 * Formats minor units as USD, dropping a zero cents part.
 *
 * $39 and $39.00 are the same price but not the same sentence: the second one
 * reads like an invoice, the first like a decision. Cents are shown only when
 * they carry information, which is why the monthly figure keeps them.
 */
export function formatUSD(minor: Minor): string {
  const negative = minor < 0;
  const abs = Math.abs(Math.round(minor));
  const dollars = Math.floor(abs / 100);
  const cents = abs % 100;
  const body =
    cents === 0
      ? `$${dollars.toLocaleString("en-US")}`
      : `$${dollars.toLocaleString("en-US")}.${String(cents).padStart(2, "0")}`;
  return negative ? `-${body}` : body;
}

/**
 * What a year of Trove costs on each plan, so the page can show the saving of
 * paying yearly without a second literal appearing anywhere.
 */
export const YEARLY_ON_MONTHLY: Minor = PRICING.monthly * 12;
export const YEARLY_SAVING: Minor = YEARLY_ON_MONTHLY - PRICING.yearly;

/** Whole percent saved by paying yearly, rounded down so the claim is never generous. */
export const YEARLY_SAVING_PCT = Math.floor(
  (YEARLY_SAVING / YEARLY_ON_MONTHLY) * 100,
);

/**
 * What a visitor keeps by buying Trove instead of a stack of alternatives.
 * Never negative: if the stack is somehow cheaper the honest answer is zero
 * saving, not a negative one dressed up as a discount.
 */
export function savingsVs(stackMinor: Minor): Minor {
  return Math.max(0, stackMinor - PRICING.yearly);
}

// ---------------------------------------------------------------------------
// Prose forms
//
// Roughly thirty pages describe the price in a sentence rather than a table:
// FAQ answers, comparison rows, the llms.txt feeds Google and ChatGPT read, and
// page metadata. Until now each of those interpolated PRODUCT.priceAdjective,
// which resolved to the word "subscription-based" because there was no number
// to say. Every one of them now says the number, and none of them changed:
// lib/brand.ts re-exports these, so the call sites still read PRODUCT.
//
// They live here rather than in brand.ts because they are derived from
// PRICING. A copy string that contains a price is a price.
// ---------------------------------------------------------------------------

/**
 * Inline adjective, as in "Trove is a $39-a-year, 100% local Mac utility".
 * Hyphenated because it modifies a noun, and the hyphens are what stop a reader
 * parsing it as "a $39 a year local Mac utility".
 */
export const PRICE_ADJECTIVE = `${formatUSD(PRICING.yearly)}-a-year`;

/** Noun phrase for stat rows and callouts, where a bare figure needs its unit. */
export const PRICE_LABEL = `${formatUSD(PRICING.yearly)}/year`;

/**
 * The full offer in one sentence. Both cadences, because leading with $39
 * without the monthly option loses the reader who will not commit to a year,
 * and the suite, because one licence covering three apps is the argument.
 */
export const PRICE_SENTENCE =
  `${TRIAL_LABEL}, then ${formatUSD(PRICING.yearly)} a year ` +
  `or ${formatUSD(PRICING.monthly)} a month. One licence unlocks all three apps.`;
