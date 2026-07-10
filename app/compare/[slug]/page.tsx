import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { PRODUCT } from "@/lib/brand";

interface Comparison {
  slug: string;
  competitor: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  highlights: { trove: string; them: string }[];
  callouts: { title: string; body: string }[];
  cta: string;
}

const COMPARISONS: Record<string, Comparison> = {
  postman: {
    slug: "postman",
    competitor: "Postman",
    metaTitle: `Trove vs Postman: local, ${PRODUCT.priceAdjective} Postman-class API tester for Mac`,
    metaDescription:
      "Postman went paid + cloud-only. Trove ships a local API tester for Mac with environments, OAuth 2.0, AWS Sig V4, JS pre-request / tests, Postman v2.1 import. No account.",
    intro:
      "Postman went paid-and-cloud-only. Trove ships a local API tester for Mac. Import your existing Postman v2.1 collections, including the event scripts, and keep working without an account.",
    highlights: [
      {
        trove: "Local-first; no account, no cloud sync of collections",
        them: "Cloud-required for collection sync; account login on every device",
      },
      {
        trove:
          "Environments + {{var}} substitution everywhere (URL, headers, body, auth, multipart, OAuth, AWS keys)",
        them: "Environments + {{var}} substitution",
      },
      {
        trove:
          "7 body modes (JSON / Form / Raw / GraphQL / Multipart with file / Binary)",
        them: "Same set",
      },
      {
        trove:
          "8 auth types incl. OAuth 2.0 Authorization Code + PKCE, AWS Sig V4, Digest",
        them: "Same set",
      },
      {
        trove:
          "Pre-request + tests scripts in JavaScriptCore with full pm.* compat (pm.test, pm.expect, pm.request.headers.add)",
        them: "pm.* in Sandbox runtime",
      },
      {
        trove:
          "Response views: Pretty / Raw / Preview (HTML) / Image / Hex / Headers / Cookies / Timing breakdown",
        them: "Pretty / Raw / Preview / Headers / Cookies",
      },
      {
        trove:
          "Code export: curl / fetch / axios / Python requests / Swift",
        them: "Code export to many languages",
      },
      {
        trove: `${PRODUCT.priceAdjective}, local-first`,
        them: "$14-$49/user/month for teams",
      },
    ],
    callouts: [
      {
        title: "Import your existing Postman collection in 5 seconds",
        body:
          "Toolbar → Import Postman collection… Trove maps the v2.1 structure, including event[] scripts. Nested folders flatten into Folder / Request names so they're still grouped.",
      },
      {
        title: "What's NOT in Trove yet",
        body:
          "Postman has team workspaces, mock servers, monitors, and a public API network. Trove is local-first; these are deliberate non-features. Collection runners and visualizers are on the roadmap.",
      },
    ],
    cta: "Download Trove and import your collection",
  },
  raycast: {
    slug: "raycast",
    competitor: "Raycast",
    metaTitle: "Trove vs Raycast: local productivity panes vs launcher",
    metaDescription:
      "Raycast is a launcher with extensions. Trove is a panel-based productivity app with 40+ in-app panes + 60+ ⌘K inline actions. Both have a ⌘K palette; the philosophy and integrations differ.",
    intro:
      "Raycast is a great launcher with a third-party extension marketplace. Trove is panel-based: every action lives as a first-class pane, plus 60+ inline transforms in ⌘K. The two coexist on most pro Mac desktops; this page is about when Trove fits better.",
    highlights: [
      { trove: "Local-first, no account", them: "Account-gated cloud features" },
      {
        trove:
          "First-class panes for Recorder, OCR, PDF tools, Hash, API Tester, Speedtest, LLM chat, Hosts editor, Password gen, not third-party extensions",
        them: "Extension store; quality varies",
      },
      {
        trove:
          "Inline ⌘K palette runs 60+ pure transforms (base64, JWT decode, hex, SHA-256, JSON pretty, UUID, color, …)",
        them: "Snippets + commands + extension search",
      },
      {
        trove: `${PRODUCT.priceAdjective}, local-first`,
        them: "Free for individuals, paid for Pro/teams",
      },
    ],
    callouts: [
      {
        title: "When Raycast wins",
        body:
          "If your day is dominated by launching apps, searching files, calculator, and snippet expansion, Raycast's launcher mechanics are excellent.",
      },
      {
        title: "When Trove wins",
        body:
          "If you spend time in dev panes (API testing, hashing, OCR, recording, formatting), Trove's first-party panes give you more capability without browsing an extension store.",
      },
    ],
    cta: "Try Trove",
  },
  cleanmymac: {
    slug: "cleanmymac",
    competitor: "CleanMyMac",
    metaTitle: `Trove vs CleanMyMac: ${PRODUCT.priceAdjective} local Mac cleanup`,
    metaDescription:
      "CleanMyMac is paid. Trove's Clean, Sweep, Treemap, and Storage panes do the same disk-hygiene work locally, no telemetry.",
    intro:
      "Trove's storage suite (Clean, Sweep, Treemap, Overview, Disk Speed) covers the same disk-hygiene jobs CleanMyMac sells, locally and with no telemetry.",
    highlights: [
      {
        trove: `${PRODUCT.priceAdjective}, local-first`,
        them: "$40-$90/year subscription",
      },
      {
        trove: "Treemap viz of every folder with click-to-drill",
        them: "Space Lens (similar)",
      },
      {
        trove:
          "Sweep Downloads (clear old files by age) + Clean (npm/yarn/pnpm/Chrome/Edge/Firefox/pip/Nuget caches)",
        them: "Smart Scan covers similar surfaces",
      },
      {
        trove:
          "No always-on background process; nothing runs unless a pane is open",
        them: "Always-on Helper process",
      },
    ],
    callouts: [
      {
        title: "What Trove deliberately skips",
        body:
          "Trove doesn't 'scan for malware' or 'protect your privacy with a VPN.' Those are scope-creep features. We do disk space and file management cleanly.",
      },
    ],
    cta: "Download Trove",
  },
  boop: {
    slug: "boop",
    competitor: "Boop",
    metaTitle: "Trove vs Boop: text transforms with more surface",
    metaDescription:
      "Boop is a fantastic open-source text-transform app. Trove has 60+ ⌘K inline transforms AND 40+ panes (Boop+Hash+OCR+API tester+more) in one app.",
    intro:
      "Boop is a beloved, focused open-source text transformer. Trove's ⌘K palette covers the same transforms (base64, JWT, hashes, JSON pretty, case conversion, leet) AND adds 40+ panes for everything else. If Boop is the only thing you use it for, Boop is great. If you also want OCR, hash verify, API testing, screen recording, etc., Trove wraps it all in one app.",
    highlights: [
      {
        trove: "60+ inline ⌘K actions: encoding, hashing, case, JSON, time, color, text",
        them: "60+ Boop scripts, similar coverage",
      },
      { trove: "40+ panes for everything else", them: "Text transforms only" },
      {
        trove: `${PRODUCT.priceAdjective}, local-first`,
        them: "Free, open-source (MIT)",
      },
    ],
    callouts: [
      {
        title: "Both belong on a pro Mac",
        body:
          "Boop is sharp and quiet. Trove is sprawling and integrated. They don't conflict.",
      },
    ],
    cta: "Try Trove alongside Boop",
  },
  devutils: {
    slug: "devutils",
    competitor: "DevUtils",
    metaTitle: "Trove vs DevUtils: broader dev toolkit for Mac",
    metaDescription:
      "DevUtils nails offline dev transforms. Trove covers the same set + screen recording, OCR, API tester, hosts editor, LLM chat.",
    intro:
      "DevUtils is a focused, paid offline dev toolkit. Trove covers the same transform set (base64, JWT, JSON, hashes, UUID, JSONPath, color) plus 40+ additional panes (Recorder, OCR, Hash verify, API Tester, Hosts editor, LLM chat).",
    highlights: [
      {
        trove: `${PRODUCT.priceAdjective}, local-first`,
        them: "$30 one-time / $40 lifetime",
      },
      {
        trove: "60+ inline ⌘K actions covering DevUtils' surface",
        them: "Dedicated UI per tool",
      },
      {
        trove: "Plus: Recorder / OCR / API Tester / Hash file / Hosts editor / LLM chat",
        them: "Not in scope",
      },
    ],
    callouts: [
      {
        title: "Different UX philosophy",
        body:
          "DevUtils has a dedicated pane per tool, discoverable by browsing. Trove blends inline ⌘K transforms with full panes, discoverable by typing.",
      },
    ],
    cta: "Try Trove",
  },
};

export async function generateStaticParams() {
  return Object.values(COMPARISONS).map((c) => ({ slug: c.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const c = COMPARISONS[slug];
  if (!c) return { title: "Not found" };
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: `https://gettrove.vercel.app/compare/${c.slug}` },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url: `https://gettrove.vercel.app/compare/${c.slug}`,
    },
  };
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params;
  const c = COMPARISONS[slug];
  if (!c) return notFound();

  return (
    <>
      <Nav />
      <main id="top" className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <nav
          aria-label="Breadcrumb"
          className="text-[12px] text-[var(--color-fg-dim)] mb-6"
        >
          <Link href="/" className="hover:text-white">
            Trove
          </Link>
          <span className="mx-2">›</span>
          <Link href="/compare" className="hover:text-white">
            Compare
          </Link>
          <span className="mx-2">›</span>
          <span className="text-white">Trove vs {c.competitor}</span>
        </nav>

        <h1 className="text-[clamp(34px,5vw,52px)] font-semibold tracking-tight leading-[1.05]">
          Trove vs {c.competitor}
        </h1>
        <p className="mt-4 text-[18px] text-[var(--color-fg-dim)] leading-relaxed">
          {c.intro}
        </p>

        <section className="mt-12">
          <h2 className="text-[20px] font-semibold tracking-tight mb-4">
            Side by side
          </h2>
          <div className="rounded-3xl border border-white/[0.07] overflow-hidden">
            <div className="grid grid-cols-[1fr_1fr] text-[14px]">
              <div className="px-5 py-3 bg-white/[0.04] font-semibold border-b border-white/[0.06]">
                Trove
              </div>
              <div className="px-5 py-3 bg-white/[0.04] font-semibold border-b border-white/[0.06] border-l border-white/[0.06]">
                {c.competitor}
              </div>
              {c.highlights.map((row, i) => (
                <FragmentRow
                  key={i}
                  trove={row.trove}
                  them={row.them}
                  last={i === c.highlights.length - 1}
                />
              ))}
            </div>
          </div>
        </section>

        {c.callouts.map((co) => (
          <section
            key={co.title}
            className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
          >
            <h3 className="text-[15px] font-semibold">{co.title}</h3>
            <p className="mt-2 text-[14px] text-[var(--color-fg-dim)] leading-relaxed">
              {co.body}
            </p>
          </section>
        ))}

        <section className="mt-12">
          <Link
            href="/download"
            className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold"
          >
            {c.cta} →
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}

function FragmentRow({
  trove,
  them,
  last,
}: {
  trove: string;
  them: string;
  last: boolean;
}) {
  const border = last ? "" : "border-b border-white/[0.06]";
  return (
    <>
      <div className={`px-5 py-4 ${border} text-[13.5px] leading-relaxed`}>
        {trove}
      </div>
      <div
        className={`px-5 py-4 ${border} border-l border-white/[0.06] text-[13.5px] leading-relaxed text-[var(--color-fg-dim)]`}
      >
        {them}
      </div>
    </>
  );
}
