"use client";

import { useEffect, useRef, type ReactNode } from "react";

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
  const root = useRef<HTMLElement>(null);

  // Marks each capped pane that currently has more content than it can show,
  // so the stylesheet can fade its bottom edge. It lives here rather than in
  // the eight demos because the demos differ only in what they put inside the
  // pane, not in how the pane behaves.
  //
  // The fade is the entire affordance on a phone. macOS and iOS draw overlay
  // scrollbars, which are invisible until you are already scrolling, so the
  // capped JSON output on a 393px screen was a block of text sliced through
  // the middle of a line with nothing to say it continued. `scrollbar-color`
  // does not help: Chrome accepts the declaration and keeps the overlay bar,
  // reserving no gutter, so it is still invisible at rest.
  //
  // `data-overflow` and not a permanent fade, because a pane whose content
  // fits would otherwise dim its own last line for no reason.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const panes = [...el.querySelectorAll<HTMLElement>(".demo-input, .demo-output")];
    if (panes.length === 0) return;

    const sync = () => {
      for (const p of panes) {
        // A pane scrolled to the end has nothing below it to hint at.
        const more = p.scrollHeight - p.clientHeight - p.scrollTop > 2;
        p.dataset.overflow = more ? "1" : "0";
      }
    };

    sync();
    const ro = new ResizeObserver(sync);
    for (const p of panes) {
      ro.observe(p);
      p.addEventListener("scroll", sync, { passive: true });
      p.addEventListener("input", sync);
    }
    return () => {
      ro.disconnect();
      for (const p of panes) {
        p.removeEventListener("scroll", sync);
        p.removeEventListener("input", sync);
      }
    };
  });

  return (
    <section className="demo-shell" ref={root}>
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
