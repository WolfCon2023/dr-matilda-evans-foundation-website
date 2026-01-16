import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import "./tailwind.css";

import "@fontsource-variable/inter";
import "@fontsource-variable/newsreader";

import { SiteFooter } from "~/components/site/site-footer";
import { SiteHeader } from "~/components/site/site-header";
import { SkipLink } from "~/components/site/skip-link";
import { CookieConsentBanner } from "~/components/site/cookie-consent";
import { absoluteUrl, getSite, organizationJsonLd } from "~/seo";

export const links: LinksFunction = () => [
  { rel: "preload", as: "image", href: "/logo.png", type: "image/png" },
];

export const meta: MetaFunction<typeof loader> = () => {
  const site = getSite();
  return [
    { title: site.name },
    { name: "description", content: site.description },
    { name: "theme-color", content: "#123B74" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie") ?? "";
  const m = /(?:^|;\s*)cookie_consent=(accept|decline)(?:;|$)/.exec(cookieHeader);
  const cookieConsent = (m?.[1] as "accept" | "decline" | undefined) ?? null;
  return { origin: url.origin, cookieConsent };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");
  const origin = data?.origin ?? "";
  const cookieConsent = data?.cookieConsent ?? null;
  const location = useLocation();
  const canonical = absoluteUrl(origin, location.pathname);
  const site = getSite();
  const org = organizationJsonLd(origin);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <link rel="canonical" href={canonical} />
        <meta property="og:site_name" content={site.name} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta
          property="og:image"
          content={absoluteUrl(origin, site.defaultOgImagePath)}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content={absoluteUrl(origin, site.defaultOgImagePath)}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
        />
      </head>
      <body>
        <SkipLink />
        <div className="min-h-dvh">
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </div>
        <CookieConsentBanner initialConsent={cookieConsent} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
