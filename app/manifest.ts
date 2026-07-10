import type { MetadataRoute } from "next";

// Web app manifest. Lets the site be installed as a PWA-style shortcut
// and gives Android/Chrome a name, theme color and icon. Icons resolve
// to the generated /icon and /apple-icon routes.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Trove",
    short_name: "Trove",
    description:
      "40+ private tools for clipboard, capture, system, files and storage, in one native macOS app.",
    start_url: "/",
    display: "standalone",
    background_color: "#08080b",
    theme_color: "#08080b",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
