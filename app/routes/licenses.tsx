import type { MetaFunction } from "@remix-run/node";

import { Container } from "~/components/site/container";

export const meta: MetaFunction = () => [
  { title: "Licenses | Dr. Matilda A. Evans Educational Foundation" },
];

export default function LicensesRoute() {
  return (
    <Container className="py-14 md:py-20">
      <div className="prose prose-neutral max-w-3xl">
        <h1>Licenses</h1>
        <p>
          <strong>Last updated:</strong> January 5, 2026
        </p>
        <p>
          This website is built using open-source software. Those projects are
          licensed by their respective authors under their own license terms.
        </p>

        <h2>Third-party software</h2>
        <p>
          The site depends on third-party libraries and tools. License texts and
          attributions are provided by those projects. If you need a compiled
          list of third-party licenses for this site, please contact us and we
          will provide it.
        </p>

        <h2>Media and content</h2>
        <p>
          Photographs, documents, and other historical materials may have
          separate rights and usage restrictions. Please contact us if you would
          like to reuse any content.
        </p>
        <p>
          Contact us via <a href="/contact">our contact page</a>.
        </p>
      </div>
    </Container>
  );
}


