import type { Metadata } from "next";
import LegalLayout, { Section } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Security — Trove",
  description:
    "How Trove handles security: signing, distribution, network posture, and our responsible disclosure program.",
};

export default function SecurityPage() {
  return (
    <LegalLayout
      title="Security"
      updated="May 15, 2026"
      intro={
        <>
          Trove is a local-first app. Our security posture follows from that:
          the smaller the attack surface, the fewer ways things can go wrong.
        </>
      }
    >
      <Section title="What Trove does today">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="text-white">Local-only by default.</span> The app
            does not make outbound network calls during normal operation.
            Network-using features are opt-in and clearly labeled.
          </li>
          <li>
            <span className="text-white">Ad-hoc signed.</span> Builds are
            currently signed ad-hoc with a hardened runtime. Apple
            notarization is on the near-term roadmap and will be enabled
            before broader distribution.
          </li>
          <li>
            <span className="text-white">License keys in Keychain.</span>{" "}
            License material is stored in the macOS Keychain rather than on
            disk in plain text.
          </li>
          <li>
            <span className="text-white">Release artifacts on GitHub.</span>{" "}
            Downloadable releases are published to{" "}
            <a
              href="https://github.com/ArnavGoel03/trove"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline"
            >
              github.com/ArnavGoel03/trove
            </a>
            . Note: the public repository hosts releases and issue tracking;
            the full source tree is not currently open-sourced.
          </li>
        </ul>
      </Section>

      <Section title="Responsible disclosure">
        <p>
          If you find a security issue in Trove, please report it privately
          before disclosing publicly:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Email{" "}
            <a
              href="mailto:security@trove.app"
              className="text-white hover:underline"
            >
              security@trove.app
            </a>{" "}
            with a clear description, reproduction steps, and any proof-of-
            concept material.
          </li>
          <li>
            We acknowledge reports within{" "}
            <span className="text-white">5 business days</span> and aim to
            triage and remediate as quickly as the severity warrants.
          </li>
          <li>
            We ask reporters to allow up to{" "}
            <span className="text-white">90 days</span> from initial report
            before public disclosure, longer if a coordinated fix is in
            progress.
          </li>
          <li>
            Good-faith research that complies with this policy will not be
            pursued legally.
          </li>
        </ul>
      </Section>

      <Section title="Hall of fame">
        <p>
          Researchers who report valid issues will be credited on this page
          (with permission). We&rsquo;re a small operation and don&rsquo;t
          currently offer monetary bounties, but a public thank-you and a
          permanent link are on the table.
        </p>
      </Section>

      <Section title="What we are not claiming">
        <p>
          We want to be honest about scope. Trove is not ISO 27001 or SOC 2
          certified. We do not operate a SIEM, we do not have a formal
          enterprise compliance program, and we are not currently undergoing
          third-party penetration testing. If those things matter for your
          deployment, please reach out before purchasing — we&rsquo;d rather
          tell you up-front than oversell what a small team can deliver.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Security-related questions:{" "}
          <a
            href="mailto:security@trove.app"
            className="text-white hover:underline"
          >
            security@trove.app
          </a>
          . General questions:{" "}
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
