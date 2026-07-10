import type { Metadata } from "next";
import LegalLayout, { Section } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service — Trove",
  description:
    "The terms governing your use of Trove for macOS, including license, permitted use, and warranty.",
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      updated="May 15, 2026"
      intro={
        <>
          These Terms govern your use of Trove for macOS and the Trove website.
          By downloading, installing, or using Trove, you agree to them. If you
          do not agree, please do not use the software.
        </>
      }
    >
      <Section title="1. License grant">
        <p>
          Subject to your compliance with these Terms and payment of the
          applicable subscription fee (currently USwith a free trial), we grant you a
          personal, non-exclusive, non-transferable, revocable license to
          install and use Trove on your Mac.
        </p>
        <p>
          The license is per user, primarily for a single machine. As a
          reasonable courtesy, you may also install Trove on a secondary
          personal Mac (for example, a laptop in addition to a desktop) used
          by you. The license is not for sharing between multiple people.
        </p>
      </Section>

      <Section title="2. Permitted use">
        <p>
          You may use Trove for personal productivity and for ordinary
          commercial work performed by you or your small team. You may
          configure, customize, and integrate Trove with other apps on your
          Mac as the app supports.
        </p>
      </Section>

      <Section title="3. Prohibited use">
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Reverse engineer, decompile, or disassemble Trove, except to the
            extent expressly permitted by applicable law;
          </li>
          <li>
            Resell, sublicense, lease, or otherwise redistribute the Trove
            binary or license keys;
          </li>
          <li>
            Use Trove to violate any law, infringe the rights of others, or
            distribute malware;
          </li>
          <li>
            Bypass or attempt to bypass license verification, or generate
            license keys in an unauthorized way.
          </li>
        </ul>
      </Section>

      <Section title="4. Subscriptions and payment">
        <p>
          Trove is offered as an annual subscription. Subscriptions renew
          automatically unless cancelled before the renewal date. Refunds are
          governed by our{" "}
          <a href="/refund" className="text-white hover:underline">
            Refund Policy
          </a>
          .
        </p>
      </Section>

      <Section title="5. DMCA and copyright">
        <p>
          We respect intellectual property rights. If you believe content
          accessible through Trove or the website infringes your copyright,
          send a DMCA notice to{" "}
          <a
            href="mailto:support@trove.app"
            className="text-white hover:underline"
          >
            support@trove.app
          </a>{" "}
          with the information required by 17 U.S.C. § 512(c)(3).
        </p>
      </Section>

      <Section title="6. Warranty disclaimer">
        <p>
          TROVE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE,&rdquo;
          WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
          WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
          NON-INFRINGEMENT. WE DO NOT WARRANT THAT TROVE WILL BE
          UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.
        </p>
      </Section>

      <Section title="7. Limitation of liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR AGGREGATE LIABILITY
          ARISING OUT OF OR RELATING TO THESE TERMS OR YOUR USE OF TROVE WILL
          NOT EXCEED THE AMOUNT YOU PAID US FOR THE TROVE SUBSCRIPTION IN THE
          TWELVE MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM. IN NO
          EVENT WILL WE BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, OR PUNITIVE DAMAGES.
        </p>
      </Section>

      <Section title="8. Termination">
        <p>
          You may stop using Trove at any time and uninstall it from your Mac.
          We may suspend or terminate your license if you materially breach
          these Terms, including the prohibited-use list above. On
          termination, the license to use Trove ends; locally stored data
          remains on your Mac unless you delete it.
        </p>
      </Section>

      <Section title="9. Governing law and disputes">
        <p>
          These Terms are governed by the laws of the State of Delaware,
          United States, without regard to its conflict-of-laws principles.
          The parties consent to the exclusive jurisdiction of the state and
          federal courts located in Delaware for any dispute that cannot be
          resolved informally. Nothing in this section limits any non-waivable
          consumer rights you have under your local law.
        </p>
      </Section>

      <Section title="10. Dispute resolution">
        <p>
          Before filing a formal claim, please email{" "}
          <a
            href="mailto:support@trove.app"
            className="text-white hover:underline"
          >
            support@trove.app
          </a>{" "}
          so we can try to resolve the issue directly. We commit to a
          good-faith response within a reasonable timeframe.
        </p>
      </Section>

      <Section title="11. Changes to these Terms">
        <p>
          We may update these Terms from time to time. Material changes will
          be noted by updating the &ldquo;Last updated&rdquo; date above.
          Continued use of Trove after changes constitutes acceptance of the
          updated Terms.
        </p>
      </Section>

      <Section title="12. Contact">
        <p>
          Questions about these Terms? Email{" "}
          <a
            href="mailto:support@trove.app"
            className="text-white hover:underline"
          >
            support@trove.app
          </a>
          .
        </p>
      </Section>
    </LegalLayout>
  );
}
