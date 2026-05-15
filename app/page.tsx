import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import FeatureReel from "@/components/FeatureReel";
import Compare from "@/components/Compare";
import Privacy from "@/components/Privacy";
import Requirements from "@/components/Requirements";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

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
