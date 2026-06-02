import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ACTIONS, ACTION_CATEGORIES } from "@/lib/actions";

export const metadata: Metadata = {
  title:
    "Inline ⌘K actions: base64, sha256, JWT, JSON, URL encode, color, time | Trove",
  description:
    "Trove's ⌘K palette runs 60+ inline transforms: base64, hex, URL encode/decode, MD5/SHA-1/SHA-256/SHA-512, HMAC, JWT decode, JSON format, color conversion, Unix time, UUID, and more. Local, no upload.",
  alternates: { canonical: "https://gettrove.vercel.app/action" },
  openGraph: {
    title: "Trove ⌘K: 60+ inline dev transforms on Mac",
    description:
      "One palette. Zero uploads. Every transform: base64, JWT decode, SHA-256, UUID, JSON pretty, URL encode, color conversion, …",
    url: "https://gettrove.vercel.app/action",
  },
};

export default function ActionsIndex() {
  return (
    <>
      <Nav />
      <main id="top" className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <header className="max-w-3xl mb-12">
          <h1 className="text-[clamp(34px,5vw,52px)] font-semibold tracking-tight leading-[1.05]">
            ⌘K inline actions
          </h1>
          <p className="mt-4 text-[16px] text-[var(--color-fg-dim)] leading-relaxed">
            {ACTIONS.length}+ instant transforms that run on your Mac
            without leaving the keyboard. Open Trove (or hit your bound
            hotkey), type the trigger and your input, hit Return — the
            result is on your clipboard. No upload, no telemetry, no
            online tool tab to close.
          </p>
        </header>

        {ACTION_CATEGORIES.map((cat) => {
          const inCat = ACTIONS.filter((a) => a.category === cat.id);
          if (inCat.length === 0) return null;
          return (
            <section key={cat.id} id={cat.id} className="mb-12">
              <h2 className="text-[20px] font-semibold tracking-tight mb-4">
                {cat.label}
                <span className="ml-2 text-[14px] text-[var(--color-fg-dim)] font-normal">
                  {inCat.length}
                </span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {inCat.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/action/${a.slug}`}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.05] hover:border-white/[0.12] transition-colors block"
                  >
                    <div className="text-[14.5px] font-semibold">{a.title}</div>
                    <div className="text-[12.5px] text-[var(--color-fg-dim)] mt-1 line-clamp-2">
                      {a.tagline}
                    </div>
                    <div className="mt-2 text-[11px] font-mono text-[var(--color-fg-dim)] truncate">
                      ⌘K {a.triggers[0]}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <section className="mt-16 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 max-w-3xl">
          <h3 className="text-[16px] font-semibold">
            What about the rest of Trove?
          </h3>
          <p className="mt-2 text-[13.5px] text-[var(--color-fg-dim)]">
            These actions live in the Quick Switcher; Trove also has 40+
            full panes (API Tester, Speedtest, Hash, OCR, Hosts editor,
            Local LLM chat, Image Editor, …). Browse them at{" "}
            <Link href="/features" className="text-white underline">
              /features
            </Link>{" "}
            or download the app at{" "}
            <Link href="/download" className="text-white underline">
              /download
            </Link>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
