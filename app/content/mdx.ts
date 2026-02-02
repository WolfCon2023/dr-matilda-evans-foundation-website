import type { ComponentType } from "react";

type MdxModule = {
  default?: ComponentType;
  frontmatter?: Record<string, unknown>;
};

function asModule(mod: unknown): MdxModule {
  return mod as MdxModule;
}

const pageModules = import.meta.glob("../../content/pages/*.mdx", {
  eager: true,
}) as Record<string, unknown>;

const postModules = import.meta.glob("../../content/posts/*.mdx", {
  eager: true,
}) as Record<string, unknown>;

export type PageEntry = {
  slug: string;
  title: string;
  date?: string;
  updated?: string;
  section?: string;
  heroImage?: string;
  audioSrc?: string;
  Component: ComponentType;
};

export type PostEntry = PageEntry;

function filenameSlug(filePath: string) {
  const m = /\/([^/]+)\.mdx$/.exec(filePath.replace(/\\/g, "/"));
  return m?.[1] ?? "";
}

function toEntry(filePath: string, mod: unknown): PageEntry | null {
  const m = asModule(mod);
  const Component = m.default;
  if (!Component) return null;

  const fm = (m.frontmatter ?? {}) as any;
  return {
    slug: String(fm.slug ?? filenameSlug(filePath)),
    title: String(fm.title ?? filenameSlug(filePath)),
    date: typeof fm.date === "string" ? fm.date : undefined,
    updated: typeof fm.updated === "string" ? fm.updated : undefined,
    section: typeof fm.section === "string" ? fm.section : undefined,
    heroImage: typeof fm.heroImage === "string" ? fm.heroImage : undefined,
    audioSrc: typeof fm.audioSrc === "string" ? fm.audioSrc : undefined,
    Component,
  };
}

export function getAllPages(): PageEntry[] {
  return Object.entries(pageModules)
    .map(([filePath, mod]) => toEntry(filePath, mod))
    .filter((x): x is PageEntry => Boolean(x));
}

export function getAllPosts(): PostEntry[] {
  return Object.entries(postModules)
    .map(([filePath, mod]) => toEntry(filePath, mod))
    .filter((x): x is PostEntry => Boolean(x));
}

export function getPageBySlug(slug: string): PageEntry | null {
  return getAllPages().find((p) => p.slug === slug) ?? null;
}

export function getPostBySlug(slug: string): PostEntry | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}




