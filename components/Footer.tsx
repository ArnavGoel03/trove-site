"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { APPS, CONTACT, STUDIO, TROVE } from "@/lib/brand";
import { releasePageURL, ISSUES_URL } from "@/lib/releases";
import Logomark from "./Logomark";
import GithubMark from "./icons/GithubMark";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm";

export default function Footer() {
  return (
    <footer className="relative border-t border-line-soft mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(5,1fr)] gap-10">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <Logomark name={STUDIO.name} size={30} />
            <span className="text-body font-semibold tracking-tight">
              {STUDIO.name}
            </span>
          </div>
          <p className="text-caption text-fg-dim max-w-sm leading-relaxed">
            {/* STUDIO.tagline is already "Private, native Mac apps. One
                subscription.", so prefixing it here printed both halves twice.
                Say it once, then add what the tagline doesn't cover. */}
            {STUDIO.tagline} They never phone home: no account, no telemetry,
            nothing leaves your Mac. One subscription unlocks{" "}
            {APPS.trove.name}, {APPS.relay.name}, and {APPS.tend.name}.
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
            { label: "Pricing", href: "/pricing" },
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
              label: "Issue tracker",
              href: ISSUES_URL,
              external: true,
            },
            {
              label: "Releases",
              href: releasePageURL(),
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
            // Deep link rather than a floating widget: the switches are an
            // accessibility preference and live with the rest of them.
            { label: "Feel and haptics", href: "/accessibility#feel" },
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

      <div className="border-t border-line-soft">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-caption text-fg-mute">
            <span>
              {"©"} {new Date().getFullYear()} {STUDIO.name}. macOS, Apple Silicon
              and the Apple logo are trademarks of Apple Inc.
            </span>
            <a
              href={STUDIO.makerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:text-fg transition-colors ${FOCUS_RING}`}
            >
              Made by {STUDIO.maker}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <LatestReleaseBadge />
            <a
              href={releasePageURL()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${TROVE.name} releases on GitHub`}
              className={`text-fg-mute hover:text-fg transition-colors ${FOCUS_RING}`}
            >
              <GithubMark size={16} />
            </a>
            <a
              href={CONTACT.support}
              aria-label="Email support"
              className={`text-fg-mute hover:text-fg transition-colors ${FOCUS_RING}`}
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
      href={releasePageURL()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Latest release notes on GitHub"
      className={`inline-flex items-center gap-1.5 text-caption text-fg-dim hover:text-fg transition-colors font-medium ${FOCUS_RING}`}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
      <span className="font-mono tabular-nums">{tag ?? "Releases"}</span>
      <span className="text-fg-dim">&middot;</span>
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
      <div className="text-micro uppercase text-fg-dim mb-4">
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
                className={`text-caption text-fg-dim hover:text-fg transition-colors ${FOCUS_RING}`}
              >
                {l.label}
              </a>
            ) : (
              <Link
                href={l.href}
                className={`text-caption text-fg-dim hover:text-fg transition-colors ${FOCUS_RING}`}
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
