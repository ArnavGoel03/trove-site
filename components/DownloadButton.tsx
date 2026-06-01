"use client";

import { motion } from "motion/react";
import { Apple, MonitorDown, Download } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useMacDetect } from "@/lib/useMacDetect";

// Single repo ArnavGoel03/trove holds both Mac and Windows releases:
//   - Mac: `vX.Y.Z` tag with `Trove.zip` asset (e.g. v1.5.2).
//   - Windows: `vX.Y.Z-win` tag with `Trove-win-x64.zip` asset (e.g. v1.5.2-win).
// We resolve the latest of each at mount via the GitHub API so the buttons
// always point at the freshest tag without a redeploy.
const REPO = "ArnavGoel03/trove";
const FALLBACK_MAC_TAG = "v1.5.2";
const FALLBACK_WIN_TAG = "v1.5.2-win";

function macDownloadURL(tag: string) {
  return `https://github.com/${REPO}/releases/download/${tag}/Trove.zip`;
}
function winDownloadURL(tag: string) {
  return `https://github.com/${REPO}/releases/download/${tag}/Trove-win-x64.zip`;
}

type LatestTags = { mac: string; win: string };

async function fetchLatestTags(): Promise<LatestTags> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/releases?per_page=20`,
    { cache: "no-store" }
  );
  if (!res.ok) return { mac: FALLBACK_MAC_TAG, win: FALLBACK_WIN_TAG };
  const list: { tag_name: string; draft: boolean; prerelease: boolean }[] =
    await res.json();
  let mac = FALLBACK_MAC_TAG;
  let win = FALLBACK_WIN_TAG;
  for (const r of list) {
    if (r.draft) continue;
    if (r.tag_name.endsWith("-win")) {
      if (win === FALLBACK_WIN_TAG) win = r.tag_name;
    } else if (mac === FALLBACK_MAC_TAG) {
      mac = r.tag_name;
    }
  }
  return { mac, win };
}

export default function DownloadButton({
  size = "lg",
}: {
  size?: "lg" | "md";
}) {
  const platform = useMacDetect();
  const [tags, setTags] = useState<LatestTags>({
    mac: FALLBACK_MAC_TAG,
    win: FALLBACK_WIN_TAG,
  });

  useEffect(() => {
    fetchLatestTags()
      .then(setTags)
      .catch(() => {});
  }, []);

  const macHref = macDownloadURL(tags.mac);
  const winHref = winDownloadURL(tags.win);

  const sizeCls =
    size === "lg" ? "px-6 py-3.5 text-[15px]" : "px-4 py-2 text-[13px]";

  async function copyLink(url: string, label: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(`${label} link copied`, {
        description: "Paste it in a browser on the target machine.",
      });
    } catch {
      toast.error("Couldn't copy link", {
        description: "Open the URL from the address bar and right-click → Copy.",
      });
    }
  }

  function onMacDownload() {
    toast.success("Download starting", {
      description:
        "Check ~/Downloads/Trove.zip. First launch: right-click → Open (the build is ad-hoc signed; Developer ID notarization is on the roadmap).",
      duration: 8000,
    });
  }

  function onWindowsDownload() {
    toast.success("Download starting", {
      description:
        "Unzip Trove-win-x64.zip and run Trove.exe. Windows SmartScreen may warn: click 'More info' → 'Run anyway'.",
      duration: 7000,
    });
  }

  // SSR / first-tick placeholder with identical footprint so layout doesn't
  // shift after platform detection resolves.
  if (platform === "unknown") {
    return (
      <div
        className={`btn-primary inline-flex items-center gap-2 rounded-full font-semibold ${sizeCls} invisible`}
        aria-hidden="true"
      >
        <Apple size={16} />
        Download for Mac (.zip)
      </div>
    );
  }

  if (platform === "mac") {
    return (
      <div className="inline-flex flex-col items-start gap-2">
        <motion.a
          href={macHref}
          download
          onClick={onMacDownload}
          whileHover={{ y: -1 }}
          whileTap={{ y: 0 }}
          className={`btn-primary inline-flex items-center gap-2 rounded-full font-semibold ${sizeCls} transition-all`}
        >
          <Apple size={16} className="-ml-0.5" />
          Download for Mac ({tags.mac})
        </motion.a>
        <a
          href="/download"
          className="text-[12.5px] text-[var(--color-fg-dim)] hover:text-white transition-colors pl-1"
        >
          Or browse all platforms →
        </a>
      </div>
    );
  }

  if (platform === "windows") {
    return (
      <div className="inline-flex flex-col items-start gap-2">
        <motion.a
          href={winHref}
          download
          onClick={onWindowsDownload}
          whileHover={{ y: -1 }}
          whileTap={{ y: 0 }}
          className={`btn-primary inline-flex items-center gap-2 rounded-full font-semibold ${sizeCls} transition-all`}
        >
          <MonitorDown size={16} className="-ml-0.5" />
          Download for Windows ({tags.win})
        </motion.a>
        <a
          href="/download"
          className="text-[12.5px] text-[var(--color-fg-dim)] hover:text-white transition-colors pl-1"
        >
          Or browse all platforms →
        </a>
      </div>
    );
  }

  // Linux / ChromeOS / mobile — copy-link path for both targets.
  return (
    <div className="inline-flex flex-col items-start gap-2.5">
      <button
        onClick={() => copyLink(macHref, "Mac")}
        className={`btn-ghost inline-flex items-center gap-2 rounded-full font-medium ${sizeCls} cursor-pointer`}
      >
        <Download size={16} className="-ml-0.5 opacity-70" />
        Copy Mac download link ({tags.mac})
      </button>
      <a
        href="/download"
        className="text-[12.5px] text-[var(--color-fg-dim)] hover:text-white transition-colors pl-1"
      >
        Or open the downloads page →
      </a>
    </div>
  );
}
