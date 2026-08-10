import type { Metadata } from "next";
import Link from "next/link";

import DownloadButton from "@/components/DownloadButton";
import JsonLd, { breadcrumbLd, faqPageLd, webPageLd } from "@/components/JsonLd";
import PageShell from "@/components/PageShell";
import { Bullets, Card, Note, Pill, Section, Stat, TextLink } from "@/components/ui";
import { APPS, PLATFORM, PRODUCT, SIGNING, STUDIO, STUDIO_HOST, SUITE, TROVE } from "@/lib/brand";
import {
  DEVICES_LABEL,
  formatUSD,
  PRICING,
  REFUND_LABEL,
  savingsVs,
  TRIAL_LABEL,
  YEARLY_ON_MONTHLY,
  YEARLY_SAVING,
  YEARLY_SAVING_PCT,
} from "@/lib/pricing";
import { ISSUES_URL } from "@/lib/releases";
import { firstYearMinor, oldestCheck, RIVALS } from "@/lib/rivals";

const FIRST_YEAR = firstYearMinor();
const SAVED = savingsVs(FIRST_YEAR);
const URL = `${STUDIO.domain}/pricing`;

const TITLE = `Pricing: ${formatUSD(PRICING.yearly)} a year for the whole suite`;
const DESCRIPTION =
  `${TRIAL_LABEL}, then ${formatUSD(PRICING.yearly)} a year or ` +
  `${formatUSD(PRICING.monthly)} a month. One licence unlocks ${TROVE.name}, ` +
  `${APPS.relay.name} and ${APPS.tend.name} on ${DEVICES_LABEL}. No account, no telemetry.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: "website" },
};

/**
 * Pricing questions, kept here rather than in lib/faq.ts.
 *
 * lib/faq.ts is the product FAQ: forty-odd entries about what the tools do,
 * feeding /faq and the llms.txt export. These five are about the transaction,
 * they only make sense next to the plans, and folding them into the product
 * FAQ would put "what happens when my subscription ends" between two questions
 * about clipboard history.
 */
const QUESTIONS: readonly { question: string; answer: string }[] = [
  {
    question: `What happens when the ${TRIAL_LABEL.replace("-day free trial", "-day trial")} ends?`,
    answer:
      `Nothing is deleted and nothing is uploaded. ${TROVE.name} keeps running in a reduced ` +
      `state and your clipboard history, snippets and settings stay exactly where they are, ` +
      `on your Mac. Enter a licence key at any point and everything unlocks again. There is no ` +
      `account to close, because there was never an account.`,
  },
  {
    question: "Does one licence really cover all three apps?",
    answer:
      `Yes. The key you buy carries an entitlement for the whole suite, so ${APPS.relay.name} ` +
      `and ${APPS.tend.name} unlock with the same key the day they ship, at no extra cost and ` +
      `with no upgrade path to sit through. That is the whole point of pricing the suite ` +
      `rather than the app.`,
  },
  {
    question: `Why is it ${formatUSD(PRICING.yearly)} and not one payment forever?`,
    answer:
      `A lifetime price is a bet that the app stops changing. ${TROVE.name} shipped ` +
      `${PRODUCT.toolCount} tools and is on version ${TROVE.version}; a yearly price is what ` +
      `pays for the next version instead of the last one. If that is not the trade you want, ` +
      `the monthly plan exists precisely so you can leave after a month.`,
  },
  {
    question: "How many Macs can I use it on?",
    answer:
      `${DEVICES_LABEL[0].toUpperCase()}${DEVICES_LABEL.slice(1)}. The licence is tied to you, ` +
      `not to a machine, so a new Mac is a paste of the same key rather than a support ticket.`,
  },
  {
    question: "Can I get a refund?",
    answer:
      `Within ${REFUND_LABEL} of the first charge, for any reason, no questions asked. The full ` +
      `terms are on the refund policy page, including what happens to a renewal you did not ` +
      `expect.`,
  },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageLd(TITLE, DESCRIPTION, URL),
          faqPageLd([...QUESTIONS]),
          breadcrumbLd([
            { name: TROVE.name, url: STUDIO.domain },
            { name: "Pricing", url: URL },
          ]),
        ]}
      />
      <PageShell
        eyebrow="Pricing"
        title="One licence. Every app. One price."
        lede={
          <>
            {TRIAL_LABEL} of the whole thing: {PRODUCT.toolCount} tools, no account, no card.
            After that it is {formatUSD(PRICING.yearly)} a year, and the same key unlocks{" "}
            {APPS.relay.name} and {APPS.tend.name} the day they ship.
          </>
        }
      >
        <Plans />

        <Section
          id="covers"
          title="What the key unlocks"
          lede={`${SUITE.pitch} Bought once, entered once, valid on ${DEVICES_LABEL}.`}
        >
          <ul className="grid gap-4 sm:grid-cols-3">
            {(["trove", "relay", "tend"] as const).map((key) => {
              const app = APPS[key];
              const live = app.status === "live";
              return (
                <Card as="li" key={app.key} className="flex flex-col">
                  <Pill tone={live ? "live" : "neutral"}>
                    {live ? "Available now" : "In development"}
                  </Pill>
                  <h3 className="mt-4 font-display text-lead font-semibold tracking-tight text-fg">
                    {app.name}
                  </h3>
                  <p className="mt-1 text-caption text-accent">{app.tagline}</p>
                  <p className="mt-3 flex-1 text-caption text-fg-dim text-pretty">{app.blurb}</p>
                  <p className="mt-4 text-caption">
                    <TextLink href={app.href}>
                      {live ? "What it does" : "Preview"}
                    </TextLink>
                  </p>
                </Card>
              );
            })}
          </ul>
          <Note title="Nothing is held back for a higher tier.">
            There is one plan, not a Personal and a Pro. Every tool, every inline action and
            every future app in the suite is in it. The only choice on this page is how often
            you pay.
          </Note>
        </Section>

        <Section
          id="against"
          title="What it costs to not buy it"
          lede={
            <>
              The {RIVALS.length} apps {TROVE.name} replaces, priced from their own vendors&rsquo;
              pages and checked on {oldestCheck()}. Subscriptions counted for one year, one-time
              purchases counted once.
            </>
          }
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              value={formatUSD(FIRST_YEAR)}
              label="Buying the stack, first year"
              hint={`${RIVALS.length} apps, every price sourced.`}
            />
            <Stat
              value={formatUSD(PRICING.yearly)}
              label={`Buying ${TROVE.name}, first year`}
              hint={`Plus ${APPS.relay.name} and ${APPS.tend.name} when they land.`}
            />
            <Stat
              value={formatUSD(SAVED)}
              label="Kept, first year"
              hint="Against the same list of jobs, not a list of features."
            />
          </div>
          <p className="mt-5 text-caption text-fg-mute text-pretty">
            The itemised table, with a link to every price and the date it was read, is{" "}
            <TextLink href="/#ledger-title">on the homepage</TextLink>. Nothing in it is a
            review-site figure, a launch discount, or a lifetime price divided by a guess.
          </p>
        </Section>

        <Section id="terms" title="The parts people get burned by">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <h3 className="text-body font-medium tracking-tight text-fg">
                It runs on {PLATFORM.arch} only
              </h3>
              <p className="mt-2 text-caption text-fg-dim text-pretty">
                {PLATFORM.minMacOS}. {PLATFORM.archDetail}. If you are on an Intel Mac, do not
                buy this yet, and the {TRIAL_LABEL.replace("-day free trial", "-day trial")} will
                tell you within a minute either way.
              </p>
            </Card>
            <Card>
              <h3 className="text-body font-medium tracking-tight text-fg">
                First launch needs a right-click
              </h3>
              <p className="mt-2 text-caption text-fg-dim text-pretty">
                {SIGNING.short}. {SIGNING.firstLaunch}
              </p>
            </Card>
            <Card>
              <h3 className="text-body font-medium tracking-tight text-fg">
                Two of the three apps are not out
              </h3>
              <p className="mt-2 text-caption text-fg-dim text-pretty">
                {APPS.relay.name} and {APPS.tend.name} are in development. Buy today for{" "}
                {TROVE.name}, on what {TROVE.name} does today. Treat the other two as included
                later, never as the reason to pay now.
              </p>
            </Card>
            <Card>
              <h3 className="text-body font-medium tracking-tight text-fg">
                Refunds take an email, not a form
              </h3>
              <p className="mt-2 text-caption text-fg-dim text-pretty">
                {REFUND_LABEL}, any reason, no questions. Read the{" "}
                <TextLink href="/refund">refund policy</TextLink> before you buy rather than
                after, which is the only time it is any use.
              </p>
            </Card>
          </div>
        </Section>

        <Section id="faq" title="Questions about the money">
          <dl className="space-y-6">
            {QUESTIONS.map((q) => (
              <div key={q.question} className="border-t border-line-soft pt-6">
                <dt className="text-body font-medium tracking-tight text-fg text-pretty">
                  {q.question}
                </dt>
                <dd className="mt-2 text-body text-fg-dim text-pretty">{q.answer}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-caption text-fg-mute text-pretty">
            Anything else about a licence or a charge:{" "}
            <TextLink href="/contact">contact</TextLink>. Anything about a bug:{" "}
            <TextLink href={ISSUES_URL} external>
              the issue tracker
            </TextLink>
            . Anything about how the licence check works:{" "}
            <TextLink href="/security">security</TextLink>.
          </p>
        </Section>

        <section
          aria-labelledby="pricing-close"
          className="mt-20 flex flex-col items-center border-t border-line-soft pt-16 text-center"
        >
          <h2
            id="pricing-close"
            className="font-display text-title font-semibold text-fg text-balance"
          >
            Try the whole thing for {PRICING.trialDays} days first.
          </h2>
          <p className="mt-4 max-w-lg text-body text-fg-dim text-pretty">
            No card, no account, nothing to cancel. If it does not earn its place on your Mac in
            two weeks, it never will.
          </p>
          <div className="mt-8">
            <DownloadButton size="lg" />
          </div>
          <p className="mt-5 text-caption text-fg-mute">
            {PLATFORM.minMacOS} &middot; {PLATFORM.archDetail} &middot; {STUDIO_HOST}
          </p>
          <p className="mt-6 text-caption text-fg-dim">
            <Link
              href="/features"
              className="underline decoration-line-strong underline-offset-4 hover:text-accent"
            >
              Every tool
            </Link>
            <span aria-hidden="true" className="px-2 text-fg-mute">
              &middot;
            </span>
            <Link
              href="/compare"
              className="underline decoration-line-strong underline-offset-4 hover:text-accent"
            >
              Against the alternatives
            </Link>
            <span aria-hidden="true" className="px-2 text-fg-mute">
              &middot;
            </span>
            <Link
              href="/download"
              className="underline decoration-line-strong underline-offset-4 hover:text-accent"
            >
              Download
            </Link>
          </p>
        </section>
      </PageShell>
    </>
  );
}

/**
 * The two cadences, side by side.
 *
 * Yearly is first and marked, because it is both cheaper and the one that
 * matches how the product is built. The monthly card still states its true
 * annual cost: a plan that quietly costs more over a year, shown only as a
 * small number, is the oldest trick on a pricing page and the one thing that
 * would make a reader distrust the ledger further down.
 */
function Plans() {
  return (
    <section aria-labelledby="plans-title">
      <h2 id="plans-title" className="sr-only">
        Plans
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-accent/40 bg-surface-1 p-6 shadow-[--shadow-card]">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-body font-medium tracking-tight text-fg">Yearly</h3>
            <Pill tone="accent">Save {YEARLY_SAVING_PCT}%</Pill>
          </div>
          <p className="mt-5 font-display text-hero font-semibold tabular-nums text-fg">
            {formatUSD(PRICING.yearly)}
          </p>
          <p className="mt-1 text-caption text-fg-mute">per year, billed once</p>
          <div className="mt-6">
            <Bullets
              items={[
                <>
                  {formatUSD(YEARLY_SAVING)} less than twelve months at the monthly rate (
                  {formatUSD(YEARLY_ON_MONTHLY)}).
                </>,
                <>One key, valid on {DEVICES_LABEL}.</>,
                <>
                  Unlocks {APPS.trove.name}, {APPS.relay.name} and {APPS.tend.name}.
                </>,
                <>{TRIAL_LABEL} before anything is charged.</>,
              ]}
            />
          </div>
        </div>

        <div className="rounded-lg border border-line-soft bg-surface-1 p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-body font-medium tracking-tight text-fg">Monthly</h3>
          </div>
          <p className="mt-5 font-display text-hero font-semibold tabular-nums text-fg">
            {formatUSD(PRICING.monthly)}
          </p>
          <p className="mt-1 text-caption text-fg-mute">per month, cancel any time</p>
          <div className="mt-6">
            <Bullets
              items={[
                <>
                  {formatUSD(YEARLY_ON_MONTHLY)} if you keep it for a year, which is{" "}
                  {formatUSD(YEARLY_SAVING)} more than the yearly plan.
                </>,
                <>Exactly the same app. Nothing is gated by cadence.</>,
                <>For trying a year of updates without committing to one.</>,
                <>{TRIAL_LABEL} before anything is charged.</>,
              ]}
            />
          </div>
        </div>
      </div>
      <p className="mt-5 text-caption text-fg-mute text-pretty">
        Prices in USD. Local tax, where it applies, is added at checkout by the payment
        processor. {TROVE.name} itself never sees a card number: it has no network code for
        payments and no account system to attach one to.
      </p>
    </section>
  );
}
