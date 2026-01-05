import fs from "node:fs";
import path from "node:path";

import { XMLParser } from "fast-xml-parser";

import { basenameFromUrl, canonicalizeFilename, readLocalImages } from "./_shared";

const ROOT = process.cwd();
const XML_PATH = path.join(
  ROOT,
  "drmatildaaevanseducationalfoundation.WordPress.2025-12-29.xml"
);
const CONTENT_DIR = path.join(ROOT, "content");
const IMAGES_DIR = path.join(ROOT, "images");

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

function listMdxFiles(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith(".mdx"))
    .map((d) => path.join(dir, d.name));
}

function extractUrlsFromSrcset(srcset: string) {
  return srcset
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.split(/\s+/)[0])
    .filter(Boolean);
}

function extractImageRefs(mdx: string): string[] {
  const refs: string[] = [];

  // <img src="..."> and any src="..." attributes
  const srcAttr = /\bsrc\s*=\s*["']([^"']+)["']/gi;
  for (const m of mdx.matchAll(srcAttr)) refs.push(m[1]);

  // srcset="..."
  const srcsetAttr = /\bsrcset\s*=\s*["']([^"']+)["']/gi;
  for (const m of mdx.matchAll(srcsetAttr)) refs.push(...extractUrlsFromSrcset(m[1]));

  // data-src="..." and common lazy attrs
  const dataSrcAttr = /\bdata-(?:src|lazy-src|original)\s*=\s*["']([^"']+)["']/gi;
  for (const m of mdx.matchAll(dataSrcAttr)) refs.push(m[1]);

  // Markdown images: ![alt](url "title")
  const mdImg = /!\[[^\]]*]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
  for (const m of mdx.matchAll(mdImg)) refs.push(m[1]);

  return refs;
}

function isLocalImagesRef(url: string) {
  return (
    url.startsWith("/images/") ||
    url.startsWith("images/") ||
    url.startsWith("./images/")
  );
}

async function main() {
  if (!fs.existsSync(XML_PATH)) {
    throw new Error(`XML not found at ${XML_PATH}`);
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
  const items = toArray(parsed?.rss?.channel?.item) as any[];

  const expectedAttachmentBasenames = new Set<string>();
  const expectedAttachmentCanonical = new Map<string, string[]>();
  for (const it of items) {
    if (safeText(it["wp:post_type"]) !== "attachment") continue;
    const url = safeText(it["wp:attachment_url"]) || safeText(it.guid);
    if (!url) continue;
    const base = basenameFromUrl(url);
    const ext = path.extname(base).toLowerCase();
    const isImage =
      ext === ".jpg" ||
      ext === ".jpeg" ||
      ext === ".png" ||
      ext === ".gif" ||
      ext === ".webp" ||
      ext === ".svg";
    if (!isImage) continue;
    expectedAttachmentBasenames.add(base);
    const key = canonicalizeFilename(base);
    const list = expectedAttachmentCanonical.get(key) ?? [];
    list.push(base);
    expectedAttachmentCanonical.set(key, list);
  }

  const localImages = readLocalImages(IMAGES_DIR);
  const localImageSet = new Set(localImages.allFiles);
  const localCanonicalSet = new Set(localImages.byCanonical.keys());

  const mdxFiles = [
    ...listMdxFiles(path.join(CONTENT_DIR, "pages")),
    ...listMdxFiles(path.join(CONTENT_DIR, "posts")),
  ];

  const referencedLocalFiles = new Set<string>();
  const brokenReferences: Array<{ file: string; ref: string }> = [];

  for (const file of mdxFiles) {
    const content = fs.readFileSync(file, "utf8");
    const refs = extractImageRefs(content);
    for (const ref of refs) {
      if (!isLocalImagesRef(ref)) continue;
      const basename = path.basename(ref.split("?")[0].split("#")[0]);
      referencedLocalFiles.add(basename);
      if (!localImageSet.has(basename)) {
        brokenReferences.push({ file: path.relative(ROOT, file), ref });
      }
    }
  }

  const missingExpectedCanonical = Array.from(expectedAttachmentCanonical.keys()).filter(
    (k) => !localCanonicalSet.has(k)
  );

  const unusedImages = Array.from(localImageSet).filter(
    (b) => !referencedLocalFiles.has(b)
  );

  const lines: string[] = [];
  lines.push(`# Image Audit Report`);
  lines.push(``);
  lines.push(`- **Expected attachments (from XML)**: ${expectedAttachmentBasenames.size}`);
  lines.push(`- **Local images present (./images)**: ${localImageSet.size}`);
  lines.push(`- **MDX files scanned**: ${mdxFiles.length}`);
  lines.push(`- **Referenced local images**: ${referencedLocalFiles.size}`);
  lines.push(``);

  lines.push(`## Missing images (expected by XML but not found in ./images)`);
  lines.push(``);
  if (missingExpectedCanonical.length === 0) {
    lines.push(`None`);
  } else {
    for (const key of missingExpectedCanonical.sort()) {
      const originals = expectedAttachmentCanonical.get(key) ?? [key];
      for (const b of originals) lines.push(`- ${b}`);
    }
  }
  lines.push(``);

  lines.push(`## Broken references (MDX points to a non-existent local file)`);
  lines.push(``);
  if (brokenReferences.length === 0) {
    lines.push(`None`);
  } else {
    for (const br of brokenReferences) {
      lines.push(`- **${br.file}** → \`${br.ref}\``);
    }
  }
  lines.push(``);

  lines.push(`## Unused local images (present in ./images but never referenced in MDX)`);
  lines.push(``);
  if (unusedImages.length === 0) {
    lines.push(`None`);
  } else {
    for (const b of unusedImages.sort()) lines.push(`- ${b}`);
  }
  lines.push(``);

  ensureDir(CONTENT_DIR);
  fs.writeFileSync(
    path.join(CONTENT_DIR, "IMAGE_AUDIT_REPORT.md"),
    lines.join("\n") + "\n",
    "utf8"
  );

  const hasErrors =
    missingExpectedCanonical.length > 0 || brokenReferences.length > 0;
  if (hasErrors) {
    console.error(
      JSON.stringify(
        {
          missingExpected: missingExpectedCanonical.length,
          brokenReferences: brokenReferences.length,
        },
        null,
        2
      )
    );
    process.exit(1);
  }
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


