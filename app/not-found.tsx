import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#08080b" }}>
      {/* Nav — static, matches Nav.tsx branding */}
      <header className="fixed top-0 inset-x-0 z-50 px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label="Trove"
          >
            <span className="relative inline-flex w-7 h-7 rounded-[8px] bg-gradient-to-br from-[#ff8b5a] via-[#ff6a2a] to-[#b27cff] items-center justify-center shadow-[0_4px_12px_-2px_rgba(255,122,69,0.5)]">
              <span className="absolute inset-0.5 rounded-[6px] bg-black/20" />
              <span className="relative text-[11px] font-bold tracking-tight text-white">
                T
              </span>
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-white">
              Trove
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
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full font-medium px-5 py-3 text-[14px] text-white border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
        >
          Back to home
        </Link>
      </main>
    </div>
  );
}
