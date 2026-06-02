"use client";

import { Apple, MonitorDown, Download, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

const REPO = "ArnavGoel03/trove";

type Release = {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  assets: { name: string; size: number; browser_download_url: string }[];
};

export default function DownloadCard({
  platform,
  title,
  tagline,
  assetName,
  instructionsTitle,
  instructions,
  release,
  fallbackTag,
  fallbackAsset,
}: {
  platform: "mac" | "windows";
  title: string;
  tagline: string;
  assetName: string;
  instructionsTitle: string;
  instructions: string[];
  release: Release | null;
  fallbackTag: string;
  fallbackAsset: string;
}) {
  const tag = release?.tag_name ?? fallbackTag;
  const asset = release?.assets.find((a) => a.name === assetName);
  const href =
    asset?.browser_download_url ??
    `https://github.com/${REPO}/releases/download/${tag}/${fallbackAsset}`;
  const sizeMb = asset ? (asset.size / (1024 * 1024)).toFixed(1) : null;
  const publishedISO = release?.published_at;
  const releasePage =
    release?.html_url ?? `https://github.com/${REPO}/releases/tag/${tag}`;

  const Icon = platform === "mac" ? Apple : MonitorDown;

  function onDownload() {
    if (platform === "mac") {
      toast.success("Mac download starting", {
        description: "Right-click → Open on first launch (ad-hoc signed).",
        duration: 7000,
      });
    } else {
      toast.success("Windows download starting", {
        description:
          "SmartScreen: click 'More info' → 'Run anyway' the first time.",
        duration: 7000,
      });
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(href);
      toast.success(`${title} link copied`);
    } catch {
      toast.error("Couldn't copy link");
    }
  }

  const publishedLabel = publishedISO
    ? new Date(publishedISO).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "release date unknown";

  return (
    <div className="relative rounded-3xl border border-white/[0.07] bg-white/[0.025] p-7 flex flex-col gap-5 overflow-hidden">
      <div
        className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full opacity-25 blur-3xl"
        style={{
          background:
            platform === "mac"
              ? "radial-gradient(closest-side, rgba(255,138,80,0.7), transparent)"
              : "radial-gradient(closest-side, rgba(110,170,255,0.65), transparent)",
        }}
      />
      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className={
              "size-10 rounded-2xl inline-flex items-center justify-center " +
              (platform === "mac"
                ? "bg-gradient-to-br from-[#ff8b5a] via-[#ff6a2a] to-[#b27cff]"
                : "bg-gradient-to-br from-[#5a9bff] via-[#3b7fdc] to-[#2a55b2]")
            }
          >
            <Icon size={20} strokeWidth={2} className="text-white" />
          </span>
          <div>
            <div className="text-[20px] font-semibold tracking-tight leading-tight">
              {title}
            </div>
            <div className="text-[12px] text-[var(--color-fg-dim)] mt-0.5">
              {tag} · {publishedLabel}
              {sizeMb ? ` · ${sizeMb} MB` : ""}
            </div>
          </div>
        </div>
        <a
          href={releasePage}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] text-[var(--color-fg-dim)] hover:text-white inline-flex items-center gap-1 transition-colors"
          title="Open release page on GitHub"
        >
          Release notes
          <ExternalLink size={12} />
        </a>
      </div>

      <p className="relative text-[14px] text-[var(--color-fg-dim)] leading-relaxed">
        {tagline}
      </p>

      <div className="relative flex flex-wrap items-center gap-2">
        <motion.a
          href={href}
          download
          onClick={onDownload}
          whileHover={{ y: -1 }}
          whileTap={{ y: 0 }}
          className="btn-primary inline-flex items-center gap-2 rounded-full font-semibold px-5 py-3 text-[14.5px] transition-all"
        >
          <Icon size={16} className="-ml-0.5" />
          Download {tag}
        </motion.a>
        <button
          onClick={copyLink}
          className="btn-ghost inline-flex items-center gap-2 rounded-full px-4 py-3 text-[13px] cursor-pointer"
          title="Copy direct download URL"
        >
          <Download size={14} className="opacity-70" />
          Copy link
        </button>
      </div>

      <div className="relative">
        <div className="text-[12px] uppercase tracking-wide text-[var(--color-fg-dim)] mb-2">
          {instructionsTitle}
        </div>
        <ol className="text-[13.5px] text-[var(--color-fg-dim)] leading-relaxed space-y-1.5 list-decimal list-outside pl-5">
          {instructions.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
