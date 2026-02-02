import { isRouteErrorResponse, useLoaderData, useMatches, useRouteError } from "@remix-run/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

import { Container } from "~/components/site/container";
import { getPostBySlug } from "~/content/mdx";
import { articleJsonLd, getSite } from "~/seo";
import { Volume2 } from "lucide-react";

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

  // Keep section boundaries clean.
  if ((post.section ?? "academy") !== "behavioral-health") {
    return Response.redirect(`/dr-evans-academy/${slug}`, 302) as any;
  }

  return { slug: post.slug, title: post.title, date: post.date, updated: post.updated };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.title ?? "Article";
  const site = getSite();
  return [
    { title: `${title} | Behavioral Health` },
    { name: "description", content: site.description },
    { property: "og:type", content: "article" },
    { property: "og:title", content: title },
  ];
};

export default function BehavioralHealthPostRoute() {
  const data = useLoaderData<typeof loader>();
  const post = getPostBySlug(data.slug);
  if (!post) {
    throw new Response("Not found", { status: 404 });
  }
  const Post = post.Component;
  const heroImage = post.heroImage;
  const audioSrc = post.audioSrc;
  const matches = useMatches();
  const origin = String((matches.find((m) => m.id === "root")?.data as any)?.origin ?? "");
  const ld = origin
    ? articleJsonLd({
        origin,
        title: data.title,
        pathname: `/behavioral-health/${data.slug}`,
        datePublished: data.date,
        dateModified: data.updated,
      })
    : null;

  return (
    <Container className="py-14 md:py-20">
      <article className="prose prose-neutral max-w-3xl prose-headings:font-serif prose-a:text-primary">
        <div className="not-prose text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Behavioral Health Within Our Communities
        </div>
        <h1>{data.title}</h1>
        {data.date ? (
          <div className="not-prose mt-2 text-sm text-muted-foreground">{data.date}</div>
        ) : null}
        {ld ? (
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
          />
        ) : null}
        {heroImage || audioSrc ? (
          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_280px] md:items-start">
            <div>
              <Post />
            </div>
            <aside className="not-prose">
              <div className="grid gap-4 md:sticky md:top-24">
                {heroImage ? (
                  <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
                    <img
                      src={heroImage}
                      alt={`${data.title} — image`}
                      className="h-auto w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ) : null}

                {audioSrc ? (
                  <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border/70 bg-background">
                        <Volume2 className="h-4 w-4" aria-hidden />
                      </span>
                      Audio recording
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Interview with Wauneta Lone Wolf (1997).
                    </div>
                    <audio
                      className="mt-3 w-full"
                      controls
                      preload="metadata"
                      controlsList="nodownload"
                    >
                      <source src={audioSrc} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ) : null}
              </div>
            </aside>
          </div>
        ) : (
          <Post />
        )}
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
      <h1 className="font-serif text-3xl tracking-tight md:text-5xl">Something went wrong</h1>
    </Container>
  );
}

