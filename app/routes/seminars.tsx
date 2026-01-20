import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

import { Container } from "~/components/site/container";
import { SmartImage } from "~/components/site/smart-image";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getPageBySlug } from "~/content/mdx";

export const meta: MetaFunction = () => [
  { title: "Seminars | Dr. Matilda A. Evans Educational Foundation" },
  {
    name: "description",
    content:
      "Explore upcoming seminars and watch recordings of past seminars hosted by the Dr. Matilda A. Evans Educational Foundation.",
  },
];

type SeminarLink = { label: string; href: string };

type PastSeminar = {
  title: string;
  dateLabel?: string;
  description: string;
  image?: { src: string; alt: string; variant?: "poster" | "banner" };
  passcode?: string;
  links: SeminarLink[];
};

const PAST_SEMINARS: PastSeminar[] = [
  {
    title: "Special Seminar Presentation — Kwanis Carlos",
    description:
      "We are sure you will enjoy this special presentation by Kwanis Carlos. She comes with a wealth of knowledge and experience which we all can benefit from. We are honored to have her on board. Please join us for this timely seminar.",
    image: {
      src: "/images/MatildaEvansSeminar-Kwanis-Carlos-sized-200x300.png",
      alt: "Seminar presentation",
      variant: "poster",
    },
    passcode: "@XFJ**3z",
    links: [
      {
        label: "Watch recording (Zoom)",
        href: "https://us02web.zoom.us/rec/component-page?action=viewdetailpage&sharelevel=meeting&useWhichPasswd=meeting&clusterId=us02&componentName=need-password&meetingId=yv7d4RyxkM_PRssYl-RQoDA3ABOiIQuoOFWnY2rzg_Lfn19wFGef3F3TcWbSqDrV.fu8U_reklHawZUgj&originRequestUrl=https%3A%2F%2Fus02web.zoom.us%2Frec%2Fshare%2Fu--vgyF1Vxt74b1nFChM3dx4NcAx1qXW9ctvzB3pxDGOrejCBDPLs9URUSR5yjyC.KP6eGHr0MFe8osqj",
      },
    ],
  },
  {
    title: "“I Have a Testimony” — Closing the Gap Broadcast Network",
    dateLabel: "Aired July 21, 2024",
    description:
      "Listen to the broadcast of “I Have a Testimony” on the Closing the Gap Broadcast Network. This special episode featured inspiring interviews with Tim & Beverly Muhammad, Nadia J. Muhammad, Sherice Muhammad, and Kwanis Carlos. The program pays tribute to Dr. Matilda A. Evans—South Carolina’s first African American woman physician—recognized for pioneering accomplishments in healthcare and education.",
    image: { src: "/images/IHAT-300x169.png", alt: "I Have a Testimony", variant: "banner" },
    links: [{ label: "Watch recording (YouTube)", href: "https://www.youtube.com/live/B4CYonJPha0" }],
  },
];

export default function SeminarsRoute() {
  const upcoming = getPageBySlug("upcoming-seminars");
  const Upcoming = upcoming?.Component;

  return (
    <Container className="py-14 md:py-20">
      <div className="max-w-3xl">
        <h1 className="font-serif text-3xl tracking-tight md:text-5xl">
          Seminars
        </h1>
        <p className="mt-4 text-muted-foreground">
          Explore upcoming seminars and browse recordings from past seminars.
        </p>
      </div>

      <div className="mt-12 grid gap-14">
        <section aria-labelledby="future-seminars">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="future-seminars"
                className="font-serif text-2xl tracking-tight md:text-3xl"
              >
                Future seminars
              </h2>
              <p className="mt-2 text-muted-foreground">
                Check back for upcoming dates and details.
              </p>
            </div>
            <Button asChild variant="secondary" className="sm:w-auto">
              <Link to="/contact?category=seminars">Contact about seminars</Link>
            </Button>
          </div>

          <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
            {Upcoming ? (
              <div className="prose prose-neutral max-w-none prose-headings:font-serif prose-a:text-primary">
                <Upcoming />
              </div>
            ) : (
              <p className="text-muted-foreground">Coming soon.</p>
            )}
          </div>
        </section>

        <section aria-labelledby="past-seminars">
          <h2
            id="past-seminars"
            className="font-serif text-2xl tracking-tight md:text-3xl"
          >
            Past seminars
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {PAST_SEMINARS.map((s) => (
              <Card key={s.title} className="h-full overflow-hidden">
                {s.image ? (
                  <div className="border-b border-border/60 bg-muted/20 p-4">
                    <SmartImage
                      src={s.image.src}
                      alt={s.image.alt}
                      className={
                        s.image.variant === "poster"
                          ? "mx-auto aspect-[2/3] w-full max-w-[18rem] object-contain"
                          : "mx-auto aspect-[16/9] w-full object-contain"
                      }
                    />
                  </div>
                ) : null}
                <CardHeader>
                  <CardTitle>{s.title}</CardTitle>
                  {s.dateLabel ? (
                    <div className="text-sm text-muted-foreground">
                      {s.dateLabel}
                    </div>
                  ) : null}
                </CardHeader>
                <CardContent className="grid gap-4 text-sm text-muted-foreground">
                  <p>{s.description}</p>
                  {s.passcode ? (
                    <div className="rounded-lg border border-border/60 bg-background/70 px-3 py-2">
                      <span className="font-semibold text-foreground">
                        Passcode:
                      </span>{" "}
                      <span className="font-mono">{s.passcode}</span>
                    </div>
                  ) : null}
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    {s.links.map((l) => (
                      <Button key={l.href} asChild variant="secondary">
                        <a href={l.href} target="_blank" rel="noreferrer">
                          {l.label}
                        </a>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
}


