"use client";

import { motion } from "motion/react";
import { toast } from "sonner";
import { Terminal, Github, Copy } from "lucide-react";
import DownloadButton from "@/components/DownloadButton";

const BREW_CMD = "brew install --cask trove";

export default function FeaturesCta() {
  async function copyBrew() {
    try {
      await navigator.clipboard.writeText(BREW_CMD);
      toast.success("Homebrew command copied", {
        description:
          "Paste in Terminal — the cask installs Trove from the GitHub release.",
      });
    } catch {
      toast.error("Couldn't copy", {
        description: "Select and copy the command manually.",
      });
    }
  }

  return (
    <section className="relative px-6 py-24 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-[#ff7a45]/25 bg-gradient-to-br from-[#ff7a45]/8 via-transparent to-[#b27cff]/8"
      >
        <div
          aria-hidden
          className="absolute -inset-32 -z-10 opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(50% 50% at 30% 0%, rgba(255,122,69,0.35), transparent 70%), radial-gradient(50% 50% at 80% 100%, rgba(178,124,255,0.3), transparent 70%)",
          }}
        />

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] leading-[1.05] max-w-2xl">
          Try the 1.1.0 release.
          <br />
          <span className="text-[var(--color-fg-dim)]">
            Two ways to install.
          </span>
        </h2>

        <div className="mt-9 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-white/[0.08] bg-black/30 p-5">
            <div className="text-[11.5px] uppercase tracking-[0.18em] text-[var(--color-fg-mute)] mb-3">
              Direct download
            </div>
            <p className="text-[13.5px] text-[var(--color-fg-dim)] mb-5 leading-relaxed">
              The fastest path: grab the universal .zip from GitHub
              Releases. First launch needs right-click → Open
              (Gatekeeper bypass for the ad-hoc-signed build).
            </p>
            <DownloadButton size="md" />
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-black/30 p-5">
            <div className="text-[11.5px] uppercase tracking-[0.18em] text-[var(--color-fg-mute)] mb-3">
              Homebrew Cask
            </div>
            <p className="text-[13.5px] text-[var(--color-fg-dim)] mb-4 leading-relaxed">
              Once the tap is published, install and update sit on the same
              <code className="text-white/90 bg-white/[0.04] px-1.5 py-0.5 rounded text-[12px] mx-1">
                brew upgrade --cask
              </code>
              flow as your other Mac apps.
            </p>
            <button
              onClick={copyBrew}
              className="btn-ghost group inline-flex items-center gap-2 rounded-xl font-mono text-[12.5px] px-3.5 py-2.5 w-full justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2 min-w-0">
                <Terminal size={14} className="opacity-70 shrink-0" />
                <span className="truncate">$ {BREW_CMD}</span>
              </span>
              <Copy
                size={13}
                className="opacity-60 group-hover:opacity-100 transition-opacity shrink-0"
              />
            </button>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-4 text-[12.5px] text-[var(--color-fg-dim)]">
          <a
            href="https://github.com/ArnavGoel03/trove"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Github size={13} /> Source on GitHub
          </a>
          <span className="text-[var(--color-fg-mute)]">·</span>
          <a
            href="https://github.com/ArnavGoel03/trove/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            All releases
          </a>
          <span className="text-[var(--color-fg-mute)]">·</span>
          <a
            href="https://github.com/ArnavGoel03/trove/blob/main/macos/CHANGELOG.md"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Full 1.1.0 changelog
          </a>
        </div>
      </motion.div>
    </section>
  );
}
