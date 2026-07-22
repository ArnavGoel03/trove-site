import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import JsonLd, { webPageLd, breadcrumbLd } from "@/components/JsonLd";
import { GUIDES } from "@/lib/guides";
import { ChevronRight } from "lucide-react";
import { STUDIO } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Guides — Trove",
  description:
    "Long-form how-tos for Trove — recording, OCR, hashing, clipboard workflows, text-transform pipelines.",
  alternates: { canonical: `${STUDIO.domain}/guides` },
};

export default function GuidesIndex() {
  return (
    <PageShell
      eyebrow="Guides"
      title="How to actually use Trove"
      lede="Real workflows, end-to-end, with the keystrokes and panes called out. Each guide takes a few minutes and turns a Trove feature you've seen on the homepage into one you actually use."
    >
      <JsonLd
        data={webPageLd(
          "Trove Guides",
          "Long-form how-tos for using Trove.",
          `${STUDIO.domain}/guides`,
        )}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: STUDIO.domain },
          { name: "Guides", url: `${STUDIO.domain}/guides` },
        ])}
      />

      <ul className="space-y-3">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/guides/${g.slug}`}
              className="pane rounded-xl p-5 flex items-start gap-4 hover:border-white/20 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-accent)] mb-1.5">
                  {g.eyebrow} · {g.estimate}
                </div>
                <div className="text-[16px] font-medium text-white leading-snug">
                  {g.title}
                </div>
                <div className="text-[13.5px] text-[var(--color-fg-dim)] leading-[1.65] mt-1.5">
                  {g.lede}
                </div>
              </div>
              <span className="shrink-0 inline-flex w-7 h-7 rounded-full items-center justify-center bg-white/[0.04] text-[var(--color-fg-dim)] mt-1">
                <ChevronRight size={14} strokeWidth={2} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
