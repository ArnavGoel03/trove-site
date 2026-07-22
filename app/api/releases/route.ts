// Server-side release resolution.
//
// The GitHub call happens here, once, cached, rather than in every visitor's
// browser. Three reasons: unauthenticated GitHub allows 60 requests/hour per
// IP and a popular page would exhaust that; the response is identical for
// everyone so it belongs in a shared cache; and a failure here degrades to the
// build-time floor instead of showing a broken button.

import { NextResponse } from "next/server";
import { fetchReleases, resolveTags, FALLBACK_TAGS } from "@/lib/releases";

export const revalidate = 900;

export async function GET() {
  try {
    const tags = resolveTags(await fetchReleases());
    return NextResponse.json(tags, {
      headers: {
        "Cache-Control":
          "public, s-maxage=900, stale-while-revalidate=86400",
      },
    });
  } catch {
    // Never surface an error to the button. The floor is a real, downloadable
    // tag generated from macos/VERSION, so falling back is safe.
    return NextResponse.json(FALLBACK_TAGS, {
      headers: { "Cache-Control": "public, s-maxage=60" },
    });
  }
}
