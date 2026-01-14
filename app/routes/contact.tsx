import { useFetcher, useSearchParams } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

import { Container } from "~/components/site/container";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { getSite } from "~/seo";

function toTelHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  if (!digits) return "";
  if (digits.startsWith("+")) return `tel:${digits}`;
  if (digits.length === 10) return `tel:+1${digits}`;
  return `tel:${digits}`;
}

export const meta: MetaFunction = () => [
  { title: "Contact | Dr. Matilda A. Evans Educational Foundation" },
  {
    name: "description",
    content:
      "Contact the Dr. Matilda A. Evans Educational Foundation. We welcome partnership inquiries, research requests, and community engagement.",
  },
];

export default function ContactRoute() {
  const fetcher = useFetcher<{ ok: boolean; message?: string }>();
  const isSubmitting = fetcher.state !== "idle";
  const [searchParams] = useSearchParams();
  const preselectedCategory = searchParams.get("category") ?? "";
  const site = getSite();
  const phone = site.telephone?.trim();
  const phoneHref = phone ? toTelHref(phone) : "";

  return (
    <Container className="py-14 md:py-20">
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl tracking-tight md:text-5xl">
          Contact
        </h1>
        <p className="mt-4 text-muted-foreground">
          Send a note to the Foundation. We typically respond within a few
          business days.
        </p>
        {phone && phoneHref ? (
          <div className="mt-6 grid gap-2">
            <div className="text-sm font-medium">Contact number</div>
            <div className="rounded-lg border border-border/70 bg-muted/30 px-4 py-3 text-sm">
              <a className="font-medium text-foreground hover:underline" href={phoneHref}>
                {phone}
              </a>
            </div>
          </div>
        ) : null}

        <fetcher.Form method="post" action="/api/contact" className="mt-10 grid gap-5">
          {/* honeypot */}
          <div className="hidden">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="name">
              Name
            </label>
            <Input id="name" name="name" required />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input id="email" name="email" type="email" required />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="category">
              Category
            </label>
            <Select
              id="category"
              name="category"
              required
              defaultValue={preselectedCategory}
            >
              <option value="" disabled>
                Select a category…
              </option>
              <option value="volunteer">Volunteer</option>
              <option value="partner">Partner</option>
              <option value="donate">Donation</option>
              <option value="inquiry">General inquiry</option>
            </Select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="subject">
              Subject
            </label>
            <Input id="subject" name="subject" />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="message">
              Message
            </label>
            <Textarea id="message" name="message" required />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send message"}
            </Button>
            {fetcher.data?.message ? (
              <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
                {fetcher.data.message}
              </p>
            ) : null}
          </div>
        </fetcher.Form>
      </div>
    </Container>
  );
}



