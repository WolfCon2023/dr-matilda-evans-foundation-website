import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

import { Container } from "~/components/site/container";
import { getAllPosts, getPageBySlug } from "~/content/mdx";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const meta: MetaFunction = () => [
  { title: "Dr. Evans Academy | Dr. Matilda A. Evans Educational Foundation" },
  {
    name: "description",
    content:
      "Stories, lessons, and educational resources from the Dr. Evans Academy.",
  },
];

export default function AcademyIndexRoute() {
  const academyPage = getPageBySlug("dr-evans-academy");
  const AcademyPage = academyPage?.Component;
  const posts = getAllPosts().sort((a, b) =>
    (b.date ?? "").localeCompare(a.date ?? "")
  );

  return (
    <Container className="py-14 md:py-20">
      <div className="grid gap-12">
        <div className="max-w-3xl">
          <h1 className="font-serif text-3xl tracking-tight md:text-5xl">
            Dr. Evans Academy
          </h1>
          {AcademyPage ? (
            <div className="prose prose-neutral mt-6 max-w-none prose-headings:font-serif prose-a:text-primary">
              <AcademyPage />
            </div>
          ) : (
            <p className="mt-4 text-muted-foreground">
              Articles and resources inspired by Dr. Evans’ legacy.
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((p) => (
            <Card key={p.slug} className="h-full">
              <CardHeader>
                <CardTitle>
                  <Link className="hover:underline" to={`/dr-evans-academy/${p.slug}`}>
                    {p.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {p.date ? <div className="mb-2">{p.date}</div> : null}
                <div>Read article →</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}


