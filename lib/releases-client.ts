import type { ResolvedTags } from "./releases.ts";

// Share the in-flight request and successful result for this page lifetime.
// Rejected requests are removed so later mounts can retry after an outage.
export function createLatestTagsLoader(request: typeof fetch) {
  let pending: Promise<ResolvedTags> | undefined;
  return function load(): Promise<ResolvedTags> {
    if (!pending) {
      pending = Promise.resolve().then(() => request("/api/releases"))
        .then(async (response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const value: unknown = await response.json();
          if (!value || typeof value !== "object" ||
              !("mac" in value) || typeof value.mac !== "string" ||
              !("win" in value) || typeof value.win !== "string" ||
              !("macBeta" in value) ||
              (value.macBeta !== null && typeof value.macBeta !== "string")) {
            throw new Error("Invalid release response");
          }
          return value as ResolvedTags;
        }).catch((error: unknown) => {
          pending = undefined;
          throw error;
        });
    }
    return pending;
  };
}

export const fetchLatestTags = createLatestTagsLoader((...args) => fetch(...args));
