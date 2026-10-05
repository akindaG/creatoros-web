import { LegalPage, LegalSection } from "@/components/legal-page";

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="CreatorOS AI Privacy Policy"
      updated="October 5, 2026"
    >
      <p>
        CreatorOS AI ("CreatorOS", "we", "us") is a social media management and growth-intelligence platform.
        This policy explains what information CreatorOS processes when you register, connect supported social
        accounts, create content, schedule posts, use AI features, or view analytics.
      </p>

      <LegalSection title="1. Information we collect">
        <p>
          We process account information you provide to CreatorOS, such as your name, email address, password
          credentials in hashed form, profile preferences, and workspace settings.
        </p>
        <p>
          We also process content you choose to store in CreatorOS, including captions, drafts, uploaded images
          or videos, scheduled publishing times, publishing results, and analytics used by the product.
        </p>
      </LegalSection>

      <LegalSection title="2. Facebook and Instagram information">
        <p>
          When you choose to connect Facebook or Instagram, CreatorOS uses Meta authorization flows to request
          only the permissions needed for supported features. Depending on the account and permissions approved,
          CreatorOS may receive identifiers, account or Page names, Instagram usernames, access tokens, Page
          credentials, permitted engagement or insight data, and publishing responses.
        </p>
        <p>
          CreatorOS supports automatic publishing to connected Facebook Pages and eligible Instagram professional
          accounts. Personal Facebook profile sharing remains a user-confirmed/manual workflow.
        </p>
      </LegalSection>

      <LegalSection title="3. How we use information">
        <p>
          We use information to authenticate users, connect social accounts, save drafts, upload media, publish or
          schedule content at the user's request, display analytics, recommend posting times, provide growth
          recommendations, and operate or secure the service.
        </p>
        <p>
          CreatorOS does not sell your personal information or social access tokens to advertisers.
        </p>
      </LegalSection>

      <LegalSection title="4. AI features">
        <p>
          When you use AI-assisted features, the text or content context you submit may be sent to the AI provider
          configured for CreatorOS so the requested caption, hashtag, analysis, or recommendation can be generated.
          Do not submit secrets or information you are not authorized to process.
        </p>
      </LegalSection>

      <LegalSection title="5. Storage and security">
        <p>
          CreatorOS uses cloud infrastructure for the web application, backend, database, and media storage.
          Social access tokens are encrypted before database storage. Passwords are stored as password hashes rather
          than plaintext. Authentication tokens may be stored in your browser to keep you signed in.
        </p>
        <p>
          No internet service can guarantee absolute security. We use reasonable technical safeguards appropriate
          to the current CreatorOS service and continue to improve them as the platform develops.
        </p>
      </LegalSection>

      <LegalSection title="6. Service providers and third-party platforms">
        <p>
          CreatorOS relies on service providers for application hosting, backend hosting, database and storage
          services, and AI processing. Facebook and Instagram are provided by Meta and remain subject to Meta's own
          terms, privacy policies, account requirements, and API restrictions.
        </p>
      </LegalSection>

      <LegalSection title="7. Retention and deletion">
        <p>
          We retain information while it is needed to provide CreatorOS and support your account. You can disconnect
          supported social accounts from the Social Accounts page. You can also request deletion of your CreatorOS
          account data by following the instructions on our Data Deletion page.
        </p>
      </LegalSection>

      <LegalSection title="8. Your choices">
        <p>
          You may choose not to connect a social account, disconnect a connected account, delete drafts, or stop
          using CreatorOS. Revoking permissions directly in Facebook or Instagram may also stop CreatorOS from
          accessing those platforms.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes to this policy">
        <p>
          We may update this policy when CreatorOS features, integrations, or data practices change. The "Last
          updated" date above identifies the current version.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>
          For privacy questions or data requests, contact{" "}
          <a className="text-violet-300 hover:text-violet-200" href="mailto:creators.help.ai@gmail.com">
            creators.help.ai@gmail.com
          </a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
