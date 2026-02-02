import { Link, NavLink } from "@remix-run/react";
import { Menu } from "lucide-react";

import { getMenu } from "~/content/menu";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Container } from "~/components/site/container";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url) || /^mailto:/i.test(url) || /^tel:/i.test(url);
}

function shouldShowMenuItem(title: string, url: string) {
  if (!title?.trim()) return false;
  if (!url?.trim()) return false;
  const t = title.trim().toLowerCase();
  const u = url.trim().toLowerCase();

  // Prevent junk / widget links from cluttering the nav (e.g. weather/location).
  if (u.startsWith("#")) return false;
  if (u.startsWith("javascript:")) return false;
  if (/^\d+$/.test(t)) return false;
  if (t === "untitled") return false;
  if (t.includes("columbia") && /\b\d{1,3}\b/.test(t) && (u === "#" || u === "")) {
    return false;
  }
  return true;
}

function normalizeTitle(title: string) {
  return title.replace(/\s+/g, " ").trim();
}

function normalizeUrl(url: string) {
  return url.trim();
}

type MenuItem = ReturnType<typeof getMenu>["items"][number];

function cleanMenuTree(items: MenuItem[]): MenuItem[] {
  const seen = new Set<string>();
  const out: MenuItem[] = [];

  for (const item of items) {
    const title = normalizeTitle(item.title);
    const url = normalizeUrl(item.url);
    if (!shouldShowMenuItem(title, url)) continue;

    const children = cleanMenuTree((item.children ?? []) as MenuItem[]);
    const key = `${url.toLowerCase()}|${title.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);

    out.push({
      ...item,
      title,
      url,
      children,
    });
  }

  return out;
}

function flattenTopLevel(items: MenuItem[]) {
  return items;
}

function priorityScore(item: { title: string; url: string }) {
  const t = item.title.toLowerCase();
  const u = item.url.toLowerCase();

  if (u === "/") return 0;
  if (u.includes("columbiasc63.com")) return 500;
  if (u.includes("#explore-foundation")) return 5;
  if (u.startsWith("/about")) return 10;
  if (u.includes("historiccolumbia") || u.includes("historic-house") || u.includes("visit-the-historic-house"))
    return 20;
  if (u.startsWith("/dr-evans-academy")) return 30;
  if (t.includes("research")) return 40;
  if (u.startsWith("/board-of-directors") || t.includes("board")) return 50;
  if (u.startsWith("/contact")) return 60;
  return 200;
}

function labelFor(item: { title: string; url: string }) {
  const t = item.title.toLowerCase();
  const u = item.url.toLowerCase();
  if (u === "/" || t === "home") return "Home";
  // Keep header labels short and consistent.
  if (u.includes("#explore-foundation")) return "Explore";
  if (u.startsWith("/about")) return "About";
  if (u.startsWith("/dr-evans-academy") || t.includes("academy") || t.includes("class"))
    return "Academy";
  if (t.includes("visit") || u.includes("historiccolumbia") || u.includes("historic-house"))
    return "Visit";
  if (t.includes("research") || u.includes("renaissance")) return "Research";
  if (t.includes("contact") || u.startsWith("/contact")) return "Contact";
  if (t.includes("board") || u.includes("board-of-directors")) return "Board";
  return item.title;
}

export function SiteHeader() {
  const { items } = getMenu();
  const cleaned = cleanMenuTree(items as MenuItem[]);

  // Brand already links home, so don't add a "Home" item to the top nav.
  const topLevel = flattenTopLevel(cleaned)
    .map((i) => ({
      ...i,
      title: normalizeTitle(i.title),
      url: normalizeUrl(i.url),
      children: (i.children ?? []).filter((c) => shouldShowMenuItem(c.title, c.url)),
    }))
    .filter((i) => i.url !== "/");

  // Curated primary nav for a clean, premium header.
  const pick = (predicate: (i: MenuItem) => boolean) => {
    const idx = topLevel.findIndex(predicate);
    if (idx === -1) return null;
    const [item] = topLevel.splice(idx, 1);
    return item;
  };

  const preferred: MenuItem[] = [];
  // Put Behavioral Health under Explore (not in "More").
  const behavioralHealth =
    pick((i) => i.url.toLowerCase().startsWith("/behavioral-health")) ??
    pick((i) => i.title.toLowerCase().includes("behavioral health"));

  preferred.push({
    title: "Explore the Foundation",
    url: "/#explore-foundation",
    children: behavioralHealth
      ? [
          {
            ...behavioralHealth,
            title: "Behavioral Health Within Our Communities",
            url: "/behavioral-health",
            children: [],
          },
        ]
      : [],
  });

  const about =
    pick((i) => i.url.toLowerCase().startsWith("/about")) ??
    pick((i) => i.title.toLowerCase().includes("about"));
  if (about) preferred.push(about);

  const visit =
    pick((i) => i.title.toLowerCase().includes("visit")) ??
    pick((i) => i.url.toLowerCase().includes("historiccolumbia"));
  if (visit) preferred.push(visit);

  const research =
    pick((i) => i.title.toLowerCase().includes("research")) ??
    pick((i) => i.url.toLowerCase().includes("renaissance"));
  if (research) preferred.push(research);

  const academy =
    pick((i) => i.url.toLowerCase().startsWith("/dr-evans-academy")) ??
    pick((i) => i.title.toLowerCase().includes("academy")) ??
    pick((i) => i.title.toLowerCase().includes("class"));
  if (academy) preferred.push(academy);

  const contact =
    pick((i) => i.url.toLowerCase().startsWith("/contact")) ??
    pick((i) => i.title.toLowerCase().includes("contact"));
  if (contact) preferred.push(contact);

  // Fill remaining slots with best-ranked items, but keep the header small.
  const MAX_TOP = 5;
  const rankedRest = [...topLevel].sort((a, b) => {
    const pa = priorityScore(a);
    const pb = priorityScore(b);
    if (pa !== pb) return pa - pb;
    return a.title.localeCompare(b.title);
  });
  const top = [...preferred, ...rankedRest].slice(0, MAX_TOP);
  const usedKeys = new Set(top.map((i) => `${i.url}|${i.title}`));
  const more = [...preferred, ...rankedRest].filter(
    (i) => !usedKeys.has(`${i.url}|${i.title}`)
  );

  // Keep Contact as a right-side action on desktop (avoid duplicating it in the top nav).
  const isContactUrl = (u: string) => u.toLowerCase().startsWith("/contact");
  const desktopTop = top.filter((i) => !isContactUrl(i.url));
  const desktopMore = more.filter((i) => !isContactUrl(i.url));

  const mobileItems: MenuItem[] = (() => {
    const seen = new Set<string>();
    const all = [...top, ...more];
    const out: MenuItem[] = [];
    for (const item of all) {
      const key = `${item.url}|${item.title}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(item);
    }
    return out;
  })();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/65">
      <Container className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            className="group inline-flex items-center gap-3 whitespace-nowrap"
            aria-label="Dr. Matilda A. Evans Educational Foundation (Home)"
          >
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="Dr. Matilda A. Evans Educational Foundation"
                width={1536}
                height={1024}
                className="h-10 w-auto drop-shadow-sm md:h-11"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
            <div className="hidden min-w-0 xl:block">
              <div className="text-sm font-semibold leading-none tracking-tight text-foreground">
                Dr. Matilda A. Evans
              </div>
              <div className="mt-0.5 text-xs font-medium leading-none text-muted-foreground">
                Educational Foundation
              </div>
            </div>
          </Link>
        </div>

        <nav
          className="hidden min-w-0 flex-1 justify-center text-sm font-semibold lg:flex"
          aria-label="Primary"
        >
          <NavigationMenu className="max-w-full">
            <NavigationMenuList>
              {desktopTop.map((item) => {
                const hasChildren = (item.children?.length || 0) > 0;
                const external = item.external ?? isExternalUrl(item.url);
                const label = labelFor(item);

                if (!hasChildren) {
                  return (
                    <NavigationMenuItem key={`${item.title}:${item.url}`}>
                      {external ? (
                        <NavigationMenuLink asChild>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className={navigationMenuTriggerStyle}
                          >
                            {label}
                          </a>
                        </NavigationMenuLink>
                      ) : (
                        <NavigationMenuLink asChild>
                          <NavLink
                            to={item.url}
                            className={({ isActive }) =>
                              cn(
                                navigationMenuTriggerStyle,
                                isActive && "text-foreground"
                              )
                            }
                          >
                            {label}
                          </NavLink>
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  );
                }

                const children = (item.children ?? []).filter((c) =>
                  shouldShowMenuItem(c.title, c.url)
                );

                return (
                  <NavigationMenuItem key={`${item.title}:${item.url}`}>
                    <NavigationMenuTrigger>{label}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid min-w-[18rem] gap-1 p-3 md:w-[22rem]">
                        {children.map((child) => {
                          const childExternal =
                            child.external ?? isExternalUrl(child.url);
                          return childExternal ? (
                            <a
                              key={child.url}
                              href={child.url}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-xl px-3 py-2 text-sm text-foreground/85 hover:bg-accent hover:text-foreground"
                            >
                              <div className="font-semibold">{child.title}</div>
                              <div className="text-xs text-muted-foreground">
                                Opens external site
                              </div>
                            </a>
                          ) : (
                            <Link
                              key={child.url}
                              to={child.url}
                              className="rounded-xl px-3 py-2 text-sm text-foreground/85 hover:bg-accent hover:text-foreground"
                            >
                              <div className="font-semibold">{child.title}</div>
                            </Link>
                          );
                        })}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              })}

              {desktopMore.length ? (
                <NavigationMenuItem key="more">
                  <NavigationMenuTrigger>More</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid min-w-[18rem] gap-1 p-3 md:w-[26rem]">
                      {desktopMore.map((item) => {
                        const external = item.external ?? isExternalUrl(item.url);
                        const hasChildren = (item.children?.length || 0) > 0;
                        const children = (item.children ?? []).filter((c) =>
                          shouldShowMenuItem(c.title, c.url)
                        );
                        const label = labelFor(item);

                        return (
                          <div key={`${item.title}:${item.url}`} className="rounded-xl">
                            {external ? (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="block rounded-xl px-3 py-2 text-sm font-semibold text-foreground/85 hover:bg-accent hover:text-foreground"
                              >
                                {label}
                              </a>
                            ) : (
                              <Link
                                to={item.url}
                                className="block rounded-xl px-3 py-2 text-sm font-semibold text-foreground/85 hover:bg-accent hover:text-foreground"
                              >
                                {label}
                              </Link>
                            )}

                            {hasChildren && children.length ? (
                              <div className="mb-1 ml-2 grid gap-1 border-l border-border/70 pl-2">
                                {children.map((c) => {
                                  const cExt = c.external ?? isExternalUrl(c.url);
                                  return cExt ? (
                                    <a
                                      key={c.url}
                                      href={c.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="rounded-md px-2 py-1 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground"
                                    >
                                      {c.title}
                                    </a>
                                  ) : (
                                    <Link
                                      key={c.url}
                                      to={c.url}
                                      className="rounded-md px-2 py-1 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground"
                                    >
                                      {c.title}
                                    </Link>
                                  );
                                })}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : null}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="hidden shrink-0 items-center justify-end gap-2 lg:flex">
          <Button asChild variant="outline" size="sm" className="h-10">
            <Link to="/contact">Contact</Link>
          </Button>
          <Button asChild size="sm" className="h-10">
            <Link to="/donate">Donate</Link>
          </Button>
        </div>

        <div className="flex items-center justify-end gap-2 lg:hidden">
          <Button asChild size="sm" className="h-10">
            <Link to="/donate">Donate</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent className="pt-10">
              <div className="flex flex-col gap-1">
                {mobileItems.map((item) => {
                  const hasChildren = (item.children?.length || 0) > 0;
                  const external = item.external ?? isExternalUrl(item.url);
                  const label = labelFor(item);
                  if (!hasChildren) {
                    return external ? (
                      <a
                        key={`${item.title}:${item.url}`}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-accent"
                      >
                        {label}
                      </a>
                    ) : (
                      <NavLink
                        key={`${item.title}:${item.url}`}
                        to={item.url}
                        className={({ isActive }) =>
                          cn(
                            "rounded-md px-3 py-2 text-sm font-semibold hover:bg-accent",
                            isActive && "bg-accent"
                          )
                        }
                      >
                        {label}
                      </NavLink>
                    );
                  }

                  return (
                    <div key={`${item.title}:${item.url}`} className="pt-2">
                      <div className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {label}
                      </div>
                      <div className="flex flex-col">
                        {(item.children ?? [])
                          .filter((c: MenuItem) => shouldShowMenuItem(c.title, c.url))
                          .map((child: MenuItem) => {
                          const childExternal =
                            child.external ?? isExternalUrl(child.url);
                          return childExternal ? (
                            <a
                              key={child.url}
                              href={child.url}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                            >
                              {child.title}
                            </a>
                          ) : (
                            <NavLink
                              key={child.url}
                              to={child.url}
                              className={({ isActive }) =>
                                cn(
                                  "rounded-md px-3 py-2 text-sm hover:bg-accent",
                                  isActive && "bg-accent"
                                )
                              }
                            >
                              {child.title}
                            </NavLink>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}



