"use client";
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => { if (typeof window !== "undefined") window.print(); }}
      className="rounded-full border border-white/[0.1] px-4 py-1.5 text-[12px] text-[var(--color-fg-dim)] hover:text-white hover:border-white/30 transition-colors"
    >
      Print cheatsheet
    </button>
  );
}
