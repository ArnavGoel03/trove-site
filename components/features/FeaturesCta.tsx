"use client";

import { motion } from "motion/react";
import { toast } from "sonner";
import { Terminal, Github, Copy } from "lucide-react";
import DownloadButton from "@/components/DownloadButton";
import { PLATFORM, SIGNING, TROVE } from "@/lib/brand";
import { useReveal } from "@/lib/reveal";
import { ISSUES_URL, releasePageURL } from "@/lib/releases";

const BREW_CMD = "brew install --cask trove";

export default function FeaturesCta() {
  const rise = useReveal();
  async function copyBrew() {
    try {
      await navigator.clipboard.writeText(BREW_CMD);
      toast.success("Homebrew command copied", {
        description:
          "Paste in Terminal: the cask installs Trove from the GitHub release.",
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
        {...rise({ y: 24 })}
        className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-accent/25 bg-gradient-to-br from-accent/8 via-transparent to-accent/8"
      >
        <div
          aria-hidden
          className="absolute -inset-32 -z-10 opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(50% 50% at 30% 0%, rgb(var(--color-accent-rgb)/0.35), transparent 70%), radial-gradient(50% 50% at 80% 100%, rgb(var(--color-accent-rgb)/0.3), transparent 70%)",
          }}
        />

        <h2 className="text-display font-semibold max-w-2xl">
          Try the {TROVE.version} release.
          <br />
          <span className="text-fg-dim">
            Two ways to install.
          </span>
        </h2>

        <div className="mt-9 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-line-soft bg-black/30 p-5">
            <div className="text-micro uppercase text-fg-mute mb-3">
              Direct download
            </div>
            <p className="text-caption text-fg-dim mb-5 leading-relaxed">
              The fastest path: grab the .zip from GitHub Releases
              ({PLATFORM.arch}, {PLATFORM.minMacOS}). {SIGNING.firstLaunch}
            </p>
            <DownloadButton size="md" />
          </div>

          <div className="rounded-2xl border border-line-soft bg-black/30 p-5">
            <div className="text-micro uppercase text-fg-mute mb-3">
              Homebrew Cask
            </div>
            <p className="text-caption text-fg-dim mb-4 leading-relaxed">
              Once the tap is published, install and update sit on the same
              <code className="text-white/90 bg-surface-1 px-1.5 py-0.5 rounded text-caption mx-1">
                brew upgrade --cask
              </code>
              flow as your other Mac apps.
            </p>
            <button
              onClick={copyBrew}
              className="btn-ghost group inline-flex items-center gap-2 rounded-xl font-mono text-caption px-3.5 py-2.5 w-full justify-between cursor-pointer"
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

        <div className="mt-7 flex flex-wrap items-center gap-4 text-caption text-fg-dim">
          <a
            href={ISSUES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Github size={13} /> Report an issue
          </a>
          <span className="text-fg-mute">·</span>
          <a
            href={releasePageURL()}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            All releases
          </a>
          <span className="text-fg-mute">·</span>
          <a
            href="/changelog"
            className="hover:text-white transition-colors"
          >
            Full {TROVE.version} changelog
          </a>
        </div>
      </motion.div>
    </section>
  );
}
