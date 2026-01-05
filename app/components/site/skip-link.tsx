import { cn } from "~/lib/utils";

export function SkipLink() {
  return (
    <a
      href="#main"
      className={cn(
        "sr-only focus:not-sr-only",
        "fixed left-4 top-4 z-[100] rounded-md bg-background px-3 py-2 text-sm font-semibold shadow",
        "outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
    >
      Skip to content
    </a>
  );
}



