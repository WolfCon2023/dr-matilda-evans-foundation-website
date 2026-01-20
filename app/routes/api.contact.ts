import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { z } from "zod";

import site from "../../content/data/site.json";

type Env = {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
};

const DEFAULT_CONTACT_TO_EMAIL =
  (site as { email?: string }).email?.trim() || "Matildaevansmd@yahoo.com";

const ContactSchema = z.object({
  website: z.string().optional(),
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.string().trim().email().max(200),
  category: z.enum(["volunteer", "partner", "donate", "seminars", "speaking", "inquiry"]),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(5000),
});

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getEnv(context: unknown): Env {
  const cfEnv = (context as any)?.cloudflare?.env as Env | undefined;
  if (cfEnv) return cfEnv;
  // Local dev fallback
  return process.env as unknown as Env;
}

async function rateLimit(request: Request, seconds: number) {
  const ip =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "unknown";

  const anyCaches = globalThis as any;
  const cache: Cache | undefined = anyCaches?.caches?.default ?? anyCaches?.caches;
  if (!cache?.match || !cache?.put) return { allowed: true as const, ip };

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

async function sendWithResend(env: Env, args: { to: string; subject: string; html: string; replyTo: string }) {
  if (!env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");
  if (!env.CONTACT_FROM_EMAIL) throw new Error("CONTACT_FROM_EMAIL is not set");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: args.to,
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

export async function loader() {
  return json({ ok: false, message: "Method not allowed" }, { status: 405 });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const limited = await rateLimit(request, 30);
  if (!limited.allowed) {
    return json({ ok: false, message: "Please wait a moment and try again." }, { status: 429 });
  }

  const form = await request.formData();
  const parsed = ContactSchema.safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) {
    return json({ ok: false, message: "Please check the form and try again." }, { status: 400 });
  }

  const env = getEnv(context);
  const { website, name, phone, email, category, subject, message } = parsed.data;

  // Honeypot: pretend success to bots.
  if (website && website.trim().length > 0) {
    return json({ ok: true, message: "Thanks — we’ll be in touch soon." });
  }

  const categoryLabel =
    category === "volunteer"
      ? "Volunteer"
      : category === "partner"
        ? "Partner"
        : category === "donate"
          ? "Donation"
          : category === "seminars"
            ? "Seminars"
          : category === "speaking"
            ? "Speaking engagement"
            : "General inquiry";

  const cleanSubject = subject?.trim()
    ? `Contact (${categoryLabel}): ${subject.trim()}`
    : `Contact (${categoryLabel})`;

  const phoneLabel = phone?.trim() || "(none)";
  const toEmail = env.CONTACT_TO_EMAIL?.trim() || DEFAULT_CONTACT_TO_EMAIL;

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.5">
      <h2>New message from the website contact form</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phoneLabel)}</p>
      <p><strong>Category:</strong> ${escapeHtml(categoryLabel)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject?.trim() || "(none)")}</p>
      <hr />
      <pre style="white-space: pre-wrap">${escapeHtml(message)}</pre>
    </div>
  `.trim();

  try {
    await sendWithResend(env, { to: toEmail, subject: cleanSubject, html, replyTo: email });
  } catch (err) {
    console.error(err);
    return json(
      { ok: false, message: "We couldn’t send your message right now. Please try again later." },
      { status: 500 }
    );
  }

  return json({ ok: true, message: "Thanks — we’ll be in touch soon." });
}

