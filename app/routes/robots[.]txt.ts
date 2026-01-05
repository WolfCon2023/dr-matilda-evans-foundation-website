import type { LoaderFunctionArgs } from "@remix-run/node";

import { absoluteUrl } from "~/seo";

export async function loader({ request }: LoaderFunctionArgs) {
  const origin = new URL(request.url).origin;
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl(
    origin,
    "/sitemap.xml"
  )}\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}




