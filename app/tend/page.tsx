import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import AppPage from "@/components/AppPage";
import JsonLd, {
  softwareApplicationLdFor,
  webPageLd,
  breadcrumbLd,
} from "@/components/JsonLd";
import { APPS, STUDIO } from "@/lib/brand";
import { SUITE_DETAIL } from "@/lib/suite";

const APP = APPS.tend;
const DETAIL = SUITE_DETAIL.tend;
const URL = `${STUDIO.domain}${APP.href}`;

export const metadata: Metadata = {
  title: `${APP.name}: ${APP.tagline}`,
  description: APP.blurb,
  alternates: { canonical: URL },
  openGraph: {
    title: `${APP.name}: ${APP.tagline}`,
    description: APP.blurb,
    url: URL,
    type: "website",
    images: [
      {
        url: `${APP.href}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${APP.name}: ${APP.tagline}`,
      },
    ],
  },
};

export default function Page() {
  return (
    <PageShell
      eyebrow={DETAIL.category}
      title={APP.name}
      lede={DETAIL.pitch}
    >
      <JsonLd data={softwareApplicationLdFor("tend")} />
      <JsonLd data={webPageLd(`${APP.name}: ${APP.tagline}`, APP.blurb, URL)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", url: STUDIO.domain },
          { name: APP.name, url: URL },
        ])}
      />
      <AppPage appKey="tend" />
    </PageShell>
  );
}
