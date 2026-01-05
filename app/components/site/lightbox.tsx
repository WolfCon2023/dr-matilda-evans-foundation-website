import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "~/lib/utils";
import { SmartImage } from "~/components/site/smart-image";

export type LightboxItem = {
  src: string;
  alt: string;
  caption?: string;
};

function normalizeSrc(src: string) {
  // Ensure local assets are absolute so they don't become route-relative like
  // `/dr-matilda-a-evans-photo-gallery/images/...` (which 404s).
  if (!src) return src;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("/")) return src;
  return `/${src}`;
}

export function LightboxGallery({
  items,
}: {
  items: LightboxItem[];
}) {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const active = items[activeIndex];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((img, idx) => (
          <button
            key={`${img.src}-${idx}`}
            type="button"
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-border/70 bg-card text-left shadow-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
            )}
            onClick={() => {
              setActiveIndex(idx);
              setOpen(true);
            }}
          >
            <SmartImage
              src={normalizeSrc(img.src)}
              alt={img.alt}
              className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
            {img.caption ? (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-3">
                <div className="text-xs font-medium text-white/95 line-clamp-2">
                  {img.caption}
                </div>
              </div>
            ) : null}
          </button>
        ))}
      </div>

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm" />
          <DialogPrimitive.Content
            className={cn(
              "fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-5xl -translate-x-1/2 -translate-y-1/2",
              "rounded-2xl border border-border/40 bg-background shadow-2xl"
            )}
          >
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <DialogPrimitive.Title className="text-sm font-semibold">
                Photo Gallery
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="sr-only">
                Browse photos. Select a thumbnail to open a larger view.
              </DialogPrimitive.Description>
              <DialogPrimitive.Close
                className="rounded-md p-2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </DialogPrimitive.Close>
            </div>

            {active ? (
              <figure className="p-4">
                <SmartImage
                  src={normalizeSrc(active.src)}
                  alt={active.alt}
                  className="max-h-[70vh] w-full rounded-xl object-contain"
                />
                {active.caption ? (
                  <figcaption className="mt-3 text-sm text-muted-foreground">
                    {active.caption}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}



