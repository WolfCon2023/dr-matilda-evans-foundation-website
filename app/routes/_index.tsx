import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Handshake,
  MapPinned,
  Newspaper,
  Images,
  Users,
} from "lucide-react";
import type { MetaFunction } from "@remix-run/node";

import homepage from "../../content/homepage.json";
import { Container } from "~/components/site/container";
import { Reveal } from "~/components/site/reveal";
import { SmartImage } from "~/components/site/smart-image";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const meta: MetaFunction = () => [
  { title: "Dr. Matilda A. Evans Educational Foundation" },
  {
    name: "description",
    content:
      "Preserving the legacy of Dr. Matilda A. Evans and expanding educational opportunity through programs, partnerships, and public history.",
  },
];

export default function Index() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_500px_at_15%_10%,hsl(var(--accent))_0%,transparent_55%),radial-gradient(900px_500px_at_85%_10%,rgba(18,59,116,0.18)_0%,transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-b from-transparent to-background" />
        <Container className="py-12 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="md:col-span-7"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Newspaper className="h-4 w-4" />
                {homepage.hero.kicker}
              </div>
              <h1 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight md:text-6xl">
                {homepage.hero.headline}
              </h1>
              <p className="mt-5 max-w-prose text-lg text-muted-foreground md:text-xl">
                {homepage.hero.subhead}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg">
                  <Link to={homepage.hero.primaryCta.href}>
                    {homepage.hero.primaryCta.label}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to={homepage.hero.secondaryCta.href}>
                    {homepage.hero.secondaryCta.label}
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
              className="md:col-span-5"
            >
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/40" />

                <div className="grid md:grid-rows-[auto_1fr]">
                  <div className="p-5">
                    <div className="rounded-2xl border border-border/60 bg-background/80 p-4 backdrop-blur">
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Featured
                      </div>
                      <div className="mt-1 font-serif text-lg font-semibold leading-tight">
                        {homepage.featuredStory.title}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5">
                    <div className="grid gap-4 rounded-2xl border border-border/60 bg-background/70 p-4 backdrop-blur md:grid-cols-[96px_1fr]">
                      <SmartImage
                        src={homepage.hero.heroQuote.portrait.src}
                        alt={homepage.hero.heroQuote.portrait.alt}
                        className="h-24 w-24 rounded-xl object-cover"
                        loading="eager"
                        fetchPriority="high"
                      />
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {homepage.hero.heroQuote.source}
                        </div>
                        <div className="mt-2 font-serif text-lg font-semibold leading-snug">
                          {homepage.hero.heroQuote.headline}
                        </div>
                        <blockquote className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {homepage.hero.heroQuote.quote}
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container className="grid gap-10 md:grid-cols-12 md:items-center">
          <Reveal className="md:col-span-7">
            <h2 className="font-serif text-2xl tracking-tight md:text-4xl">
              {homepage.featuredStory.title}
            </h2>
            <p className="mt-4 max-w-prose text-muted-foreground">
              {homepage.featuredStory.description}
            </p>
            {"cta" in homepage.featuredStory && (homepage.featuredStory as any).cta ? (
              <div className="mt-6">
                <Button asChild variant="secondary">
                  <Link to={(homepage.featuredStory as any).cta.href}>
                    {(homepage.featuredStory as any).cta.label}
                  </Link>
                </Button>
              </div>
            ) : null}
          </Reveal>
          <Reveal className="md:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
              <SmartImage
                src="/images/historical-marker-300x169.jpg"
                alt="Historic marker commemorating Dr. Matilda A. Evans"
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container>
          <Reveal className="grid gap-8 rounded-3xl border border-border/60 bg-card p-8 shadow-sm md:grid-cols-12 md:items-center md:p-12">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                {homepage.fromTheArchives.title}
              </div>
              <h2 className="mt-4 font-serif text-2xl tracking-tight md:text-4xl">
                {homepage.fromTheArchives.featured.title}
              </h2>
              <p className="mt-3 max-w-prose text-muted-foreground">
                {homepage.fromTheArchives.featured.description}
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link to={homepage.fromTheArchives.featured.href}>Read excerpt</Link>
                </Button>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="rounded-2xl border border-border/60 bg-background/70 p-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {homepage.fromTheArchives.featured.kicker}
                </div>
                <blockquote className="mt-3 font-serif text-lg leading-snug">
                  “Thoroughness not only in books and the industrial arts, but in
                  thought and action as well.”
                </blockquote>
                <div className="mt-3 text-sm text-muted-foreground">
                  — Dr. Matilda A. Evans (1916)
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section id="explore-foundation" className="py-14 md:py-20">
        <Container>
          <Reveal>
            <h2 className="font-serif text-2xl tracking-tight md:text-4xl">
              {homepage.programs.title}
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {homepage.programs.items.map((p) => {
              const title = p.title.toLowerCase();
              const href = (p as any).href as string | undefined;
              const Icon = title.includes("board")
                ? Users
                : title.includes("photo") || (href ?? "").includes("photo-gallery")
                  ? Images
                  : title.includes("seminar") || (href ?? "").includes("/seminars")
                    ? Newspaper
                  : title.includes("academy") ||
                      (href ?? "").startsWith("/dr-evans-academy")
                    ? BookOpen
                : title.includes("history") || (href ?? "").startsWith("/about")
                    ? BookOpen
                    : Handshake;
              const isExternal = href ? /^https?:\/\//i.test(href) : false;
              return (
                <Reveal key={p.title}>
                  <Card className="h-full overflow-hidden">
                    <CardHeader className="relative">
                      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/70 text-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle>{p.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      {p.description}
                      {href ? (
                        <div className="mt-4">
                          {isExternal ? (
                            <a
                              className="text-sm font-semibold text-primary hover:underline"
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Learn more →
                            </a>
                          ) : (
                            <Link
                              className="text-sm font-semibold text-primary hover:underline"
                              to={href}
                            >
                              Learn more →
                            </Link>
                          )}
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container className="grid gap-10 md:grid-cols-12 md:items-center">
          <Reveal className="md:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
                <SmartImage
                src={homepage.visitHouse.image.src}
                alt={homepage.visitHouse.image.alt}
                className="aspect-square w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal className="md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <MapPinned className="h-4 w-4" />
              Visit
            </div>
            <h2 className="mt-4 font-serif text-2xl tracking-tight md:text-4xl">
              {homepage.visitHouse.title}
            </h2>
            <p className="mt-4 max-w-prose text-muted-foreground">
              {homepage.visitHouse.description}
            </p>
            <div className="mt-6">
              <Button asChild variant="outline">
                <a
                  href={homepage.visitHouse.cta.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {homepage.visitHouse.cta.label}
                </a>
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container className="grid gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <h2 className="font-serif text-2xl tracking-tight md:text-4xl">
              {homepage.bookSpotlight.title}
            </h2>
            <p className="mt-4 max-w-prose text-muted-foreground">
              {homepage.bookSpotlight.description}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {homepage.bookSpotlight.links.map((l) => {
                const isArcadia = /arcadia/i.test(l.label);
                return (
                  <div
                    key={l.href}
                    className={isArcadia ? "sm:col-span-3 sm:justify-self-center" : ""}
                  >
                    <Button asChild variant="secondary" size="sm">
                      <a href={l.href} target="_blank" rel="noreferrer">
                        {l.label}
                      </a>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
              <SmartImage
                src={homepage.bookSpotlight.image.src}
                alt={homepage.bookSpotlight.image.alt}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container className="rounded-2xl border border-border/60 bg-card p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-12 md:items-center">
            <Reveal className="md:col-span-4">
              <div className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm">
                <SmartImage
                  src="/images/olga-mauvene-aiken-swanson.jpg"
                  alt="Olga Mauvene Aiken Swanson"
                  className="aspect-[4/5] w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "/images/D5FB094D-9DBD-434D-906D-443C5E5AA925-189x300.jpeg";
                  }}
                />
              </div>
            </Reveal>
            <Reveal className="md:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                In Loving Memory
              </div>
              <h2 className="mt-4 font-serif text-2xl tracking-tight md:text-4xl">
                Olga Mauvene Aiken Swanson (1949–2023)
              </h2>
              <p className="mt-3 max-w-prose text-muted-foreground">
                One of the four grandchildren of Dr. Matilda A. Evans. Read a
                memorial note honoring Olga’s life and her wish to support
                scientific research in her grandmother’s name.
              </p>
              <div className="mt-6">
                <Button asChild variant="secondary">
                  <Link to="/in-loving-memory-olga-aiken-swanson">Read more →</Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section id="contact" className="py-14 md:py-20">
        <Container className="rounded-2xl border border-border/60 bg-accent/50 p-8 md:p-12">
          <div className="grid gap-6 md:grid-cols-12 md:items-center">
            <div className="md:col-span-8">
              <h2 className="font-serif text-2xl tracking-tight md:text-4xl">
                {homepage.contactCta.title}
              </h2>
              <p className="mt-3 max-w-prose text-muted-foreground">
                {homepage.contactCta.description}
              </p>
            </div>
            <div className="md:col-span-4 md:flex md:justify-end">
              <Button asChild size="lg" variant="secondary">
                <Link to={homepage.contactCta.cta.href}>
                  {homepage.contactCta.cta.label}
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section id="donate" className="py-10 md:py-14">
        <Container className="rounded-2xl border border-border/60 bg-card p-8 md:p-12">
          <div className="grid gap-6 md:grid-cols-12 md:items-center">
            <div className="md:col-span-8">
              <h2 className="font-serif text-2xl tracking-tight md:text-4xl">
                Support the mission
              </h2>
              <p className="mt-3 max-w-prose text-muted-foreground">
                Your support helps preserve public history and expand educational opportunity.
              </p>
            </div>
            <div className="md:col-span-4 md:flex md:justify-end">
              <Button asChild size="lg">
                <a href="/contact?category=donate">Donate (inquire)</a>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
