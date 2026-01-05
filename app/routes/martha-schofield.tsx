import type { MetaFunction } from "@remix-run/node";

import { Container } from "~/components/site/container";

export const meta: MetaFunction = () => [
  { title: "Martha Schofield | Dr. Matilda A. Evans Educational Foundation" },
  {
    name: "description",
    content:
      "An excerpt (1916) written by Dr. Matilda A. Evans honoring Martha Schofield, pioneer educator and founder of the Schofield School in Aiken, South Carolina.",
  },
];

const excerptTitle = "Martha Schofield: Pioneer Educator Arrives";
const excerptKicker = "Excerpts (1916) — Dr. Matilda A. Evans";
const excerptSubtitle =
  "A tribute to an educator whose industrial training model shaped schools across the South.";

const paragraphs: string[] = [
  "Into the midst of these terrible times which made weak the souls and hearts of the strongest of men, came Miss Martha Scofield, the first of the pioneers to push into the distracted South to labor, to suffer, and if need be, to die for the millions of ignorant, irresponsible Negroes. Their education, along industrial lines, she made her life-work – crowning it on the 77th day of her birth, February 1st, 1916, by passing from earth to heaven. But she left to show that she did something on earth – a school and campus comprising an area of two entire blocks in the beautiful city of Aiken, SC, on which she had erected eight building.",
  "The school farm, adequate for all farm demonstrations, consists of about 400 acres. The funds by which all this valuable property was acquired was raised by Miss Schofield herself, through the fluent use of the trenchant pen, which she knew how to wield as few women have ever learned to do. Everything contracted in the interest of the school was paid for in cash as Miss Schofield, in all her fifty years of administration, never contracted the outlay of money without first having provided the means with which to meet claims. She enjoyed the good will and friendship of men and women of wealth and influence throughout the country, especially of the old Abolitionists, who supported her institution generously as long as they lived and possessed the means with which to do so.",
  "The Schofield School at Aiken has sent out into the world many young men and women who have gone back among their own people as accomplished teachers, ministers, physicians, farmers and artisans, leading the colored race of the South to the highest appreciation of what Martha Scofield’s motto for life was, “Thoroughness”. Thoroughness not only in books and the industrial arts, but in thought and action as well. No doubt the success which attended the efforts of the graduates this School is due, in the main, to the strict regard for efficiency with which this great woman inspired every student coming under her influences.",
  "When we contemplate the widespread influence which the life and work of Martha Schofield has exerted on the education of the people of the South, the white as well as the colored, words become inadequate to pay proper tribute to her; to justly express the appreciation felt by those having knowledge of her achievements.",
  "There is not a colored school in the entire South that has not acknowledged the wisdom of this Divinely endowed leader and instructor by establishing an industrial department. Recognizing the imperative importance of this sort of instruction, almost all the schools and colleges for whites emphasize it by giving it first place in the curriculums.",
  "Much credit must be given to the practical success of Miss Schofield’s school work for the marvelous strides made by the education of the Negro at such celebrated institutions as Hampton, VA, with an enrollment annually of over 1,000 students and endowment of a million dollars and at Tuskegee, with about an equal number of students and as great or greater endowment fund. Then there are other great institutions devoted entirely to the education of the colored race, making quite a feature of the industrial department, such as Atlanta University, Atlanta, GA, Fisk University, Nashville, Tenn, Haines Institute, Augusta GA, Spelman University, Atlanta, GA, Claflin and the Agricultural Colored State College at Orangeburg, SC.",
  "Miss Martha Schofield was born near Newton, in Bucks County, Pennsylvania, on the first day of February in the year 1839 of well-to-do parents, who professed and lived true the principles of religion as enunciated by the Society of Friends, or the Quakers, as they are commonly called.",
  "She spent much time and endured many hardships traveling through the country speaking and teaching the value of homes and the necessity of clean homes, both physically and morally. She never tired of stressing these things and there are many good Negro homes in South Carolina and all over the Southland that are evidence that her efforts have not been in vain. Martha Schofield was helpful not alone to the Negroes but also to the whites, for good Negroes make good whites and good whites make good Negroes.",
];

export default function MarthaSchofieldRoute() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(1000px_480px_at_20%_10%,rgba(18,59,116,0.22)_0%,transparent_55%),radial-gradient(900px_480px_at_80%_10%,hsl(var(--accent))_0%,transparent_55%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-b from-background to-transparent" />

      <Container className="py-14 md:py-20">
        <header className="mx-auto max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {excerptKicker}
          </div>
          <h1 className="mt-4 font-serif text-3xl tracking-tight md:text-5xl">
            {excerptTitle}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{excerptSubtitle}</p>
        </header>

        <div className="mx-auto mt-10 grid max-w-5xl gap-10 md:grid-cols-[1fr_260px] md:items-start">
          <article className="rounded-3xl border border-border/60 bg-background/70 p-6 shadow-sm backdrop-blur md:p-8">
            <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-[0.98rem] md:prose-p:text-[1.02rem]">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </article>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Pull quote
              </div>
              <blockquote className="mt-3 font-serif text-lg leading-snug">
                “Thoroughness not only in books and the industrial arts, but in
                thought and action as well.”
              </blockquote>
              <div className="mt-3 text-sm text-muted-foreground">
                — Dr. Matilda A. Evans (1916 excerpt)
              </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Context
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="font-semibold">Where</dt>
                  <dd className="text-muted-foreground">Aiken, South Carolina</dd>
                </div>
                <div>
                  <dt className="font-semibold">Focus</dt>
                  <dd className="text-muted-foreground">
                    Industrial education, civic uplift, and enduring community
                    impact
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">Date</dt>
                  <dd className="text-muted-foreground">1916 (excerpt)</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}



