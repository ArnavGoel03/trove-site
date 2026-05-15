import type { Metadata } from "next";
import LegalLayout, { Section } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Acceptable Use Policy — Trove",
  description:
    "What you can and cannot do with your Trove license and the Trove software.",
};

export default function AcceptableUsePage() {
  return (
    <LegalLayout
      title="Acceptable Use Policy"
      updated="May 15, 2026"
      intro={
        <>
          This Acceptable Use Policy (&ldquo;AUP&rdquo;) describes what is and
          is not allowed when using Trove. It supplements our{" "}
          <a href="/terms" className="text-white hover:underline">
            Terms of Service
          </a>
          .
        </>
      }
    >
      <Section title="1. Permitted use">
        <ul className="list-disc pl-6 space-y-2">
          <li>Personal productivity on your own Mac;</li>
          <li>
            Ordinary commercial work performed by you or your small team, as
            part of your day-to-day workflow;
          </li>
          <li>
            Reasonable customization, scripting, and integration of Trove with
            other apps on your Mac.
          </li>
        </ul>
      </Section>

      <Section title="2. Prohibited use">
        <p>You may not:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Use a single Trove license on more than one user&rsquo;s primary
            Mac. A secondary personal device (e.g. your laptop alongside your
            desktop) is fine; sharing a license across multiple people is not;
          </li>
          <li>
            Resell, redistribute, or sublicense the Trove binary or generated
            license keys;
          </li>
          <li>
            Operate automated systems to generate, brute-force, or harvest
            license keys, or otherwise circumvent license verification;
          </li>
          <li>
            Use Trove to commit illegal acts, harass others, infringe
            intellectual property, or distribute malware;
          </li>
          <li>
            Use Trove or our services to interfere with, disrupt, or compromise
            the security of any system, network, or user.
          </li>
        </ul>
      </Section>

      <Section title="3. Reporting violations">
        <p>
          If you believe someone is violating this policy, please report it to{" "}
          <a
            href="mailto:support@trove.app"
            className="text-white hover:underline"
          >
            support@trove.app
          </a>
          . Security-sensitive reports should go to{" "}
          <a
            href="mailto:security@trove.app"
            className="text-white hover:underline"
          >
            security@trove.app
          </a>{" "}
          — see our{" "}
          <a href="/security" className="text-white hover:underline">
            Security
          </a>{" "}
          page.
        </p>
      </Section>

      <Section title="4. Enforcement">
        <p>
          We reserve the right to investigate suspected violations and, at our
          discretion, to suspend or terminate the licenses of users who
          violate this policy or our Terms. We will, where appropriate, give
          notice and an opportunity to remedy the issue before terminating.
        </p>
      </Section>
    </LegalLayout>
  );
}
