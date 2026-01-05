import { isRouteErrorResponse, useLoaderData, useRouteError } from "@remix-run/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import { Container } from "~/components/site/container";
import { getPageBySlug } from "~/content/mdx";

const RESERVED = new Set([
  "dr-evans-academy",
  "contact",
  "privacy",
  "cookies",
  "terms",
  "accessibility",
  "licenses",
  "sitemap.xml",
  "robots.txt",
]);

export async function loader({ params }: LoaderFunctionArgs): Promise<{
  slug: string;
  title: string;
  date?: string;
  updated?: string;
}> {
  const slug = params.slug ?? "";
  const notFound = (): never => {
    throw new Response("Not found", { status: 404 });
  };
  if (!slug || RESERVED.has(slug)) {
    notFound();
  }
  if (slug === "home") {
    notFound();
  }
  const page = getPageBySlug(slug);
  if (!page) notFound();
  const p = page!;
  return { slug: p.slug, title: p.title, date: p.date, updated: p.updated };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.title ?? "Page";
  return [{ title: `${title} | Dr. Matilda A. Evans Educational Foundation` }];
};

export default function PageRoute() {
  const data = useLoaderData<typeof loader>();
  const page = getPageBySlug(data.slug);
  if (!page) {
    // Shouldn't happen because the loader guards, but keeps the component safe.
    throw new Response("Not found", { status: 404 });
  }
  const Page = page.Component;

  return (
    <Container className="py-14 md:py-20">
      <article className="prose prose-neutral max-w-3xl prose-headings:font-serif prose-a:text-primary">
        <h1>{data.title}</h1>
        <Page />
      </article>
    </Container>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <Container className="py-14 md:py-20">
        <h1 className="font-serif text-3xl tracking-tight md:text-5xl">
          {error.status === 404 ? "Page not found" : "Something went wrong"}
        </h1>
      </Container>
    );
  }
  return (
    <Container className="py-14 md:py-20">
      <h1 className="font-serif text-3xl tracking-tight md:text-5xl">
        Something went wrong
      </h1>
    </Container>
  );
}


