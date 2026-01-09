import { Link } from "@remix-run/react";

import { Container } from "~/components/site/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background">
      <Container className="grid gap-10 py-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="font-serif text-lg font-semibold tracking-tight">
            Dr. Matilda A. Evans Educational Foundation
          </div>
          <p className="mt-3 max-w-prose text-sm text-muted-foreground">
            Matilda A Evans Education Foundation LLC is a 501 (c) (3) non profit
            organization, EIN 99-2293861. Donations are tax-deductible.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 md:col-span-7 md:grid-cols-4">
          <div>
            <div className="text-sm font-semibold">Explore</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link className="hover:text-foreground" to="/dr-evans-academy">
                  Dr. Evans Academy
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" to="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold">Visit</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  className="hover:text-foreground"
                  href="https://www.google.com/maps/search/?api=1&query=Matilda+Evans+House+Columbia+SC"
                  target="_blank"
                  rel="noreferrer"
                >
                  Find the historic house
                </a>
              </li>
              <li>
                <a
                  className="hover:text-foreground"
                  href="https://www.nps.gov/subjects/nationalhistoriclandmarks/index.htm"
                  target="_blank"
                  rel="noreferrer"
                >
                  National Historic Landmark Program
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold">Support</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link className="hover:text-foreground" to="/volunteer-partner">
                  Volunteer / Partner
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-foreground"
                  to="/contact?category=donate"
                >
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold">Legal</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link className="hover:text-foreground" to="/privacy">
                  Privacy
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" to="/cookies">
                  Cookies
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" to="/terms">
                  Terms
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" to="/accessibility">
                  Accessibility
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" to="/licenses">
                  Licenses
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="md:col-span-12">
          <div className="flex flex-col gap-2 border-t border-border/70 pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
            <div>
              ©2026 Dr. Matilda A. Evans Educational Foundation, Inc. All rights
              reserved.
            </div>
            <div className="md:text-right">Built by Wolf Consulting Group, LLC</div>
          </div>
        </div>
      </Container>
    </footer>
  );
}



