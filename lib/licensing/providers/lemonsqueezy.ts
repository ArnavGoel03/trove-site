// Lemon Squeezy license-key adapter. Self-contained: reads its own env (via
// config.ts), does its own product mapping, exposes only LicenseProvider.
//
// API confirmed live 2026-07-10 via Context7 (docs.lemonsqueezy.com/api/license-api)
// and websearch cross-check:
//   POST {apiBase}/v1/licenses/validate   (no API key: the License API is
//   POST {apiBase}/v1/licenses/activate    public/unauthenticated by design,
//                                           keyed by the license key itself)
// Both take a form-encoded body (application/x-www-form-urlencoded) per the
// official examples, and require an `Accept: application/json` header.
//
// Known limitation (documented, not silently shipped): like Polar, LS's
// activate call is not idempotent per instance_name, so we pre-check
// activation_usage against activation_limit from the validate call and skip
// activating a device that is already over the cap, but repeated legitimate
// checks from the SAME device still mint a new instance each time. A correct
// fix needs a small persistence layer to cache the returned instance id per
// our instanceId and reuse it. Tracked in LICENSING.md.
import { getLemonSqueezyConfig, mapProductIds } from "../config";
import type { LicenseProvider, ValidateResult } from "./types";

const FAR_FUTURE_EPOCH = 253402300799; // 9999-12-31T23:59:59Z, used when a provider reports "never expires".

interface LSLicenseKey {
  id: number;
  status: "inactive" | "active" | "expired" | "disabled";
  activation_limit: number | null;
  activation_usage: number;
  expires_at: string | null;
}

interface LSMeta {
  variant_id?: number;
  customer_id?: number;
}

interface LSValidateResponse {
  valid: boolean;
  error: string | null;
  license_key?: LSLicenseKey;
  meta?: LSMeta;
}

interface LSActivateResponse {
  activated: boolean;
  error: string | null;
  license_key?: LSLicenseKey;
  meta?: LSMeta;
}

function toEpochSeconds(iso: string | null | undefined): number {
  if (!iso) return FAR_FUTURE_EPOCH;
  const ms = Date.parse(iso);
  return Number.isNaN(ms) ? FAR_FUTURE_EPOCH : Math.floor(ms / 1000);
}

function statusFromKey(key: LSLicenseKey): string {
  if (key.status === "expired") return "expired";
  if (key.status === "disabled") return "canceled";
  return "active"; // "active" or "inactive" (not yet activated) both mean usable.
}

function buildResult(key: LSLicenseKey, meta: LSMeta | undefined): ValidateResult {
  return {
    ok: true,
    subject: meta?.customer_id !== undefined ? String(meta.customer_id) : String(key.id),
    products: mapProductIds([meta?.variant_id]),
    status: statusFromKey(key),
    expiresAt: toEpochSeconds(key.expires_at),
    deviceLimit: key.activation_limit ?? null,
  };
}

export class LemonSqueezyProvider implements LicenseProvider {
  async validate(licenseKey: string, instanceId: string): Promise<ValidateResult> {
    const { apiBase } = getLemonSqueezyConfig();
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    };

    let preCheck: Response;
    try {
      preCheck = await fetch(`${apiBase}/v1/licenses/validate`, {
        method: "POST",
        headers,
        body: new URLSearchParams({ license_key: licenseKey }),
      });
    } catch {
      return { ok: false, reason: "error" };
    }

    if (preCheck.status === 404) return { ok: false, reason: "invalid" };
    if (preCheck.status >= 500) return { ok: false, reason: "error" };

    let preJson: LSValidateResponse;
    try {
      preJson = (await preCheck.json()) as LSValidateResponse;
    } catch {
      return { ok: false, reason: "error" };
    }

    if (!preJson.valid || !preJson.license_key) {
      return { ok: false, reason: "invalid" };
    }

    const key = preJson.license_key;
    if (key.status === "disabled") return { ok: false, reason: "invalid" };
    if (key.status === "expired") return buildResult(key, preJson.meta);

    // "active" or "inactive": bind this device if an activation cap applies.
    if (key.activation_limit === null || key.activation_limit === undefined) {
      return buildResult(key, preJson.meta);
    }
    if (key.activation_usage >= key.activation_limit) {
      return { ok: false, reason: "limit_reached" };
    }

    let activateRes: Response;
    try {
      activateRes = await fetch(`${apiBase}/v1/licenses/activate`, {
        method: "POST",
        headers,
        body: new URLSearchParams({ license_key: licenseKey, instance_name: instanceId }),
      });
    } catch {
      return { ok: false, reason: "error" };
    }

    if (activateRes.status === 404) return { ok: false, reason: "invalid" };
    if (activateRes.status >= 500) return { ok: false, reason: "error" };

    let activateJson: LSActivateResponse;
    try {
      activateJson = (await activateRes.json()) as LSActivateResponse;
    } catch {
      return { ok: false, reason: "error" };
    }

    if (!activateJson.activated || !activateJson.license_key) {
      const msg = (activateJson.error ?? "").toLowerCase();
      if (msg.includes("limit")) return { ok: false, reason: "limit_reached" };
      if (msg.includes("not found") || msg.includes("invalid")) {
        return { ok: false, reason: "invalid" };
      }
      return { ok: false, reason: "error" };
    }

    return buildResult(activateJson.license_key, activateJson.meta);
  }
}
