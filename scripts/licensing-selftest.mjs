#!/usr/bin/env node
// Proves the endpoint's Ed25519 signing byte-matches the app's offline
// verifier, without touching any payment provider. Loads the LOCAL private
// key, signs a sample entitlement via the real lib/licensing/sign.ts, then
// verifies the signature the way the Swift app does: Ed25519 verify over the
// base64-decoded payload bytes against the embedded public key. Also proves
// a tampered signature is rejected.
//
//   node scripts/licensing-selftest.mjs

import { readFileSync } from "node:fs";
import { createPublicKey, verify } from "node:crypto";
import { homedir } from "node:os";
import { join } from "node:path";

const EMBEDDED_PUBLIC_KEY_B64 = "SkYoOLPNCEknk/yMhgNu3rwN05+O75QxlnbymWjwyCU=";
const PRIVATE_PEM_PATH = join(homedir(), ".config", "studio-licensing", "ed25519-private.pem");

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

// 1. Load the local private key and set the env var sign.ts expects.
let pem;
try {
  pem = readFileSync(PRIVATE_PEM_PATH, "utf8");
} catch (err) {
  fail(`could not read private key at ${PRIVATE_PEM_PATH}: ${err.message}`);
}
process.env.LICENSE_SIGNING_KEY_PEM_B64 = Buffer.from(pem, "utf8").toString("base64");

// 2. Sign a sample entitlement via the real signing module.
const { signEntitlement } = await import("../lib/licensing/sign.ts");

const sample = {
  schema: 1,
  subject: "selftest-subject",
  products: ["studio"],
  status: "active",
  issuedAt: Math.floor(Date.now() / 1000),
  expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  deviceLimit: 3,
  instanceId: "selftest-instance-id",
};

const { payload, signature } = signEntitlement(sample);

// 3. Verify with the embedded PUBLIC key, the same way the app does
//    (Ed25519 verify over the base64-decoded payload bytes).
const publicKey = createPublicKey({
  key: Buffer.concat([
    // Ed25519 SubjectPublicKeyInfo DER prefix for a 32-byte raw public key.
    Buffer.from("302a300506032b6570032100", "hex"),
    Buffer.from(EMBEDDED_PUBLIC_KEY_B64, "base64"),
  ]),
  format: "der",
  type: "spki",
});

const payloadBytes = Buffer.from(payload, "base64");
const signatureBytes = Buffer.from(signature, "base64");

const isValid = verify(null, payloadBytes, publicKey, signatureBytes);
if (isValid !== true) fail("genuine signature did not verify against the embedded public key");

// 4. A tampered signature must NOT verify.
const tampered = Buffer.from(signatureBytes);
tampered[0] ^= 0xff;
const tamperedValid = verify(null, payloadBytes, publicKey, tampered);
if (tamperedValid !== false) fail("tampered signature incorrectly verified as valid");

// 5. Round-trip sanity: the payload bytes decode back to the same entitlement.
const decoded = JSON.parse(payloadBytes.toString("utf8"));
if (decoded.instanceId !== sample.instanceId) {
  fail("decoded payload instanceId does not match (fail-closed field the app requires)");
}

console.log("PASS: genuine signature verifies true, tampered signature verifies false, payload round-trips.");
process.exit(0);
