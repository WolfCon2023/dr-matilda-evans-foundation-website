import fs from "node:fs";
import path from "node:path";

export type LocalImageIndex = {
  byExactLower: Map<string, string>;
  byCanonical: Map<string, string[]>;
  allFiles: string[];
};

export function readLocalImages(imagesDir: string): LocalImageIndex {
  const allFiles = fs
    .readdirSync(imagesDir, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name);

  const byExactLower = new Map<string, string>();
  const byCanonical = new Map<string, string[]>();

  for (const file of allFiles) {
    byExactLower.set(file.toLowerCase(), file);

    const key = canonicalizeFilename(file);
    const list = byCanonical.get(key) ?? [];
    list.push(file);
    byCanonical.set(key, list);
  }

  // Sort canonical buckets so we pick "best" candidates first (prefer originals)
  for (const [k, list] of byCanonical.entries()) {
    list.sort((a, b) => scoreCandidate(a) - scoreCandidate(b));
    byCanonical.set(k, list);
  }

  return { byExactLower, byCanonical, allFiles };
}

function scoreCandidate(filename: string) {
  // Lower score = preferred
  const lower = filename.toLowerCase();
  const hasDims = /-\d{2,4}x\d{2,4}(?=\.[^.]+$)/.test(lower) ? 1 : 0;
  const hasScaled = /-scaled(?=\.[^.]+$)/.test(lower) ? 1 : 0;
  const hasEdited = /-e\d+(?=-|\.|$)/.test(lower) ? 1 : 0;
  const hasCopy = /\(\d+\)(?=\.[^.]+$)/.test(lower) ? 1 : 0;
  const len = lower.length / 1000; // tiny tie-breaker
  return hasDims * 10 + hasScaled * 10 + hasEdited * 10 + hasCopy * 10 + len;
}

export function canonicalizeFilename(filename: string) {
  const parsed = path.parse(filename);
  let name = parsed.name.toLowerCase();

  // WordPress variants
  name = name.replace(/-\d{2,4}x\d{2,4}$/, "");
  name = name.replace(/-scaled$/, "");
  name = name.replace(/-e\d+$/, "");

  // Common manual duplicates like "image (1).jpg"
  name = name.replace(/\s*\(\d+\)$/, "");

  // Sometimes "-1" is used for duplicates (but avoid stripping legitimate numbers)
  name = name.replace(/-(\d+)$/, (_m, n) => (n === "1" ? "" : `-${n}`));

  // Collapse whitespace
  name = name.replace(/\s+/g, " ").trim();

  return `${name}${parsed.ext.toLowerCase()}`;
}

export function basenameFromUrl(url: string) {
  try {
    const u = new URL(url);
    return path.basename(u.pathname);
  } catch {
    // Relative or invalid URL
    return path.basename(url.split("?")[0].split("#")[0]);
  }
}

export function matchLocalImage(
  local: LocalImageIndex,
  filenameOrUrl: string
): { matched: boolean; file?: string } {
  const basename = basenameFromUrl(filenameOrUrl);
  const exact = local.byExactLower.get(basename.toLowerCase());
  if (exact) return { matched: true, file: exact };

  const canonical = canonicalizeFilename(basename);
  const candidates = local.byCanonical.get(canonical);
  if (candidates && candidates.length > 0) {
    return { matched: true, file: candidates[0] };
  }

  return { matched: false };
}




