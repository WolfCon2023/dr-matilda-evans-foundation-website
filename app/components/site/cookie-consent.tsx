import * as React from "react";
import { Link } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type ConsentValue = "accept" | "decline" | null;

const COOKIE_NAME = "cookie_consent";
const MAX_AGE_DAYS = 180;

function setConsentCookie(value: Exclude<ConsentValue, null>) {
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export function CookieConsentBanner({
  initialConsent,
  className,
}: {
  initialConsent: ConsentValue;
  className?: string;
}) {
  const [visible, setVisible] = React.useState(initialConsent == null);

  React.useEffect(() => {
    // Keep client in sync if SSR didn't know (or if user cleared cookies).
    setVisible(initialConsent == null);
  }, [initialConsent]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/90 text-white backdrop-blur",
        className
      )}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-white/90">
          By using this website, you agree to our use of cookies. We use cookies
          to provide you with a great experience and to help our website run
          effectively.{" "}
          <Link className="underline underline-offset-4 hover:text-white" to="/cookies">
            Learn more.
          </Link>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-10 border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
            onClick={() => {
              setConsentCookie("decline");
              setVisible(false);
            }}
          >
            Decline
          </Button>
          <Button
            type="button"
            className="h-10"
            onClick={() => {
              setConsentCookie("accept");
              setVisible(false);
            }}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}


