/**
 * Renders a `<script type="application/ld+json">` block server-side so
 * Googlebot / Bingbot get the structured data on first byte (no JS run
 * needed). Stringify is intentional — JSON.stringify escapes < > & for
 * us; the resulting payload is plain ASCII JSON inside the script tag.
 *
 * Pass any valid schema.org graph. The common builders are exported
 * alongside so each route can compose its own without duplicating
 * the trove-wide constants.
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const ORG = {
  "@type": "Organization",
  name: "Trove",
  url: "https://gettrove.vercel.app",
  logo: "https://gettrove.vercel.app/opengraph-image",
} as const;

export function softwareApplicationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Trove",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "macOS 13+",
    url: "https://gettrove.vercel.app",
    downloadUrl: "https://github.com/ArnavGoel03/trove/releases/latest",
    softwareVersion: "1.1.0",
    offers: {
      "@type": "Offer",
      price: "10",
      priceCurrency: "USD",
      category: "Annual subscription",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "48",
    },
    publisher: ORG,
  };
}

export function webPageLd(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: "Trove",
      url: "https://gettrove.vercel.app",
    },
    publisher: ORG,
  };
}

export function howToLd(opts: {
  name: string;
  description: string;
  url: string;
  steps: { name: string; text: string }[];
  totalTime?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    totalTime: opts.totalTime ?? "PT2M",
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
    tool: { "@type": "HowToTool", name: "Trove" },
  };
}

export function articleLd(opts: {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    datePublished: opts.datePublished ?? "2026-05-31",
    dateModified: opts.datePublished ?? "2026-05-31",
    author: ORG,
    publisher: ORG,
  };
}

export function breadcrumbLd(crumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}
