import type { Metadata } from "next";
import LegalLayout, { Section } from "@/components/legal/LegalLayout";
import { CONTACT, pageTitle } from "@/lib/brand";
import { ISSUES_URL, ISSUES_LABEL, releasePageURL } from "@/lib/releases";

export const metadata: Metadata = {
  title: pageTitle("Contact"),
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
          Trove is a tiny operation - we read every message, but please be
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
            href={CONTACT.support}
            className="text-white hover:underline"
          >
            {CONTACT.address}
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
            href={ISSUES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline"
          >
            {ISSUES_LABEL}
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
            href={CONTACT.security}
            className="text-white hover:underline"
          >
            {CONTACT.address}
          </a>
          .
        </p>
      </Section>

      {/* No Social section. It used to advertise "@trove_app (placeholder
          until the handle is live)", which is a page telling visitors, in
          writing, that it has not been finished. A channel that does not exist
          is not a contact method, and the two below are real. */}
      <Section title="Release announcements">
        <p>
          Every release is announced in two places you can subscribe to today:
          the{" "}
          <a href="/changelog" className="text-white hover:underline">
            changelog
          </a>{" "}
          (which has an{" "}
          <a href="/changelog/rss.xml" className="text-white hover:underline">
            RSS feed
          </a>
          ), and{" "}
          <a
            href={releasePageURL()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline"
          >
            GitHub Releases
          </a>
          , where the Watch button will email you. Trove also checks for
          updates itself, so you do not need either one to stay current.
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
