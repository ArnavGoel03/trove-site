"use client";

import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APPS, STUDIO, TROVE } from "@/lib/brand";
import { releasePageURL } from "@/lib/releases";
import { useEffect, useState } from "react";
import Logomark from "./Logomark";
import GithubMark from "./icons/GithubMark";

// Home wordmark: the studio name once the studio brand is live, the
// flagship app name otherwise. Never a hardcoded literal either way.
const HOME_BRAND = STUDIO.live ? STUDIO.name : TROVE.name;

/**
 * One list, two audiences.
 *
 * Nine links fit a 1600px browser and nothing else: at 1100px they wrapped
 * into the download button, and adding Pricing (which is now a real route, and
 * the one link a buyer actually looks for) would have made ten. `secondary`
 * marks the links the desktop bar drops. Nothing is lost by dropping them:
 * every one is in the footer, and the mobile sheet still renders the whole
 * list, because a sheet has vertical room and no reason to hide anything.
 */
const NAV_LINKS: readonly {
  label: string;
  href: string;
  secondary?: boolean;
}[] = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: APPS.relay.name, href: APPS.relay.href },
  { label: APPS.tend.name, href: APPS.tend.href },
  { label: "Compare", href: "/compare" },
  { label: "Guides", href: "/guides", secondary: true },
  { label: "FAQ", href: "/faq", secondary: true },
  { label: "Updates", href: "/updates", secondary: true },
  { label: "Changelog", href: "/changelog", secondary: true },
  { label: "Security", href: "/security", secondary: true },
];

const PRIMARY_LINKS = NAV_LINKS.filter((l) => !l.secondary);

/**
 * Returns true when `href` is the active section for the current path.
 * Exact match for the homepage, prefix match for everything else so a
 * deep page like /pane/clipboard still lights up its parent nav item
 * where one exists (here it does not, but the rule is future-proof).
 */
function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Nav() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  // Close the mobile sheet on route change and lock body scroll while open.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 px-6 py-4 bg-black/40 backdrop-blur-xl supports-[backdrop-filter]:bg-black/30 border-b border-line-soft"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label={`${HOME_BRAND} home`}
        >
          <Logomark name={HOME_BRAND} size={40} />
          <span className="text-body font-semibold tracking-tight">
            {HOME_BRAND}
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-6 text-caption text-fg-dim"
        >
          {PRIMARY_LINKS.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                  active ? "text-fg" : "hover:text-fg"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={releasePageURL()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${TROVE.name} releases on GitHub`}
            title="Releases on GitHub"
            className="btn-ghost rounded-full w-8 h-8 inline-flex items-center justify-center text-fg-dim hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <GithubMark size={15} />
          </a>
          <Link
            href="/download"
            className="btn-ghost rounded-full px-4 py-1.5 text-caption font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Download
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden btn-ghost rounded-full w-8 h-8 inline-flex items-center justify-center text-fg-dim hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {open ? (
              <X size={16} strokeWidth={1.75} />
            ) : (
              <Menu size={16} strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile sheet. Rendered (not unmounted) only when open so focus
          order stays natural; backdrop closes on tap. */}
      {open ? (
        <div className="md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-[57px] z-40 bg-black/60 backdrop-blur-sm"
          />
          <nav
            id="mobile-nav"
            aria-label="Mobile"
            className="absolute left-0 right-0 top-full z-50 mx-3 mt-2 rounded-2xl border border-line-soft bg-bg-elev/95 backdrop-blur-xl p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]"
          >
            {NAV_LINKS.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-xl px-4 py-3 text-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                    active
                      ? "bg-surface-2 text-fg"
                      : "text-fg-dim hover:bg-surface-1 hover:text-fg"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/download"
              className="mt-1 block rounded-xl px-4 py-3 text-body font-medium text-fg bg-surface-2 hover:bg-surface-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              Download
            </Link>
          </nav>
        </div>
      ) : null}
    </motion.header>
  );
}
