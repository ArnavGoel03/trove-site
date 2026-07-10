import Link from "next/link";
import Logomark from "@/components/Logomark";
import { STUDIO, TROVE } from "@/lib/brand";

// Same rule as Nav.tsx: the studio name once the studio brand is
// live, the flagship app name otherwise. Never a hardcoded literal.
const HOME_BRAND = STUDIO.live ? STUDIO.name : TROVE.name;

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#08080b" }}>
      {/* Nav: static, matches Nav.tsx branding */}
      <header className="fixed top-0 inset-x-0 z-50 px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label={`${HOME_BRAND} home`}
          >
            <Logomark name={HOME_BRAND} size={36} />
            <span className="text-[16px] font-semibold tracking-tight text-white">
              {HOME_BRAND}
            </span>
          </Link>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div
          aria-hidden="true"
          role="presentation"
          className="absolute inset-0 -z-10 opacity-60 pointer-events-none"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 40%, rgba(255,122,69,0.12) 0%, transparent 60%)",
          }}
        />

        <p className="text-[12px] uppercase tracking-[0.2em] text-[#71717a] mb-4">
          404
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.02] text-white mb-4">
          Page not found.
        </h1>
        <p className="text-[16px] text-[#a1a1aa] max-w-md leading-relaxed mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full font-medium px-5 py-3 text-[14px] text-white border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Back to home
          </Link>
          <Link
            href="/features"
            className="inline-flex items-center gap-2 rounded-full font-medium px-5 py-3 text-[14px] text-[var(--color-fg-dim)] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Browse features
          </Link>
          <Link
            href="/download"
            className="inline-flex items-center gap-2 rounded-full font-medium px-5 py-3 text-[14px] text-[var(--color-fg-dim)] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Download
          </Link>
        </div>
      </main>
    </div>
  );
}
