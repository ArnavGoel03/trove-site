import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trove — Your Mac, finally tidy.",
  description:
    "30+ panes for clipboard, capture, system, files and storage — in a single 14 MB native macOS app. Local-only. No telemetry.",
  metadataBase: new URL("https://toolbox.app"),
  openGraph: {
    title: "Trove — Your Mac, finally tidy.",
    description:
      "30+ panes in one 14 MB native Mac app. Replaces a dozen menubar utilities.",
    type: "website",
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
      <body className="antialiased">
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
