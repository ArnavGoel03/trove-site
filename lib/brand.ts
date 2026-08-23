// Single source of truth for ALL product naming across the site.
//
// Change a name here and it updates everywhere that reads from these exports
// (nav, hero, footer, page metadata, structured data). Built for the studio /
// suite direction so renaming any app, or the studio itself, is a one-file
// edit instead of a 66-file find-and-replace.
//
// NOTE: the studio brand is surfaced in the live site chrome (STUDIO.live is
// true): the nav wordmark, footer copyright, and Organization schema all
// present as the studio. The Trove homepage itself stays flagship-focused.

import {
  PRICE_ADJECTIVE,
  PRICE_LABEL,
  PRICE_SENTENCE,
  TRIAL_LABEL,
} from "./pricing.ts";
import { VERSIONS } from "./versions.generated.ts";
import { APP_CONTRACT } from "./suite.generated.ts";

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
  /** Current shipping version, e.g. "1.12.7". */
  version: string;
  /** Release date of `version`, ISO YYYY-MM-DD. */
  releaseDate: string;
  /**
   * Oldest macOS this app's shipped binary will launch on, as a major version.
   *
   * Per app, not per studio, because they genuinely differ and the site said
   * otherwise. Tend is built on SwiftData and ships LSMinimumSystemVersion 14,
   * while /tend advertised "macOS 13 Ventura or later" like everything else.
   * On the day Tend became downloadable that turned into a real download
   * button handed to people whose Mac cannot run it. Mirrors
   * `apps.*.minMacOS` in macos/suite.config.json.
   */
  minMacOS: string;
}

/** The parent studio. Name is a WORKING PLACEHOLDER, change it here only. */
export const STUDIO = {
  name: "Quiver",
  tagline: "Private, native Mac apps. One subscription.",
  /** When true, the site presents as a studio/suite; until then, Trove-only. */
  live: true,
  domain: "https://quiver.arnavgoel.dev",
  /** The maker, links the studio to the personal portfolio (bidirectional). */
  maker: "Arnav Goel",
  makerUrl: "https://arnavgoel.dev",
} as const;

/**
 * The bare host, for places that DISPLAY the domain rather than link it.
 * Derived so it can never drift from `STUDIO.domain`.
 */
export const STUDIO_HOST = STUDIO.domain.replace(/^https?:\/\//, "");


/** Every app in the suite. Rename any app by editing its `name` here. */
export const APPS: Record<"trove" | "relay" | "tend", AppBrand> = {
  trove: {
    key: "trove",
    name: "Trove",
    tagline: "One app instead of a dozen.",
    // No count in this sentence. `lib/panes.ts` imports this file, so this file
    // can never import TOOL_COUNT back, and a number typed here by hand is a
    // number that goes stale the next time a pane ships. The "30+" that used to
    // sit here was already understating the catalog by seventeen.
    blurb:
      "Clipboard, window manager, system monitor, OCR, PDF kit, disk cleaner, and dozens more, in one private, native Mac app.",
    // status and minMacOS are generated from macos/suite.config.json, the same
    // file the binaries read. Both were hand-typed here and in that file, and
    // the floor drifted: this said 13 while Tend's binary refused to launch
    // below 15, on the morning it became downloadable.
    status: APP_CONTRACT.trove.status,
    href: "/",
    version: VERSIONS.trove.version,
    releaseDate: VERSIONS.trove.releaseDate,
    minMacOS: APP_CONTRACT.trove.minMacOS,
  },
  relay: {
    key: "relay",
    name: "Relay", // API client working name
    tagline: "A private, local API client.",
    blurb:
      "Requests, environments, auth, and scripting. Your keys stay in your Keychain, no account, no cloud.",
    status: APP_CONTRACT.relay.status,
    href: "/relay",
    version: VERSIONS.relay.version,
    releaseDate: VERSIONS.relay.releaseDate,
    minMacOS: APP_CONTRACT.relay.minMacOS,
  },
  tend: {
    key: "tend",
    name: "Tend",
    tagline: "Tasks and calendar that never leave your Mac.",
    blurb: "A calm, local-first task and calendar app.",
    status: APP_CONTRACT.tend.status,
    href: "/tend",
    version: VERSIONS.tend.version,
    releaseDate: VERSIONS.tend.releaseDate,
    minMacOS: APP_CONTRACT.tend.minMacOS,
  },
};

/** The subscription that unlocks the whole suite. */
export const SUITE = {
  name: `${STUDIO.name} Suite`,
  pitch: "One subscription unlocks every app.",
  trial: TRIAL_LABEL,
} as const;

/** The flagship app this site currently leads with. */
export const TROVE = APPS.trove;

/**
 * Where a human can actually reach a human.
 *
 * Twelve links across /contact, /privacy, /terms, /refund and /acceptable-use
 * pointed at `support@trove.app` and `security@trove.app`. Nobody here owns
 * `trove.app`: it is not this site's domain and never was, so every support
 * request, every privacy request, and every security disclosure the site
 * invited was addressed to somebody else's domain. That is the same failure as
 * the `gettrove.vercel.app` links, which is why it now has one home and a rule
 * in scripts/check-hardcoded.mjs.
 *
 * One address, because this is one person. The subject tags are what turn a
 * single inbox back into separate queues; a second real mailbox would just be
 * a second thing to forget to read.
 */
const INBOX = "yashgoel0304@gmail.com";

/** Builds a mailto with a tagged subject, so one inbox still sorts. */
function inboxFor(tag: string): string {
  return `mailto:${INBOX}?subject=${encodeURIComponent(`[${tag}] ${TROVE.name}`)}`;
}

export const CONTACT = {
  /** The address itself, for the places that display it as text. */
  address: INBOX,
  /** Licences, billing, and how-do-I questions. */
  support: inboxFor("Support"),
  /** Responsible disclosure. Same inbox, tagged so it is not missed. */
  security: inboxFor("Security"),
  /** Privacy and data requests, which several jurisdictions require a route for. */
  privacy: inboxFor("Privacy"),
  /** Accessibility reports. */
  accessibility: inboxFor("A11Y"),
  /** Press and review copies. */
  press: inboxFor("Press"),
} as const;

/** SEO title used in <title> and Open Graph. */
export const SEO_TITLE = `${TROVE.name}: ${TROVE.tagline}`;
export const SEO_DESCRIPTION = TROVE.blurb;

/**
 * Page title and social-card alt text.
 *
 * Eighteen routes wrote the brand name straight into a string literal and did
 * it three different ways: colon, ASCII hyphen, and a long dash. The tab bar
 * showed a different separator depending on which page you were on, and
 * renaming the app would have missed all eighteen. One helper, one separator,
 * and the name comes from APPS.
 */
export function pageTitle(page: string): string {
  return `${page}: ${TROVE.name}`;
}

/** Alt text for a route's Open Graph image. Same reasoning as `pageTitle`. */
export function ogAlt(page: string): string {
  return `${TROVE.name}: ${page}`;
}

/**
 * Current product facts. The price fields are re-exports, not definitions:
 * lib/pricing.ts owns every currency value and check-hardcoded.mjs fails the
 * build on a dollar figure written anywhere else. They stay reachable under
 * PRODUCT so the thirty-odd existing call sites keep working untouched.
 */
export const PRODUCT = {
  trial: TRIAL_LABEL,
  pricing: PRICE_SENTENCE,
  /** Inline adjective, e.g. "Trove is a <priceAdjective> screen recorder." */
  priceAdjective: PRICE_ADJECTIVE,
  /** Short noun-phrase form for stat displays and callouts. */
  priceLabel: PRICE_LABEL,
} as const;

/**
 * What the downloadable binary actually runs on. Single source of truth: seven
 * pages claimed "Apple Silicon and Intel" while CI shipped an arm64-only slice
 * (`universal: "0"` in the release workflow), so every Intel visitor was being
 * sold a build that cannot launch on their machine.
 *
 * To ship Intel again: set `universal: "1"` in the macOS repo's
 * `.github/workflows/release.yml`, publish a release, then change the three
 * strings below. Nothing else needs touching.
 */
/**
 * macOS marketing names, so a floor renders as a sentence without anyone
 * typing "Sonoma" next to the wrong number.
 */
const MACOS_NAME: Record<string, string> = {
  "13": "Ventura",
  "14": "Sonoma",
  "15": "Sequoia",
};

/** "macOS 14 Sonoma or later", from a bare major version. */
export function minMacOSLabel(major: string): string {
  const name = MACOS_NAME[major];
  return name ? `macOS ${major} ${name} or later` : `macOS ${major} or later`;
}

export const PLATFORM = {
  minMacOS: "macOS 13 Ventura or later",
  /** Compact form for badges and stat rows. */
  arch: "Apple Silicon",
  /** Sentence form, for prose and structured data. */
  archLong: "Apple Silicon (M1 or later)",
  /** Requirements-table value, where the exclusion has to be explicit. */
  archDetail: "Apple Silicon only (no Intel build)",
} as const;

/**
 * How the binary is signed, and therefore what a first launch looks like.
 *
 * Six pages described this three different ways and all three were wrong: the
 * shipped asset is NOT ad-hoc signed. It carries an Apple Development
 * certificate, a full Apple Root CA chain, and the hardened runtime. What it
 * lacks is a Developer ID Application certificate and notarization, which is
 * a different cert from the same team and needs a paid Developer Program
 * membership.
 *
 * That distinction is the entire user-visible difference. Gatekeeper rejects
 * an Apple Development signature for distribution (`spctl --assess` returns
 * `rejected`), so the first launch shows "cannot be verified" with only "Move
 * to Bin" offered, and the user has to right-click Open to get past it. Saying
 * "unsigned" undersells it; saying "signed" without the caveat leaves people
 * stuck at a dialog that only offers to delete the app.
 *
 * When Developer ID + notarization land, change these four strings and the
 * whole site follows.
 */
/**
 * Both sentences below name an app, and three apps now ship under the same
 * unnotarized signature, so the app name is a parameter rather than a literal.
 * The words are unchanged; `SIGNING.firstLaunch` and `SIGNING.why` still read
 * exactly as they did, because they are these functions applied to Trove. A
 * second hand-written copy of either sentence for Relay or Tend is what this
 * avoids: the day notarization lands, one edit still updates every app.
 */
export function firstLaunchFor(appName: string): string {
  return `Right-click ${appName}.app and choose Open, then Open again. Double-clicking will not work the first time.`;
}

export function signingWhyFor(appName: string): string {
  return `${appName} is code-signed with a hardened runtime but not yet notarized by Apple, which needs a paid Developer Program membership. After the first right-click Open it launches normally forever.`;
}

export const SIGNING = {
  /** Compact form for badges and stat rows. */
  short: "Signed, not yet notarized",
  /** What a visitor has to actually do on first launch. */
  firstLaunch: firstLaunchFor(APPS.trove.name),
  /** One-sentence explanation of why, for prose. */
  why: signingWhyFor(APPS.trove.name),
  /** Requirements-table / press-kit value. */
  detail: "Direct download (.zip) · signed, not yet notarized",
} as const;
