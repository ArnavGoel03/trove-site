"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check, Apple } from "lucide-react";
import { useMacDetect } from "@/lib/useMacDetect";

const ZIP_URL = "/Trove.zip";

export default function DownloadButton({
  size = "lg",
}: {
  size?: "lg" | "md";
}) {
  const platform = useMacDetect();
  const [copied, setCopied] = useState(false);

  const sizeCls =
    size === "lg" ? "px-6 py-3.5 text-[15px]" : "px-4 py-2 text-[13px]";

  async function copyLink() {
    try {
      const url = `${window.location.origin}${ZIP_URL}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // no-op
    }
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
      <div
        className={`btn-ghost inline-flex items-center gap-2 rounded-full font-medium ${sizeCls} cursor-not-allowed opacity-90`}
        aria-disabled="true"
      >
        <Apple size={16} className="-ml-0.5 opacity-60" />
        macOS only — open this link on a Mac
      </div>
      <button
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 text-[12.5px] text-[var(--color-fg-dim)] hover:text-white transition-colors px-2 py-1 rounded-md"
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="ok"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-1.5"
            >
              <Check size={13} /> Copied
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-1.5"
            >
              <Copy size={13} /> Copy download link
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
