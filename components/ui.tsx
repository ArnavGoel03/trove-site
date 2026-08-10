import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The page vocabulary.
 *
 * Thirty routes were each writing their own version of the same box:
 * `rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5`, with four
 * slightly different opacities across the site for what was meant to be one
 * surface. The scroll stage on the homepage had already moved to tokens
 * (`bg-surface-1`, `border-line-soft`, `text-body`), so every other page was
 * quietly a different product.
 *
 * These are the shared parts, expressed only in tokens. Nothing here hardcodes
 * a colour, a radius, or a pixel size: change the token in globals.css and the
 * whole site moves. A page that needs something not in this file should add it
 * here rather than inventing a rival next to it.
 */

/** A bordered surface. The default container for anything grouped. */
export function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li" | "section";
}) {
  return (
    <Tag
      className={`rounded-lg border border-line-soft bg-surface-1 p-5 ${className}`}
    >
      {children}
    </Tag>
  );
}

/** A card that is entirely a link. Internal by default, external opts in. */
export function LinkCard({
  href,
  title,
  external = false,
  children,
}: {
  href: string;
  title: string;
  external?: boolean;
  children?: ReactNode;
}) {
  const inner = (
    <>
      <div className="text-body font-medium tracking-tight text-fg">
        {title}
        <span aria-hidden="true" className="ml-1.5 font-normal text-fg-mute">
          &rarr;
        </span>
      </div>
      {children ? (
        <p className="mt-2 text-caption text-fg-dim text-pretty">{children}</p>
      ) : null}
    </>
  );

  const className =
    "block rounded-lg border border-line-soft bg-surface-1 p-5 transition-colors duration-[--duration-base] hover:border-line-strong hover:bg-surface-2";

  // `target=_blank` without `rel` hands the new tab a live `window.opener`
  // handle on this page. Every external link on the site goes through here so
  // that pairing cannot be forgotten one card at a time.
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

/** A titled block within a page. The heading level is the caller's choice. */
export function Section({
  title,
  lede,
  id,
  children,
  level = 2,
}: {
  title: string;
  lede?: ReactNode;
  id?: string;
  children: ReactNode;
  level?: 2 | 3;
}) {
  const Heading = level === 2 ? "h2" : "h3";
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className="mt-16 first:mt-0">
      <Heading
        id={headingId}
        className={`font-display font-semibold text-fg text-balance ${
          level === 2 ? "text-title" : "text-lead"
        }`}
      >
        {title}
      </Heading>
      {lede ? (
        <p className="mt-4 max-w-2xl text-body text-fg-dim text-pretty">{lede}</p>
      ) : null}
      <div className="mt-7">{children}</div>
    </section>
  );
}

/** A figure with a label under it. Numbers are tabular so columns line up. */
export function Stat({
  value,
  label,
  hint,
}: {
  value: ReactNode;
  label: string;
  hint?: string;
}) {
  return (
    <Card>
      <div className="font-display text-title font-semibold tabular-nums text-fg">
        {value}
      </div>
      <div className="mt-1 text-caption font-medium text-fg">{label}</div>
      {hint ? <p className="mt-1.5 text-caption text-fg-mute text-pretty">{hint}</p> : null}
    </Card>
  );
}

/** A small status chip. `tone` carries meaning, never decoration. */
export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "live" | "accent";
}) {
  const tones = {
    neutral: "bg-surface-2 text-fg-mute",
    live: "bg-surface-2 text-fg",
    accent: "bg-accent/15 text-accent",
  } as const;
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-medium ${tones[tone]}`}
    >
      {tone === "live" ? (
        <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-accent" />
      ) : null}
      {children}
    </span>
  );
}

/** An inline text link, styled once so no page invents its own underline. */
export function TextLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className =
    "underline decoration-line-strong underline-offset-4 transition-colors duration-[--duration-fast] hover:text-accent";
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/**
 * A bulleted list where the marker is a rule rather than a dot.
 *
 * `list-disc` renders at the browser's default size, which is visibly larger
 * than this type scale and drags the eye to the bullet instead of the line.
 */
export function Bullets({ items }: { items: readonly ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="relative pl-5 text-body text-fg-dim text-pretty">
          <span
            aria-hidden="true"
            className="absolute left-0 top-[0.7em] h-px w-2.5 bg-line-strong"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** A pulled-aside note. Used for caveats the reader must not skim past. */
export function Note({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-line-soft bg-surface-1 p-5 border-l-2 border-l-accent">
      {title ? (
        <div className="text-caption font-medium tracking-tight text-fg">{title}</div>
      ) : null}
      <div className={`text-caption text-fg-dim text-pretty ${title ? "mt-2" : ""}`}>
        {children}
      </div>
    </div>
  );
}
