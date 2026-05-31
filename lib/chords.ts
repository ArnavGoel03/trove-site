// Mirror of `ChordRegistry` in macos/main.swift (line ~3483). Edit on both
// sides when a new pane adds a shortcut. The /shortcuts page renders this
// directly; per-pane pages also pull from here for their "Shortcuts" block.

export type Chord = {
  keys: string;
  label: string;
};

/** Always-visible app-wide chords. */
export const GLOBAL_CHORDS: Chord[] = [
  { keys: "⌘?", label: "Show keyboard shortcuts overlay" },
  { keys: "⌘K", label: "Quick Switcher (jump to pane)" },
  { keys: "⌘,", label: "Settings" },
  { keys: "⌘1", label: "Stage pane" },
  { keys: "⌘2", label: "History pane" },
  { keys: "⌘3", label: "Snippets pane" },
  { keys: "⌘4", label: "Notes pane" },
  { keys: "⌘⇧V", label: "Paste into Stage" },
  { keys: "⌘⇧N", label: "Capture screenshot" },
  { keys: "⌘⇧⌫", label: "Clear Stage" },
  { keys: "⌘⌥⇧T", label: "Global screenshot to Stage" },
  { keys: "⌃⇧⌘V", label: "Open clipboard history HUD" },
  { keys: "⌘⇧.", label: "Stop active recording (global)" },
];

/** Per-pane bespoke chords. Keyed by pane name as it appears in lib/panes.ts. */
export const PANE_CHORDS: Record<string, Chord[]> = {
  Stage: [
    { keys: "Drag", label: "Drop files / text onto Stage to collect them" },
    { keys: "⌘⇧V", label: "Paste current clipboard into Stage" },
    { keys: "⌘⇧⌫", label: "Clear all Stage items" },
    { keys: "Space", label: "Quick Look the focused Stage item" },
    { keys: "⌫", label: "Remove the focused Stage item" },
  ],
  History: [
    { keys: "⌘F", label: "Focus search field" },
    { keys: "⌘⇧.", label: "Toggle plain / regex search" },
    { keys: "↑ / ↓", label: "Navigate entries" },
    { keys: "↩", label: "Copy focused entry" },
    { keys: "Space", label: "Preview focused entry" },
  ],
  Snippets: [
    { keys: "⌘N", label: "New snippet" },
    { keys: "⌘F", label: "Search snippets" },
    { keys: "⌘E", label: "Edit focused snippet" },
    { keys: "↩", label: "Copy focused snippet" },
  ],
  Notes: [
    { keys: "⌘N", label: "New note" },
    { keys: "⌘B", label: "Bold selection" },
    { keys: "⌘I", label: "Italic selection" },
    { keys: "⌘K", label: "Insert link" },
  ],
  Calculator: [
    { keys: "↑ / ↓", label: "Recall previous expressions" },
    { keys: "⌘C", label: "Copy last result" },
    { keys: "Tab", label: "Insert `ans` (previous result)" },
  ],
  "Text Tools": [
    { keys: "⌘V", label: "Paste new input" },
    { keys: "⌘⇧S", label: "Save current chain as recipe" },
    { keys: "⌘⌫", label: "Remove last pipeline step" },
  ],
  Hash: [
    { keys: "Drag", label: "Drop files to hash, or a SUMS file to verify" },
    { keys: "⌘C", label: "Copy focused row's SHA-256" },
    { keys: "⌫", label: "Remove focused row" },
  ],
  QR: [
    { keys: "⌘C", label: "Copy QR PNG" },
    { keys: "⌘S", label: "Save QR PNG…" },
  ],
  OCR: [
    { keys: "⌘⇧N", label: "Capture region and OCR" },
    { keys: "⌘C", label: "Copy recognized text" },
  ],
};

export function chordsForPane(name: string): Chord[] {
  return PANE_CHORDS[name] ?? [];
}
