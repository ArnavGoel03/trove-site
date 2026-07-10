import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import AppComingSoon from "@/components/AppComingSoon";
import { APPS, STUDIO } from "@/lib/brand";

const APP = APPS.tend;

export const metadata: Metadata = {
  title: `${APP.name}: ${APP.tagline}`,
  description: APP.blurb,
  alternates: { canonical: `${STUDIO.domain}/tend` },
};

export default function Page() {
  return (
    <PageShell
      eyebrow="Coming soon &middot; part of the suite"
      title={APP.name}
      lede={APP.tagline}
    >
      <AppComingSoon appKey="tend" />
    </PageShell>
  );
}
