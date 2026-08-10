import dynamic from "next/dynamic";

import Nav from "@/components/Nav";
import Track from "@/components/stage/Track";
import JsonLd, {
  softwareApplicationLd,
  webPageLd,
  organizationLd,
  suiteItemListLd,
} from "@/components/JsonLd";
import { SEO_DESCRIPTION, SEO_TITLE, STUDIO } from "@/lib/brand";

/**
 * The homepage is one argument told in nine beats, then the evidence for it.
 *
 * `Track` is the argument: a sticky frame, a scroll-driven scene behind it, and
 * every word of the copy in ordinary DOM so it is selectable, indexable and
 * readable by a screen reader whether or not the canvas ever loads. `Ledger`
 * is the evidence, server-rendered and static. `Close` is the ask.
 *
 * Everything below the track is `dynamic()` without `ssr: false`: still
 * server-rendered into the first HTML, just split into its own chunk so the
 * JavaScript that makes the stage move is not queued behind a footer.
 */
const Ledger = dynamic(() => import("@/components/Ledger"));
const Suite = dynamic(() => import("@/components/Suite"));
const Close = dynamic(() => import("@/components/Close"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function Page() {
  return (
    <main id="main-content" className="relative">
      {/* Structured data first, so a fetcher that reads only the head of the
          document still gets the product, the price and the studio. */}
      <JsonLd data={softwareApplicationLd()} />
      <JsonLd data={webPageLd(SEO_TITLE, SEO_DESCRIPTION, STUDIO.domain)} />
      {STUDIO.live ? (
        <>
          <JsonLd data={organizationLd()} />
          <JsonLd data={suiteItemListLd()} />
        </>
      ) : null}

      <Nav />
      <Track />
      <Ledger />
      <Suite />
      <Close />
      <Footer />
    </main>
  );
}
