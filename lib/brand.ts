// Single source of truth for ALL product naming across the site.
//
// Change a name here and it updates everywhere that reads from these exports
// (nav, hero, footer, page metadata, structured data). Built for the studio /
// suite direction so renaming any app, or the studio itself, is a one-file
// edit instead of a 66-file find-and-replace.
//
// NOTE: the studio brand is scaffolded but NOT yet surfaced in the live site
// chrome, the visible site is still Trove-branded until a studio name is
// chosen. Flip `STUDIO.live` to true (and wire it into Nav) when ready.

export type AppStatus = "live" | "soon";

export interface AppBrand {
  key: string;
  name: string;
  /** Short product tagline (hero / cards). */
  tagline: string;
  /** One-sentence description (suite listing, meta). */
  blurb: string;
  status: AppStatus;
  /** Product page path. */
  href: string;
}

/** The parent studio. Name is a WORKING PLACEHOLDER, change it here only. */
export const STUDIO = {
  name: "Quiver",
  tagline: "Private, native Mac apps. One subscription.",
  /** When true, the site presents as a studio/suite; until then, Trove-only. */
  live: false,
  domain: "https://gettrove.vercel.app",
} as const;

/** Every app in the suite. Rename any app by editing its `name` here. */
export const APPS: Record<"trove" | "relay" | "tend", AppBrand> = {
  trove: {
    key: "trove",
    name: "Trove",
    tagline: "One app instead of a dozen.",
    blurb:
      "Clipboard, window manager, system monitor, OCR, PDF kit, disk cleaner, and 30+ more, in one private, native Mac app.",
    status: "live",
    href: "/",
  },
  relay: {
    key: "relay",
    name: "Relay", // API client working name
    tagline: "A private, local API client.",
    blurb:
      "Requests, environments, auth, and scripting. Your keys stay in your Keychain, no account, no cloud.",
    status: "soon",
    href: "/relay",
  },
  tend: {
    key: "tend",
    name: "Tend",
    tagline: "Tasks and calendar that never leave your Mac.",
    blurb: "A calm, local-first task and calendar app.",
    status: "soon",
    href: "/tend",
  },
};

/** The subscription that unlocks the whole suite. */
export const SUITE = {
  name: `${STUDIO.name} Suite`,
  pitch: "One subscription unlocks every app.",
  trial: "14-day free trial",
} as const;

/** The flagship app this site currently leads with. */
export const TROVE = APPS.trove;

/** SEO title used in <title> and Open Graph. */
export const SEO_TITLE = `${TROVE.name}: ${TROVE.tagline}`;
export const SEO_DESCRIPTION = TROVE.blurb;

/** Current product facts (route stale "40+ tools / $10" strings through here). */
export const PRODUCT = {
  toolCount: "40+",
  trial: SUITE.trial,           // "14-day free trial"
  pricing: "Free trial, then one simple subscription.",
} as const;
