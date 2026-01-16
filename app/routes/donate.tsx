import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { Container } from "~/components/site/container";

export const meta: MetaFunction = () => [
  { title: "Donate (Zelle) | Dr. Matilda A. Evans Educational Foundation" },
  {
    name: "description",
    content:
      "Support the Dr. Matilda A. Evans Educational Foundation. Donate via Zelle.",
  },
];

export default function DonateRoute() {
  return (
    <Container className="py-14 md:py-20">
      <div className="prose prose-neutral max-w-3xl">
        <h1>Donate</h1>
        <p>
          Thank you for supporting the Dr. Matilda A. Evans Educational
          Foundation. Donations help preserve public history and expand
          educational opportunity.
        </p>

        <h2>Donate via Zelle</h2>
        <div className="not-prose rounded-xl border border-border/70 bg-muted/30 p-5">
          <div className="text-sm font-semibold">Zelle recipient</div>
          <div className="mt-1 text-sm text-muted-foreground">
            We’ll post our Zelle recipient information here shortly.
          </div>
          <div className="mt-4 grid gap-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Send to</span>
              <span className="font-medium text-foreground">(Coming soon)</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Memo</span>
              <span className="font-medium text-foreground">Donation</span>
            </div>
          </div>
        </div>

        <h2>How it works</h2>
        <ol>
          <li>Open Zelle in your banking app.</li>
          <li>Send your donation to the recipient listed above.</li>
          <li>
            If you’d like a receipt or follow-up, include your email/phone in
            the memo or send us a message via{" "}
            <Link to="/contact">the contact form</Link>.
          </li>
        </ol>

        <h2>Need help?</h2>
        <p>
          If you have any questions about donating, please{" "}
          <Link to="/contact">contact the Foundation</Link>.
        </p>
      </div>
    </Container>
  );
}

