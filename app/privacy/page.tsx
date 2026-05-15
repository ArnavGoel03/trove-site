import type { Metadata } from "next";
import LegalLayout, { Section } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — Trove",
  description:
    "Trove is local-only. We collect nothing in the app. This page explains exactly what data, if any, leaves your Mac.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="May 15, 2026"
      intro={
        <>
          Trove is a local-first macOS app. The short version: the app itself
          does not collect, transmit, or store any personal data on our servers.
          The longer version is below.
        </>
      }
    >
      <Section title="1. Who we are">
        <p>
          Trove (&ldquo;Trove,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) is an
          independently developed macOS productivity app. This Privacy Policy
          covers both the Trove desktop app and the marketing website at{" "}
          <span className="text-white">gettrove.vercel.app</span>.
        </p>
      </Section>

      <Section title="2. What the Trove app collects">
        <p>
          <span className="text-white">Nothing.</span> Trove is local-only by
          design. The app runs entirely on your Mac and does not send your
          clipboard history, screenshots, file metadata, captures, notes, or
          any other usage data to us or to any third party.
        </p>
        <p>
          The only network activity originating from Trove is initiated by you
          — for example, checking for an update from the official release
          channel, or using an opt-in pane that explicitly requires the network
          (such as a translation pane). These features are clearly labeled in
          the app.
        </p>
      </Section>

      <Section title="3. What the website collects">
        <p>
          The marketing website is hosted on Vercel. Vercel records standard
          request logs (IP address, user agent, request path, timestamp) for
          security, abuse prevention, and basic aggregate analytics. We do not
          set any first-party cookies, and we do not embed third-party
          advertising or tracking pixels.
        </p>
        <p>
          We do not use Google Analytics, Meta Pixel, or any similar
          surveillance tooling.
        </p>
      </Section>

      <Section title="4. Where your data is stored">
        <p>
          <span className="text-white">In the app:</span> All Trove data —
          clipboard history, pane settings, snippets, notes, captures — lives
          on your Mac at{" "}
          <code className="text-white/90 bg-white/[0.04] px-1.5 py-0.5 rounded">
            ~/Library/Application Support/Trove/
          </code>
          . License keys are stored in the macOS Keychain.
        </p>
        <p>
          <span className="text-white">On the website:</span> Request logs are
          held within Vercel&rsquo;s edge infrastructure under Vercel&rsquo;s
          standard retention.
        </p>
      </Section>

      <Section title="5. Data retention">
        <p>
          App data is retained indefinitely on your Mac until you delete it.
          You can delete all Trove data at any time by quitting the app and
          removing the{" "}
          <code className="text-white/90 bg-white/[0.04] px-1.5 py-0.5 rounded">
            ~/Library/Application Support/Trove/
          </code>{" "}
          folder, along with the Trove entries in Keychain.
        </p>
      </Section>

      <Section title="6. Third parties">
        <p>
          The Trove app does not share data with third parties because it does
          not transmit data in the first place. For website hosting we use
          Vercel, and downloads / release notes may be served from GitHub. Both
          providers have their own privacy practices, which apply when you
          interact with their infrastructure.
        </p>
      </Section>

      <Section title="7. Your rights">
        <p>
          Because the app stores everything locally, you exercise your data
          rights directly: you can export, edit, or delete your data by
          managing the files on your own Mac. There is no account to close and
          nothing to request from us.
        </p>
        <p>
          <span className="text-white">EU / EEA / UK users:</span> You have
          additional rights under the GDPR / UK GDPR, including access,
          rectification, erasure, and the right to lodge a complaint with your
          local data protection authority. Because we hold no personal data
          server-side, most of these rights are satisfied by your local
          control of the app.
        </p>
      </Section>

      <Section title="8. Children">
        <p>
          Trove is not directed at children under 13, and we do not knowingly
          collect personal information from children under 13. If you believe a
          child has provided us information, contact us and we will address it
          promptly.
        </p>
      </Section>

      <Section title="9. Changes to this policy">
        <p>
          We may update this policy occasionally — for example, when adding a
          new opt-in network feature, or to clarify wording. Material changes
          will be noted by updating the &ldquo;Last updated&rdquo; date at the
          top of this page.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          Questions about this policy? Email{" "}
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
