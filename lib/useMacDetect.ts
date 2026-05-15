"use client";

import { useEffect, useState } from "react";

export type Platform = "mac" | "windows" | "other" | "unknown";

interface UserAgentData {
  platform?: string;
}

/// Detects the visitor's desktop platform. iPadOS reports as Macintosh — we
/// exclude touch-Macs from the "mac" branch so iPad users don't get the .zip.
/// Returns:
///   "mac"     → ship Trove for Mac (.zip)
///   "windows" → ship Trove for Windows (.zip with .exe inside)
///   "other"   → Linux, ChromeOS, mobile — copy-link fallback
///   "unknown" → SSR, before the first effect tick
export function useMacDetect(): Platform {
  const [platform, setPlatform] = useState<Platform>("unknown");

  useEffect(() => {
    try {
      const nav = navigator as Navigator & { userAgentData?: UserAgentData };
      const uaPlatform = nav.userAgentData?.platform;
      if (uaPlatform) {
        if (uaPlatform === "macOS") return setPlatform("mac");
        if (uaPlatform === "Windows") return setPlatform("windows");
        return setPlatform("other");
      }
      const ua = navigator.userAgent || "";
      const isMac =
        /Macintosh|Mac OS X/i.test(ua) &&
        !/iPad|iPhone|iPod/.test(ua) &&
        !("ontouchend" in document && navigator.maxTouchPoints > 1);
      if (isMac) return setPlatform("mac");
      const isWindows = /Windows NT/i.test(ua);
      if (isWindows) return setPlatform("windows");
      setPlatform("other");
    } catch {
      setPlatform("other");
    }
  }, []);

  return platform;
}
