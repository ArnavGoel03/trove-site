import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ACTIONS, ACTIONS_BY_SLUG, relatedActions } from "@/lib/actions";

// Pre-render every action page at build time for snappy SEO + Lighthouse.
export async function generateStaticParams() {
  return ACTIONS.map((a) => ({ slug: a.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const action = ACTIONS_BY_SLUG[slug];
  if (!action) return { title: "Not found" };
  const title = `${action.title} on Mac, local, no upload | Trove`;
  const description = action.tagline;
  const url = `https://gettrove.vercel.app/action/${action.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    keywords: action.searchTerms,
    openGraph: {
      title,
      description,
      url,
      siteName: "Trove",
      type: "article",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ActionPage({ params }: PageProps) {
  const { slug } = await params;
  const action = ACTIONS_BY_SLUG[slug];
  if (!action) return notFound();
  const related = relatedActions(action, 8);

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `${action.title} on Mac`,
    description: action.tagline,
    totalTime: "PT5S",
    tool: { "@type": "SoftwareApplication", name: "Trove" },
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Open the Quick Switcher",
        text: "Press ⌘K (or your bound hotkey) anywhere in Trove.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: `Type the trigger`,
        text: `Type: ${action.triggers[0]}`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Hit Return",
        text: "The result is copied to your clipboard.",
      },
    ],
  };

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Trove",
    operatingSystem: "macOS 13+",
    applicationCategory: "DeveloperApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    aggregateRating: undefined,
    description: `${action.title} is one of 60+ inline ⌘K actions Trove ships. Local, no upload, no telemetry.`,
  };

  return (
    <>
      <Nav />
      <main id="main-content" className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <nav
          aria-label="Breadcrumb"
          className="text-[12px] text-[var(--color-fg-dim)] mb-6"
        >
          <Link href="/" className="hover:text-white">
            Trove
          </Link>
          <span className="mx-2">›</span>
          <Link href="/action" className="hover:text-white">
            Inline actions
          </Link>
          <span className="mx-2">›</span>
          <span className="text-white">{action.title}</span>
        </nav>

        <h1 className="text-[clamp(34px,5vw,52px)] font-semibold tracking-tight leading-[1.05]">
          {action.title} on Mac
        </h1>
        <p className="mt-4 text-[18px] text-[var(--color-fg-dim)] leading-relaxed">
          {action.tagline}
        </p>

        <section className="mt-10 rounded-3xl border border-white/[0.07] bg-white/[0.025] p-7">
          <div className="text-[12px] uppercase tracking-wide text-[var(--color-fg-dim)] mb-3">
            One-keystroke workflow
          </div>
          <ol className="space-y-3 text-[14.5px]">
            <li>
              <strong>1.</strong> Open Trove (or hit your ⌘K hotkey from
              anywhere).
            </li>
            <li>
              <strong>2.</strong> Type:{" "}
              <code className="px-1.5 py-0.5 rounded bg-black/40 font-mono text-[13px]">
                {action.triggers[0]}
              </code>
            </li>
            <li>
              <strong>3.</strong> Hit <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[12px]">↩</kbd> and the result is on your clipboard.
            </li>
          </ol>
        </section>

        <section className="mt-10">
          <div className="text-[12px] uppercase tracking-wide text-[var(--color-fg-dim)] mb-3">
            Example
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <div className="text-[11px] text-[var(--color-fg-dim)] uppercase tracking-wide mb-2">
                Input
              </div>
              <pre className="font-mono text-[13px] whitespace-pre-wrap break-all">
                {action.example.input}
              </pre>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <div className="text-[11px] text-[var(--color-fg-dim)] uppercase tracking-wide mb-2">
                Output
              </div>
              <pre className="font-mono text-[13px] whitespace-pre-wrap break-all">
                {action.example.output}
              </pre>
            </div>
          </div>
        </section>

        <section className="mt-10 text-[15px] leading-relaxed text-[var(--color-fg-dim)]">
          <p>{action.body}</p>
          <p className="mt-4">
            Trove is local-first: no telemetry, no upload, no account.
            <code className="mx-1 px-1.5 py-0.5 rounded bg-black/40 font-mono text-[12px]">
              {action.triggers[0]}
            </code>
            runs on your Mac in microseconds. The full catalog of inline
            actions is at{" "}
            <Link href="/action" className="text-white underline">
              /action
            </Link>
            ; pane-by-pane features live at{" "}
            <Link href="/features" className="text-white underline">
              /features
            </Link>
            .
          </p>
        </section>

        {action.triggers.length > 1 && (
          <section className="mt-8">
            <div className="text-[12px] uppercase tracking-wide text-[var(--color-fg-dim)] mb-2">
              Also triggers on
            </div>
            <ul className="flex flex-wrap gap-2">
              {action.triggers.slice(1).map((t) => (
                <li
                  key={t}
                  className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.06] text-[12.5px] font-mono"
                >
                  {t}
                </li>
              ))}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-[20px] font-semibold tracking-tight mb-3">
              Related actions
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {related.map((a) => (
                <Link
                  key={a.slug}
                  href={`/action/${a.slug}`}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.05] transition-colors"
                >
                  <div className="text-[14.5px] font-semibold">{a.title}</div>
                  <div className="text-[12.5px] text-[var(--color-fg-dim)] mt-1 line-clamp-2">
                    {a.tagline}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6">
          <h3 className="text-[16px] font-semibold">
            Want all 60+ inline actions, plus 40+ panes?
          </h3>
          <p className="mt-2 text-[13.5px] text-[var(--color-fg-dim)]">
            Trove ships an API tester (Postman-class), local LLM chat, hash
            verifier, OCR, screen recorder, hosts file editor, password
            generator + HIBP, treemap, and more. Local-first, $10/yr.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/download"
              className="btn-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-semibold"
            >
              Download Trove
            </Link>
            <Link
              href="/action"
              className="btn-ghost inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px]"
            >
              Browse all actions
            </Link>
          </div>
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <Footer />
    </>
  );
}
