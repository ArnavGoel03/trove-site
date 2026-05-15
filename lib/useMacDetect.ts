"use client";

import { useEffect, useState } from "react";

type Platform = "mac" | "other" | "unknown";

interface UserAgentData {
  platform?: string;
}

export function useMacDetect(): Platform {
  const [platform, setPlatform] = useState<Platform>("unknown");

  useEffect(() => {
    try {
      const nav = navigator as Navigator & { userAgentData?: UserAgentData };
      const uaPlatform = nav.userAgentData?.platform;
      if (uaPlatform) {
        setPlatform(uaPlatform === "macOS" ? "mac" : "other");
        return;
      }
      const ua = navigator.userAgent || "";
      // iPadOS reports as Macintosh — exclude touch macs from "mac desktop" branch
      const isMac =
        /Macintosh|Mac OS X/i.test(ua) &&
        !/iPad|iPhone|iPod/.test(ua) &&
        !("ontouchend" in document && navigator.maxTouchPoints > 1);
      setPlatform(isMac ? "mac" : "other");
    } catch {
      setPlatform("other");
    }
  }, []);

  return platform;
}
