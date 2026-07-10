import { TROVE, STUDIO, SEO_DESCRIPTION } from "@/lib/brand";
/**
 * Renders a `<script type="application/ld+json">` block server-side so
 * Googlebot / Bingbot get the structured data on first byte (no JS run
 * needed). Stringify is intentional: JSON.stringify escapes < > & for
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
  name: TROVE.name,
  url: STUDIO.domain,
  logo: `${STUDIO.domain}/opengraph-image`,
} as const;

export function softwareApplicationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: TROVE.name,
    alternateName: `${TROVE.name} for Mac`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "macOS 13.0 or later (Ventura+), Apple Silicon and Intel",
    url: STUDIO.domain,
    downloadUrl: "https://github.com/ArnavGoel03/trove/releases/latest",
    softwareVersion: "1.5",
    fileSize: "14 MB",
    description: SEO_DESCRIPTION,
    featureList: [
      "Clipboard history with regex search and dedup",
      "Multi-clipboard staging (Stage)",
      "Text snippets",
      "Screen recorder with system audio, mic, webcam PIP, click ripples and keystroke overlay (no watermark)",
      "Screenshot capture with delay timer",
      "On-device OCR with optional translation",
      "PDF merge, split, compress, rotate, OCR and watermark",
      "Batch image convert, resize and compress (HEIC, PNG, JPEG, WebP)",
      "MD5 / SHA-1 / SHA-256 / SHA-512 hashing and SHA256SUMS verification",
      "CPU, memory, GPU, VRAM and per-process network monitors",
      "Disk usage overview, treemap, dev-cache cleanup and disk speed benchmark",
      "Window tiling and switcher",
      "macOS Shortcuts intents and trove:// URL scheme automation",
    ],
    offers: {
      "@type": "Offer",
      name: `${TROVE.name} subscription`,
      description: "14-day free trial, then a subscription.",
      availability: "https://schema.org/InStock",
    },
    license: "https://github.com/ArnavGoel03/trove",
    publisher: ORG,
  };
}

export function faqPageLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.answer,
      },
    })),
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
      name: TROVE.name,
      url: STUDIO.domain,
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
    tool: { "@type": "HowToTool", name: TROVE.name },
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
