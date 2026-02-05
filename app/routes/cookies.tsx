import type { MetaFunction } from "@remix-run/node";

import { Container } from "~/components/site/container";

export const meta: MetaFunction = () => [
  { title: "Cookies | Dr. Matilda A. Evans Educational Foundation" },
];

export default function CookiesRoute() {
  return (
    <Container className="py-14 md:py-20">
      <div className="prose prose-neutral max-w-3xl">
        <h1>Cookies</h1>
        <p>
          <strong>Last updated:</strong> January 5, 2026
        </p>
        <p>
          We aim to keep this site simple and privacy-respecting. This page
          explains how cookies and similar technologies may be used.
        </p>
        <h2>What are cookies?</h2>
        <p>
          Cookies are small text files stored on your device. They can help a
          website remember preferences and support essential features.
        </p>
        <h2>Types of cookies</h2>
        <ul>
          <li>
            <strong>Essential cookies</strong>: required for basic site
            functionality and security.
          </li>
          <li>
            <strong>Preference cookies</strong>: remember choices (for example,
            language) when available.
          </li>
          <li>
            <strong>Analytics cookies</strong>: help understand site usage. If
            we add analytics in the future, we will update this page.
          </li>
        </ul>

        <h2>How this site uses cookies</h2>
        <p>
          We may use essential cookies and similar mechanisms to support site
          functionality, reduce spam/abuse, and keep the site reliable.
        </p>

        <h2>Contact form</h2>
        <p>
          When you submit the contact form, we process the information you
          provide to respond to your message. We do not sell personal
          information.
        </p>
        <h2>Your choices</h2>
        <p>
          You can control cookies through your browser settings. Note that
          disabling cookies may impact certain functionality.
        </p>
        <h2>Questions</h2>
        <p>
          If you have questions about cookies on this site, please reach out via{" "}
          <a href="/contact">our contact page</a>.
        </p>
      </div>
    </Container>
  );
}


