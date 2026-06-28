"use client";

import { Github, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.05] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-10">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="relative inline-flex w-7 h-7 rounded-[8px] bg-gradient-to-br from-[#ff8b5a] via-[#ff6a2a] to-[#b27cff] items-center justify-center shadow-[0_4px_12px_-2px_rgba(255,122,69,0.5)]">
              <span className="absolute inset-0.5 rounded-[6px] bg-black/20" />
              <span className="relative text-[11px] font-bold text-white">
                T
              </span>
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              Trove
            </span>
          </div>
          <p className="text-[13px] text-[var(--color-fg-dim)] max-w-sm leading-relaxed">
            53 panes for clipboard, capture, system, files and storage, in a
            single ~14 MB native macOS app. Scriptable from Shortcuts.
            Installable via Homebrew. Local-only.
          </p>
        </div>

        <FooterCol
          title="Product"
          links={[
            { label: "Features", href: "/features" },
            { label: "Compare", href: "/compare" },
            { label: "Changelog", href: "/changelog" },
            { label: "Roadmap", href: "/roadmap" },
            { label: "Download", href: "/download" },
          ]}
        />

        <FooterCol
          title="Resources"
          links={[
            { label: "Guides", href: "/guides" },
            { label: "FAQ", href: "/faq" },
            { label: "Updates", href: "/updates" },
            { label: "Shortcuts", href: "/shortcuts" },
            { label: "Shortcuts gallery", href: "/shortcuts-gallery" },
            { label: "URL scheme", href: "/url-scheme" },
            { label: "Themes", href: "/themes" },
            {
              label: "Source code",
              href: "https://github.com/ArnavGoel03/trove",
              external: true,
            },
            {
              label: "Discussions",
              href: "https://github.com/ArnavGoel03/trove/discussions",
              external: true,
            },
            {
              label: "Releases",
              href: "https://github.com/ArnavGoel03/trove/releases",
              external: true,
            },
          ]}
        />

        <FooterCol
          title="Company"
          links={[
            { label: "Contact", href: "/contact" },
            { label: "Security", href: "/security" },
            { label: "Accessibility", href: "/accessibility" },
            { label: "Press", href: "/press" },
          ]}
        />

        <FooterCol
          title="Legal"
          links={[
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
            { label: "Refund Policy", href: "/refund" },
            { label: "Acceptable Use", href: "/acceptable-use" },
            { label: "EULA", href: "/eula" },
          ]}
        />
      </div>

      <div className="border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-[12px] text-[var(--color-fg-mute)]">
            <span>
              {"©"} {new Date().getFullYear()} Trove. macOS, Apple Silicon
              and the Apple logo are trademarks of Apple Inc.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <LatestReleaseBadge />
            <a
              href="https://github.com/ArnavGoel03/trove"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Trove on GitHub"
              className={`text-[var(--color-fg-mute)] hover:text-white transition-colors ${FOCUS_RING}`}
            >
              <Github size={16} />
            </a>
            <a
              href="mailto:support@trove.app"
              aria-label="Email support"
              className={`text-[var(--color-fg-mute)] hover:text-white transition-colors ${FOCUS_RING}`}
            >
              <Mail size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * Pulls the latest release tag from the GitHub Releases API at component
 * mount and renders a discreet `v1.2.3 release notes` link. Falls back to
 * "Releases" if the fetch fails (rate limit, offline, repo private) so the
 * footer never shows a broken or stale version string. Cached client-side
 * for the page lifetime: one network request per page load, no polling.
 */
function LatestReleaseBadge() {
  const [tag, setTag] = useState<string | null>(null);
  useEffect(() => {
    let aborted = false;
    fetch("https://api.github.com/repos/ArnavGoel03/trove/releases/latest", {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (aborted) return;
        const t: unknown = j?.tag_name;
        if (typeof t === "string" && t.length > 0 && t.length < 32) {
          setTag(t);
        }
      })
      .catch(() => {
        /* swallow: footer just shows "Releases" */
      });
    return () => {
      aborted = true;
    };
  }, []);
  return (
    <a
      href="https://github.com/ArnavGoel03/trove/releases"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Latest release notes on GitHub"
      className={`inline-flex items-center gap-1.5 text-[11.5px] text-[var(--color-fg-dim)] hover:text-white transition-colors font-medium ${FOCUS_RING}`}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
      <span className="font-mono tabular-nums">{tag ?? "Releases"}</span>
      <span className="text-[var(--color-fg-dim)]">&middot;</span>
      <span>release notes</span>
    </a>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
        {title}
      </div>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            {l.external ? (
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-[13.5px] text-[var(--color-fg-dim)] hover:text-white transition-colors ${FOCUS_RING}`}
              >
                {l.label}
              </a>
            ) : (
              <Link
                href={l.href}
                className={`text-[13.5px] text-[var(--color-fg-dim)] hover:text-white transition-colors ${FOCUS_RING}`}
              >
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
