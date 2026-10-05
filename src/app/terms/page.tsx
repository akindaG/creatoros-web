import { LegalPage, LegalSection } from "@/components/legal-page";

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="CreatorOS AI Terms of Service"
      updated="October 5, 2026"
    >
      <p>
        These terms govern your use of CreatorOS AI. By creating an account or using the service, you agree to use
        CreatorOS responsibly and only for accounts, content, and data you are authorized to manage.
      </p>

      <LegalSection title="1. CreatorOS service">
        <p>
          CreatorOS provides tools for social account connection, content management, AI-assisted content workflows,
          scheduling, publishing, analytics, and growth recommendations. Features may change as the service develops.
        </p>
      </LegalSection>

      <LegalSection title="2. Your account">
        <p>
          You are responsible for keeping your CreatorOS login credentials secure and for activity performed through
          your account. Information you provide must be accurate enough for CreatorOS to operate the requested
          features and support your account.
        </p>
      </LegalSection>

      <LegalSection title="3. Social account authorization">
        <p>
          You may connect only Facebook Pages, Instagram accounts, or other supported accounts that you are authorized
          to manage. You are responsible for complying with Meta’s terms, policies, account requirements, and content
          rules while using CreatorOS.
        </p>
      </LegalSection>

      <LegalSection title="4. Your content">
        <p>
          You retain responsibility for content you upload, draft, publish, or schedule through CreatorOS. You must
          have the rights needed to use that content. CreatorOS does not claim ownership of your original content
          merely because it is stored or processed to provide the service.
        </p>
      </LegalSection>

      <LegalSection title="5. AI-assisted output">
        <p>
          AI-generated captions, hashtags, analyses, or recommendations are assistance tools. You are responsible for
          reviewing output before using or publishing it. CreatorOS does not guarantee that AI output is accurate,
          complete, unique, or suitable for every purpose.
        </p>
      </LegalSection>

      <LegalSection title="6. Acceptable use">
        <p>
          Do not use CreatorOS to violate law, infringe third-party rights, bypass platform restrictions, distribute
          malware, gain unauthorized access, abuse social APIs, or publish content through accounts you do not control.
        </p>
      </LegalSection>

      <LegalSection title="7. Scheduling and third-party availability">
        <p>
          CreatorOS attempts to publish scheduled content at the time requested by the user, but external platform
          APIs, network conditions, token expiry, platform review status, rate limits, and service outages can affect
          the exact delivery time or cause a publish attempt to fail.
        </p>
      </LegalSection>

      <LegalSection title="8. Third-party services">
        <p>
          Facebook, Instagram, hosting providers, database providers, storage providers, and AI providers are
          third-party services. Their own terms and policies apply, and CreatorOS cannot guarantee the continued
          availability or behavior of an external API.
        </p>
      </LegalSection>

      <LegalSection title="9. Suspension or termination">
        <p>
          Access may be restricted when reasonably necessary to protect the service, other users, or third-party
          platforms, or when these terms are materially violated. You may stop using CreatorOS and request account
          data deletion at any time.
        </p>
      </LegalSection>

      <LegalSection title="10. Service availability">
        <p>
          CreatorOS is provided on an as-available basis. We work to keep the service reliable, but do not promise
          uninterrupted availability or that every external publishing operation will succeed.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact">
        <p>
          Questions about these terms can be sent to{" "}
          <a className="text-violet-300 hover:text-violet-200" href="mailto:creators.help.ai@gmail.com">
            creators.help.ai@gmail.com
          </a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
