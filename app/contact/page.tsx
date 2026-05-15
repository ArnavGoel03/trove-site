import type { Metadata } from "next";
import LegalLayout, { Section } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Contact — Trove",
  description:
    "Get in touch with the Trove team. Support, bug reports, and security disclosures.",
};

export default function ContactPage() {
  return (
    <LegalLayout
      title="Contact"
      updated="May 15, 2026"
      intro={
        <>
          Trove is a tiny operation — we read every message, but please be
          patient. Responses typically arrive within{" "}
          <span className="text-white">2 business days</span>.
        </>
      }
    >
      <Section title="General support">
        <p>
          Questions about your license, billing, or how to do something in the
          app:
        </p>
        <p>
          <a
            href="mailto:support@trove.app"
            className="text-white hover:underline"
          >
            support@trove.app
          </a>
        </p>
      </Section>

      <Section title="Bug reports">
        <p>
          Bugs, crashes, and feature requests are tracked publicly on GitHub.
          Please include your macOS version, Trove version, and steps to
          reproduce.
        </p>
        <p>
          <a
            href="https://github.com/ArnavGoel03/trove/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline"
          >
            github.com/ArnavGoel03/trove/issues
          </a>
        </p>
      </Section>

      <Section title="Security disclosures">
        <p>
          Please use the responsible-disclosure process described on our{" "}
          <a href="/security" className="text-white hover:underline">
            Security
          </a>{" "}
          page. The dedicated address is{" "}
          <a
            href="mailto:security@trove.app"
            className="text-white hover:underline"
          >
            security@trove.app
          </a>
          .
        </p>
      </Section>

      <Section title="Social">
        <p>
          We post release notes and occasional updates on X / Twitter:{" "}
          <span className="text-white">@trove_app</span> (placeholder until
          the handle is live).
        </p>
      </Section>

      <Section title="A note on response times">
        <p>
          Trove is built and supported by a very small team. We&rsquo;d rather
          spend our time fixing your bug than copy-pasting templated replies,
          so please bear with us if a response takes a couple of days. We
          read everything.
        </p>
      </Section>
    </LegalLayout>
  );
}
