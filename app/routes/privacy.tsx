import type { MetaFunction } from "@remix-run/node";

import { Container } from "~/components/site/container";

export const meta: MetaFunction = () => [
  { title: "Privacy | Dr. Matilda A. Evans Educational Foundation" },
];

export default function PrivacyRoute() {
  return (
    <Container className="py-14 md:py-20">
      <div className="prose prose-neutral max-w-3xl">
        <h1>Privacy</h1>
        <p>
          <strong>Last updated:</strong> January 5, 2026
        </p>
        <p>
          This website is operated by the Dr. Matilda A. Evans Educational
          Foundation (the “Foundation”). This Privacy Notice explains what
          information we collect, how we use it, and the choices available to
          you.
        </p>

        <h2>Information we collect</h2>
        <p>
          We collect information you choose to provide when you contact us,
          including:
        </p>
        <ul>
          <li>Name</li>
          <li>Email address</li>
          <li>Category (e.g., volunteer, partner, inquiry)</li>
          <li>Subject and message contents</li>
        </ul>

        <h2>How we use information</h2>
        <p>We use the information you provide to:</p>
        <ul>
          <li>Respond to inquiries and requests</li>
          <li>Coordinate volunteer and partnership conversations</li>
          <li>Maintain internal records related to Foundation activities</li>
          <li>Protect our website and reduce spam/abuse</li>
        </ul>

        <h2>What we do not do</h2>
        <ul>
          <li>We do not sell your personal information.</li>
          <li>We do not use your contact form message for advertising.</li>
        </ul>

        <h2>Sharing</h2>
        <p>
          We may share information with service providers who help us operate
          the site and deliver email (for example, an email delivery provider).
          These providers are permitted to use information only to perform
          services for the Foundation.
        </p>

        <h2>Retention</h2>
        <p>
          We retain contact form submissions for as long as reasonably necessary
          to respond to you, maintain records related to Foundation activities,
          and meet legal or operational requirements.
        </p>

        <h2>Your choices</h2>
        <p>
          You may request that we update or delete your contact form submission
          information, subject to any legal obligations or legitimate record
          keeping needs.
        </p>

        <h2>Security</h2>
        <p>
          We take reasonable measures to protect information submitted through
          this site. No online service is 100% secure; please avoid sending
          sensitive information through the contact form.
        </p>

        <h2>Children’s privacy</h2>
        <p>
          This site is not directed to children under 13. If you believe a child
          has submitted personal information through our contact form, please
          contact us so we can address it.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about privacy can be sent via{" "}
          <a href="/contact">our contact page</a>.
        </p>
      </div>
    </Container>
  );
}




