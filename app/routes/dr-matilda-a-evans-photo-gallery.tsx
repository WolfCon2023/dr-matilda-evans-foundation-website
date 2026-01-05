import type { MetaFunction } from "@remix-run/node";

import data from "../../content/data/gallery.dr-matilda.json";
import { Container } from "~/components/site/container";
import { LightboxGallery } from "~/components/site/lightbox";

export const meta: MetaFunction = () => [
  { title: "Photo Gallery | Dr. Matilda A. Evans Educational Foundation" },
  {
    name: "description",
    content:
      "Archival photographs and documents highlighting Dr. Matilda A. Evans’ life, work, and legacy.",
  },
];

export default function DrMatildaGalleryRoute() {
  return (
    <Container className="py-14 md:py-20">
      <div className="max-w-3xl">
        <h1 className="font-serif text-3xl tracking-tight md:text-5xl">
          {data.title}
        </h1>
        <p className="mt-4 text-muted-foreground">{data.intro}</p>
      </div>

      <div className="mt-10">
        <LightboxGallery items={data.items} />
      </div>
    </Container>
  );
}



