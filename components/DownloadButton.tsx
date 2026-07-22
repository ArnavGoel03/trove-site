"use client";

import { motion } from "motion/react";
import { Apple, MonitorDown, Download } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useMacDetect } from "@/lib/useMacDetect";

import { FALLBACK_TAGS, downloadURL, type ResolvedTags } from "@/lib/releases";

// Tags come from /api/releases, which makes the GitHub call server-side and
// caches it. The initial state is the build-time floor derived from
// macos/VERSION, so the first paint already shows a real, downloadable tag
// rather than a hand-typed placeholder that may be months stale.
async function fetchLatestTags(): Promise<ResolvedTags> {
  const res = await fetch("/api/releases");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as ResolvedTags;
}

export default function DownloadButton({
  size = "lg",
}: {
  size?: "lg" | "md";
}) {
  const platform = useMacDetect();
  const [tags, setTags] = useState<ResolvedTags>(FALLBACK_TAGS);

  useEffect(() => {
    fetchLatestTags()
      .then(setTags)
      .catch(() => {});
  }, []);

  const macHref = downloadURL("mac", tags.mac);
  const winHref = downloadURL("windows", tags.win);

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

  // Linux / ChromeOS / mobile - copy-link path for both targets.
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
