// Centralized env access for the licensing endpoint. Every provider adapter
// reads its OWN config through the getter below (never process.env
// directly), so env names, parsing, and "missing var" error messages live in
// exactly one place. Adding a provider means adding one getter here plus the
// adapter file plus the registry line in provider.ts; nothing else changes.

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} not set`);
  return v;
}

/** Maps a provider's own product/variant id -> our product id ("studio" | "trove" | "relay" | "tend"). */
export type ProductMap = Record<string, string>;

let cachedProductMap: ProductMap | null | undefined;

/**
 * Shared by every provider: `PRODUCT_MAP` is a JSON string like
 * `{"<providerProductId>":"studio","<otherId>":"trove"}`. Only one provider
 * is ever active per deployment (LICENSE_PROVIDER), so the same env var name
 * is safe to reuse across adapters without collision.
 */
export function getProductMap(): ProductMap {
  if (cachedProductMap !== undefined) {
    if (cachedProductMap === null) throw new Error("PRODUCT_MAP not set");
    return cachedProductMap;
  }
  const raw = process.env.PRODUCT_MAP;
  if (!raw) {
    cachedProductMap = null;
    throw new Error("PRODUCT_MAP not set");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("PRODUCT_MAP is not valid JSON");
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("PRODUCT_MAP must be a JSON object of {providerId: ourProductId}");
  }
  cachedProductMap = parsed as ProductMap;
  return cachedProductMap;
}

/** Map a list of the provider's ids (benefit id, variant id, ...) to our product ids, dropping unmapped ones. */
export function mapProductIds(providerIds: Array<string | number | null | undefined>): string[] {
  const map = getProductMap();
  const out: string[] = [];
  for (const id of providerIds) {
    if (id === null || id === undefined) continue;
    const mapped = map[String(id)];
    if (mapped && !out.includes(mapped)) out.push(mapped);
  }
  return out;
}

export interface PolarConfig {
  accessToken: string;
  organizationId: string;
  apiBase: string;
}

export function getPolarConfig(): PolarConfig {
  return {
    accessToken: required("POLAR_ACCESS_TOKEN"),
    organizationId: required("POLAR_ORGANIZATION_ID"),
    // Override to https://sandbox-api.polar.sh for sandbox testing.
    apiBase: process.env.POLAR_API_BASE || "https://api.polar.sh",
  };
}

export interface LemonSqueezyConfig {
  apiBase: string;
}

export function getLemonSqueezyConfig(): LemonSqueezyConfig {
  return {
    apiBase: process.env.LEMONSQUEEZY_API_BASE || "https://api.lemonsqueezy.com",
  };
}
