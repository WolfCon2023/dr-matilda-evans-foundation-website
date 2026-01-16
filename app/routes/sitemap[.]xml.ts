import type { LoaderFunctionArgs } from "@remix-run/node";

import { getAllPages, getAllPosts } from "~/content/mdx";
import { absoluteUrl } from "~/seo";

const RESERVED = new Set(["home", "dr-evans-academy"]);
const ROUTE_FILES = new Set([
  "contact",
  "donate",
  "privacy",
  "cookies",
  "terms",
  "accessibility",
  "seminars",
  "licenses",
]);

export async function loader({ request }: LoaderFunctionArgs) {
  const origin = new URL(request.url).origin;

  const urls: Array<{ loc: string; lastmod?: string }> = [];

  urls.push({ loc: absoluteUrl(origin, "/") });
  urls.push({ loc: absoluteUrl(origin, "/dr-evans-academy") });

  for (const page of getAllPages()) {
    if (RESERVED.has(page.slug)) continue;
    if (ROUTE_FILES.has(page.slug)) continue;
    urls.push({
      loc: absoluteUrl(origin, `/${page.slug}`),
      lastmod: page.updated ?? page.date,
    });
  }

  for (const post of getAllPosts()) {
    urls.push({
      loc: absoluteUrl(origin, `/dr-evans-academy/${post.slug}`),
      lastmod: post.updated ?? post.date,
    });
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .sort((a, b) => a.loc.localeCompare(b.loc))
      .map((u) => {
        const lastmod = u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : "";
        return `  <url><loc>${u.loc}</loc>${lastmod}</url>`;
      })
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}




