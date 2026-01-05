/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import type { AppLoadContext, EntryContext } from "@remix-run/cloudflare";
import reactDomServer from "react-dom/server";

const { renderToReadableStream, renderToPipeableStream } =
  reactDomServer as unknown as {
    renderToReadableStream?: (
      element: React.ReactElement,
      options?: unknown
    ) => Promise<ReadableStream>;
    renderToPipeableStream?: (
      element: React.ReactElement,
      options?: unknown
    ) => { pipe: (dest: unknown) => void; abort: () => void };
  };

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  // This is ignored so we can keep it in the template for visibility.  Feel
  // free to delete this parameter in your app if you're not using it!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext
) {
  const isNode =
    typeof process !== "undefined" &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Boolean((process as any).versions?.node);

  // In local dev (`remix vite:dev`) we run in Node, where `renderToReadableStream`
  // may not be available. In Cloudflare/edge, prefer `renderToReadableStream`.
  if (isNode || typeof renderToReadableStream !== "function") {
    return handleNodeRequest(
      request,
      responseStatusCode,
      responseHeaders,
      remixContext
    );
  }

  return handleWebStreamRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}

async function handleWebStreamRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  let didError = false;

  const stream = await renderToReadableStream!(
    <RemixServer context={remixContext} url={request.url} abortDelay={ABORT_DELAY} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        didError = true;
        console.error(error);
      },
    }
  );

  if (isbot(request.headers.get("user-agent") || "")) {
    // React 18's ReadableStream has `allReady` at runtime.
    const allReady = (stream as any).allReady;
    if (typeof allReady?.then === "function") {
      await allReady;
    }
  }

  responseHeaders.set("Content-Type", "text/html; charset=utf-8");

  return new Response(stream, {
    status: didError ? 500 : responseStatusCode,
    headers: responseHeaders,
  });
}

async function handleNodeRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  if (typeof renderToPipeableStream !== "function") {
    throw new TypeError("renderToPipeableStream is not available");
  }

  const { PassThrough, Readable } = (await import("node:stream")) as unknown as {
    PassThrough: new () => NodeJS.ReadWriteStream;
    Readable: { toWeb: (stream: NodeJS.ReadableStream) => ReadableStream };
  };

  return isbot(request.headers.get("user-agent") || "")
    ? new Promise<Response>((resolve, reject) => {
        let shellRendered = false;
        const { pipe, abort } = renderToPipeableStream!(
          <RemixServer
            context={remixContext}
            url={request.url}
            abortDelay={ABORT_DELAY}
          />,
          {
            onAllReady() {
              shellRendered = true;
              const body = new PassThrough();
              const stream = Readable.toWeb(body);
              responseHeaders.set("Content-Type", "text/html; charset=utf-8");
              resolve(
                new Response(stream, {
                  headers: responseHeaders,
                  status: responseStatusCode,
                })
              );
              pipe(body);
            },
            onShellError(error: unknown) {
              reject(error);
            },
            onError(error: unknown) {
              responseStatusCode = 500;
              if (shellRendered) console.error(error);
            },
          }
        );
        setTimeout(abort, ABORT_DELAY);
      })
    : new Promise<Response>((resolve, reject) => {
        let shellRendered = false;
        const { pipe, abort } = renderToPipeableStream!(
          <RemixServer
            context={remixContext}
            url={request.url}
            abortDelay={ABORT_DELAY}
          />,
          {
            onShellReady() {
              shellRendered = true;
              const body = new PassThrough();
              const stream = Readable.toWeb(body);
              responseHeaders.set("Content-Type", "text/html; charset=utf-8");
              resolve(
                new Response(stream, {
                  headers: responseHeaders,
                  status: responseStatusCode,
                })
              );
              pipe(body);
            },
            onShellError(error: unknown) {
              reject(error);
            },
            onError(error: unknown) {
              responseStatusCode = 500;
              if (shellRendered) console.error(error);
            },
          }
        );
        setTimeout(abort, ABORT_DELAY);
      });
}
