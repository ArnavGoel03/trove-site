import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FeaturesHero from "@/components/features/FeaturesHero";
import PaneGrid from "@/components/features/PaneGrid";
import { STUDIO } from "@/lib/brand";

const CapabilityList = dynamic(
  () => import("@/components/features/CapabilityList"),
);
const FeaturesCta = dynamic(() => import("@/components/features/FeaturesCta"));

export const metadata: Metadata = {
  title: "Features: every pane in Trove 1.11.2",
  description:
    "All 40+ tools in Trove 1.11.2: Clipboard, Compute, Capture, Files, System, Storage. Plus Shortcuts integration, URL scheme verbs, SHA256SUMS verification, saved Text Tools recipes, Homebrew cask, and the sub-500ms cold launch.",
  alternates: {
    canonical: `${STUDIO.domain}/features`,
  },
  openGraph: {
    title: "Features: every pane in Trove 1.11.2",
    description:
      "All 40+ tools plus Shortcuts, URL scheme, SHA256SUMS verify, saved recipes, Homebrew cask.",
    url: `${STUDIO.domain}/features`,
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
