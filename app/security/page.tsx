import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import JsonLd, { webPageLd, breadcrumbLd } from "@/components/JsonLd";
import {
  ShieldCheck,
  Lock,
  Network,
  FileSearch,
  AlertTriangle,
  Wrench,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Security: Trove",
  description:
    "Trove's security posture: local-only by default, ad-hoc signed today, frontmost-gated URL scheme, red-teamed core surfaces, responsible disclosure program.",
  alternates: { canonical: "https://gettrove.vercel.app/security" },
};

type Sec = {
  icon: typeof ShieldCheck;
  title: string;
  body: string;
  bullets?: string[];
};

const SECTIONS: Sec[] = [
  {
    icon: Lock,
    title: "Local-only by default",
    body: "During normal use Trove makes no outbound calls. The three exceptions: the in-app updater polls GitHub Releases every six hours, the homepage and footer read the latest release tag once on first paint, and the calculator's live-currency conversion (opt-in, off by default) reaches the FX endpoint when you enable it. Every other pane runs entirely on your machine.",
    bullets: [
      "Stage, History, Snippets, Notes, Calculator (offline), Text Tools, Color, QR, OCR, Record, Snip, Mirror, Image Tools, PDF, Hash, Rename, Snap, Switcher, Move Files, Finder, Processes, Awake, Permissions, Log, GPU, Network, Overview, Scan, Clean, Sweep, Disk Speed, Library, Account, all process locally.",
      "OCR runs on Apple's Vision framework on-device. No cloud OCR.",
      "Hash, Image Tools, PDF, Rename, Disk Speed all stream files locally, nothing is uploaded.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "URL-scheme hardening",
    body: "Every state-changing trove:// verb is gated on Trove being the frontmost app. The check uses NSWorkspace.frontmostApplication's bundle identifier: not a window-focus heuristic. A drive-by `<a href=\"trove://copy-text\">` from a website is refused with a flash toast.",
    bullets: [
      "Frontmost gating: copy, copy-text, clear, capture, add, snippet/copy, history/copy, calc?copy=1",
      "Symlink resolution on every file path before validation",
      "Blocklist on /dev/, /proc/, /sys/, /private/var/run/",
      "1 MB cap on text payloads, 200 MB cap on file payloads",
      "SHA256SUMS verifier refuses absolute paths and `..` components: a hostile sums file can't hash /etc/passwd",
    ],
  },
  {
    icon: Wrench,
    title: "Crash discipline",
    body: "DEVELOP_RULES §1 enforced across the production Swift tree: no `try!`, no `fatalError`, no `main.sync`, no bare `.waitUntilExit`, no `.first!`. Every JSON-backed store has quarantine-on-corrupt: if a file is unreadable, Trove moves it aside and starts fresh instead of crashing on launch.",
    bullets: [
      "lint-trove pass runs clean across 45 production files",
      "Errors surface as Sonner-grade flash toasts, never alert() or silent failure",
      "Test suite: 233/233 PASS at 1.11.2",
    ],
  },
  {
    icon: Network,
    title: "Network posture",
    body: "Trove has no telemetry, no analytics, no crash reporter calling home. The only outbound endpoint is api.github.com (for release polling). You can verify with Little Snitch, lsof, or a packet capture, there's nothing else.",
    bullets: [
      "Updater: GitHub Releases API every 6h (opt-out in Settings → Updates)",
      "Latest version display: GitHub Releases API once per page load",
      "Calculator currency: optional, off by default",
    ],
  },
  {
    icon: FileSearch,
    title: "Signing + distribution",
    body: "Builds today are ad-hoc signed (no developer ID, no notarization yet). Run with `xattr -d com.apple.quarantine /Applications/Trove.app` on first launch, or grant via System Settings → Privacy & Security. A signed + notarized channel is in progress, when it ships, the Cask formula will auto-flip to it.",
    bullets: [
      "GitHub Releases is the canonical distribution channel",
      "Homebrew Cask: `brew tap arnavgoel/trove && brew install --cask trove` (once tap is published)",
      "Every release artifact has a SHA-256 alongside, verify with Trove's own Hash pane",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Responsible disclosure",
    body: "Found a security bug? Email yashgoel0304@gmail.com with `[SECURITY] Trove` in the subject. Please don't open a public GitHub issue for vulnerabilities, let us patch first, then publicly credit you in the changelog. We aim to triage within 48 hours and ship a fix in the next beta build.",
    bullets: [
      "Scope: the Trove macOS app and the gettrove.vercel.app marketing site",
      "Out of scope: third-party dependencies (report upstream)",
      "PGP key on request",
    ],
  },
];

export default function SecurityPage() {
  return (
    <PageShell
      eyebrow="Trust"
      title="Security"
      lede="A local-first app has a small attack surface. Trove's is small on purpose, and the pages below spell out exactly what is and isn't reachable from the network."
    >
      <JsonLd
        data={webPageLd(
          "Trove Security",
          "How Trove handles local-only operation, URL-scheme hardening, signing, and responsible disclosure.",
          "https://gettrove.vercel.app/security",
        )}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: "https://gettrove.vercel.app" },
          { name: "Security", url: "https://gettrove.vercel.app/security" },
        ])}
      />

      <div className="space-y-6">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <article key={s.title} className="pane rounded-xl p-6">
              <header className="flex items-center gap-3 mb-4">
                <span className="inline-flex w-10 h-10 rounded-xl items-center justify-center bg-[rgba(255,122,69,0.12)] text-[var(--color-accent)]">
                  <Icon size={20} strokeWidth={1.5} />
                </span>
                <h2 className="text-[20px] font-semibold tracking-tight text-white">
                  {s.title}
                </h2>
              </header>
              <p className="text-[15px] leading-[1.7] text-[var(--color-fg-dim)]">
                {s.body}
              </p>
              {s.bullets ? (
                <ul className="mt-4 space-y-2">
                  {s.bullets.map((b) => (
                    <li
                      key={b}
                      className="text-[14px] leading-[1.7] text-[var(--color-fg-dim)] pl-5 relative before:content-['-'] before:absolute before:left-0 before:text-[var(--color-fg-mute)]"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}
