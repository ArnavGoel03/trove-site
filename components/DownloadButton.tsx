"use client";

import { motion } from "motion/react";
import { Apple } from "lucide-react";
import { toast } from "sonner";
import { useMacDetect } from "@/lib/useMacDetect";

const ZIP_URL = "/Trove.zip";

export default function DownloadButton({
  size = "lg",
}: {
  size?: "lg" | "md";
}) {
  const platform = useMacDetect();

  const sizeCls =
    size === "lg" ? "px-6 py-3.5 text-[15px]" : "px-4 py-2 text-[13px]";

  async function copyLink() {
    try {
      const url = `${window.location.origin}${ZIP_URL}`;
      await navigator.clipboard.writeText(url);
      toast.success("Link copied", {
        description: "Paste it in a browser on your Mac to download Trove.",
      });
    } catch {
      toast.error("Couldn't copy", {
        description: "Your browser blocked the clipboard write. Try selecting the URL manually.",
      });
    }
  }

  function onMacDownload() {
    toast.success("Download starting", {
      description: "Check ~/Downloads/Trove.zip. Right-click → Open on first launch.",
      duration: 6000,
    });
  }

  if (platform === "unknown") {
    // SSR-safe placeholder, same dimensions as Mac CTA
    return (
      <div
        className={`btn-primary inline-flex items-center gap-2 rounded-full font-semibold ${sizeCls} invisible`}
      >
        <Apple size={16} />
        Download for Mac (.zip)
      </div>
    );
  }

  if (platform === "mac") {
    return (
      <motion.a
        href={ZIP_URL}
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

  // Non-Mac visitor
  return (
    <div className="inline-flex flex-col items-start gap-2.5">
      <button
        onClick={copyLink}
        className={`btn-ghost inline-flex items-center gap-2 rounded-full font-medium ${sizeCls} hover:opacity-100 opacity-90 cursor-pointer`}
      >
        <Apple size={16} className="-ml-0.5 opacity-60" />
        macOS only — copy link to open on a Mac
      </button>
    </div>
  );
}
