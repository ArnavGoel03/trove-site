import { STUDIO, SUITE, TROVE } from "@/lib/brand";
import { PRICE_LABEL } from "@/lib/pricing";
import { SUITE_DETAIL } from "@/lib/suite";
import { Bullets, Button, Card, Note, Pill, Section } from "@/components/ui";

/**
 * The product page for a suite app that is not Trove.
 *
 * One component for both, because the argument is the same shape each time:
 * what it is, what it does, what it replaces, what is not finished, and the
 * fact that the licence already covers it. All the copy comes from
 * lib/suite.ts, so this file holds layout and nothing else.
 *
 * It replaces components/AppComingSoon.tsx, which printed the tagline twice
 * (PageShell already renders it as the lede) and then told the reader nothing
 * except that the app was not out yet. A page whose entire content is "not
 * yet" is a page that argues against the purchase it sits next to.
 */
export default function AppPage({ appKey }: { appKey: "relay" | "tend" }) {
  const app = SUITE_DETAIL[appKey];
  const { brand } = app;

  return (
    <div className="space-y-0">
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone="accent">In testing</Pill>
        <Pill>v{brand.version}</Pill>
        <Pill>Part of the {STUDIO.name} suite</Pill>
      </div>

      <div className="mt-8 space-y-5">
        {app.body.map((paragraph) => (
          <p key={paragraph} className="text-body text-fg-dim text-pretty">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/pricing">See what the licence covers</Button>
        <Button href="/download" tone="secondary">
          Download {TROVE.name} now
        </Button>
      </div>

      <Section title="What it does">
        <div className="grid gap-4 sm:grid-cols-2">
          {app.capabilities.map((capability) => (
            <Card key={capability.title} as="article">
              <h3 className="text-body font-medium tracking-tight text-fg">
                {capability.title}
              </h3>
              <p className="mt-2 text-caption text-fg-dim text-pretty">
                {capability.detail}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title={`Instead of ${app.instead.of}`}
        lede={app.instead.why}
      >
        <Bullets
          items={[
            <>
              <span className="text-fg">One licence, three apps.</span> {SUITE.pitch}{" "}
              {brand.name} is included at {PRICE_LABEL}, alongside {TROVE.name} and
              everything shipped after it.
            </>,
            <>
              <span className="text-fg">No account, ever.</span> Nothing to sign up
              for, nothing to sign in to, and nothing on our side that could be
              breached, because there is no our side.
            </>,
            <>
              <span className="text-fg">Native, not a browser.</span> Written in
              SwiftUI against the platform, so it launches instantly and behaves
              like the rest of your Mac.
            </>,
          ]}
        />
      </Section>

      <Section title="Where it stands">
        <div className="space-y-4">
          <Note title="Not downloadable yet">{app.horizon}</Note>
          <Card>
            <div className="text-caption font-medium tracking-tight text-fg">
              Requirements
            </div>
            <p className="mt-2 text-caption text-fg-dim text-pretty">
              {app.requirements}
            </p>
          </Card>
        </div>
      </Section>
    </div>
  );
}
