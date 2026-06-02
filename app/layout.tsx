import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trove: your Mac, finally tidy.",
  description:
    "33 panes for clipboard, capture, system, files and storage, in a single ~14 MB native macOS app. Scriptable from Shortcuts. Local-only. No telemetry.",
  metadataBase: new URL("https://gettrove.vercel.app"),
  alternates: {
    canonical: "https://gettrove.vercel.app",
  },
  applicationName: "Trove",
  openGraph: {
    title: "Trove: your Mac, finally tidy.",
    description:
      "33 panes in one ~14 MB native Mac app. Replaces a dozen menubar utilities.",
    type: "website",
    url: "https://gettrove.vercel.app",
    siteName: "Trove",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Trove: your Mac, finally tidy.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trove: your Mac, finally tidy.",
    description:
      "33 panes in one ~14 MB native Mac app. Replaces a dozen menubar utilities.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  themeColor: "#08080b",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to the only external origin we hit on any page so
            the latest-release fetch in Footer / DownloadButton lands
            without TCP+TLS overhead. */}
        <link
          rel="preconnect"
          href="https://api.github.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://api.github.com" />
        {/* Speculation Rules: prerender same-origin links on hover so
            the homepage → /features jump (and every legal page link)
            paints instantly. Chrome ignores this header silently on
            Safari / Firefox, pure progressive enhancement. */}
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              prerender: [
                {
                  source: "document",
                  where: { href_matches: "/*" },
                  eagerness: "moderate",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div className="grain" aria-hidden="true" />
        {children}
        <ScrollToTop />
        <Toaster
          position="bottom-right"
          theme="dark"
          richColors
          closeButton
          duration={4000}
          toastOptions={{
            classNames: {
              toast:
                "!bg-[#171922] !border-white/[0.08] !text-white !shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)]",
            },
          }}
        />
      </body>
    </html>
  );
}
