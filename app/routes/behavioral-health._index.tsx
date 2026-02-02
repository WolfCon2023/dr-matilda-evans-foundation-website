import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

import { Container } from "~/components/site/container";
import { getAllPosts } from "~/content/mdx";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const meta: MetaFunction = () => [
  {
    title:
      "Behavioral Health Within Our Communities | Dr. Matilda A. Evans Educational Foundation",
  },
  {
    name: "description",
    content:
      "Monthly reflections and resources exploring mindfulness, mental wellness, and community behavioral health.",
  },
];

export default function BehavioralHealthIndexRoute() {
  const posts = getAllPosts()
    .filter((p) => (p.section ?? "academy") === "behavioral-health")
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  return (
    <Container className="py-14 md:py-20">
      <div className="grid gap-10">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Explore
          </div>
          <h1 className="mt-2 font-serif text-3xl tracking-tight md:text-5xl">
            Behavioral Health Within Our Communities
          </h1>
          <p className="mt-4 text-muted-foreground">
            A monthly series exploring mindfulness, mental wellness, and the
            practices that help communities grow safer, healthier, and more
            compassionate.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((p) => (
            <Card key={p.slug} className="h-full">
              <CardHeader>
                <CardTitle>
                  <Link className="hover:underline" to={`/behavioral-health/${p.slug}`}>
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
          {posts.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              New articles will appear here each month.
            </div>
          ) : null}
        </div>
      </div>
    </Container>
  );
}

