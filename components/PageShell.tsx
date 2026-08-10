import type { ReactNode } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

/**
 * Standard outer chrome for every non-homepage route: fixed Nav at top, grain
 * overlay (from the root layout), a centred column, Footer at the bottom.
 *
 * Every size and colour here is a token, so this file is the single lever for
 * the reading rhythm of about thirty pages. It used to write its own
 * `text-[16px] sm:text-[17px]` and `text-[var(--color-fg-dim)]`, which meant a
 * change to the type scale moved the homepage and left every other page behind.
 *
 * `wide` widens the column past the legal-style reading measure for pages that
 * carry grids or tables (/compare, /shortcuts, /pane/[slug], /pricing).
 */
export default function PageShell({
  eyebrow,
  title,
  lede,
  children,
  wide = false,
}: {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <main id="main-content" className="relative">
      <Nav />
      <div
        className={`relative mx-auto px-5 pt-32 pb-24 sm:px-8 ${
          wide ? "max-w-6xl" : "max-w-3xl"
        }`}
      >
        {eyebrow ? (
          <p className="mb-4 text-micro font-mono uppercase text-accent">{eyebrow}</p>
        ) : null}
        <h1 className="font-display text-display font-semibold text-fg text-balance">
          {title}
        </h1>
        {lede ? (
          <p className="mt-6 max-w-2xl text-lead text-fg-dim text-pretty">{lede}</p>
        ) : null}
        <div className="mt-14">{children}</div>
      </div>
      <Footer />
    </main>
  );
}
