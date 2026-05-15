import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";

// Below-the-fold sections are loaded as separate chunks so the
// initial JS to interactive on Hero is as small as possible.
// They're still server-rendered (no `ssr: false`) so the HTML
// shows up immediately for SEO and no layout jump.
const FeatureReel = dynamic(() => import("@/components/FeatureReel"));
const Compare = dynamic(() => import("@/components/Compare"));
const Privacy = dynamic(() => import("@/components/Privacy"));
const Requirements = dynamic(() => import("@/components/Requirements"));
const Footer = dynamic(() => import("@/components/Footer"));
const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"));

export default function Page() {
  return (
    <main className="relative">
      <SmoothScroll />
      <Nav />
      <Hero />
      <FeatureReel />
      <Compare />
      <Privacy />
      <Requirements />
      <Footer />
    </main>
  );
}
