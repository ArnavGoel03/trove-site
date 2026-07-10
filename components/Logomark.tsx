/**
 * Shared brand mark: a rounded-square app-icon-style tile with the
 * first letter of the given name. Used by Nav, Footer and the 404
 * page so all three stay visually identical and update together
 * when a name changes in lib/brand.ts.
 *
 * Previously each usage inlined its own w-7 h-7 (28px) square with a
 * `bg-black/20 backdrop-blur-sm` darkening layer over the letter,
 * which is what made the mark look "buried" against the dark nav:
 * small, low-contrast, and blurred at its own edges. This version is
 * bigger by default, drops the darkening overlay in favor of a crisp
 * ring + glossy inset highlight (matching .btn-primary's language in
 * globals.css), and gives the letter a drop-shadow for legibility
 * against the bright gradient.
 *
 * No "use client" needed: pure markup, no hooks or handlers, safe to
 * render from server components (not-found.tsx) and client
 * components (Nav.tsx, Footer.tsx) alike.
 */
export default function Logomark({
  name,
  size = 36,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const letter = name.charAt(0).toUpperCase();
  const radius = Math.round(size * 0.28);
  const fontSize = Math.round(size * 0.42);

  return (
    <span
      aria-hidden
      className={`relative inline-flex shrink-0 items-center justify-center bg-gradient-to-br from-[#ffab7a] via-[#ff6a2a] to-[#b27cff] ring-1 ring-white/[0.18] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),inset_0_-1px_0_0_rgba(0,0,0,0.28),0_8px_20px_-8px_rgba(255,122,69,0.65)] ${className}`}
      style={{ width: size, height: size, borderRadius: radius }}
    >
      <span
        className="relative font-bold tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
        style={{ fontSize }}
      >
        {letter}
      </span>
    </span>
  );
}
