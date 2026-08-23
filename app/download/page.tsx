import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DownloadCard from "./DownloadCard";
import { APPS, PLATFORM } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Download Trove: Mac and Windows",
  description:
    "Native, local-only Trove for macOS 13+ and Windows 10/11. Single-file install on both. No account, no telemetry.",
};

// Re-evaluate the page every hour so the SSR-rendered version numbers in
// each card stay in sync with the GitHub releases. The card itself also
// hits the live API client-side for a final freshness pass.
export const revalidate = 3600;

import {
  RELEASE_REPO,
  BUILT_IN_MAC_TAG,
  BUILT_IN_WIN_TAG,
  ASSET_NAMES,
} from "@/lib/releases";

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
      `https://api.github.com/repos/${RELEASE_REPO}/releases?per_page=20`,
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
      <main id="top" className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <header className="max-w-3xl mb-12">
          <h1 className="text-[clamp(34px,5vw,52px)] font-semibold tracking-tight leading-[1.05]">
            Download Trove
          </h1>
          <p className="mt-4 text-body text-fg-dim leading-relaxed">
            Native on every supported platform. Local-only by default: no
            account, no telemetry, no upload. Single binary, no installer.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <DownloadCard
            platform="mac"
            title="macOS"
            tagline={`${PLATFORM.minMacOS}. ${PLATFORM.archDetail}.`}
            instructionsTitle="First launch (please read)"
            instructions={[
              `Unzip ${ASSET_NAMES.mac}; the app appears as Trove.app.`,
              'Move it to /Applications (drag from Downloads).',
              "Right-click Trove.app and choose Open, then click Open again. Double-clicking will NOT work the first time: macOS says the developer cannot be verified and only offers Move to Bin.",
              "Trove is code-signed, but not yet notarized by Apple (that needs a paid Developer Program membership). After the first right-click Open, it launches normally forever.",
              "Update channel and feature toggles live in Settings (⌘,).",
            ]}
            release={mac}
            fallbackTag={BUILT_IN_MAC_TAG}
          />
          <DownloadCard
            platform="windows"
            title="Windows"
            tagline="Self-contained build, no runtime to install first. Windows 10 build 17763 and newer, x64."
            instructionsTitle="First launch"
            instructions={[
              `Unzip ${ASSET_NAMES.windows} anywhere you like (no installer required).`,
              "Double-click Trove.exe to launch.",
              "Windows SmartScreen may prompt: click 'More info' → 'Run anyway' (the build is not yet code-signed).",
              "25 of the Mac app's 38 panes have a Windows surface, growing each release. The Mac column on /compare lists the full picture.",
              "Not code-signed, and built on macOS rather than smoke-tested on Windows hardware. Treat it as a beta.",
            ]}
            release={win}
            fallbackTag={BUILT_IN_WIN_TAG}
          />
        </div>

        <section className="mt-16 grid sm:grid-cols-3 gap-6 text-caption">
          <Highlight
            title="Local-only"
            body="No account, no telemetry, no upload. Everything runs on the device."
          />
          <Highlight
            title="Every build, kept"
            body={`Past and current releases stay published at github.com/${RELEASE_REPO}.`}
          />
          <Highlight
            title="Auto-update"
            body="In-app updater polls GitHub Releases. Stable + Beta channels, opt-in."
          />
        </section>

        {/*
          The two other suite apps ship from the same release repo and are
          downloadable today. Their own pages carry the button, the version and
          the first-launch note, all resolved from the published asset, so
          linking there cannot go stale the way a second copy of the download
          UI would. Every word below is the app's own blurb from lib/brand.ts.
        */}
        <section className="mt-12 grid sm:grid-cols-2 gap-6 text-caption">
          <LinkCard title={APPS.relay.name} href={APPS.relay.href}>
            {APPS.relay.blurb}
          </LinkCard>
          <LinkCard title={APPS.tend.name} href={APPS.tend.href}>
            {APPS.tend.blurb}
          </LinkCard>
          <LinkCard
            title="Want every release?"
            href={`https://github.com/${RELEASE_REPO}/releases`}
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
    <div className="rounded-2xl border border-line-soft bg-surface-1 p-5">
      <div className="text-body font-semibold tracking-tight">{title}</div>
      <p className="mt-1.5 text-fg-dim leading-relaxed">
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
      className="block rounded-2xl border border-line-soft bg-surface-1 p-5 hover:bg-surface-1 hover:border-line-strong transition-colors"
    >
      <div className="text-body font-semibold tracking-tight">
        {title}
        <span className="ml-1 text-fg-dim font-normal">→</span>
      </div>
      <p className="mt-1.5 text-fg-dim leading-relaxed">
        {children}
      </p>
    </a>
  );
}
