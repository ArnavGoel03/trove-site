// Provider-agnostic contract. The route and sign.ts depend on THIS file only,
// never on a concrete adapter: swapping Polar for Lemon Squeezy (or adding a
// third provider) never touches the route or the signing code.

export type ValidateResult =
  | {
      ok: true;
      subject: string;
      products: string[];
      status: string;
      expiresAt: number;
      deviceLimit: number | null;
    }
  | { ok: false; reason: "invalid" | "expired" | "limit_reached" | "error" };

export interface LicenseProvider {
  validate(licenseKey: string, instanceId: string, product: string): Promise<ValidateResult>;
}
