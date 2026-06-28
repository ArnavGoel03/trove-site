import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import JsonLd, { webPageLd, breadcrumbLd } from "@/components/JsonLd";
import { Settings, Palette } from "lucide-react";

export const metadata: Metadata = {
  title: "Themes: Trove",
  description:
    "Dark, Light, Linear, and Cron themes ship in Trove. Pick one in Settings → Theme and the entire app, every pane, every chrome element, follows.",
  alternates: { canonical: "https://gettrove.vercel.app/themes" },
};

type ThemeSpec = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  surface: string;
  panel: string;
  border: string;
  text: string;
  textDim: string;
  accent: string;
  accent2: string;
  badge: string;
  swatch: string[];
};

const THEMES: ThemeSpec[] = [
  {
    id: "dark",
    name: "Dark",
    tagline: "The default.",
    description:
      "Near-black background with orange accents: the in-app default. Holds up across long sessions and OLED panels.",
    surface: "#08080b",
    panel: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))",
    border: "rgba(255,255,255,0.08)",
    text: "#f5f5f7",
    textDim: "#a1a1aa",
    accent: "#ff7a45",
    accent2: "#b27cff",
    badge: "Default",
    swatch: ["#08080b", "#ff7a45", "#b27cff", "#f5f5f7"],
  },
  {
    id: "light",
    name: "Light",
    tagline: "Bright, but not blinding.",
    description:
      "Off-white surface with the same orange accent. Auto-toggles when macOS reports Light appearance, if Settings → Theme → System Match is on.",
    surface: "#f6f6f7",
    panel: "linear-gradient(180deg, rgba(0,0,0,0.025), rgba(0,0,0,0.005))",
    border: "rgba(0,0,0,0.08)",
    text: "#0a0a0c",
    textDim: "#52525b",
    accent: "#ff6a2a",
    accent2: "#7a4cd6",
    badge: "Auto",
    swatch: ["#f6f6f7", "#ff6a2a", "#7a4cd6", "#0a0a0c"],
  },
  {
    id: "linear",
    name: "Linear",
    tagline: "The Linear-app palette, ported.",
    description:
      "Deep navy with a violet accent. The chrome borrows the same density and sidebar geometry as Linear's desktop app.",
    surface: "#0e0f1a",
    panel: "linear-gradient(180deg, rgba(150,140,255,0.06), rgba(150,140,255,0.015))",
    border: "rgba(150,140,255,0.16)",
    text: "#e8e8f2",
    textDim: "#9494a8",
    accent: "#5e6ad2",
    accent2: "#c2b8ff",
    badge: "Pro",
    swatch: ["#0e0f1a", "#5e6ad2", "#c2b8ff", "#e8e8f2"],
  },
  {
    id: "cron",
    name: "Cron",
    tagline: "The Cron-calendar palette, ported.",
    description:
      "Warm graphite with a single saturated lime accent. One high-contrast highlight per pane; Trove's status pills inherit the green directly.",
    surface: "#16161a",
    panel: "linear-gradient(180deg, rgba(160,255,140,0.05), rgba(160,255,140,0.012))",
    border: "rgba(255,255,255,0.06)",
    text: "#ededf0",
    textDim: "#9c9ca5",
    accent: "#9efd6a",
    accent2: "#f0f0f0",
    badge: "Pro",
    swatch: ["#16161a", "#9efd6a", "#f0f0f0", "#ededf0"],
  },
];

export default function ThemesPage() {
  return (
    <PageShell
      eyebrow="Appearance"
      title="Themes"
      lede={
        <>
          Four themes ship in 1.11.2: Dark, Light, Linear, Cron. Pick one in
          Settings &rarr; Theme and the entire app follows: sidebar, chrome,
          panes, even the menubar overlay. Custom palettes ship in 1.2.0.
        </>
      }
      wide
    >
      <JsonLd
        data={webPageLd(
          "Trove Themes",
          "Dark, Light, Linear, and Cron themes for Trove.",
          "https://gettrove.vercel.app/themes",
        )}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: "https://gettrove.vercel.app" },
          { name: "Themes", url: "https://gettrove.vercel.app/themes" },
        ])}
      />

      <div className="pane rounded-xl p-5 mb-10 flex items-start gap-3">
        <span className="inline-flex w-9 h-9 rounded-lg items-center justify-center bg-[rgba(255,122,69,0.12)] text-[var(--color-accent)] shrink-0">
          <Settings size={16} strokeWidth={1.75} />
        </span>
        <div>
          <div className="text-[14px] font-medium text-white mb-1">
            How to switch
          </div>
          <p className="text-[13.5px] leading-[1.7] text-[var(--color-fg-dim)]">
            Open Trove, hit <kbd className="md-inline">⌘,</kbd> for Settings,
            choose <span className="text-white">Theme</span> in the sidebar,
            and pick one of the four palettes. The switch is live: no relaunch,
            no flicker. The selection persists per-Mac in your local
            preferences plist.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {THEMES.map((t) => (
          <article
            key={t.id}
            className="rounded-2xl overflow-hidden border"
            style={{ borderColor: t.border, background: t.surface }}
          >
            {/* Mock window chrome */}
            <div
              className="flex items-center gap-1.5 px-4 py-2.5 border-b"
              style={{ borderColor: t.border }}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
              <span
                className="ml-3 text-[11px] font-medium tracking-tight"
                style={{ color: t.textDim }}
              >
                Trove: {t.name}
              </span>
              <span
                className="ml-auto text-[10px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full"
                style={{
                  color: t.accent,
                  border: `1px solid ${t.accent}33`,
                  background: `${t.accent}10`,
                }}
              >
                {t.badge}
              </span>
            </div>

            {/* Mock pane body */}
            <div className="grid grid-cols-[110px_1fr] min-h-[260px]">
              {/* Sidebar */}
              <div
                className="px-3 py-4 border-r"
                style={{ borderColor: t.border, background: t.panel }}
              >
                {["Stage", "History", "Snippets", "Record", "Hash", "Disk"].map(
                  (label, i) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 mb-1.5 px-2 py-1 rounded-md"
                      style={{
                        background: i === 0 ? `${t.accent}1f` : "transparent",
                        color: i === 0 ? t.text : t.textDim,
                      }}
                    >
                      <span
                        className="w-1 h-1 rounded-full"
                        style={{ background: i === 0 ? t.accent : t.textDim }}
                      />
                      <span className="text-[11px] font-medium tracking-tight">
                        {label}
                      </span>
                    </div>
                  ),
                )}
              </div>

              {/* Main */}
              <div className="px-4 py-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div
                    className="text-[13px] font-semibold tracking-tight"
                    style={{ color: t.text }}
                  >
                    Stage
                  </div>
                  <div
                    className="text-[10px] font-mono tabular-nums"
                    style={{ color: t.textDim }}
                  >
                    3 items
                  </div>
                </div>
                {[
                  { label: "Quarterly report.pdf", meta: "1.4 MB · pdf" },
                  { label: "Screen Recording.mov", meta: "12.8 MB · video" },
                  { label: "snippet.txt", meta: "382 B · text" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="rounded-lg px-3 py-2 border"
                    style={{
                      borderColor: t.border,
                      background: t.panel,
                    }}
                  >
                    <div
                      className="text-[11.5px] font-medium tracking-tight"
                      style={{ color: t.text }}
                    >
                      {row.label}
                    </div>
                    <div
                      className="text-[10px] mt-0.5"
                      style={{ color: t.textDim }}
                    >
                      {row.meta}
                    </div>
                  </div>
                ))}
                <div className="mt-auto flex items-center gap-2">
                  <span
                    className="text-[10.5px] px-2.5 py-1 rounded-full font-medium"
                    style={{
                      background: `linear-gradient(180deg, ${t.accent}, ${t.accent2})`,
                      color: t.surface,
                    }}
                  >
                    Stage all
                  </span>
                  <span
                    className="text-[10.5px] px-2.5 py-1 rounded-full"
                    style={{
                      color: t.textDim,
                      border: `1px solid ${t.border}`,
                    }}
                  >
                    Clear
                  </span>
                </div>
              </div>
            </div>

            {/* Theme metadata */}
            <div
              className="px-4 py-3 border-t"
              style={{ borderColor: t.border, background: "rgba(0,0,0,0.15)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[14px] font-semibold tracking-tight"
                  style={{ color: t.text }}
                >
                  {t.name}
                </span>
                <span className="text-[12px]" style={{ color: t.textDim }}>
                  · {t.tagline}
                </span>
              </div>
              <p
                className="text-[12px] leading-[1.55]"
                style={{ color: t.textDim }}
              >
                {t.description}
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                {t.swatch.map((hex) => (
                  <span
                    key={hex}
                    className="inline-block w-4 h-4 rounded-md border"
                    style={{
                      background: hex,
                      borderColor: t.border,
                    }}
                    title={hex}
                  />
                ))}
                <span
                  className="ml-2 text-[10px] font-mono tabular-nums"
                  style={{ color: t.textDim }}
                >
                  {t.swatch.length} tokens
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 pane rounded-xl p-6 flex items-start gap-3">
        <span className="inline-flex w-9 h-9 rounded-lg items-center justify-center bg-[rgba(178,124,255,0.12)] text-[var(--color-accent-2)] shrink-0">
          <Palette size={16} strokeWidth={1.75} />
        </span>
        <div>
          <div className="text-[14px] font-medium text-white mb-1">
            Coming in 1.2.0: custom palettes
          </div>
          <p className="text-[13.5px] leading-[1.7] text-[var(--color-fg-dim)]">
            Per-token customization (surface, accent, border, text) with a live
            preview pane. Export as a .trovetheme file, share via Discussions,
            import with a double-click.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
