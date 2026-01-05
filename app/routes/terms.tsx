import type { MetaFunction } from "@remix-run/node";

import { Container } from "~/components/site/container";

export const meta: MetaFunction = () => [
  { title: "Terms | Dr. Matilda A. Evans Educational Foundation" },
];

export default function TermsRoute() {
  return (
    <Container className="py-14 md:py-20">
      <div className="prose prose-neutral max-w-3xl">
        <h1>Terms</h1>
        <p>
          <strong>Last updated:</strong> January 5, 2026
        </p>
        <p>
          This website is provided by the Dr. Matilda A. Evans Educational
          Foundation (the “Foundation”) for informational purposes. By using
          this site, you agree to use it lawfully and respectfully.
        </p>

        <h2>Acceptable use</h2>
        <ul>
          <li>Do not attempt to disrupt or compromise the site.</li>
          <li>Do not submit false or harmful information through our forms.</li>
          <li>Do not use the site for unlawful purposes.</li>
        </ul>

        <h2>Content</h2>
        <p>
          Content may be updated over time. Please contact us if you believe any
          information should be corrected.
        </p>
        <h2>Intellectual property</h2>
        <p>
          Unless otherwise noted, website text and design are owned by the
          Foundation. Some images, documents, and historical materials may be
          owned by third parties or may be used with permission. Please contact
          us if you have questions about reuse.
        </p>
        <h2>External links</h2>
        <p>
          This site may link to third-party websites. We are not responsible for
          the content or practices of those sites.
        </p>
        <h2>Disclaimers</h2>
        <p>
          This site is provided “as is” without warranties of any kind. The
          Foundation does not guarantee the site will be uninterrupted or
          error-free.
        </p>
        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, the Foundation is not liable
          for damages arising from your use of this site.
        </p>
        <h2>Changes</h2>
        <p>
          We may update these Terms from time to time. The “Last updated” date
          above reflects the most recent changes.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent via <a href="/contact">our contact page</a>.
        </p>
      </div>
    </Container>
  );
}


