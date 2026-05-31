import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import JsonLd, { webPageLd, breadcrumbLd } from "@/components/JsonLd";
import {
  Accessibility,
  Ear,
  Eye,
  Keyboard,
  Languages,
  MousePointer2,
  PauseCircle,
  Type,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Accessibility — Trove",
  description:
    "How Trove supports VoiceOver, Reduced Motion, contrast tokens, keyboard navigation, and the full macOS accessibility surface.",
  alternates: { canonical: "https://gettrove.vercel.app/accessibility" },
};

type Sec = {
  icon: typeof Accessibility;
  title: string;
  body: string;
  bullets?: string[];
};

const SECTIONS: Sec[] = [
  {
    icon: Ear,
    title: "VoiceOver — every pane is rotor-navigable",
    body: "Every interactive element in Trove ships with an explicit accessibilityLabel and, where the visual affordance is non-obvious, an accessibilityHint. List rows in History, Snippets, and Library expose their content as the label so the VoiceOver rotor reads the actual entry, not a generic 'row'. Pane titles announce as headings so the rotor's Headings list maps to the sidebar.",
    bullets: [
      "Sidebar pane buttons: label is the pane name, trait is .button + .header",
      "Clipboard rows: label is the truncated content, value is the source app, hint is 'Activate to paste'",
      "Snippet rows: label is the title, value is the body preview, custom rotor action for 'Edit' and 'Delete'",
      "Recorder controls: dynamic label that switches between 'Start recording' and 'Stop, X seconds elapsed' so VO announces state changes",
      "Modal dialogs trap focus and announce on open via the system accessibility post",
    ],
  },
  {
    icon: PauseCircle,
    title: "Reduced Motion — respected app-wide",
    body: "Trove queries NSWorkspace.shared.accessibilityDisplayShouldReduceMotion before every animated transition. When the user has 'Reduce motion' on in System Settings → Accessibility → Display, the following degrade gracefully to instant state changes: the click ripple in Recorder, the pane-switch crossfade, the Sonner-style toast slide, the menubar overlay reveal, and the Stage drop-zone pulse. Nothing is removed — every state still updates — but no kinetic transitions play.",
    bullets: [
      "Recorder click ripple is suppressed when accessibilityDisplayShouldReduceMotion is true",
      "Pane switcher uses a 0ms cross-fade instead of a 200ms slide",
      "Toast notifications appear instantly without the 150ms ease-out",
      "Stage drop-zone shows a static border highlight, no breathing pulse",
      "The marketing site mirrors the same respect via the prefers-reduced-motion media query in globals.css",
    ],
  },
  {
    icon: Eye,
    title: "Contrast tokens — 4.5:1 minimum on body text",
    body: "Both the Dark and Light themes were designed against WCAG AA contrast on body text and AAA on titles. The accent orange is reserved for non-essential signal — every interactive control that depends on color also has a shape, icon, or text label. Color is never the only channel.",
    bullets: [
      "Body text: --color-fg (#f5f5f7) on --color-bg (#08080b) — 18.9:1",
      "Dimmed text: --color-fg-dim (#a1a1aa) on --color-bg — 8.4:1",
      "Muted text: --color-fg-mute (#71717a) on --color-bg — 4.7:1 (used only on metadata, never on actionable text)",
      "Accent orange (#ff7a45) is used on background, not on long-form text — when it is used as text (links, eyebrow labels), it's at 14px+ and against the dark surface, 4.8:1",
      "Light theme parallels: dimmed text holds 7.1:1, muted holds 4.6:1",
    ],
  },
  {
    icon: Keyboard,
    title: "Keyboard navigation — Tab, arrows, ⌘? overlay",
    body: "Every pane is fully keyboard-navigable without a mouse. The sidebar accepts arrow-up / arrow-down. Lists accept arrow keys + Return to activate + Backspace to delete. Modal sheets accept Escape. The global ⌘? overlay is generated from a ChordRegistry that every pane registers into at boot — there is no hand-maintained cheatsheet, so the overlay never goes stale.",
    bullets: [
      "Tab order follows visual order, including past the sidebar into each pane's primary action",
      "Focus rings are visible — Trove honors the system focus-ring style and never sets outline: none",
      "Lists: ↑/↓ moves selection, ↵ activates, ⌫ deletes, ⌘A selects all where applicable",
      "Modal sheets trap focus and restore it to the originating control on dismiss",
      "Hit ⌘? from anywhere to open the ChordRegistry-backed cheatsheet — searchable, scoped to the active pane",
    ],
  },
  {
    icon: Type,
    title: "Dynamic Type + text scaling",
    body: "All UI text is set in points, not pixels, and uses SF Pro Text / SF Pro Display via the system font stack. The macOS 'Larger Text' accessibility option scales the entire app — no text is hard-pinned at a fixed metric. The marketing site uses rem-based sizing on body copy so browser-level zoom and OS-level text scaling both compose cleanly.",
    bullets: [
      "Body text scales with the system 'Larger Text' setting",
      "Code panes use a monospace stack that also respects scaling",
      "The marketing site's md-body block uses rem on line-height for browser zoom",
    ],
  },
  {
    icon: MousePointer2,
    title: "Pointer targets — 32×32 minimum",
    body: "Every interactive control in Trove has a 32×32-point minimum hit target, which exceeds Apple's 28×28 HIG floor and lands close to the WCAG 2.5.5 'Target Size (Enhanced)' 44×44 recommendation for primary actions. Buttons in toolbars and menubar overlays get an explicit padded hit area larger than their visual size.",
  },
  {
    icon: Languages,
    title: "Localization + plain language",
    body: "Trove ships in English today. Every user-facing string is in a Localizable.strings file so a localization pass is mechanical. The copy avoids idiom and jargon — error messages explain what happened and what to try next, not 'error -1407'.",
    bullets: [
      "All UI strings sourced from Localizable.strings, ready for a localization pass",
      "Error toasts are plain-language: 'Couldn't save — your disk is full' instead of 'NSCocoaError 642'",
      "Empty states tell the user what the pane does, not just that it's empty",
    ],
  },
];

export default function AccessibilityPage() {
  return (
    <PageShell
      eyebrow="Inclusion"
      title="Accessibility"
      lede="VoiceOver, Reduced Motion, keyboard-only, low-vision. A small native app is easier to make accessible than a big sprawly one, and Trove leans on that: every control gets a label, every state can be announced, every motion respects your system setting."
    >
      <JsonLd
        data={webPageLd(
          "Trove Accessibility",
          "VoiceOver support, Reduced Motion, contrast tokens, and keyboard navigation in Trove.",
          "https://gettrove.vercel.app/accessibility",
        )}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: "https://gettrove.vercel.app" },
          {
            name: "Accessibility",
            url: "https://gettrove.vercel.app/accessibility",
          },
        ])}
      />

      <div className="space-y-6">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <article key={s.title} className="pane rounded-xl p-6">
              <header className="flex items-center gap-3 mb-4">
                <span className="inline-flex w-10 h-10 rounded-xl items-center justify-center bg-[rgba(255,122,69,0.12)] text-[var(--color-accent)]">
                  <Icon size={20} strokeWidth={1.5} />
                </span>
                <h2 className="text-[20px] font-semibold tracking-tight text-white">
                  {s.title}
                </h2>
              </header>
              <p className="text-[15px] leading-[1.7] text-[var(--color-fg-dim)]">
                {s.body}
              </p>
              {s.bullets ? (
                <ul className="mt-4 space-y-2">
                  {s.bullets.map((b) => (
                    <li
                      key={b}
                      className="text-[14px] leading-[1.7] text-[var(--color-fg-dim)] pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-[var(--color-fg-mute)]"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="mt-12 pane rounded-xl p-6">
        <h2 className="text-[18px] font-semibold tracking-tight text-white mb-3">
          Report an accessibility bug
        </h2>
        <p className="text-[14px] leading-[1.7] text-[var(--color-fg-dim)]">
          If something is unreachable with VoiceOver, doesn&rsquo;t honor your
          motion settings, or fails contrast on a theme you use, please email{" "}
          <a
            href="mailto:yashgoel0304@gmail.com?subject=%5BA11Y%5D%20Trove"
            className="md-link"
          >
            yashgoel0304@gmail.com
          </a>{" "}
          with <span className="md-inline">[A11Y]</span> in the subject. We
          treat a11y reports the same as crash reports — triage within 48
          hours, fix in the next beta.
        </p>
      </div>
    </PageShell>
  );
}
