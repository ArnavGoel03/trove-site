import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import JsonLd, { softwareApplicationLd, webPageLd } from "@/components/JsonLd";

// Below-the-fold sections are loaded as separate chunks so the
// initial JS to interactive on Hero is as small as possible.
// They're still server-rendered (no `ssr: false`) so the HTML
// shows up immediately for SEO and no layout jump.
const FeatureReel = dynamic(() => import("@/components/FeatureReel"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const Compare = dynamic(() => import("@/components/Compare"));
const Privacy = dynamic(() => import("@/components/Privacy"));
const Requirements = dynamic(() => import("@/components/Requirements"));
const Footer = dynamic(() => import("@/components/Footer"));
const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"));

export default function Page() {
  return (
    <main id="main-content" className="relative">
      {/* Structured data: SoftwareApplication + WebPage. Server-rendered
          at the top of <main> so search-engine fetchers see it on first
          byte without waiting for hydration. */}
      <JsonLd data={softwareApplicationLd()} />
      <JsonLd
        data={webPageLd(
          "Trove: your Mac, finally tidy.",
          "53 panes in one ~14 MB native Mac app. Replaces a dozen menubar utilities.",
          "https://gettrove.vercel.app",
        )}
      />
      <SmoothScroll />
      <Nav />
      <Hero />
      <FeatureReel />
      <Testimonials />
      <Compare />
      <Privacy />
      <Requirements />
      <Footer />
    </main>
  );
}
