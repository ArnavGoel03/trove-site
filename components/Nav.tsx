"use client";

import { motion } from "motion/react";
import { Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APPS, STUDIO, TROVE } from "@/lib/brand";
import { useEffect, useState } from "react";

// Home wordmark: the studio name once the studio brand is live, the
// flagship app name otherwise. Never a hardcoded literal either way.
const HOME_BRAND = STUDIO.live ? STUDIO.name : TROVE.name;

const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: APPS.relay.name, href: APPS.relay.href },
  { label: APPS.tend.name, href: APPS.tend.href },
  { label: "Compare", href: "/compare" },
  { label: "Guides", href: "/guides" },
  { label: "FAQ", href: "/faq" },
  { label: "Updates", href: "/updates" },
  { label: "Changelog", href: "/changelog" },
  { label: "Security", href: "/security" },
];

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
      className="fixed top-0 inset-x-0 z-50 px-6 py-4 bg-black/40 backdrop-blur-xl supports-[backdrop-filter]:bg-black/30 border-b border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label={`${HOME_BRAND} home`}
        >
          <span className="relative inline-flex w-7 h-7 rounded-[8px] bg-gradient-to-br from-[#ff8b5a] via-[#ff6a2a] to-[#b27cff] items-center justify-center shadow-[0_4px_12px_-2px_rgba(255,122,69,0.5)]">
            <span className="absolute inset-0.5 rounded-[6px] bg-black/20 backdrop-blur-sm" />
            <span className="relative text-[11px] font-bold tracking-tight text-white">
              {HOME_BRAND[0]}
            </span>
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            {HOME_BRAND}
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-6 text-[13px] text-[var(--color-fg-dim)]"
        >
          {NAV_LINKS.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                  active ? "text-white" : "hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/ArnavGoel03/trove"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${TROVE.name} on GitHub`}
            title="Source code on GitHub"
            className="btn-ghost rounded-full w-8 h-8 inline-flex items-center justify-center text-[var(--color-fg-dim)] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <Github size={15} strokeWidth={1.75} />
          </a>
          <Link
            href="/download"
            className="btn-ghost rounded-full px-4 py-1.5 text-[13px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Download
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden btn-ghost rounded-full w-8 h-8 inline-flex items-center justify-center text-[var(--color-fg-dim)] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
            className="absolute left-0 right-0 top-full z-50 mx-3 mt-2 rounded-2xl border border-white/[0.08] bg-[#0e0e12]/95 backdrop-blur-xl p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]"
          >
            {NAV_LINKS.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-xl px-4 py-3 text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                    active
                      ? "bg-white/[0.06] text-white"
                      : "text-[var(--color-fg-dim)] hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/download"
              className="mt-1 block rounded-xl px-4 py-3 text-[15px] font-medium text-white bg-white/[0.06] hover:bg-white/[0.1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              Download
            </Link>
          </nav>
        </div>
      ) : null}
    </motion.header>
  );
}
