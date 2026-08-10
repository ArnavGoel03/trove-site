import { TROVE } from "@/lib/brand";
import { formatUSD, PRICING, savingsVs } from "@/lib/pricing";
import {
  firstYearMinor,
  oneTimeMinor,
  recurringPerYearMinor,
  RIVALS,
  type Rival,
} from "@/lib/rivals";

/**
 * The itemised list behind the receipt, with a link to every price.
 *
 * Server-rendered and static: no store, no scroll, no JavaScript. This is the
 * part of the page a sceptic reads, so it has to be there before hydration, it
 * has to be a real table a screen reader can navigate by column, and every row
 * has to carry the URL the number came from and the date it was read. A price
 * without a source is not an argument, it is a claim.
 *
 * Ordered dearest first. Subscriptions and one-time purchases are visually
 * separated and summed separately, for the reason lib/rivals.ts explains at
 * length: amortising a lifetime licence into a yearly figure is the trick that
 * makes every comparison page worth ignoring.
 */

const LEDGER: readonly Rival[] = [...RIVALS].sort((a, b) => {
  if (a.cadence !== b.cadence) return a.cadence === "year" ? -1 : 1;
  return b.priceMinor - a.priceMinor;
});

const RECURRING = recurringPerYearMinor();
const ONE_TIME = oneTimeMinor();
const FIRST_YEAR = firstYearMinor();
const SAVING = savingsVs(FIRST_YEAR);
const RECURRING_COUNT = RIVALS.filter((r) => r.cadence === "year").length;

function host(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "source";
  }
}

export default function Ledger() {
  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8" aria-labelledby="ledger-title">
      <h2 id="ledger-title" className="text-title font-display font-semibold text-fg text-balance">
        The whole ledger, with sources.
      </h2>
      <p className="mt-4 max-w-2xl text-body text-fg-dim text-pretty">
        {RIVALS.length} apps, {RECURRING_COUNT} of them subscriptions. Every price is what the
        vendor&rsquo;s own page showed on the date beside it. Nothing here is a review-site figure,
        a launch discount, or a lifetime price divided by a guess at how long you will live.
      </p>

      {/* Five columns need 44rem to stay readable, and a phone has 24. Rather
          than hand a reader a table they have to drag sideways, the CSS turns
          each row into a card below 48rem and every cell states its own column
          name from `data-label`.

          Changing `display` on table elements is what drops their implicit
          roles in every engine, so the roles are written out. They are
          redundant on a desktop and load-bearing on a phone, and one table
          that adapts beats two copies of the same prices that can disagree. */}
      <div className="mt-10 overflow-x-auto">
        <table className="ledger" role="table">
          <caption className="sr-only">
            Apps {TROVE.name} replaces, with each vendor&rsquo;s listed price and its source
          </caption>
          <thead role="rowgroup">
            <tr role="row">
              <th scope="col" role="columnheader">
                App
              </th>
              <th scope="col" role="columnheader">
                What it does
              </th>
              <th scope="col" role="columnheader">
                Replaces
              </th>
              <th scope="col" role="columnheader" className="ledger-num">
                Listed price
              </th>
              <th scope="col" role="columnheader">
                Source
              </th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            {LEDGER.map((rival) => (
              <tr key={rival.name} role="row">
                <th scope="row" role="rowheader">
                  {rival.name}
                </th>
                <td role="cell">{rival.does}</td>
                <td role="cell" className="ledger-replaces" data-label="Replaces">
                  {rival.replaces.join(", ")}
                </td>
                <td role="cell" className="ledger-num" data-label="Listed price">
                  {rival.asShown}
                </td>
                <td role="cell" data-label="Source">
                  <a
                    href={rival.source}
                    rel="nofollow noopener"
                    target="_blank"
                    className="ledger-source"
                  >
                    {host(rival.source)}
                    <span className="sr-only">, opens in a new tab</span>
                  </a>
                  <span className="ledger-checked"> {rival.checked}</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot role="rowgroup">
            <tr role="row">
              <th scope="row" role="rowheader" colSpan={3}>
                Subscriptions, per year
              </th>
              <td role="cell" className="ledger-num">
                {formatUSD(RECURRING)}
              </td>
              <td role="cell" />
            </tr>
            <tr role="row">
              <th scope="row" role="rowheader" colSpan={3}>
                One-time purchases
              </th>
              <td role="cell" className="ledger-num">
                {formatUSD(ONE_TIME)}
              </td>
              <td role="cell" />
            </tr>
            <tr role="row" className="ledger-total">
              <th scope="row" role="rowheader" colSpan={3}>
                First year, both together
              </th>
              <td role="cell" className="ledger-num">
                {formatUSD(FIRST_YEAR)}
              </td>
              <td role="cell" />
            </tr>
            <tr role="row" className="ledger-win">
              <th scope="row" role="rowheader" colSpan={3}>
                {TROVE.name}, everything above in one app
              </th>
              <td role="cell" className="ledger-num">
                {formatUSD(PRICING.yearly)} / year
              </td>
              <td role="cell" />
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="mt-6 text-caption text-fg-mute text-pretty">
        Difference in the first year: {formatUSD(SAVING)}. Apps with a usable free tier are
        deliberately left out of this table, because counting them as money you spend would not be
        true.
      </p>
    </section>
  );
}
