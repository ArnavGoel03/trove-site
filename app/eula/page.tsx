import type { Metadata } from "next";
import LegalLayout, { Section } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "End User License Agreement — Trove",
  description:
    "Trove End User License Agreement — your right to use the Trove software.",
};

export default function EulaPage() {
  return (
    <LegalLayout
      title="End User License Agreement"
      updated="May 15, 2026"
      intro={
        <>
          This End User License Agreement (&ldquo;EULA&rdquo;) is a short
          companion to our{" "}
          <a href="/terms" className="text-white hover:underline">
            Terms of Service
          </a>
          . The Terms contain the substantive provisions; this EULA records
          the basic right-to-use that you receive when you install Trove.
        </>
      }
    >
      <Section title="1. License">
        <p>
          We grant you a personal, non-exclusive, non-transferable, revocable
          license to install and use Trove on your Mac, in accordance with the
          Terms of Service.
        </p>
      </Section>

      <Section title="2. Ownership">
        <p>
          Trove is licensed, not sold. We and our licensors retain all right,
          title, and interest in and to Trove, including all intellectual
          property rights. No rights are granted to you other than those
          expressly set out in this EULA and the Terms.
        </p>
      </Section>

      <Section title="3. Restrictions">
        <p>
          You may not copy, modify, reverse engineer, decompile, distribute,
          rent, lease, sublicense, or create derivative works based on Trove,
          except to the extent expressly permitted by applicable law or by our
          Terms.
        </p>
      </Section>

      <Section title="4. Updates">
        <p>
          Updates to Trove are governed by the same license. Some updates may
          add, change, or remove features.
        </p>
      </Section>

      <Section title="5. Termination">
        <p>
          This EULA terminates automatically if you breach its terms. On
          termination, you must stop using Trove and uninstall it from your
          Mac.
        </p>
      </Section>

      <Section title="6. Governing terms">
        <p>
          For warranty, liability, dispute resolution, and other substantive
          provisions, see the{" "}
          <a href="/terms" className="text-white hover:underline">
            Terms of Service
          </a>
          . In case of conflict between this EULA and the Terms, the Terms
          control.
        </p>
      </Section>
    </LegalLayout>
  );
}
