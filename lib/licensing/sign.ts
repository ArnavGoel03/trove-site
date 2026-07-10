// Ed25519 entitlement signing, the security core of the licensing endpoint.
//
// This MUST byte-match the app's offline verifier (licensing_client.swift,
// StudioLicensing.verify): we sign the raw UTF-8 JSON bytes of the
// entitlement with Ed25519 (algorithm = null selects Ed25519 in node:crypto),
// base64-encode both the payload bytes and the signature, and the app decodes
// + verifies those same bytes against its embedded public key. Do not
// "improve" this by re-serializing, pretty-printing, or re-encoding anywhere
// else in the pipeline: the signature only matches the EXACT bytes signed
// here.
import { createPrivateKey, sign } from "node:crypto";

export interface StudioEntitlement {
  schema: number;
  subject: string;
  products: string[];
  status: string;
  issuedAt: number;
  expiresAt: number;
  deviceLimit: number | null;
  instanceId: string | null;
}

function privateKey() {
  const b64 = process.env.LICENSE_SIGNING_KEY_PEM_B64;
  if (!b64) throw new Error("LICENSE_SIGNING_KEY_PEM_B64 not set");
  // base64 of the PKCS8 PEM.
  return createPrivateKey(Buffer.from(b64, "base64"));
}

export function signEntitlement(ent: StudioEntitlement): { payload: string; signature: string } {
  const bytes = Buffer.from(JSON.stringify(ent), "utf8");
  const signature = sign(null, bytes, privateKey()); // Ed25519 (algorithm = null)
  return { payload: bytes.toString("base64"), signature: signature.toString("base64") };
}
