"use client";

import { motion } from "motion/react";
import { Apple, MonitorDown, Download } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useMacDetect } from "@/lib/useMacDetect";

// Resolve to the latest GitHub Release at request time, so the marketing
// site never serves a stale local zip. `releases/latest/download/<asset>`
// is GitHub's stable redirect; it 302s to whichever asset URL is current.
const MAC_ZIP_URL =
  "https://github.com/ArnavGoel03/trove/releases/latest/download/Trove.zip";
const WIN_ZIP_URL =
  "https://github.com/ArnavGoel03/trove-win/releases/latest/download/Trove-win-x64.zip";

export default function DownloadButton({
  size = "lg",
}: {
  size?: "lg" | "md";
}) {
  const platform = useMacDetect();
  const [winVer, setWinVer] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.github.com/repos/ArnavGoel03/trove-win/releases/latest")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (typeof j?.tag_name === "string") setWinVer(j.tag_name);
      })
      .catch(() => {});
  }, []);

  const sizeCls =
    size === "lg" ? "px-6 py-3.5 text-[15px]" : "px-4 py-2 text-[13px]";

  async function copyMacLink() {
    try {
      const url = `${window.location.origin}${MAC_ZIP_URL}`;
      await navigator.clipboard.writeText(url);
      toast.success("Mac download link copied", {
        description: "Paste it in a browser on your Mac.",
      });
    } catch {
      toast.error("Couldn't copy link", {
        description: "Select and copy the URL from the address bar manually.",
      });
    }
  }

  function onMacDownload() {
    toast.success("Download starting", {
      description:
        "Check ~/Downloads/Trove.zip. The first launch needs right-click → Open (Gatekeeper bypass for the ad-hoc-signed build — Developer ID notarization is on the roadmap).",
      duration: 8000,
    });
  }

  function onWindowsDownload() {
    toast.success("Download starting", {
      description:
        "Unzip Trove-win-x64.zip and run Trove.exe. Windows SmartScreen may warn — click 'More info' → 'Run anyway'.",
      duration: 7000,
    });
  }

  // SSR / first-tick placeholder with identical footprint to the Mac CTA so
  // layout doesn't shift after the platform check resolves.
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
      <motion.a
        href={MAC_ZIP_URL}
        download
        onClick={onMacDownload}
        whileHover={{ y: -1 }}
        whileTap={{ y: 0 }}
        className={`btn-primary inline-flex items-center gap-2 rounded-full font-semibold ${sizeCls} transition-all`}
      >
        <Apple size={16} className="-ml-0.5" />
        Download for Mac (.zip)
      </motion.a>
    );
  }

  if (platform === "windows") {
    return (
      <div className="inline-flex flex-col items-start gap-2">
        <motion.a
          href={WIN_ZIP_URL}
          onClick={onWindowsDownload}
          whileHover={{ y: -1 }}
          whileTap={{ y: 0 }}
          className={`btn-primary inline-flex items-center gap-2 rounded-full font-semibold ${sizeCls} transition-all`}
        >
          <MonitorDown size={16} className="-ml-0.5" />
          Download for Windows (.zip)
        </motion.a>
        <span className="text-[11.5px] text-[var(--color-fg-dim)] pl-1">
          {winVer ?? "early build"} · Calculator, Text Tools, File Hash, QR ready · the rest stubbed
        </span>
      </div>
    );
  }

  // Linux / ChromeOS / mobile — give them a way to copy the Mac link AND
  // jump to the Windows release page.
  return (
    <div className="inline-flex flex-col items-start gap-2.5">
      <button
        onClick={copyMacLink}
        className={`btn-ghost inline-flex items-center gap-2 rounded-full font-medium ${sizeCls} cursor-pointer`}
      >
        <Download size={16} className="-ml-0.5 opacity-70" />
        Copy Mac download link
      </button>
      <a
        href={WIN_ZIP_URL}
        className="text-[12.5px] text-[var(--color-fg-dim)] hover:text-white transition-colors pl-1"
      >
        Or grab the Windows build →
      </a>
    </div>
  );
}
