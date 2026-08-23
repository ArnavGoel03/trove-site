import { APPS, PLATFORM, minMacOSLabel, type AppBrand } from "@/lib/brand";

/**
 * What each suite app actually does, and what is honestly true about it today.
 *
 * `lib/brand.ts` owns the name, tagline, one-line blurb, version and status.
 * This file is the layer above that: the sales argument for a single app, the
 * capability list, and the readiness caveat. It imports from brand rather than
 * restating it, so a rename or a version bump still has exactly one home.
 *
 * The reason this exists at all: /relay and /tend were a shared "coming soon"
 * stub that printed the tagline twice and said nothing a buyer could act on.
 * Both apps are real, both are in this repo (`../relay`, `../tend`), and both
 * have shipped builds. A page that sells a suite cannot leave two thirds of it
 * as a placeholder.
 *
 * Every claim below is checked against those sources. Nothing here describes a
 * feature that does not exist yet: `horizon` is where the not-yet lives, and it
 * is rendered as a caveat, not as a feature.
 */

export interface Capability {
  /** Short label. Sentence case, no trailing period. */
  readonly title: string;
  /** One or two sentences. What it does, and why it is different. */
  readonly detail: string;
}

export interface AppDetail {
  readonly brand: AppBrand;
  /** What kind of app this is, in two or three words. The page eyebrow. */
  readonly category: string;
  /** The headline argument, one sentence. Shown as the page lede. */
  readonly pitch: string;
  /** Two or three paragraphs of body copy under the lede. */
  readonly body: readonly string[];
  /** What it does. Four to six entries, each one a real shipped capability. */
  readonly capabilities: readonly Capability[];
  /** Named competitor and the reason to switch. Never vague. */
  readonly instead: { readonly of: string; readonly why: string };
  /** What is not done yet. Rendered as a caveat so nobody is misled. */
  readonly horizon: string;
  /** Platform sentence. Defaults to the same floor as Trove. */
  readonly requirements: string;
}

/** Requirements sentence for one app, from that app's own floor. */
function macOnly(app: AppBrand): string {
  return `${minMacOSLabel(app.minMacOS)}, ${PLATFORM.archLong}.`;
}

export const SUITE_DETAIL: Record<"relay" | "tend", AppDetail> = {
  relay: {
    brand: APPS.relay,
    category: "API client",
    pitch:
      "Every request you send, every key you hold, stays on your Mac. No workspace, no sync, no seat count.",
    body: [
      "Relay is the API client for people who noticed that the industry standard now wants an account before it will let you send a GET request, and stores the bearer token you paste into it on somebody else's server.",
      "It is the same engine as Trove's API tester, not a reimplementation: the two apps share their source files on disk, so a fix in one is a fix in both and the behaviour cannot drift. Relay is that engine given its own window, its own collections, and room to grow.",
      "Secrets live in the macOS Keychain, scoped to this device. Collections are files on your disk that you can put in your own git repository. There is nothing to log into, so there is nothing to leak.",
    ],
    capabilities: [
      {
        title: "Requests and environments",
        detail:
          "Full request builder with per-environment variables, so the same collection runs against local, staging and production without editing a single URL.",
      },
      {
        title: "Auth that does not phone home",
        detail:
          "Bearer, basic, and OAuth 2.0 with PKCE. The token exchange happens on your machine and the result goes into your Keychain, never into a synced workspace.",
      },
      {
        title: "Pre and post-request scripting",
        detail:
          "Scripts run in a sandboxed context for signing requests, extracting a token from one response and threading it into the next, and asserting on what came back.",
      },
      {
        title: "Postman import",
        detail:
          "Bring an existing collection across as a file. The importer refuses paths outside the file you picked, so an untrusted collection cannot read the rest of your disk.",
      },
      {
        title: "Keychain-backed secrets",
        detail:
          "API keys are stored device-only and never written into the collection file, so a collection is safe to commit and safe to share.",
      },
    ],
    instead: {
      of: "Postman",
      why: "Postman needs an account, syncs your collections to its cloud by default, and prices per seat. Relay needs neither an account nor a network connection to start, and it is included in the one licence that also unlocks Trove and Tend.",
    },
    horizon:
      "Relay is in private testing and is not downloadable yet. The engine ships today inside Trove's API tester, so the licence you buy now already includes it.",
    requirements: macOnly(APPS.relay),
  },

  tend: {
    brand: APPS.tend,
    category: "Tasks and calendar",
    pitch:
      "A task manager built around the two things every other one gets wrong: capturing without friction, and actually looking at the list again.",
    body: [
      "Most task apps are storage. You put things in, and the pile grows until you stop opening the app. Tend is built around the review instead: a guided weekly pass that takes your inbox card by card and makes you decide, once, where each thing belongs.",
      "Capture is a single line of plain text. Type “call dentist tomorrow 3pm !today” and Tend parses the date, the time and the bucket out of the sentence, from a menu-bar window that opens over whatever you are doing.",
      "It is local-first and free to run: SwiftData on your device, syncing through your own iCloud account if you want it, and through nothing at all if you do not. There is no server, so there is no subscription needed to keep your own tasks reachable.",
    ],
    capabilities: [
      {
        title: "Sunday Reset",
        detail:
          "A guided weekly review that sorts the inbox one card at a time and sweeps what you missed. The habit other apps expect you to build yourself is the app's main screen here.",
      },
      {
        title: "Natural-language capture",
        detail:
          "One line parses into a date, a time and a bucket. No date picker, no dropdown, no second screen between the thought and the list.",
      },
      {
        title: "Four horizons, not infinite lists",
        detail:
          "Inbox, then Today, Soon or Someday, then the Logbook. Everything captured lands in one place and leaves it during the review, so nothing is filed at the moment you are least able to decide.",
      },
      {
        title: "Projects, areas, tags and subtasks",
        detail:
          "The structure you would expect from a mature task app, including repeating tasks with real recurrence rules and a guard against a repeat spawning twice.",
      },
      {
        title: "Mac and iPhone, one codebase",
        detail:
          "Native SwiftUI on both, with a menu-bar quick-entry window on the Mac and Siri capture through App Intents.",
      },
    ],
    instead: {
      of: "Things",
      why: "Things is a fine list, sold twice: once for the Mac and again for the iPhone, with the weekly review left as an exercise for the reader. Tend puts the review at the centre, syncs through your own iCloud rather than a vendor's, and comes with the same licence as the rest of the suite.",
    },
    horizon:
      "Tend runs on Mac and in the iOS simulator today. The widget and the watch app are written but need an Apple Developer Team for App Group signing, which is the same thing gating Trove's notarization.",
    requirements: `${macOnly(APPS.tend)} iPhone version in testing.`,
  },
};
