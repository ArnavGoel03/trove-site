# Quiver site

Read docs/STATE.md first. Shared engineering rules are in ~/dev/standards.
Release response caching for browser consumers lives in lib/releases-client.ts;
failed requests must remain retryable. Track scroll subscriptions and frame
coalescing live in components/stage/observe-progress.ts. Keep one progress driver
and cancel all subscriptions and pending frames on effect cleanup.

Checks: pnpm test, pnpm exec tsc --noEmit, pnpm build (includes the hardcoded gate).
Rendered desktop/phone and scroll acceptance are required before promoting
changes to the stage driver. Source tests do not establish browser performance.
