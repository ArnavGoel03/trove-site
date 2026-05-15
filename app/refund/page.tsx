import type { Metadata } from "next";
import LegalLayout, { Section } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Refund Policy — Trove",
  description:
    "Trove offers a 14-day no-questions-asked refund. Here's how it works.",
};

export default function RefundPage() {
  return (
    <LegalLayout
      title="Refund Policy"
      updated="May 15, 2026"
      intro={
        <>
          We want you to be happy with Trove. If it&rsquo;s not the right tool
          for your Mac, we&rsquo;ll refund your purchase within the window
          described below — no interrogation.
        </>
      }
    >
      <Section title="1. 14-day refund window">
        <p>
          You may request a full refund within{" "}
          <span className="text-white">14 calendar days</span> of your initial
          purchase, for any reason. No questions asked.
        </p>
      </Section>

      <Section title="2. How to request a refund">
        <p>
          Email{" "}
          <a
            href="mailto:support@trove.app"
            className="text-white hover:underline"
          >
            support@trove.app
          </a>{" "}
          from the address you used to purchase, and include your order ID (or
          the receipt email). We&rsquo;ll process the refund to the original
          payment method, typically within a few business days.
        </p>
      </Section>

      <Section title="3. Subscriptions cancelled mid-term">
        <p>
          If you cancel an annual subscription after the 14-day window but
          before renewal, you keep access for the remainder of the paid term.
          If a cancellation is requested because of a significant defect we
          cannot resolve, we will pro-rate a refund for the unused portion of
          the term at our discretion.
        </p>
      </Section>

      <Section title="4. Renewals">
        <p>
          Renewal charges are not automatically refundable simply because the
          renewal occurred. To avoid a renewal charge, cancel before the
          renewal date. If a renewal was unexpected and you contact us within
          14 days of the renewal charge without having used the new term in a
          meaningful way, we will generally honor a refund as a courtesy.
        </p>
      </Section>

      <Section title="5. Exclusions">
        <p>We do not offer refunds for:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Purchases made more than 14 days ago, except as noted above;</li>
          <li>
            Fraudulent purchases or chargebacks initiated without first
            contacting us;
          </li>
          <li>
            Accounts terminated for violations of our{" "}
            <a href="/terms" className="text-white hover:underline">
              Terms
            </a>{" "}
            or{" "}
            <a
              href="/acceptable-use"
              className="text-white hover:underline"
            >
              Acceptable Use Policy
            </a>
            .
          </li>
        </ul>
      </Section>

      <Section title="6. EU / UK consumer rights">
        <p>
          If you are a consumer located in the EU, EEA, or UK, you may have
          additional statutory withdrawal rights that override the limits in
          this policy. Where local consumer law mandates a longer window or a
          different process, that law controls.
        </p>
      </Section>

      <Section title="7. Contact">
        <p>
          Refund questions? Email{" "}
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
