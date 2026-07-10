// The ONE switch. Adding a new provider (Stripe, Paddle, FastSpring, ...) is
// a true 3-step drop-in that never touches this function's body, the route,
// or sign.ts:
//   1. Write lib/licensing/providers/<name>.ts implementing LicenseProvider,
//      self-contained (it reads its own env via config.ts and does its own
//      product mapping).
//   2. Add one line to REGISTRY below.
//   3. Set LICENSE_PROVIDER=<name> in the environment.
import { LemonSqueezyProvider } from "./providers/lemonsqueezy";
import { PolarProvider } from "./providers/polar";
import type { LicenseProvider } from "./providers/types";

const REGISTRY: Record<string, () => LicenseProvider> = {
  polar: () => new PolarProvider(),
  lemonsqueezy: () => new LemonSqueezyProvider(),
};

export function getProvider(): LicenseProvider {
  const selected = process.env.LICENSE_PROVIDER;
  if (!selected) {
    throw new Error(
      `LICENSE_PROVIDER not set. Valid values: ${Object.keys(REGISTRY).join(", ")}`,
    );
  }
  const factory = REGISTRY[selected];
  if (!factory) {
    throw new Error(
      `Unknown LICENSE_PROVIDER "${selected}". Valid values: ${Object.keys(REGISTRY).join(", ")}`,
    );
  }
  return factory();
}
