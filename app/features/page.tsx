import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FeaturesHero from "@/components/features/FeaturesHero";
import PaneGrid from "@/components/features/PaneGrid";

const CapabilityList = dynamic(
  () => import("@/components/features/CapabilityList"),
);
const FeaturesCta = dynamic(() => import("@/components/features/FeaturesCta"));

export const metadata: Metadata = {
  title: "Features: every pane in Trove 1.1.0",
  description:
    "All 33 panes in Trove 1.1.0: Clipboard, Compute, Capture, Files, System, Storage. Plus Shortcuts integration, URL scheme verbs, SHA256SUMS verification, saved Text Tools recipes, Homebrew cask, and the sub-500ms cold launch.",
  alternates: {
    canonical: "https://gettrove.vercel.app/features",
  },
  openGraph: {
    title: "Features: every pane in Trove 1.1.0",
    description:
      "All 33 panes plus Shortcuts, URL scheme, SHA256SUMS verify, saved recipes, Homebrew cask.",
    url: "https://gettrove.vercel.app/features",
    type: "article",
  },
};

export default function FeaturesPage() {
  return (
    <main id="main-content" className="relative">
      <Nav />
      <FeaturesHero />
      <PaneGrid />
      <CapabilityList />
      <FeaturesCta />
      <Footer />
    </main>
  );
}
