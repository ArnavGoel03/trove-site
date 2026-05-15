import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
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
