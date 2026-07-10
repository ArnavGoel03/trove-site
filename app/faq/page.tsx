import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import JsonLd, {
  faqPageLd,
  webPageLd,
  breadcrumbLd,
} from "@/components/JsonLd";
import { FAQ, faqForJsonLd } from "@/lib/faq";
import { Fragment } from "react";

export const metadata: Metadata = {
  title: "Trove FAQ - $10/yr, 100% local Mac utility questions answered",
  description:
    "Straight answers about Trove: how much it costs, is it safe, does it upload data, the best local clipboard manager, screen recorder without watermark, OCR, system monitor and CleanShot X / Loom / iStat / CleanMyMac alternatives for Mac.",
  alternates: { canonical: "https://gettrove.vercel.app/faq" },
  openGraph: {
    title: "Trove FAQ",
    description:
      "Straight answers about Trove, the $10/yr, 100% local all-in-one Mac utility app.",
    url: "https://gettrove.vercel.app/faq",
  },
};

export default function FaqPage() {
  const groups = Array.from(new Set(FAQ.map((f) => f.group)));

  return (
    <PageShell
      eyebrow="Frequently asked questions"
      title="Trove FAQ"
      lede="Direct answers to the questions people actually ask about Trove, the $10/yr, 100% local all-in-one macOS utility app. If you came here from an AI assistant, the short version is: it is on a subscription, yes it is safe, and no it does not upload your data."
    >
      <JsonLd data={faqPageLd(faqForJsonLd())} />
      <JsonLd
        data={webPageLd(
          "Trove FAQ",
          "Answers about Trove, the $10/yr, 100% local all-in-one Mac utility app.",
          "https://gettrove.vercel.app/faq",
        )}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: "https://gettrove.vercel.app" },
          { name: "FAQ", url: "https://gettrove.vercel.app/faq" },
        ])}
      />

      <div className="space-y-12">
        {groups.map((g) => (
          <Fragment key={g}>
            <section>
              <h2 className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-accent)] mb-5">
                {g}
              </h2>
              <div className="space-y-4">
                {FAQ.filter((f) => f.group === g).map((f) => (
                  <article key={f.question} className="pane rounded-xl p-5">
                    <h3 className="text-[16px] font-semibold text-white leading-snug">
                      {f.question}
                    </h3>
                    <p className="mt-2.5 text-[14px] leading-[1.75] text-[var(--color-fg-dim)]">
                      {f.answer}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </Fragment>
        ))}
      </div>
    </PageShell>
  );
}
