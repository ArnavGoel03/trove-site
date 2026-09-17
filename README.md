# Quiver site

Next.js marketing and download site for the Quiver apps. Run pnpm dev locally.
Run pnpm test, pnpm exec tsc --noEmit and pnpm build to verify changes.

Browser release consumers share lib/releases-client.ts; the API retains its
server cache. The stage DOM driver schedules work on input and geometry changes.
Current publication status and verification limits are in docs/STATE.md.
