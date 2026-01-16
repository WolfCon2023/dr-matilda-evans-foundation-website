import site from "../content/data/site.json";

export function getSite() {
  return site as {
    name: string;
    legalName?: string;
    description: string;
    defaultOgImagePath: string;
    email?: string;
    telephone?: string;
    zelleEmail?: string;
    address?: {
      streetAddress?: string;
      addressLocality?: string;
      addressRegion?: string;
      postalCode?: string;
      addressCountry?: string;
    };
    sameAs?: string[];
  };
}

export function absoluteUrl(origin: string, pathname: string) {
  const base = origin.replace(/\/$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

export function organizationJsonLd(origin: string) {
  const s = getSite();
  const url = absoluteUrl(origin, "/");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: s.name,
    legalName: s.legalName || s.name,
    url,
    description: s.description,
    sameAs: s.sameAs ?? [],
    contactPoint:
      s.email || s.telephone
        ? [
            {
              "@type": "ContactPoint",
              contactType: "customer support",
              email: s.email || undefined,
              telephone: s.telephone || undefined,
            },
          ]
        : undefined,
    address: s.address
      ? {
          "@type": "PostalAddress",
          streetAddress: s.address.streetAddress || undefined,
          addressLocality: s.address.addressLocality || undefined,
          addressRegion: s.address.addressRegion || undefined,
          postalCode: s.address.postalCode || undefined,
          addressCountry: s.address.addressCountry || undefined,
        }
      : undefined,
  };
}

export function articleJsonLd(args: {
  origin: string;
  title: string;
  pathname: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const s = getSite();
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    mainEntityOfPage: absoluteUrl(args.origin, args.pathname),
    datePublished: args.datePublished,
    dateModified: args.dateModified,
    author: { "@type": "Organization", name: s.name },
    publisher: { "@type": "Organization", name: s.name },
  };
}




