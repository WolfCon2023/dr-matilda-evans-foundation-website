import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { Container } from "~/components/site/container";
import { getSite } from "~/seo";

export const meta: MetaFunction = () => [
  { title: "Donate | Dr. Matilda A. Evans Educational Foundation" },
  {
    name: "description",
    content:
      "Support the Dr. Matilda A. Evans Educational Foundation. Donate via Zelle or Cash App.",
  },
];

function ZelleBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#6D1ED4]/10 px-3 py-1 text-xs font-semibold text-[#6D1ED4]">
      <span
        aria-hidden
        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#6D1ED4] text-[11px] font-bold text-white"
      >
        Z
      </span>
      Zelle
    </span>
  );
}

function CashAppBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#00D632]/10 px-3 py-1 text-xs font-semibold text-[#00A82D]">
      <span
        aria-hidden
        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#00D632] text-[11px] font-bold text-black"
      >
        $
      </span>
      Cash App
    </span>
  );
}

export default function DonateRoute() {
  const site = getSite();
  const zelleEmail = site.zelleEmail?.trim() || "Matildaevansmd@yahoo.com";
  const cashAppId = site.cashAppId?.trim() || "$DMEEF";
  const cashAppHandle = cashAppId.replace(/^\$/, "");
  const cashAppUrl = `https://cash.app/$${cashAppHandle}`;

  return (
    <Container className="py-14 md:py-20">
      <div className="prose prose-neutral max-w-3xl">
        <h1>Donate</h1>
        <p>
          Thank you for supporting the Dr. Matilda A. Evans Educational
          Foundation. Donations help preserve public history and expand
          educational opportunity.
        </p>

        <h2>Donate options</h2>
        <div className="not-prose grid gap-6">
          <div className="rounded-xl border border-border/70 bg-muted/30 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm font-semibold">Zelle</div>
            <ZelleBadge />
          </div>
          <div className="mt-4 grid gap-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Send to (Zelle email)</span>
              <a className="font-medium text-foreground hover:underline" href={`mailto:${zelleEmail}`}>
                {zelleEmail}
              </a>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Memo</span>
              <span className="font-medium text-foreground">Donation</span>
            </div>
          </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-muted/30 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold">Cash App</div>
              <CashAppBadge />
            </div>
            <div className="mt-4 grid gap-2 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Cash App ID</span>
                <a className="font-medium text-foreground hover:underline" href={cashAppUrl} target="_blank" rel="noreferrer">
                  {cashAppId}
                </a>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Memo</span>
                <span className="font-medium text-foreground">Donation</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Please contact the Foundation for wire instructions for donations above $2000.
          </div>
        </div>

        <h2>How it works</h2>
        <ol>
          <li>Open Zelle or Cash App in your banking/app experience.</li>
          <li>Send your donation using one of the options above.</li>
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

