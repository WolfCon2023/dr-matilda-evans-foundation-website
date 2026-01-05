import { isRouteErrorResponse, useLoaderData, useMatches, useRouteError } from "@remix-run/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import { Container } from "~/components/site/container";
import { getPostBySlug } from "~/content/mdx";
import { articleJsonLd, getSite } from "~/seo";

export async function loader({
  params,
}: LoaderFunctionArgs): Promise<{
  slug: string;
  title: string;
  date?: string;
  updated?: string;
}> {
  const slug = params.slug ?? "";
  const notFound = (): never => {
    throw new Response("Not found", { status: 404 });
  };
  if (!slug) notFound();
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const p = post!;
  return { slug: p.slug, title: p.title, date: p.date, updated: p.updated };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.title ?? "Article";
  const site = getSite();
  return [
    { title: `${title} | Dr. Evans Academy` },
    { name: "description", content: site.description },
    { property: "og:type", content: "article" },
    { property: "og:title", content: title },
  ];
};

export default function AcademyPostRoute() {
  const data = useLoaderData<typeof loader>();
  const post = getPostBySlug(data.slug);
  if (!post) {
    throw new Response("Not found", { status: 404 });
  }
  const Post = post.Component;
  const matches = useMatches();
  const origin = String((matches.find((m) => m.id === "root")?.data as any)?.origin ?? "");
  const ld = origin
    ? articleJsonLd({
        origin,
        title: data.title,
        pathname: `/dr-evans-academy/${data.slug}`,
        datePublished: data.date,
        dateModified: data.updated,
      })
    : null;

  return (
    <Container className="py-14 md:py-20">
      <article className="prose prose-neutral max-w-3xl prose-headings:font-serif prose-a:text-primary">
        <div className="not-prose text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Dr. Evans Academy
        </div>
        <h1>{data.title}</h1>
        {data.date ? (
          <div className="not-prose mt-2 text-sm text-muted-foreground">
            {data.date}
          </div>
        ) : null}
        {ld ? (
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
          />
        ) : null}
        <Post />
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
          {error.status === 404 ? "Article not found" : "Something went wrong"}
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


