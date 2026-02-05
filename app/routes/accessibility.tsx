import type { MetaFunction } from "@remix-run/node";

import { Container } from "~/components/site/container";

export const meta: MetaFunction = () => [
  { title: "Accessibility | Dr. Matilda A. Evans Educational Foundation" },
];

export default function AccessibilityRoute() {
  return (
    <Container className="py-14 md:py-20">
      <div className="prose prose-neutral max-w-3xl">
        <h1>Accessibility</h1>
        <p>
          <strong>Last updated:</strong> January 5, 2026
        </p>
        <p>
          The Dr. Matilda A. Evans Educational Foundation is committed to
          providing a website that is accessible to the widest possible
          audience, regardless of technology or ability.
        </p>

        <h2>Standards and guidelines</h2>
        <p>
          We aim to conform to generally recognized accessibility best practices
          and standards, including:
        </p>
        <ul>
          <li>
            <strong>WCAG</strong> (Web Content Accessibility Guidelines) 2.1/2.2
            guidance, with a goal of meeting Level AA where practical
          </li>
          <li>
            The spirit of the <strong>Americans with Disabilities Act (ADA)</strong>
          </li>
        </ul>

        <h2>Accessibility features</h2>
        <p>This site is designed to support:</p>
        <ul>
          <li>Keyboard navigation</li>
          <li>Readable color contrast and scalable text</li>
          <li>Clear headings and semantic structure</li>
          <li>Alternative text for meaningful images where available</li>
        </ul>

        <h2>Ongoing improvements</h2>
        <p>
          Accessibility is an ongoing effort. We review and improve pages as we
          add new content and as standards evolve.
        </p>

        <h2>Feedback and assistance</h2>
        <p>
          If you encounter an accessibility barrier, need information in an
          alternative format, or have suggestions for improvement, please let us
          know. Include the page URL and a brief description of the issue.
        </p>
        <p>
          Contact us via <a href="/contact">our contact page</a>.
        </p>
      </div>
    </Container>
  );
}




