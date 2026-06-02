import type { ReactNode } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

/**
 * Standard outer chrome for every non-homepage route: fixed Nav at top,
 * grain overlay (already provided by root layout), centered article width,
 * Footer at the bottom. Uses the same dark + orange palette as the homepage
 * so deep-links don't feel like a different site. `wide` widens the inner
 * column past the legal-style 3xl reading width when a page needs grids
 * or tables (e.g. /compare, /shortcuts, /pane/[slug]).
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
        className={`relative ${wide ? "max-w-6xl" : "max-w-3xl"} mx-auto px-6 pt-32 pb-24`}
      >
        {eyebrow ? (
          <div className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-fg-mute)] mb-4">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.05] text-white">
          {title}
        </h1>
        {lede ? (
          <p className="mt-6 text-[16px] sm:text-[17px] leading-[1.7] text-[var(--color-fg-dim)] max-w-2xl">
            {lede}
          </p>
        ) : null}
        <div className="mt-12">{children}</div>
      </div>
      <Footer />
    </main>
  );
}
