// Polar.sh license-key adapter. Self-contained: reads its own env (via
// config.ts), does its own product mapping, exposes only LicenseProvider.
//
// API confirmed live 2026-07-10 via Context7 (polar.sh/docs, /llms-full.txt)
// and websearch cross-check:
//   POST {apiBase}/v1/license-keys/validate   (Authorization: Bearer <org access token>)
//   POST {apiBase}/v1/license-keys/activate   (same auth)
// These are the SERVER-authenticated endpoints (license_keys:write scope),
// distinct from the public, unauthenticated /v1/customer-portal/license-keys/*
// endpoints meant for direct client use. Body: { key, organization_id, ... }.
//
// Known limitation (documented, not silently shipped): Polar's activate call
// is NOT idempotent per label. Calling it on every request would mint a new
// activation each time and exhaust a real activation_limit within a handful
// of launches. We avoid that by pre-checking `usage` against
// `limit_activations` from the validate call and skipping activation
// entirely once a device limit isn't configured, but a genuinely correct
// fix needs a small persistence layer (cache the returned activation id per
// instanceId, then pass it as `activation_id` on subsequent validates
// instead of re-activating). Tracked in LICENSING.md.
import { getPolarConfig, mapProductIds } from "../config";
import type { LicenseProvider, ValidateResult } from "./types";

const FAR_FUTURE_EPOCH = 253402300799; // 9999-12-31T23:59:59Z, used when a provider reports "never expires".

interface PolarLicenseKey {
  id: string;
  user_id?: string | null;
  benefit_id: string;
  status: "granted" | "revoked" | "disabled";
  limit_activations: number | null;
  usage: number;
  expires_at: string | null;
}

function toEpochSeconds(iso: string | null): number {
  if (!iso) return FAR_FUTURE_EPOCH;
  const ms = Date.parse(iso);
  return Number.isNaN(ms) ? FAR_FUTURE_EPOCH : Math.floor(ms / 1000);
}

function statusFromKey(key: PolarLicenseKey): string {
  if (key.status === "revoked") return "canceled";
  // "granted": active unless expiry has already passed.
  if (key.expires_at) {
    const expiresMs = Date.parse(key.expires_at);
    if (!Number.isNaN(expiresMs) && expiresMs < Date.now()) return "expired";
  }
  return "active";
}

function buildResult(key: PolarLicenseKey): ValidateResult {
  return {
    ok: true,
    subject: key.user_id ?? key.id,
    products: mapProductIds([key.benefit_id]),
    status: statusFromKey(key),
    expiresAt: toEpochSeconds(key.expires_at),
    deviceLimit: key.limit_activations ?? null,
  };
}

export class PolarProvider implements LicenseProvider {
  async validate(licenseKey: string, instanceId: string): Promise<ValidateResult> {
    const { accessToken, organizationId, apiBase } = getPolarConfig();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    let preCheck: Response;
    try {
      preCheck = await fetch(`${apiBase}/v1/license-keys/validate`, {
        method: "POST",
        headers,
        body: JSON.stringify({ key: licenseKey, organization_id: organizationId }),
      });
    } catch {
      return { ok: false, reason: "error" };
    }

    if (preCheck.status === 404) return { ok: false, reason: "invalid" };
    if (preCheck.status >= 500) return { ok: false, reason: "error" };
    if (!preCheck.ok) return { ok: false, reason: "invalid" };

    let key: PolarLicenseKey;
    try {
      key = (await preCheck.json()) as PolarLicenseKey;
    } catch {
      return { ok: false, reason: "error" };
    }

    if (key.status === "disabled") return { ok: false, reason: "invalid" };
    if (key.status === "revoked") return buildResult(key);

    // "granted": bind this device if the benefit enforces an activation cap.
    if (key.limit_activations === null || key.limit_activations === undefined) {
      return buildResult(key);
    }
    if (key.usage >= key.limit_activations) {
      return { ok: false, reason: "limit_reached" };
    }

    let activateRes: Response;
    try {
      activateRes = await fetch(`${apiBase}/v1/license-keys/activate`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          key: licenseKey,
          organization_id: organizationId,
          label: instanceId,
        }),
      });
    } catch {
      return { ok: false, reason: "error" };
    }

    if (activateRes.status === 404) return { ok: false, reason: "invalid" };
    if (activateRes.status === 403 || activateRes.status === 422) {
      return { ok: false, reason: "limit_reached" };
    }
    if (activateRes.status >= 500) return { ok: false, reason: "error" };
    if (!activateRes.ok) return { ok: false, reason: "error" };

    let activated: { license_key: PolarLicenseKey };
    try {
      activated = (await activateRes.json()) as { license_key: PolarLicenseKey };
    } catch {
      return { ok: false, reason: "error" };
    }

    return buildResult(activated.license_key);
  }
}
