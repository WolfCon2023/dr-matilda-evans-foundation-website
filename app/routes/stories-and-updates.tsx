import { redirect } from "@remix-run/node";

export function loader() {
  return redirect("/dr-evans-academy", 302);
}


