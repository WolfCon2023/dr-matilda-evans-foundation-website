import * as React from "react";

type SmartImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
};

function inferSizeFromFilename(src: string): { width: number; height: number } | null {
  // Matches "...-300x169.jpg" (WordPress-style resized filenames).
  const m = /-(\d{2,5})x(\d{2,5})\.(?:png|jpe?g|webp|gif)(?:\?.*)?$/i.exec(src);
  if (!m) return null;
  const width = Number(m[1]);
  const height = Number(m[2]);
  if (!Number.isFinite(width) || !Number.isFinite(height)) return null;
  return { width, height };
}

export function SmartImage({ src, alt, decoding, loading, ...rest }: SmartImageProps) {
  const inferred = inferSizeFromFilename(src);
  return (
    <img
      src={src}
      alt={alt}
      width={rest.width ?? inferred?.width}
      height={rest.height ?? inferred?.height}
      decoding={decoding ?? "async"}
      loading={loading ?? "lazy"}
      {...rest}
    />
  );
}


