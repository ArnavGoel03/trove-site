import type { ReactNode } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function LegalLayout({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="relative">
      <Nav />
      <article className="relative max-w-3xl mx-auto px-6 pt-32 pb-24">
        <div className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-fg-mute)] mb-4">
          Legal
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.05] text-white">
          {title}
        </h1>
        <div className="mt-4 text-[13px] text-[var(--color-fg-mute)]">
          Last updated: {updated}
        </div>
        {intro ? (
          <p className="mt-8 text-[15px] leading-[1.75] text-[var(--color-fg-dim)]">
            {intro}
          </p>
        ) : null}
        <div className="legal-prose mt-10 text-[15px] leading-[1.75] text-[var(--color-fg-dim)] space-y-8">
          {children}
        </div>
      </article>
      <Footer />
    </main>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="pt-8 border-t border-white/[0.06] first:border-t-0 first:pt-0">
      <h2 className="text-[20px] font-semibold tracking-tight text-white mb-3">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
