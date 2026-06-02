import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DownloadCard from "./DownloadCard";

export const metadata: Metadata = {
  title: "Download Trove: Mac and Windows",
  description:
    "Native, local-only Trove for macOS 13+ and Windows 10/11. Single-file install on both. No account, no telemetry.",
};

// Re-evaluate the page every hour so the SSR-rendered version numbers in
// each card stay in sync with the GitHub releases. The card itself also
// hits the live API client-side for a final freshness pass.
export const revalidate = 3600;

const REPO = "ArnavGoel03/trove";

type LatestRelease = {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  body: string;
  assets: { name: string; size: number; browser_download_url: string }[];
};

async function fetchLatestReleases(): Promise<{
  mac: LatestRelease | null;
  win: LatestRelease | null;
}> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/releases?per_page=20`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return { mac: null, win: null };
    const list: LatestRelease[] = await res.json();
    let mac: LatestRelease | null = null;
    let win: LatestRelease | null = null;
    for (const r of list) {
      if (r.tag_name.endsWith("-win")) {
        if (!win) win = r;
      } else if (!mac) {
        mac = r;
      }
      if (mac && win) break;
    }
    return { mac, win };
  } catch {
    return { mac: null, win: null };
  }
}

export default async function DownloadPage() {
  const { mac, win } = await fetchLatestReleases();

  return (
    <>
      <Nav />
      <main id="main-content" className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <header className="max-w-3xl mb-12">
          <h1 className="text-[clamp(34px,5vw,52px)] font-semibold tracking-tight leading-[1.05]">
            Download Trove
          </h1>
          <p className="mt-4 text-[16px] text-[var(--color-fg-dim)] leading-relaxed">
            Native on every supported platform. Local-only by default: no
            account, no telemetry, no upload. Single binary, no installer.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <DownloadCard
            platform="mac"
            title="macOS"
            tagline="Universal binary, macOS 13 Ventura or newer. Apple Silicon and Intel."
            assetName="Trove.zip"
            instructionsTitle="First launch"
            instructions={[
              "Unzip Trove.zip; the app appears as Trove.app.",
              'Move it to /Applications (drag from Downloads).',
              "First launch: right-click → Open. Gatekeeper bypass for the ad-hoc-signed build (Developer ID notarization is on the roadmap).",
              "Update channel and feature toggles live in Settings (⌘,).",
            ]}
            release={mac}
            fallbackTag="v1.5.2"
            fallbackAsset="Trove.zip"
          />
          <DownloadCard
            platform="windows"
            title="Windows"
            tagline="Self-contained single-file build. Windows 10 19041 and newer, x64."
            assetName="Trove-win-x64.zip"
            instructionsTitle="First launch"
            instructions={[
              "Unzip Trove-win-x64.zip anywhere you like (no installer required).",
              "Double-click Trove.exe to launch.",
              "Windows SmartScreen may prompt: click 'More info' → 'Run anyway' (the build is not yet code-signed).",
              "Around 55% feature parity with macOS; growing each release. The Mac column on /compare lists the full picture.",
            ]}
            release={win}
            fallbackTag="v1.5.2-win"
            fallbackAsset="Trove-win-x64.zip"
          />
        </div>

        <section className="mt-16 grid sm:grid-cols-3 gap-6 text-[13.5px]">
          <Highlight
            title="Local-only"
            body="No account, no telemetry, no upload. Everything runs on the device."
          />
          <Highlight
            title="Source on GitHub"
            body={`Source viewable at github.com/${REPO}. Signed releases.`}
          />
          <Highlight
            title="Auto-update"
            body="In-app updater polls GitHub Releases. Stable + Beta channels, opt-in."
          />
        </section>

        <section className="mt-12 grid sm:grid-cols-2 gap-6 text-[13.5px]">
          <LinkCard
            title="Want every release?"
            href={`https://github.com/${REPO}/releases`}
            external
          >
            Browse every Mac and Windows tag on GitHub Releases, including past
            betas.
          </LinkCard>
          <LinkCard title="Curious what changed?" href="/changelog">
            Live-sourced changelog with per-version detail for every pane that
            shipped.
          </LinkCard>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Highlight({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="text-[15px] font-semibold tracking-tight">{title}</div>
      <p className="mt-1.5 text-[var(--color-fg-dim)] leading-relaxed">
        {body}
      </p>
    </div>
  );
}

function LinkCard({
  title,
  href,
  external,
  children,
}: {
  title: string;
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="block rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:bg-white/[0.04] hover:border-white/[0.12] transition-colors"
    >
      <div className="text-[15px] font-semibold tracking-tight">
        {title}
        <span className="ml-1 text-[var(--color-fg-dim)] font-normal">→</span>
      </div>
      <p className="mt-1.5 text-[var(--color-fg-dim)] leading-relaxed">
        {children}
      </p>
    </a>
  );
}
