import { z } from "zod";

type Env = {
  RESEND_API_KEY?: string;
  MAILGUN_API_KEY?: string;
  MAILGUN_DOMAIN?: string;

  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
};

function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(data), { ...init, headers });
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const ContactSchema = z.object({
  website: z.string().optional(),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  category: z.enum(["volunteer", "partner", "inquiry"]),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(5000),
});

async function rateLimit(request: Request, seconds: number) {
  const ip =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "unknown";

  const cache: Cache = ((caches as unknown as { default?: Cache }).default ??
    caches) as unknown as Cache;

  const key = new Request(`https://rate.limit/contact/${ip}`);
  const cached = await cache.match(key);
  if (cached) return { allowed: false as const, ip };

  await cache.put(
    key,
    new Response("1", {
      headers: { "Cache-Control": `max-age=${seconds}` },
    })
  );
  return { allowed: true as const, ip };
}

async function sendWithResend(env: Env, args: { subject: string; html: string; replyTo: string }) {
  if (!env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");
  if (!env.CONTACT_TO_EMAIL) throw new Error("CONTACT_TO_EMAIL is not set");
  if (!env.CONTACT_FROM_EMAIL) throw new Error("CONTACT_FROM_EMAIL is not set");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: env.CONTACT_TO_EMAIL,
      subject: args.subject,
      html: args.html,
      reply_to: args.replyTo,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Resend error (${res.status}): ${text}`);
  }
}

async function sendWithMailgun(env: Env, args: { subject: string; text: string; replyTo: string }) {
  if (!env.MAILGUN_API_KEY) throw new Error("MAILGUN_API_KEY is not set");
  if (!env.MAILGUN_DOMAIN) throw new Error("MAILGUN_DOMAIN is not set");
  if (!env.CONTACT_TO_EMAIL) throw new Error("CONTACT_TO_EMAIL is not set");
  if (!env.CONTACT_FROM_EMAIL) throw new Error("CONTACT_FROM_EMAIL is not set");

  const url = `https://api.mailgun.net/v3/${env.MAILGUN_DOMAIN}/messages`;
  const form = new URLSearchParams();
  form.set("from", env.CONTACT_FROM_EMAIL);
  form.set("to", env.CONTACT_TO_EMAIL);
  form.set("subject", args.subject);
  form.set("text", args.text);
  form.set("h:Reply-To", args.replyTo);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`api:${env.MAILGUN_API_KEY}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Mailgun error (${res.status}): ${text}`);
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const limited = await rateLimit(request, 30);
  if (!limited.allowed) {
    return json(
      { ok: false, message: "Please wait a moment and try again." },
      { status: 429 }
    );
  }

  const form = await request.formData();
  const parsed = ContactSchema.safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) {
    return json(
      { ok: false, message: "Please check the form and try again." },
      { status: 400 }
    );
  }

  const { website, name, email, category, subject, message } = parsed.data;

  // Honeypot: pretend success to bots.
  if (website && website.trim().length > 0) {
    return json({ ok: true, message: "Thanks — we’ll be in touch soon." });
  }

  const categoryLabel =
    category === "volunteer"
      ? "Volunteer"
      : category === "partner"
        ? "Partner"
        : "General inquiry";

  const cleanSubject = subject?.trim()
    ? `Contact (${categoryLabel}): ${subject.trim()}`
    : `Contact (${categoryLabel})`;

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.5">
      <h2>New message from the website contact form</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Category:</strong> ${escapeHtml(categoryLabel)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject?.trim() || "(none)")}</p>
      <hr />
      <pre style="white-space: pre-wrap">${escapeHtml(message)}</pre>
    </div>
  `.trim();

  const text = `New contact form submission

Name: ${name}
Email: ${email}
Category: ${categoryLabel}
Subject: ${subject?.trim() || "(none)"}

Message:
${message}
`;

  try {
    if (env.RESEND_API_KEY) {
      await sendWithResend(env, { subject: cleanSubject, html, replyTo: email });
    } else if (env.MAILGUN_API_KEY) {
      await sendWithMailgun(env, { subject: cleanSubject, text, replyTo: email });
    } else {
      throw new Error("No email provider configured (RESEND_API_KEY or MAILGUN_API_KEY).");
    }
  } catch (err) {
    console.error(err);
    return json(
      {
        ok: false,
        message:
          "We couldn’t send your message right now. Please try again later.",
      },
      { status: 500 }
    );
  }

  return json({ ok: true, message: "Thanks — we’ll be in touch soon." });
};

export const onRequestGet: PagesFunction<Env> = async () => {
  return json({ ok: false, message: "Method not allowed" }, { status: 405 });
};


