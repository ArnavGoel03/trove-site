"use client";
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => { if (typeof window !== "undefined") window.print(); }}
      className="rounded-full border border-line-strong px-4 py-1.5 text-caption text-fg-dim hover:text-fg hover:border-fg/30 transition-colors"
    >
      Print cheatsheet
    </button>
  );
}
