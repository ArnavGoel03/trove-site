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
    <main id="main-content" className="relative">
      <Nav />
      <article className="relative max-w-3xl mx-auto px-6 pt-32 pb-24">
        <div className="text-micro uppercase tracking-[0.2em] text-fg-mute mb-4">
          Legal
        </div>
        <h1 className="text-display font-semibold text-white">
          {title}
        </h1>
        <div className="mt-4 text-caption text-fg-mute">
          Last updated: {updated}
        </div>
        {intro ? (
          <p className="mt-8 text-body leading-[1.75] text-fg-dim">
            {intro}
          </p>
        ) : null}
        <div className="legal-prose mt-10 text-body leading-[1.75] text-fg-dim space-y-8">
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
    <section className="pt-8 border-t border-line-soft first:border-t-0 first:pt-0">
      <h2 className="text-lead font-semibold tracking-tight text-white mb-3">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
