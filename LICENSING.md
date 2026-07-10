# Licensing endpoint

The native apps (Trove, Relay, Tend) never talk to a payment provider
directly. They talk only to this site's `/api/license/v1/entitlement`
endpoint, which validates a license key against whichever provider is
configured and returns an Ed25519-signed entitlement the app verifies
offline against its embedded public key (`licensing_client.swift`,
`StudioLicensing.publicKeyB64`).

Provider-agnostic by design: switching from Polar to Lemon Squeezy (or
adding a new provider later) is one env var, `LICENSE_PROVIDER`. No code path
in the route or the signing code ever names a provider.

## Contract

`POST /api/license/v1/entitlement`

Request body:

```json
{ "licenseKey": "...", "instanceId": "...", "product": "trove" }
```

- `licenseKey`: the credential the customer entered.
- `instanceId`: a stable per-install UUID generated once by the app (see
  `StudioLicensing.instanceId()`), sent on every check so the provider can
  bind and count device activations.
- `product`: this app's own id (`trove` | `relay` | `tend`). A license
  granting the `studio` suite product unlocks all three; a per-app license
  must list the matching id.

Responses:

- `200` with `{ "payload": "<base64>", "signature": "<base64>" }`: the
  license is entitled (possibly with a non-active `status`, e.g. `expired` or
  `canceled`, for the app to interpret). `payload` base64-decodes to the JSON
  entitlement; `signature` is the Ed25519 signature over those exact bytes.
- `400`: the request body is missing `licenseKey`, `instanceId`, or
  `product`.
- `403`: the provider says this credential is not entitled (invalid,
  expired, or the device activation limit was reached). The app treats every
  4xx the same way: a definitive "not entitled", clearing any cached
  entitlement.
- `502`: the provider was unreachable or returned a server error. The app
  treats this as "unreachable" and keeps the user on their last-known cached
  state (bounded by `offlineGraceSeconds`, 7 days).

The endpoint never logs the license key or the private signing key.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `LICENSE_PROVIDER` | always | `polar` or `lemonsqueezy`. The one switch that selects the active adapter. |
| `LICENSE_SIGNING_KEY_PEM_B64` | always | Base64 of the Ed25519 PKCS8 private key PEM. Produce it from the local private key with `base64 -i ~/.config/studio-licensing/ed25519-private.pem`. Keep this secret; it never leaves the server. Set it as a **production-only** Vercel env var. |
| `PRODUCT_MAP` | always | JSON string mapping the active provider's own product/variant id to our product id, e.g. `{"<polarBenefitId>":"studio","<otherVariantId>":"trove"}`. `"studio"` unlocks the whole suite. Only the active provider's ids need to be present. |
| `POLAR_ACCESS_TOKEN` | when `LICENSE_PROVIDER=polar` | Polar organization access token with the `license_keys:write` scope. |
| `POLAR_ORGANIZATION_ID` | when `LICENSE_PROVIDER=polar` | Your Polar organization id. |
| `POLAR_API_BASE` | optional | Defaults to `https://api.polar.sh`. Set to `https://sandbox-api.polar.sh` for sandbox testing. |
| `LEMONSQUEEZY_API_BASE` | optional | Defaults to `https://api.lemonsqueezy.com`. The Lemon Squeezy License API is public/unauthenticated by design (keyed by the license key itself), so no API key env var is needed for this endpoint. |

Keep every secret above scoped to the Vercel **production** environment
only. Preview and development deployments should leave `LICENSE_PROVIDER`
unset, which makes `getProvider()` throw and every check fail closed rather
than silently validating against a real paid account from a throwaway
preview build.

## Switching providers

1. Set `LICENSE_PROVIDER=polar` or `LICENSE_PROVIDER=lemonsqueezy` in Vercel
   production env.
2. Set that provider's env vars (see table above).
3. Set `PRODUCT_MAP` to that provider's product/variant ids.
4. Redeploy. Nothing else changes: the route, the signing code, and the
   other adapter are untouched.

## Adding a new provider (Stripe, Paddle, FastSpring, ...)

Three steps, no changes to the route or `sign.ts`:

1. Write `lib/licensing/providers/<name>.ts` implementing the
   `LicenseProvider` interface from `lib/licensing/providers/types.ts`. Make
   it self-contained: it reads its own env vars through a getter you add to
   `lib/licensing/config.ts`, and does its own product-id mapping (call
   `mapProductIds()` from `config.ts`, which reads the shared `PRODUCT_MAP`).
2. Add one line to the `REGISTRY` object in `lib/licensing/provider.ts`:
   `<name>: () => new YourProvider()`.
3. Set `LICENSE_PROVIDER=<name>` in the environment.

`getProvider()` looks the env var up in `REGISTRY` and throws (listing the
valid keys) if it's unset or unknown, so a typo or a forgotten env var fails
loudly instead of silently falling back to the wrong provider.

## Creating the matching products in each provider

**Polar**: create a Benefit of type "License Keys" attached to the
product/subscription tier you're selling. Note the benefit's id (returned as
`benefit_id` on the license key) and put it in `PRODUCT_MAP`. Set an
activation limit on the benefit if you want to cap devices per key.

**Lemon Squeezy**: create a Product/Variant with the "License Keys" delivery
method enabled. Note the variant's id (returned as `meta.variant_id` on
validate/activate) and put it in `PRODUCT_MAP`. Set an activation limit on
the variant if you want to cap devices per key.

Either way, map to `"studio"` for a license that should unlock the whole
suite, or to the specific app id (`"trove"`, `"relay"`, `"tend"`) for a
per-app license.

## Pointing the app at the deployed endpoint

In `licensing_client.swift`, set:

```swift
static let baseURL: URL? = URL(string: "https://gettrove.vercel.app/api/license")!
```

The app appends `v1/entitlement` itself. Setting `baseURL` simultaneously
turns enforcement on (`enforcing` is derived from it being non-nil), so ship
this change only once the endpoint is live with real provider credentials.

## Known limitation: per-device activation idempotency

Both Polar's and Lemon Squeezy's activation endpoints are not idempotent per
label/instance name: calling activate again for the same device mints a new
activation each time rather than reusing an existing one. This adapter
pre-checks the provider's reported `usage` against its `limit_activations`
(or `activation_usage` / `activation_limit` for Lemon Squeezy) before
activating, and skips activation entirely when no device cap is configured,
but it does not yet cache the provider-issued activation id per
`instanceId`. In practice this means a device that re-checks its license
very frequently could consume more of a small activation limit than
strictly necessary. A future improvement is a small key-value cache (e.g.
Vercel KV / Upstash Redis, free tier) keyed by `instanceId` storing the
provider's activation id, so repeat checks reuse it instead of re-activating.
Not implemented yet because it would add a paid-tier-adjacent dependency
before the endpoint has shipped a single real transaction; revisit once
usage data shows it matters.

## Self-test

`node scripts/licensing-selftest.mjs` signs a sample entitlement with the
local private key (`~/.config/studio-licensing/ed25519-private.pem`) and
verifies it with the embedded public key exactly the way the app does,
proving the endpoint's signing byte-matches the app's offline verifier
without needing a deployed endpoint or a provider account. It also asserts a
tampered signature fails verification. Run it after touching
`lib/licensing/sign.ts` or the entitlement shape.
