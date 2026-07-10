// POST /api/license/v1/entitlement
//
// The ONE endpoint the native apps are allowed to talk to (never a payment
// provider directly). Validates a license key against whatever provider is
// configured (see lib/licensing/provider.ts) and returns an Ed25519-signed
// entitlement the app verifies offline against its embedded public key.
//
// This route is the single place a provider's normalized ValidateResult gets
// turned into the StudioEntitlement shape the app expects; providers never
// build that shape themselves, they only report facts.
import { NextResponse } from "next/server";
import { getProvider } from "@/lib/licensing/provider";
import { signEntitlement, type StudioEntitlement } from "@/lib/licensing/sign";

export const runtime = "nodejs"; // node:crypto (Ed25519 signing) needs the Node runtime.
export const dynamic = "force-dynamic"; // Never cache a license check.

interface EntitlementRequest {
  licenseKey?: unknown;
  instanceId?: unknown;
  product?: unknown;
}

export async function POST(req: Request) {
  let body: EntitlementRequest;
  try {
    body = (await req.json()) as EntitlementRequest;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { licenseKey, instanceId, product } = body;
  if (
    typeof licenseKey !== "string" ||
    !licenseKey ||
    typeof instanceId !== "string" ||
    !instanceId ||
    typeof product !== "string" ||
    !product
  ) {
    return NextResponse.json(
      { error: "missing_fields", required: ["licenseKey", "instanceId", "product"] },
      { status: 400 },
    );
  }

  let result;
  try {
    result = await getProvider().validate(licenseKey, instanceId, product);
  } catch (err) {
    // Never log the license key. Log only the failure shape.
    console.error("licensing: provider validate threw", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "provider_error" }, { status: 502 });
  }

  if (!result.ok) {
    if (result.reason === "error") {
      return NextResponse.json({ error: "provider_unreachable" }, { status: 502 });
    }
    // invalid | expired | limit_reached: definitive "not entitled" (app treats every 4xx the same way).
    return NextResponse.json({ error: result.reason }, { status: 403 });
  }

  const now = Math.floor(Date.now() / 1000);
  const entitlement: StudioEntitlement = {
    schema: 1,
    subject: result.subject,
    products: result.products,
    status: result.status,
    issuedAt: now,
    expiresAt: result.expiresAt,
    deviceLimit: result.deviceLimit,
    // Required, never null: the app fail-closes on a missing instance id.
    instanceId,
  };

  const { payload, signature } = signEntitlement(entitlement);
  return NextResponse.json({ payload, signature }, { status: 200 });
}
