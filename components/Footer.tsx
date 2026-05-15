"use client";

import { Github, Mail } from "lucide-react";

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
            30+ panes for clipboard, capture, system, files and storage — in a
            single 14 MB native macOS app.
          </p>
        </div>

        <FooterCol
          title="Product"
          links={[
            { label: "Features", href: "/#features" },
            { label: "Compare", href: "/#compare" },
            { label: "Privacy", href: "/#privacy" },
            { label: "Requirements", href: "/#requirements" },
          ]}
        />

        <FooterCol
          title="Resources"
          links={[
            { label: "Changelog", href: "#" },
            { label: "Press kit", href: "#" },
            { label: "Status", href: "#" },
          ]}
        />

        <FooterCol
          title="Company"
          links={[
            { label: "Contact", href: "/contact" },
            { label: "Security", href: "/security" },
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
          <div className="text-[12px] text-[var(--color-fg-mute)]">
            © {new Date().getFullYear()} Trove. macOS, Apple Silicon and the
            Apple logo are trademarks of Apple Inc.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ArnavGoel03/trove"
              aria-label="GitHub"
              className="text-[var(--color-fg-mute)] hover:text-white transition-colors"
            >
              <Github size={16} />
            </a>
            <a
              href="mailto:support@trove.app"
              aria-label="Email"
              className="text-[var(--color-fg-mute)] hover:text-white transition-colors"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-mute)] mb-4">
        {title}
      </div>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="text-[13.5px] text-[var(--color-fg-dim)] hover:text-white transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
