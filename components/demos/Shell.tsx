"use client";

import type { ReactNode } from "react";

/**
 * The frame every demo sits in.
 *
 * One place decides the padding, the border, the label treatment and, most
 * importantly, the minimum height. Six widgets that each picked their own
 * height would make the copy above them jump every time the reader crossed a
 * beat boundary, which is the single most obvious way to make a scroll page
 * feel broken.
 */
export default function Shell({
  title,
  hint,
  href,
  children,
}: {
  readonly title: string;
  /** What the reader is looking at, in one short line. */
  readonly hint: string;
  /** The pane page this is a miniature of. */
  readonly href?: string;
  readonly children: ReactNode;
}) {
  return (
    <section className="demo-shell">
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="text-micro font-mono uppercase text-fg-mute">{title}</h3>
        {href ? (
          <a
            href={href}
            className="text-caption text-fg-mute underline decoration-line-strong underline-offset-4 transition-colors hover:text-fg"
          >
            The real one
          </a>
        ) : null}
      </header>
      {children}
      <p className="mt-3 text-caption text-fg-mute">{hint}</p>
    </section>
  );
}
