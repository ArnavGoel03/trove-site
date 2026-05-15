"use client";

import { motion } from "motion/react";

export default function Nav() {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 px-6 py-4 bg-black/40 backdrop-blur-xl supports-[backdrop-filter]:bg-black/30 border-b border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a
          href="#top"
          className="flex items-center gap-2.5 group"
          aria-label="Trove"
        >
          <span className="relative inline-flex w-7 h-7 rounded-[8px] bg-gradient-to-br from-[#ff8b5a] via-[#ff6a2a] to-[#b27cff] items-center justify-center shadow-[0_4px_12px_-2px_rgba(255,122,69,0.5)]">
            <span className="absolute inset-0.5 rounded-[6px] bg-black/20 backdrop-blur-sm" />
            <span className="relative text-[11px] font-bold tracking-tight text-white">
              T
            </span>
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            Trove
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-[13px] text-[var(--color-fg-dim)]">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#compare" className="hover:text-white transition-colors">
            Compare
          </a>
          <a href="#privacy" className="hover:text-white transition-colors">
            Privacy
          </a>
          <a href="#requirements" className="hover:text-white transition-colors">
            Requirements
          </a>
        </nav>
        <a
          href="#download"
          className="btn-ghost rounded-full px-4 py-1.5 text-[13px] font-medium"
        >
          Download
        </a>
      </div>
    </motion.header>
  );
}
