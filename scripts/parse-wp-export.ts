import fs from "node:fs";
import path from "node:path";

import { XMLParser } from "fast-xml-parser";
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

import {
  basenameFromUrl,
  matchLocalImage,
  readLocalImages,
  type LocalImageIndex,
} from "./_shared";

type WpItem = Record<string, unknown> & {
  title?: string;
  link?: string;
  guid?: { "#text"?: string; isPermaLink?: string } | string;
  "content:encoded"?: string;
  "excerpt:encoded"?: string;
  "wp:post_id"?: string | number;
  "wp:post_date"?: string;
  "wp:post_modified"?: string;
  "wp:post_name"?: string;
  "wp:status"?: string;
  "wp:post_type"?: string;
  "wp:attachment_url"?: string;
  "wp:post_parent"?: string | number;
  "wp:menu_order"?: string | number;
  "wp:postmeta"?:
    | { "wp:meta_key"?: string; "wp:meta_value"?: string }
    | Array<{ "wp:meta_key"?: string; "wp:meta_value"?: string }>;
};

type MenuItemJson = {
  title: string;
  url: string;
  external?: boolean;
  children?: MenuItemJson[];
};

const ROOT = process.cwd();
const XML_PATH = path.join(
  ROOT,
  "drmatildaaevanseducationalfoundation.WordPress.2025-12-29.xml"
);
const IMAGES_DIR = path.join(ROOT, "images");
const PUBLIC_IMAGES_DIR = path.join(ROOT, "public", "images");
const CONTENT_DIR = path.join(ROOT, "content");

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function toArray<T>(maybe: T | T[] | undefined): T[] {
  if (!maybe) return [];
  return Array.isArray(maybe) ? maybe : [maybe];
}

function safeText(x: unknown) {
  if (typeof x === "string") return x;
  if (typeof x === "number") return String(x);
  if (x && typeof x === "object") {
    const anyX = x as any;
    if (typeof anyX.__cdata === "string") return anyX.__cdata;
    if (typeof anyX["#text"] === "string") return anyX["#text"];
  }
  return "";
}

function mdxEscapeFrontmatter(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function isWpUploadsUrl(url: string) {
  return /\/wp-content\/uploads\//i.test(url);
}

function rewriteHtmlToMdxHtml(
  html: string,
  localImages: LocalImageIndex,
  context: { kind: "page" | "post"; slug: string; title: string },
  report: {
    externalLinks: Set<string>;
    missingImages: Array<{ basename: string; where: string; original: string }>;
  }
) {
  const $ = cheerio.load(html);

  // Remove theme/page-builder injected blocks that don't belong in MDX
  $("style,script,noscript").remove();
  // Remove embedded WP forms/page-builder widgets that break MDX parsing
  $("form,input,textarea,select,button").remove();
  // Soft-wrap helper can cause JSX void-tag mismatches; markdown doesn't need it
  $("wbr").remove();

  // Strip common WP cruft
  $("[style]").removeAttr("style");
  $("[class]").removeAttr("class");
  $("[id]").removeAttr("id");

  // Rewrite images
  $("img").each((_i, el) => {
    const src = $(el).attr("src") || "";
    const dataSrc =
      $(el).attr("data-src") ||
      $(el).attr("data-lazy-src") ||
      $(el).attr("data-original") ||
      "";

    const rewriteOne = (raw: string) => {
      if (!raw) return undefined;
      if (!isWpUploadsUrl(raw)) return undefined;
      const base = basenameFromUrl(raw);
      const match = matchLocalImage(localImages, base);
      if (match.matched && match.file) {
        return `/images/${match.file}`;
      }
      report.missingImages.push({
        basename: base,
        where: `${context.kind}:${context.slug}`,
        original: raw,
      });
      return undefined;
    };

    const newSrc = rewriteOne(src) ?? rewriteOne(dataSrc);
    if (newSrc) {
      $(el).attr("src", newSrc);
      $(el).removeAttr("data-src");
      $(el).removeAttr("data-lazy-src");
      $(el).removeAttr("data-original");
    }

    const srcset = $(el).attr("srcset");
    if (srcset) {
      const parts = srcset
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      const rewritten = parts.map((part) => {
        const [url, descriptor] = part.split(/\s+/);
        const replaced = rewriteOne(url);
        const nextUrl = replaced ?? url;
        return descriptor ? `${nextUrl} ${descriptor}` : nextUrl;
      });
      $(el).attr("srcset", rewritten.join(", "));
    }
  });

  // Capture external links
  $("a[href]").each((_i, el) => {
    const href = $(el).attr("href") || "";
    if (/^https?:\/\//i.test(href) && !/drmatildaevansfoundation\.org/i.test(href)) {
      report.externalLinks.add(href);
    }

    // Rewrite WP uploads links to local when possible
    if (isWpUploadsUrl(href)) {
      const base = basenameFromUrl(href);
      const match = matchLocalImage(localImages, base);
      if (match.matched && match.file) {
        $(el).attr("href", `/images/${match.file}`);
      } else {
        report.missingImages.push({
          basename: base,
          where: `${context.kind}:${context.slug}`,
          original: href,
        });
      }
    }
  });

  // Clean up empty paragraphs/divs
  $("p").each((_i, el) => {
    const text = $(el).text().trim();
    const hasMedia = $(el).find("img,iframe,video,audio").length > 0;
    if (!text && !hasMedia) $(el).remove();
  });

  const body = $("body").length ? $("body").html() ?? "" : $.root().html() ?? "";
  const sanitizedHtml = mdxifyHtml(body.trim());
  return htmlToMarkdown(sanitizedHtml);
}

function mdxifyHtml(input: string) {
  // MDX parses HTML tags as JSX, so void elements must be self-closing.
  // Cheerio prints `<img ...>` not `<img ... />`, which breaks MDX parsing.
  const voidTags = ["img", "br", "hr", "input", "meta", "link", "source"];
  let out = input;
  for (const tag of voidTags) {
    // Self-close: <img ...> -> <img ... />
    // Avoid touching already self-closed tags.
    const re = new RegExp(`<${tag}(\\s[^>]*?)?>`, "gi");
    out = out.replace(re, (m) => (m.endsWith("/>") ? m : m.replace(/>$/, " />")));
  }
  return out;
}

function htmlToMarkdown(html: string) {
  const td = new TurndownService({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "_",
    strongDelimiter: "**",
  });
  td.use(gfm);

  // Preserve images as Markdown images.
  td.addRule("images", {
    filter: "img",
    replacement: function (_content: string, node: HTMLElement) {
      const el = node;
      const src = (el.getAttribute("src") || "").trim();
      const alt = (el.getAttribute("alt") || "").trim();
      if (!src) return "";
      return `![${alt}](${src})`;
    },
  });

  // Figure: image + caption
  td.addRule("figure", {
    filter: "figure",
    replacement: function (_content: string, node: HTMLElement) {
      const el = node;
      const img = el.querySelector("img");
      const cap = el.querySelector("figcaption");
      const src = img?.getAttribute("src")?.trim() || "";
      const alt = img?.getAttribute("alt")?.trim() || "";
      const caption = cap?.textContent?.trim() || "";
      const imgMd = src ? `![${alt}](${src})` : "";
      const capMd = caption ? `\n\n_${caption}_` : "";
      return `${imgMd}${capMd}\n\n`;
    },
  });

  // Convert remaining spans to their content
  td.keep(["blockquote"]);

  const md = td.turndown(html);
  return md.replace(/\n{3,}/g, "\n\n").trim();
}

function parsePostmeta(item: WpItem) {
  const meta: Record<string, string> = {};
  for (const m of toArray(item["wp:postmeta"])) {
    const key = safeText(m["wp:meta_key"]);
    const value = safeText(m["wp:meta_value"]);
    if (key) meta[key] = value;
  }
  return meta;
}

function buildMenuJson(
  navItems: WpItem[],
  idToPageSlug: Map<number, string>,
  idToPostSlug: Map<number, string>
): MenuItemJson[] {
  type NavRec = {
    id: number;
    parentMenuItemId: number;
    title: string;
    menuOrder: number;
    type: string;
    object: string;
    objectId: number;
    url: string;
  };

  const records: NavRec[] = navItems.map((it) => {
    const id = Number(it["wp:post_id"] ?? 0);
    const title = safeText(it.title) || safeText(it["wp:post_name"]) || "Untitled";
    const menuOrder = Number(it["wp:menu_order"] ?? 0);
    const meta = parsePostmeta(it);
    const type = meta["_menu_item_type"] || "";
    const object = meta["_menu_item_object"] || "";
    const objectId = Number(meta["_menu_item_object_id"] || 0);
    const parentMenuItemId = Number(meta["_menu_item_menu_item_parent"] || 0);
    const url = meta["_menu_item_url"] || "";
    return {
      id,
      parentMenuItemId,
      title,
      menuOrder,
      type,
      object,
      objectId,
      url,
    };
  });

  const byId = new Map<number, NavRec>();
  for (const r of records) byId.set(r.id, r);

  const childrenByParent = new Map<number, NavRec[]>();
  for (const r of records) {
    const list = childrenByParent.get(r.parentMenuItemId) ?? [];
    list.push(r);
    childrenByParent.set(r.parentMenuItemId, list);
  }
  for (const [k, list] of childrenByParent.entries()) {
    list.sort((a, b) => a.menuOrder - b.menuOrder);
    childrenByParent.set(k, list);
  }

  const toMenuItem = (r: NavRec): MenuItemJson => {
    let url = r.url;
    let external = false;

    if (r.type === "post_type" && r.object === "page") {
      const slug = idToPageSlug.get(r.objectId);
      if (slug) url = slug === "home" ? "/" : `/${slug}`;
    } else if (r.type === "post_type" && r.object === "post") {
      const slug = idToPostSlug.get(r.objectId);
      if (slug) url = `/dr-evans-academy/${slug}`;
    } else if (r.type === "custom") {
      url = r.url;
    }

    external = /^https?:\/\//i.test(url) || /^mailto:/i.test(url) || /^tel:/i.test(url);

    const kids = childrenByParent.get(r.id) ?? [];
    return {
      title: r.title,
      url,
      external: external || undefined,
      children: kids.length ? kids.map(toMenuItem) : [],
    };
  };

  const roots = childrenByParent.get(0) ?? [];
  return roots.map(toMenuItem);
}

async function main() {
  if (!fs.existsSync(XML_PATH)) {
    throw new Error(`XML not found at ${XML_PATH}`);
  }

  ensureDir(path.join(CONTENT_DIR, "pages"));
  ensureDir(path.join(CONTENT_DIR, "posts"));
  ensureDir(path.join(CONTENT_DIR, "data"));
  ensureDir(PUBLIC_IMAGES_DIR);

  // Copy images -> public/images so /images/* works in deployment
  for (const file of fs.readdirSync(IMAGES_DIR)) {
    const src = path.join(IMAGES_DIR, file);
    const dest = path.join(PUBLIC_IMAGES_DIR, file);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
    }
  }

  const xml = fs.readFileSync(XML_PATH, "utf8");
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    parseTagValue: false,
    parseAttributeValue: false,
    trimValues: false,
    cdataPropName: "__cdata",
    textNodeName: "#text",
  });
  const parsed = parser.parse(xml) as any;
  const items: WpItem[] = toArray(parsed?.rss?.channel?.item);

  const localImages = readLocalImages(IMAGES_DIR);

  const pages = items.filter(
    (it) =>
      safeText(it["wp:post_type"]) === "page" &&
      safeText(it["wp:status"]) === "publish"
  );
  const posts = items.filter(
    (it) =>
      safeText(it["wp:post_type"]) === "post" &&
      safeText(it["wp:status"]) === "publish"
  );
  const attachments = items.filter(
    (it) => safeText(it["wp:post_type"]) === "attachment"
  );
  const navMenuItems = items.filter(
    (it) => safeText(it["wp:post_type"]) === "nav_menu_item"
  );

  const idToPageSlug = new Map<number, string>();
  const idToPostSlug = new Map<number, string>();
  const pageSlugs: string[] = [];
  const postSlugs: string[] = [];
  const emptyPages: Array<{ slug: string; title: string }> = [];

  const report = {
    externalLinks: new Set<string>(),
    missingImages: [] as Array<{ basename: string; where: string; original: string }>,
  };

  const normalizeSlug = (slug: string) => {
    const s = slug.trim();
    return s || "untitled";
  };

  // Generate page MDX
  for (const it of pages) {
    const title = safeText(it.title) || "Untitled";
    const slug = normalizeSlug(safeText(it["wp:post_name"]));
    const id = Number(it["wp:post_id"] ?? 0);
    idToPageSlug.set(id, slug);
    pageSlugs.push(slug);

    const html = safeText(it["content:encoded"]);
    const cleaned = rewriteHtmlToMdxHtml(
      html,
      localImages,
      { kind: "page", slug, title },
      report
    );

    const isEmpty = !cleaned || cleaned.replace(/<[^>]+>/g, "").trim().length === 0;
    if (isEmpty) emptyPages.push({ slug, title });

    const fm = [
      "---",
      `title: "${mdxEscapeFrontmatter(title)}"`,
      `slug: "${mdxEscapeFrontmatter(slug)}"`,
      `type: "page"`,
      `date: "${mdxEscapeFrontmatter(safeText(it["wp:post_date"]).slice(0, 10))}"`,
      `updated: "${mdxEscapeFrontmatter(
        safeText(it["wp:post_modified"]).slice(0, 10)
      )}"`,
      `wpId: ${id}`,
      `wpLink: "${mdxEscapeFrontmatter(safeText(it.link))}"`,
      "---",
      "",
    ].join("\n");

    const out = fm + (cleaned ? `${cleaned}\n` : "");
    fs.writeFileSync(path.join(CONTENT_DIR, "pages", `${slug}.mdx`), out, "utf8");
  }

  // Generate post MDX
  for (const it of posts) {
    const title = safeText(it.title) || "Untitled";
    const slug = normalizeSlug(safeText(it["wp:post_name"]));
    const id = Number(it["wp:post_id"] ?? 0);
    idToPostSlug.set(id, slug);
    postSlugs.push(slug);

    const html = safeText(it["content:encoded"]);
    const cleaned = rewriteHtmlToMdxHtml(
      html,
      localImages,
      { kind: "post", slug, title },
      report
    );

    const fm = [
      "---",
      `title: "${mdxEscapeFrontmatter(title)}"`,
      `slug: "${mdxEscapeFrontmatter(slug)}"`,
      `type: "post"`,
      `date: "${mdxEscapeFrontmatter(safeText(it["wp:post_date"]).slice(0, 10))}"`,
      `updated: "${mdxEscapeFrontmatter(
        safeText(it["wp:post_modified"]).slice(0, 10)
      )}"`,
      `wpId: ${id}`,
      `wpLink: "${mdxEscapeFrontmatter(safeText(it.link))}"`,
      "---",
      "",
    ].join("\n");

    const out = fm + (cleaned ? `${cleaned}\n` : "");
    fs.writeFileSync(path.join(CONTENT_DIR, "posts", `${slug}.mdx`), out, "utf8");
  }

  // Attachments inventory
  const attachmentsJson = attachments.map((it) => {
    const original = safeText(it["wp:attachment_url"]);
    const basename = basenameFromUrl(original || safeText(it.guid));
    const match = matchLocalImage(localImages, basename);
    return {
      originalUrl: original,
      basename,
      localMatch: match.matched,
      localPath: match.matched && match.file ? `./images/${match.file}` : null,
    };
  });
  fs.writeFileSync(
    path.join(CONTENT_DIR, "data", "attachments.json"),
    JSON.stringify(attachmentsJson, null, 2) + "\n",
    "utf8"
  );

  // Menu
  const menuItems = buildMenuJson(navMenuItems, idToPageSlug, idToPostSlug);
  fs.writeFileSync(
    path.join(CONTENT_DIR, "data", "menu.json"),
    JSON.stringify({ items: menuItems }, null, 2) + "\n",
    "utf8"
  );

  // Migration report
  const missingByBase = new Map<string, Array<{ where: string; original: string }>>();
  for (const m of report.missingImages) {
    const list = missingByBase.get(m.basename) ?? [];
    list.push({ where: m.where, original: m.original });
    missingByBase.set(m.basename, list);
  }

  const reportMd: string[] = [];
  reportMd.push(`# WordPress → MDX Migration Report`);
  reportMd.push(``);
  reportMd.push(`- **Pages migrated**: ${pages.length}`);
  reportMd.push(`- **Posts migrated**: ${posts.length}`);
  reportMd.push(`- **Attachments found**: ${attachments.length}`);
  reportMd.push(`- **Menu items found**: ${navMenuItems.length}`);
  reportMd.push(``);
  reportMd.push(`## Slugs created`);
  reportMd.push(``);
  reportMd.push(`### Pages`);
  reportMd.push(``);
  for (const slug of pageSlugs.sort()) reportMd.push(`- \`/${slug}\``);
  reportMd.push(``);
  reportMd.push(`### Posts (Dr. Evans Academy)`);
  reportMd.push(``);
  for (const slug of postSlugs.sort()) reportMd.push(`- \`/dr-evans-academy/${slug}\``);
  reportMd.push(``);
  reportMd.push(`## External links discovered`);
  reportMd.push(``);
  for (const url of Array.from(report.externalLinks).sort()) reportMd.push(`- ${url}`);
  reportMd.push(``);
  reportMd.push(`## Missing images`);
  reportMd.push(``);
  if (missingByBase.size === 0) {
    reportMd.push(`None 🎉`);
  } else {
    for (const [base, refs] of Array.from(missingByBase.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    )) {
      reportMd.push(`- **${base}**`);
      for (const r of refs) {
        reportMd.push(`  - ${r.where}: ${r.original}`);
      }
    }
  }
  reportMd.push(``);
  reportMd.push(`## Pages with empty content`);
  reportMd.push(``);
  if (emptyPages.length === 0) {
    reportMd.push(`None`);
  } else {
    for (const p of emptyPages) reportMd.push(`- \`${p.slug}\` — ${p.title}`);
  }
  reportMd.push(``);

  fs.writeFileSync(
    path.join(CONTENT_DIR, "MIGRATION_REPORT.md"),
    reportMd.join("\n") + "\n",
    "utf8"
  );

  console.log(
    JSON.stringify(
      {
        pages: pages.length,
        posts: posts.length,
        attachments: attachments.length,
        navMenuItems: navMenuItems.length,
        missingImages: missingByBase.size,
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


