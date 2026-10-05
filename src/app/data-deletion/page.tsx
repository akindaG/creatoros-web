import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/legal-page";

export default function DataDeletionPage() {
  return (
    <LegalPage
      eyebrow="Data controls"
      title="CreatorOS AI Data Deletion Instructions"
      updated="October 5, 2026"
    >
      <p>
        You can disconnect social accounts at any time, and you can request deletion of the personal data associated
        with your CreatorOS account.
      </p>

      <LegalSection title="Disconnect Facebook or Instagram">
        <p>
          Sign in to CreatorOS, open <strong className="text-white">Social Accounts</strong>, find the connected
          Facebook or Instagram account, and choose <strong className="text-white">Disconnect</strong>. This removes
          the stored CreatorOS connection for that platform and prevents future CreatorOS publishing with that
          connection.
        </p>
        <p>
          You may also revoke CreatorOS permissions from your Facebook or Instagram account settings. Revoking a
          permission at Meta can invalidate the related access token even if CreatorOS still shows historical account
          information.
        </p>
      </LegalSection>

      <LegalSection title="Request deletion of your CreatorOS account data">
        <p>
          Send an email from the email address associated with your CreatorOS account to{" "}
          <a className="text-violet-300 hover:text-violet-200" href="mailto:creators.help.ai@gmail.com">
            creators.help.ai@gmail.com
          </a>{" "}
          with the subject <strong className="text-white">CreatorOS Data Deletion Request</strong>.
        </p>
        <p>
          Include the CreatorOS account email you want deleted and, if useful for identification, the names of
          connected Facebook Pages or Instagram professional accounts. Do not send passwords, access tokens, API
          secrets, or other sensitive credentials by email.
        </p>
      </LegalSection>

      <LegalSection title="What the deletion request covers">
        <p>
          A verified deletion request may include removal of your CreatorOS profile information, saved drafts,
          scheduled content, stored media associated with your account, stored social connection credentials, and
          CreatorOS analytics records that are linked to your user account.
        </p>
        <p>
          Limited technical records may be retained where reasonably necessary for security, fraud prevention,
          debugging, backup integrity, or legal obligations, and then removed according to the applicable retention
          process.
        </p>
      </LegalSection>

      <LegalSection title="Confirmation">
        <p>
          We may ask you to verify ownership of the CreatorOS account before processing a deletion request. After the
          request is verified and processed, we will respond to the requesting email address.
        </p>
      </LegalSection>

      <LegalSection title="More information">
        <p>
          See the <Link href="/privacy" className="text-violet-300 hover:text-violet-200">Privacy Policy</Link> for
          more information about the data CreatorOS processes and how it is used.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
