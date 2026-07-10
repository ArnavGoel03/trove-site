import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import JsonLd, { webPageLd, breadcrumbLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "trove:// URL scheme — Trove",
  description:
    "Full reference for Trove's URL scheme — pane navigation, Stage operations, calculator, snippet copy, history paste, QR generation. Frontmost-gated where it counts.",
  alternates: { canonical: "https://gettrove.vercel.app/url-scheme" },
};

type Verb = {
  verb: string;
  example: string;
  description: string;
  /** Whether Trove must be frontmost to fire this verb. */
  frontmost: boolean;
  params?: { name: string; about: string }[];
};

const VERBS: Verb[] = [
  {
    verb: "show",
    example: "trove://show",
    description: "Brings Trove to the front. Safe to fire from anywhere.",
    frontmost: false,
  },
  {
    verb: "pane",
    example: "trove://pane/open?pane=PDF",
    description:
      "Switches to the named pane. Honors the user's hidden-pane choices — a drive-by URL can't pop a pane the user has hidden.",
    frontmost: false,
    params: [
      {
        name: "pane",
        about: "Pane rawValue (e.g. `Stage`, `History`, `PDF`).",
      },
    ],
  },
  {
    verb: "capture",
    example: "trove://capture",
    description: "Triggers a screenshot region capture into Stage.",
    frontmost: true,
  },
  {
    verb: "paste",
    example: "trove://paste",
    description: "Pastes the current system clipboard into Stage.",
    frontmost: false,
  },
  {
    verb: "copy / copy-text",
    example: "trove://copy-text",
    description:
      "Copies all Stage items as text (or as files for `copy`). Frontmost-gated — clipboard hijack from a drive-by URL would otherwise be a footgun.",
    frontmost: true,
  },
  {
    verb: "clear",
    example: "trove://clear",
    description:
      "Clears Stage after a confirmation alert. Frontmost-gated so a drive-by `<a href=\"trove://clear\">` can't wipe your stage in one click.",
    frontmost: true,
  },
  {
    verb: "add",
    example: "trove://add?type=text&value=hello",
    description:
      "Adds a text or file payload to Stage. Text is capped at 1 MB; file paths are resolved through symlinks and refused if they point into `/dev/`, `/proc/`, `/sys/`, or `/private/var/run/`, or if the file is >200 MB.",
    frontmost: true,
    params: [
      { name: "type", about: "`text` or `file` (default `file`)." },
      {
        name: "value",
        about: "When type=text: the URL-encoded payload (cap 1 MB).",
      },
      {
        name: "path",
        about: "When type=file: absolute filesystem path (validated).",
      },
    ],
  },
  {
    verb: "calc",
    example: "trove://calc?expr=100*1.09&copy=1",
    description:
      "Evaluates the expression with Trove's calc engine and flashes the result. `copy=1` writes it to the clipboard (frontmost-gated).",
    frontmost: false,
    params: [
      { name: "expr", about: "Expression string (URL-encode the `&`)." },
      { name: "copy", about: "`1` to copy the result; else just flashes." },
    ],
  },
  {
    verb: "snippet/copy",
    example: "trove://snippet/copy?name=signature",
    description:
      "Looks up a snippet by name (exact → prefix → substring) and copies its body. Frontmost-gated.",
    frontmost: true,
    params: [{ name: "name", about: "Snippet name. Case-insensitive." }],
  },
  {
    verb: "snippet/get",
    example: "trove://snippet/get?name=signature",
    description:
      "Same lookup as `copy`, but adds the body to Stage instead of writing to the clipboard.",
    frontmost: false,
    params: [{ name: "name", about: "Snippet name. Case-insensitive." }],
  },
  {
    verb: "history/paste",
    example: "trove://history/paste?index=0",
    description:
      "Adds the N-th text entry from clipboard history to Stage. Skips non-text entries before counting.",
    frontmost: false,
    params: [{ name: "index", about: "Zero-based index. Bounds-checked." }],
  },
  {
    verb: "history/copy",
    example: "trove://history/copy?index=2",
    description:
      "Copies the N-th text entry from history to the clipboard. Frontmost-gated.",
    frontmost: true,
    params: [{ name: "index", about: "Zero-based index. Bounds-checked." }],
  },
  {
    verb: "qr",
    example: "trove://qr?text=https://gettrove.vercel.app",
    description:
      "Generates a 1024×1024 QR code, writes a temp PNG, and adds it to Stage.",
    frontmost: false,
    params: [{ name: "text", about: "URL-encoded payload to encode." }],
  },
];

export default function URLSchemePage() {
  return (
    <PageShell
      wide
      eyebrow="Reference"
      title="trove:// URL scheme"
      lede={
        "Anything that can open a URL can drive Trove — the address bar, a Keyboard Maestro macro, an Alfred workflow, a launchd job. Every verb mirrors a Tools-menu or AppIntents action so behavior is identical across all three entry points. State-changing verbs check that Trove is frontmost before they fire, so a drive-by <a href=\"trove://…\"> from a website is refused."
      }
    >
      <JsonLd
        data={webPageLd(
          "Trove URL Scheme",
          "Full reference for the trove:// URL scheme.",
          "https://gettrove.vercel.app/url-scheme",
        )}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: "https://gettrove.vercel.app" },
          {
            name: "URL scheme",
            url: "https://gettrove.vercel.app/url-scheme",
          },
        ])}
      />

      <section className="pane rounded-xl p-5 mb-12">
        <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-fg-mute)] mb-2">
          Frontmost gating
        </div>
        <p className="text-[14px] leading-[1.7] text-[var(--color-fg-dim)]">
          Any verb marked{" "}
          <span className="text-[var(--color-accent)] font-medium">
            frontmost-only
          </span>{" "}
          is refused with a toast unless Trove is the frontmost app. This blocks
          clipboard-hijack, stage-wipe, and stage-injection attacks from
          drive-by <code className="md-inline">{`<a href="trove://…">`}</code>{" "}
          links on the web. The gate uses{" "}
          <code className="md-inline">NSWorkspace.frontmostApplication</code>{" "}
          with a bundle-identifier check — not a window-focus heuristic.
        </p>
      </section>

      <div className="space-y-6">
        {VERBS.map((v) => (
          <article
            key={v.verb}
            className="pane rounded-xl p-6"
            style={
              v.frontmost
                ? { borderColor: "rgba(225,6,0,0.25)" }
                : undefined
            }
          >
            <header className="flex items-start justify-between gap-4 mb-3">
              <h2 className="font-mono text-[16px] text-white">{v.verb}</h2>
              {v.frontmost ? (
                <span className="shrink-0 inline-flex items-center rounded-full border border-[var(--color-accent)]/40 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] text-[var(--color-accent)]">
                  Frontmost-only
                </span>
              ) : (
                <span className="shrink-0 inline-flex items-center rounded-full border border-white/[0.08] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-mute)]">
                  Safe
                </span>
              )}
            </header>
            <code className="block font-mono text-[13px] bg-white/[0.04] border border-white/[0.06] rounded-md px-3 py-2 text-white mb-3 break-all">
              {v.example}
            </code>
            <p className="text-[14px] leading-[1.7] text-[var(--color-fg-dim)]">
              {v.description}
            </p>
            {v.params ? (
              <ul className="mt-4 space-y-2">
                {v.params.map((p) => (
                  <li key={p.name} className="flex gap-3 text-[13px]">
                    <code className="font-mono text-[12px] bg-white/[0.04] border border-white/[0.06] rounded px-2 py-0.5 text-white h-fit shrink-0">
                      {p.name}
                    </code>
                    <span className="text-[var(--color-fg-dim)] leading-[1.65]">
                      {p.about}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </PageShell>
  );
}
