"use client";

import { Github, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { STUDIO, TROVE, APPS } from "@/lib/brand";
import Logomark from "./Logomark";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.05] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(5,1fr)] gap-10">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <Logomark name={STUDIO.name} size={30} />
            <span className="text-[15px] font-semibold tracking-tight">
              {STUDIO.name}
            </span>
          </div>
          <p className="text-[13px] text-[var(--color-fg-dim)] max-w-sm leading-relaxed">
            {STUDIO.tagline} Private, native Mac apps that never phone home. No
            account, no telemetry, nothing leaves your Mac. One subscription
            unlocks {APPS.trove.name}, {APPS.relay.name}, and {APPS.tend.name}.
          </p>
        </div>

        <FooterCol
          title="Apps"
          links={[
            { label: APPS.trove.name, href: APPS.trove.href },
            { label: APPS.relay.name, href: APPS.relay.href },
            { label: APPS.tend.name, href: APPS.tend.href },
          ]}
        />

        <FooterCol
          title={APPS.trove.name}
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
              href: "https://github.com/ArnavGoel03/trove-releases/releases",
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
              {"©"} {new Date().getFullYear()} {STUDIO.name}. macOS, Apple Silicon
              and the Apple logo are trademarks of Apple Inc.
            </span>
            <a
              href={STUDIO.makerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:text-white transition-colors ${FOCUS_RING}`}
            >
              Made by {STUDIO.maker}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <LatestReleaseBadge />
            <a
              href="https://github.com/ArnavGoel03/trove"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${TROVE.name} on GitHub`}
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
    // Goes through our own cached route rather than GitHub directly, so the
    // footer costs a visitor nothing against GitHub's 60/hour anonymous limit.
    fetch("/api/releases")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (aborted) return;
        const t: unknown = j?.mac;
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
      href="https://github.com/ArnavGoel03/trove-releases/releases"
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
